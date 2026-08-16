import { createClient } from '@supabase/supabase-js'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import nodemailer from 'nodemailer'
import { rateLimit } from '../lib/ratelimit'

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Email configuration
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
})

// The submitted values are rendered into a notification email. Without this,
// anything typed into the form lands as live markup in the recipient's inbox.
const esc = (v: unknown): string =>
    String(v ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')

// Generous enough for a real enquiry, small enough to keep junk out of the
// table and the inbox.
const LIMITS: Record<string, number> = {
    name: 100,
    email: 254,
    phone: 40,
    region: 100,
    city: 100,
    address: 300,
    servicePlanId: 100,
    productType: 100,
    message: 5000
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    // Each submission writes a row and sends mail, so this is worth throttling.
    const limit = rateLimit(req, { limit: 5, windowMs: 10 * 60 * 1000, bucket: 'contact' })
    if (!limit.allowed) {
        res.setHeader('Retry-After', String(limit.retryAfter))
        return res.status(429).json({ error: 'Too many submissions. Please try again later.' })
    }

    const {
        name,
        email,
        phone,
        region,
        city,
        address,
        servicePlanId,
        productType,
        message
    } = req.body || {}

    const fields: Record<string, unknown> = {
        name, email, phone, region, city, address, servicePlanId, productType, message
    }

    for (const [field, max] of Object.entries(LIMITS)) {
        const value = fields[field]
        if (value != null && typeof value !== 'string') {
            return res.status(400).json({ error: `Invalid ${field}` })
        }
        if (typeof value === 'string' && value.length > max) {
            return res.status(400).json({ error: `${field} is too long` })
        }
    }

    // A submission we cannot reply to is of no use to anyone.
    if (!name || typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({ error: 'Name is required' })
    }
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'A valid email is required' })
    }

    try {
        // 1. Save to Supabase
        const { data, error: sbError } = await supabase
            .from('contact_submissions')
            .insert([
                {
                    name,
                    email,
                    phone,
                    region,
                    city,
                    address,
                    service_plan_id: servicePlanId,
                    product_type: productType,
                    message
                }
            ])

        if (sbError) {
            console.error('Supabase error:', sbError)
            return res.status(500).json({ error: 'Could not save your submission' })
        }

        // 2. Send Email Notification
        const mailOptions = {
            from: `"enGo Website" <${process.env.SMTP_USER}>`,
            to: process.env.NOTIFICATION_EMAIL,
            subject: `New Form Submission: ${name}`,
            text: `
        You have a new contact form submission:

        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Region: ${region}
        City: ${city}
        Address: ${address}
        Product Type: ${productType}
        Service Plan ID: ${servicePlanId}

        Message:
        ${message}

        Timestamp: ${new Date().toLocaleString()}
      `,
            html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${esc(name)}</p>
        <p><strong>Email:</strong> ${esc(email)}</p>
        <p><strong>Phone:</strong> ${esc(phone)}</p>
        <p><strong>Region/City:</strong> ${esc(region)} / ${esc(city)}</p>
        <p><strong>Address:</strong> ${esc(address)}</p>
        <p><strong>Product Type:</strong> ${esc(productType)}</p>
        <p><strong>Service Plan:</strong> ${esc(servicePlanId)}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${esc(message)}</p>
        <hr>
        <p><small>Submitted at: ${new Date().toLocaleString()}</small></p>
      `
        }

        try {
            await transporter.sendMail(mailOptions)
        } catch (mailError: any) {
            console.error('Email error:', mailError)
            // We don't return 500 here because the data was saved to Supabase successfully
        }

        return res.status(200).json({ success: true, data })
    } catch (err: any) {
        console.error('Server error:', err)
        return res.status(500).json({ error: 'Internal error' })
    }
}
