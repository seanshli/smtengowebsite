import type { VercelRequest } from '@vercel/node'

// Sliding-window rate limit held in the lambda's memory.
//
// ponytail: per-instance only. Vercel may run several instances concurrently
// and recycles them, so an attacker spread across instances gets more than
// `limit` attempts, and counters reset on a cold start. It still stops the
// cases this site actually faces — form spam bots and password guessing from
// one host — at zero infrastructure cost. If real abuse shows up, move the
// counter to Vercel Firewall rules or a Supabase table keyed by IP.

interface Rule {
  /** Requests allowed inside the window. */
  limit: number
  windowMs: number
  /** Separates counters for different endpoints. */
  bucket: string
}

const hits = new Map<string, number[]>()

/** Best-effort client address. Vercel sets x-forwarded-for at the edge. */
const clientIp = (req: VercelRequest): string => {
  const fwd = req.headers['x-forwarded-for']
  const raw = Array.isArray(fwd) ? fwd[0] : fwd
  const first = raw?.split(',')[0]?.trim()
  return first || (req.headers['x-real-ip'] as string) || 'unknown'
}

export interface RateLimitResult {
  allowed: boolean
  /** Seconds the caller should wait, for the Retry-After header. */
  retryAfter: number
}

export const rateLimit = (req: VercelRequest, rule: Rule): RateLimitResult => {
  const now = Date.now()
  const key = `${rule.bucket}:${clientIp(req)}`
  const cutoff = now - rule.windowMs

  const recent = (hits.get(key) || []).filter((t) => t > cutoff)

  if (recent.length >= rule.limit) {
    const retryAfter = Math.ceil((recent[0] + rule.windowMs - now) / 1000)
    hits.set(key, recent)
    return { allowed: false, retryAfter: Math.max(retryAfter, 1) }
  }

  recent.push(now)
  hits.set(key, recent)

  // Keep the map from growing without bound on a long-lived instance.
  if (hits.size > 5000) {
    for (const [k, times] of hits) {
      if (!times.some((t) => t > cutoff)) hits.delete(k)
    }
  }

  return { allowed: true, retryAfter: 0 }
}
