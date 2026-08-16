import { createHmac, timingSafeEqual } from 'node:crypto'
import type { VercelRequest } from '@vercel/node'
import type { SupabaseClient } from '@supabase/supabase-js'

// Session tokens used to be the raw backend_members.id: unsigned, no expiry, no
// revocation, so anyone who ever saw one held a permanent key to customer PII.
// A token is now payload.signature, HMAC-SHA256 over the payload with a server
// secret. Files under api/ starting with "_" are not routed as endpoints.
//
// We deliberately do not use JWT: this needs one algorithm, and parsing an
// attacker-supplied "alg" header is the classic way that goes wrong.

const SECRET = process.env.AUTH_SECRET || ''
const TTL_SECONDS = 8 * 60 * 60 // one working day; re-login after

export interface SessionUser {
  id: string
  username: string
  name: string | null
  role: string
}

const signPayload = (payload: string) =>
  createHmac('sha256', SECRET).update(payload).digest('base64url')

export const isConfigured = () => SECRET.length >= 32

export const signSession = (userId: string): string => {
  const payload = Buffer.from(
    JSON.stringify({ sub: userId, exp: Math.floor(Date.now() / 1000) + TTL_SECONDS })
  ).toString('base64url')
  return `${payload}.${signPayload(payload)}`
}

/** Returns the user id the token vouches for, or null if it is forged/expired/malformed. */
const verifyToken = (token: string): string | null => {
  const dot = token.indexOf('.')
  if (dot < 1) return null

  const payload = token.slice(0, dot)
  const given = Buffer.from(token.slice(dot + 1), 'base64url')
  const expected = Buffer.from(signPayload(payload), 'base64url')
  // timingSafeEqual throws on length mismatch, so check that first.
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null

  try {
    const claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    if (typeof claims.sub !== 'string' || typeof claims.exp !== 'number') return null
    if (claims.exp <= Math.floor(Date.now() / 1000)) return null
    return claims.sub
  } catch {
    return null
  }
}

/**
 * Authenticates a request. The signature proves the token was issued by us; the
 * row lookup is still done so that deleting a member or changing their role
 * takes effect immediately rather than at token expiry.
 */
export const authenticate = async (
  req: VercelRequest,
  supabase: SupabaseClient
): Promise<SessionUser | null> => {
  if (!isConfigured()) return null

  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) return null

  const userId = verifyToken(header.slice(7).trim())
  if (!userId) return null

  const { data, error } = await supabase
    .from('backend_members')
    .select('id, username, name, role')
    .eq('id', userId)
    .single()

  if (error || !data) return null
  return data as SessionUser
}
