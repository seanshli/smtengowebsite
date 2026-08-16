import { createClient } from '@supabase/supabase-js'

// Client for the admin endpoints only.
//
// RLS grants backend_members and contact_submissions to the `authenticated`
// role. These endpoints connect as a server, not as a logged-in Supabase user,
// so with the anon key every query returned zero rows — which surfaced as
// "Invalid username or password" for every login, whatever the password was.
//
// The service-role key bypasses RLS, which is correct here: this code
// authenticates callers itself (bcrypt, then a signed session token), and the
// key stays server-side — the browser bundle contains no Supabase client.
//
// Public endpoints (contact, chatbot-query) deliberately keep the anon key.
// They only need the INSERT that RLS already allows, so a bug in one of them
// still cannot read the customer table.

const url = process.env.SUPABASE_URL || ''
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export const isAdminDbConfigured = (): boolean => Boolean(url && serviceKey)

if (!serviceKey) {
  console.error(
    'SUPABASE_SERVICE_ROLE_KEY is not set — admin queries will return nothing and login will fail.'
  )
}

export const supabaseAdmin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false }
})
