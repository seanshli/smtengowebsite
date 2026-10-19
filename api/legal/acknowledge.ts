import { createClient } from '@supabase/supabase-js'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import nodemailer from 'nodemailer'
import { randomUUID } from 'node:crypto'
// ESM: relative imports need the .js extension (see api/contact.ts).
import { rateLimit } from '../../lib/ratelimit.js'
import { hashIp, validateAcknowledgement, type AckRow } from '../../lib/legal-ack.js'

// Public endpoint: anon key only. RLS allows INSERT with accepted = true and
// nothing else, so a bug here still cannot read the table back.
const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_ANON_KEY || '')

const esc = (v: unknown): string =>
    String(v ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')

const firstIp = (req: VercelRequest): string | undefined => {
    const fwd = req.headers['x-forwarded-for']
    const raw = Array.isArray(fwd) ? fwd[0] : fwd
    return raw?.split(',')[0]?.trim() || undefined
}

// Notification mail is optional: only attempted when SMTP is configured.
const notify = async (row: AckRow): Promise<void> => {
    const host = process.env.SMTP_HOST
    const user = process.env.SMTP_USER
    const to = process.env.LEGAL_ACK_NOTIFY || process.env.CONTACT_NOTIFY_TO || process.env.NOTIFICATION_EMAIL || user
    if (!host || !user || !to) return

    const transporter = nodemailer.createTransport({
        host,
        port: parseInt(process.env.SMTP_PORT || '465'),
        secure: process.env.SMTP_PORT === '465',
        auth: { user, pass: process.env.SMTP_PASS }
    })
    // CR/LF in a header value would let a submitter forge extra mail headers.
    const oneLine = (s: string) => s.replace(/[\r\n]+/g, ' ').slice(0, 100)
    const versions = row.documents
        .map((d) => `${d}${row.versions[d] ? ` (${row.versions[d]})` : ''}`)
        .join(', ')
    await transporter.sendMail({
        from: `"enGo Website" <${user}>`,
        to,
        subject: `[法務簽核] ${row.audience} · ${oneLine(row.name)}`,
        html: `
        <h2>法務文件簽核</h2>
        <p><strong>對象：</strong> ${esc(row.audience)}</p>
        <p><strong>姓名：</strong> ${esc(row.name)}</p>
        <p><strong>公司／單位：</strong> ${esc(row.organization)}</p>
        <p><strong>Email：</strong> ${esc(row.email)}</p>
        <p><strong>電話：</strong> ${esc(row.phone)}</p>
        <p><strong>文件（版本）：</strong> ${esc(versions)}</p>
        <p><strong>語系：</strong> ${esc(row.locale)}</p>
        <p><strong>備註：</strong></p>
        <p style="white-space: pre-wrap;">${esc(row.note)}</p>
        <hr>
        <p><small>Submitted at: ${new Date().toISOString()}</small></p>`
    })
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const limit = rateLimit(req, { limit: 5, windowMs: 10 * 60 * 1000, bucket: 'legal' })
    if (!limit.allowed) {
        res.setHeader('Retry-After', String(limit.retryAfter))
        return res.status(429).json({ error: 'Too many submissions. Please try again later.' })
    }

    const result = validateAcknowledgement(req.body)
    if (!result.ok) {
        return res.status(400).json({ error: result.error })
    }
    const row = result.row

    const ua = req.headers['user-agent']
    const userAgent = (Array.isArray(ua) ? ua[0] : ua)?.slice(0, 300) || null

    try {
        // Client-generated id so we can return it without needing SELECT (RLS has none for anon).
        const id = randomUUID()
        const { error } = await supabase.from('legal_acknowledgements').insert([
            {
                id,
                ...row,
                ip_hash: hashIp(firstIp(req), process.env.LEGAL_ACK_SALT || 'smtengo'),
                user_agent: userAgent
            }
        ])
        if (error) {
            console.error('legal-ack insert error:', error.message)
            return res.status(500).json({ error: 'Could not save your acknowledgement' })
        }

        try {
            await notify(row)
        } catch (mailError: any) {
            // Saved already; mail is best effort. Message only, never the payload (email/phone).
            console.error('legal-ack mail error:', mailError?.message || 'unknown')
        }

        return res.status(201).json({ ok: true, id })
    } catch (err: any) {
        console.error('legal-ack server error:', err?.message || 'unknown')
        return res.status(500).json({ error: 'Internal error' })
    }
}
