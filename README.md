# smtengowebsite — www.smtengo.com

Marketing site for **enGo智管家** (Smart enGo Technology). Vue 3 + Vite single-page app with a
handful of Vercel serverless functions (contact form, chatbot, admin back office) backed by Supabase.

- **Live:** https://www.smtengo.com (aliases: web.smtengo.com, w2.smtengo.com)
- **Hosting:** Vercel project `smtengowebsite`, auto-deployed from this repo (`main` → production,
  every other branch / PR → preview). See [DEPLOYMENT.md](DEPLOYMENT.md).
- **Data:** Supabase project `website` (contact submissions, chatbot analytics, admin members).

## Layout

```
index.html            SPA shell: meta, GTM + Consent Mode v2, fonts
src/                  Vue app — views/, components/, layout/, router/, locale/, data/*.json, css/
api/                  Vercel serverless functions (Node): contact, chatbot-query, admin/*
lib/                  server-side helpers shared by api/: session, ratelimit, redact, supabase-admin
scripts/              prerender-meta.mjs (per-route <head> shells), hash-password.mjs (admin passwords)
public/               static assets, sitemap.xml, robots.txt, policy pages, product-feed.xml
supabase_setup.sql    one-time schema; supabase_add_member_contact.sql is the follow-up migration
vercel.json           rewrites (prerendered routes + SPA fallback) and security headers
```

## Commands

```sh
npm ci                 # install (lockfile)
npm run dev            # Vite dev server on http://localhost:5173 (SPA only, no api/)
vercel dev             # SPA + api/ functions, reads .env.local (see DEPLOYMENT.md)
npm run build          # vue-tsc type-check + vite build + prerender shells → dist/
npm run test:unit      # vitest (lib/*.test.ts, src/utils/*.test.ts)
npm run lint           # eslint --fix
```

Before pushing, `npm run build` and `npx vitest run` must both pass. Vercel's own build command is
`vite build` only, so the type-check is a local gate, not a deploy gate.

## Locales

Traditional Chinese (`zh`) is the default and lives at unprefixed URLs; English mirrors under `/en`.
Both are prerendered and declared as hreflang alternates. Dictionaries for `fr`, `ja`, `zhCN` and `es`
exist in `src/locale/` but are not indexed or prerendered.
