# Deployment — www.smtengo.com

Snapshot verified 2026-09-15 against the live Vercel project. Update this file when any of it changes.

## Where it runs

| Item | Value |
|---|---|
| Host | Vercel, team **Sean Li's projects** (`sean-lis-projects-e3ebb6ec`), project **`smtengowebsite`** |
| Framework preset | Vite · build `vite build` · output `dist` · install `npm install` · Node 24.x |
| Git integration | GitHub `seanshli/smtengowebsite`. Push to `main` → **production**. Any other branch or PR → **preview** URL. No GitHub Actions, no branch protection. |
| Production aliases | `https://www.smtengo.com` (primary), `https://web.smtengo.com`, `https://w2.smtengo.com`, `smtengowebsite.vercel.app` |
| DNS | `www` is a CNAME to Vercel DNS. The apex `smtengo.com` is fronted by Cloudflare. The `smtengo.com` domain is registered with a third party and attached to the Vercel team. |
| Functions region | `iad1` (Vercel default) |

The `gh-pages` branch is a leftover from the pre-Vercel GitHub Pages deploy. It is not served
anywhere and can be deleted whenever convenient.

## Environment variables (Vercel project settings)

All are set for Production. `vercel env pull .env.local` fetches them for local `vercel dev`, but
**sensitive-type variables come back empty** — that is the CLI refusing to decrypt, not an empty
value. Add those two to `.env.local` by hand from the Vercel dashboard.

| Variable | Used by | Notes |
|---|---|---|
| `SUPABASE_URL` | `api/contact.ts`, `api/chatbot-query.ts`, `lib/supabase-admin.ts` | Supabase project `website` (Tokyo) |
| `SUPABASE_ANON_KEY` | public endpoints (`contact`, `chatbot-query`) | INSERT-only via RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | `lib/supabase-admin.ts` → `api/admin/*` | **sensitive**; bypasses RLS, server only |
| `AUTH_SECRET` | `lib/session.ts` (signed admin session tokens) | **sensitive** |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | `api/contact.ts` (nodemailer) | contact-form notification mail |
| `NOTIFICATION_EMAIL` | `api/contact.ts` | recipient of contact notifications |

The browser bundle contains **no** Supabase client and no keys; everything above is read only inside
`api/` at request time.

## Supabase

Project **`website`**, ref `hukiymqfjhzcdsaqcjoi`, region Northeast Asia (Tokyo).

One-time SQL, in order, from the Supabase SQL editor:

1. `supabase_setup.sql` — `backend_members`, `contact_submissions`, chatbot tables, RLS.
2. `supabase_add_member_contact.sql` — adds `email` / `phone` to `backend_members`.

To create or reset an admin password, run `node scripts/hash-password.mjs` (hidden prompt, prints only
the bcrypt hash) and paste the hash into the `backend_members` row. Cost 10 matches `api/admin/auth.ts`.

## Serverless functions (`api/`)

| Route | Purpose | Credentials |
|---|---|---|
| `POST /api/contact` | store a contact submission, send SMTP notification | anon key + SMTP |
| `POST /api/chatbot-query` | log chatbot questions for analytics | anon key |
| `/api/admin/auth` | admin login → signed session cookie | service role + `AUTH_SECRET` |
| `/api/admin/members`, `/profile`, `/submissions`, `/chatbot-analytics` | admin back office (`/admin` in the SPA) | service role, session-gated |

Rate limiting (`lib/ratelimit.ts`) is per-instance memory. Log redaction lives in `lib/redact.ts`.

## Build pipeline

`npm run build` = `vue-tsc --build --force` **and** `vite build`, then `postbuild` runs
`scripts/prerender-meta.mjs`. The same prerender also runs as a Vite `closeBundle` plugin, so the
26 route shells (`dist/<route>/index.html`, zh + `/en`) are produced on Vercel even though Vercel only
runs `vite build`. Consequence: **the TypeScript check is a local gate only** — always run
`npm run build` before pushing.

`vercel.json` serves the prerendered shells first, then falls back to `index.html` for the SPA, and adds
HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, and a
**report-only** CSP. Promote the CSP to enforcing only after checking the report volume.

## Analytics and third parties

- Google Tag Manager `GTM-PBH3CKR5`, loaded after Consent Mode v2 defaults in `index.html`; the
  cookie banner (`src/components/cookie.vue`) updates consent state.
- Tawk.to chat snippet is present in `index.html` but **disabled**.
- Google fonts, YouTube embeds (allowed in CSP `frame-src`).

## Local development

```sh
npm ci
npm run dev                          # SPA only, http://localhost:5173
vercel link                          # once; picks project smtengowebsite
vercel env pull .env.local           # then hand-add AUTH_SECRET + SUPABASE_SERVICE_ROLE_KEY
vercel dev                           # SPA + api/ with env
```

`.claude/launch.json` defines the `smtengo-dev` preview config (`npm run dev`, port 5173).

## Ship checklist

1. Branch from `main`; `npm run build` and `npx vitest run` green locally.
2. Push, open a PR. Vercel posts a preview URL; smoke-test `/`, `/en`, `/product`, `/contact`,
   `/admin` login, language toggle, and one prerendered route with `curl -I`.
3. Merge to `main`. Vercel builds production (~30 s). Confirm `https://www.smtengo.com` serves the
   new deployment (`vercel inspect https://www.smtengo.com`).
4. Rollback: Vercel dashboard → Deployments → promote the previous production deployment, or
   `vercel rollback`.

## Known debt

- Large tracked images (`two-machines02-bg.png` ~3.4 MB, duplicated in `src/assets` and
  `public/assets`); several product photos >1 MB. Convert to WebP / lazy-load.
- Rate limiter is per-instance; fine at current traffic, not a real limiter under load.
- `fr`, `ja`, `zhCN`, `es` dictionaries are shipped but unreachable from the UI and not prerendered.
- Sass `mixed-decls` deprecation warnings during build (harmless until Dart Sass 2).
