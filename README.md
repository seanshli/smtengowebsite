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
api/                  Vercel serverless functions (Node): contact, chatbot-query, line/webhook, admin/*
lib/                  server-side helpers shared by api/: session, ratelimit, redact, supabase-admin, chatbot-answer, line, line-bot
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

## LINE bot

The 智管家 LINE official account answers from the **same knowledge base as the website chatbot**:
`api/line/webhook.ts` verifies LINE's signature, `lib/line-bot.ts` picks the answer with the site's
own ranking (`src/utils/chatbotMatch.ts` over `src/data/knowledge_base.json`) and `lib/line.ts`
flattens the chatbot markdown into LINE plain text. Updating the knowledge base and deploying updates
both channels.

- Webhook URL: `https://www.smtengo.com/api/line/webhook` (GET answers `{ ok, configured }` as a health check).
- Env (Vercel → Environment Variables, never committed): `LINE_CHANNEL_SECRET`, `LINE_CHANNEL_ACCESS_TOKEN`.
  Without both the endpoint answers 503 and the bot stays silent.
- 1:1 chats: every text message is a question. Groups and rooms: only when the message mentions
  enGo／智管家／安購 or starts with `@`. Stickers, images and audio are ignored.
- Language follows the script the person typed (zh / zhCN / en / ja); no match → escalation text with the phone number.
- Each question is logged to `chatbot_analytics` with locale `line-<lang>` (plus the `kb:<entry>` row), so the
  admin「使用洞察」panel shows LINE traffic next to the website's.
- Setup steps for the LINE side live in 文件-網站回饋/2026-09-29_LINE客服機器人-同一份知識庫-上線設定.md.
