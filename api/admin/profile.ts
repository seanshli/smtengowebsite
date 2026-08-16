import { createClient } from '@supabase/supabase-js'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import bcrypt from 'bcryptjs'

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    const userId = authHeader.split(' ')[1]

    if (req.method === 'POST') {
        const { currentPassword, newPassword } = req.body

        try {
            const { data: user, error } = await supabase
                .from('backend_members')
                .select('*')
                .eq('id', userId)
                .single()

            if (error || !user) {
                return res.status(404).json({ error: 'User not found' })
            }

            const isValid = await bcrypt.compare(currentPassword, user.password)
            if (!isValid) {
                return res.status(401).json({ error: 'Current password incorrect' })
            }

            const hashedNewPassword = await bcrypt.hash(newPassword, 10)
            const { error: updateError } = await supabase
                .from('backend_members')
                .update({ password: hashedNewPassword })
                .eq('id', userId)

            if (updateError) throw updateError
            return res.status(200).json({ success: true })
        } catch (err: any) {
            return res.status(500).json({ error: err.message })
        }
    }

    return res.status(405).json({ error: 'Method not allowed' })
}
