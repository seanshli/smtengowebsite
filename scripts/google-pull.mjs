// Pull Search Console + GA4 numbers with a service account. No npm deps (node:crypto RS256 JWT).
// Usage: node google-pull.mjs [days]   (key path from GOOGLE_APPLICATION_CREDENTIALS or ~/.config/smtengo/ga-service-account.json)
import { createSign } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { homedir } from 'node:os'
const KEY = process.env.GOOGLE_APPLICATION_CREDENTIALS || `${homedir()}/.config/smtengo/ga-service-account.json`
const SITE = 'sc-domain:smtengo.com'
const GA4_PROPERTY = '532831798'
// The property also receives hits from demoha.smtengo.com (an internal Home Assistant demo),
// h5.smtengo.com (old mall) and bk.smtengo.com; only the marketing site counts here.
const GA4_HOST = process.env.GA4_HOST || 'www.smtengo.com'
const days = Number(process.argv[2] || 28)
const b64 = (o) => Buffer.from(typeof o === 'string' ? o : JSON.stringify(o)).toString('base64url')
async function token(scope) {
  const k = JSON.parse(readFileSync(KEY, 'utf8'))
  const now = Math.floor(Date.now() / 1000)
  const unsigned = `${b64({ alg: 'RS256', typ: 'JWT' })}.${b64({ iss: k.client_email, scope, aud: k.token_uri, iat: now, exp: now + 3600 })}`
  const sig = createSign('RSA-SHA256').update(unsigned).sign(k.private_key, 'base64url')
  const r = await fetch(k.token_uri, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${unsigned}.${sig}` })
  if (!r.ok) throw new Error(`token ${r.status}: ${await r.text()}`)
  return (await r.json()).access_token
}
const iso = (d) => d.toISOString().slice(0, 10)
const end = new Date(Date.now() - 2 * 864e5)            // Search Console lags ~2 days
const start = new Date(end.getTime() - (days - 1) * 864e5)
const out = { range: { start: iso(start), end: iso(end) }, searchConsole: null, ga4: null, errors: [] }
try {
  const t = await token('https://www.googleapis.com/auth/webmasters.readonly')
  const r = await fetch(`https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`, {
    method: 'POST', headers: { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ startDate: iso(start), endDate: iso(end), dimensions: ['date'], rowLimit: 100 }) })
  if (!r.ok) throw new Error(`sc ${r.status}: ${await r.text()}`)
  const rows = (await r.json()).rows || []
  out.searchConsole = { days: rows.map((x) => ({ date: x.keys[0], clicks: x.clicks, impressions: x.impressions, ctr: +(x.ctr * 100).toFixed(1), position: +x.position.toFixed(1) })),
    totals: rows.reduce((a, x) => ({ clicks: a.clicks + x.clicks, impressions: a.impressions + x.impressions }), { clicks: 0, impressions: 0 }) }
} catch (e) { out.errors.push(String(e.message)) }
try {
  const t = await token('https://www.googleapis.com/auth/analytics.readonly')
  const r = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY}:runReport`, {
    method: 'POST', headers: { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }], dimensions: [{ name: 'date' }], dimensionFilter: { filter: { fieldName: 'hostName', stringFilter: { matchType: 'EXACT', value: GA4_HOST } } }, metrics: [{ name: 'activeUsers' }, { name: 'sessions' }, { name: 'screenPageViews' }], orderBys: [{ dimension: { dimensionName: 'date' } }] }) })
  if (!r.ok) throw new Error(`ga4 ${r.status}: ${await r.text()}`)
  const j = await r.json()
  out.ga4 = { host: GA4_HOST, days: (j.rows || []).map((x) => ({ date: x.dimensionValues[0].value, users: +x.metricValues[0].value, sessions: +x.metricValues[1].value, views: +x.metricValues[2].value })) }
  out.ga4.totals = out.ga4.days.reduce((a, d) => ({ users: a.users + d.users, sessions: a.sessions + d.sessions, views: a.views + d.views }), { users: 0, sessions: 0, views: 0 })
} catch (e) { out.errors.push(String(e.message)) }
console.log(JSON.stringify(out, null, 1))
