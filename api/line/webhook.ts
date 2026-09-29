import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import { verifyLineSignature, replyToLine } from '../../lib/line.js'
import { processLineEvents } from '../../lib/line-bot.js'

// LINE Messaging API webhook for the 智管家 official account.
//
//   Webhook URL (LINE Developers console):  https://www.smtengo.com/api/line/webhook
//   Env (Vercel project settings, never in the repo):
//     LINE_CHANNEL_SECRET        signs every delivery; requests without a valid signature are dropped
//     LINE_CHANNEL_ACCESS_TOKEN  long-lived token used to send the reply
//
// Answers come from the same knowledge base as the website chatbot
// (lib/line-bot.ts → lib/chatbot-answer.ts → src/data/knowledge_base.json), and
// each question is logged to chatbot_analytics with locale "line-<lang>" so the
// admin「使用洞察」panel shows LINE traffic next to the website's.

// The signature is computed over the exact bytes LINE sent, so the body must
// not be parsed (and re-serialised) before we check it.
export const config = { api: { bodyParser: false } }

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || ''
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

async function readRawBody(req: VercelRequest): Promise<string> {
    if (typeof req.body === 'string') return req.body
    if (Buffer.isBuffer(req.body)) return req.body.toString('utf8')
    const chunks: Buffer[] = []
    for await (const chunk of req as any) chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
    return Buffer.concat(chunks).toString('utf8')
}

const logQuery = async (keyword: string, locale: string, matchFound: boolean) => {
    if (!supabase) return
    const { error } = await supabase
        .from('chatbot_analytics')
        .insert([{ keyword, locale, match_found: matchFound, created_at: new Date().toISOString() }])
    if (error) console.error('chatbot_analytics insert (line):', error)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Vercel stores "sensitive" variables under the exact name typed in and will
    // not rename them afterwards, so accept the lowercase spelling as well.
    const secret = process.env.LINE_CHANNEL_SECRET || process.env.line_channel_secret || ''
    const token = process.env.LINE_CHANNEL_ACCESS_TOKEN || process.env.line_channel_access_token || ''
    const configured = secret.length > 0 && token.length > 0

    // Health check for deploy verification; says whether the secrets are in place
    // without revealing them.
    if (req.method === 'GET') return res.status(200).json({ ok: true, configured })
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

    if (!configured) {
        console.error('LINE_CHANNEL_SECRET / LINE_CHANNEL_ACCESS_TOKEN missing — webhook disabled')
        return res.status(503).json({ error: 'LINE bot is not configured' })
    }

    const raw = await readRawBody(req)
    const signature = req.headers['x-line-signature']
    if (!verifyLineSignature(raw, Array.isArray(signature) ? signature[0] : signature, secret)) {
        return res.status(401).json({ error: 'Bad signature' })
    }

    let events: any[] = []
    try {
        events = JSON.parse(raw || '{}').events || []
    } catch {
        return res.status(400).json({ error: 'Invalid body' })
    }

    // LINE's "Verify" button posts an empty event list and expects 200.
    const handled = await processLineEvents(events, {
        reply: (replyToken, texts) => replyToLine(replyToken, texts, token),
        log: logQuery,
    })
    return res.status(200).json({ handled: handled.length })
}
