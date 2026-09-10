import type { VercelRequest, VercelResponse } from '@vercel/node'
import bcrypt from 'bcryptjs'
import { authenticate } from '../../lib/session.js'
import { supabaseAdmin as supabase } from '../../lib/supabase-admin.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const session = await authenticate(req, supabase)
    if (!session) {
        return res.status(401).json({ error: 'Unauthorized' })
    }
    const userId = session.id

    if (req.method === 'POST') {
        const { currentPassword, newPassword } = req.body

        // The form enforces required-and-matching, but that is browser-side
        // only: a request sent straight to this endpoint skips it entirely.
        // Same minimum as the superuser reset in api/admin/members.ts, so the
        // two password paths cannot disagree about what is acceptable.
        if (typeof currentPassword !== 'string' || !currentPassword) {
            return res.status(400).json({ error: 'Current password is required' })
        }
        if (typeof newPassword !== 'string' || newPassword.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters' })
        }

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
            console.error('admin/profile:', err)
            return res.status(500).json({ error: 'Internal error' })
        }
    }

    return res.status(405).json({ error: 'Method not allowed' })
}
