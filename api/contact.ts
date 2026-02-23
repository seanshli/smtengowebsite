import { createClient } from '@supabase/supabase-js'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import nodemailer from 'nodemailer'

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
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
    } = req.body

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
            return res.status(500).json({ error: sbError.message })
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
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Region/City:</strong> ${region} / ${city}</p>
        <p><strong>Address:</strong> ${address}</p>
        <p><strong>Product Type:</strong> ${productType}</p>
        <p><strong>Service Plan:</strong> ${servicePlanId}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${message}</p>
        <hr>
        <p><small>Submitted at: ${new Date().toLocaleString()}</small></p>
      `
        }

        try {
            await transporter.sendMail(mailOptions)
        } catch (mailError) {
            console.error('Email error:', mailError)
            // We don't return 500 here because the data was saved to Supabase successfully
            // The user still gets a success response, but we log the mail failure
        }

        return res.status(200).json({ success: true, data })
    } catch (err: any) {
        console.error('Server error:', err)
        return res.status(500).json({ error: err.message })
    }
}
