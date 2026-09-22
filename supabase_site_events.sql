-- Site behaviour events (what visitors look at and click), written by /api/track
-- with the anon key and read by /api/admin/site-analytics with the service key.
-- Run once in the Supabase SQL editor (project "website").
--
-- No personal data is stored: no IP, no user agent, no cookie, no query string.

create table if not exists public.site_events (
  id          bigserial primary key,
  created_at  timestamptz not null default now(),
  event       text not null check (event ~ '^[a-z][a-z0-9_]{2,39}$'),
  page        text not null check (length(page) <= 200),
  section     text check (length(section) <= 80),
  label       text check (length(label) <= 80),
  locale      text check (length(locale) <= 12)
);

create index if not exists site_events_created_at_idx on public.site_events (created_at desc);
create index if not exists site_events_event_idx on public.site_events (event, created_at desc);

alter table public.site_events enable row level security;

-- The browser (via the anon key) may only append.
drop policy if exists "site_events anon insert" on public.site_events;
create policy "site_events anon insert" on public.site_events
  for insert to anon with check (true);

-- No select policy for anon: reads happen server-side with the service role,
-- which bypasses RLS.

-- Optional housekeeping: keep 400 days. Schedule with pg_cron if enabled:
--   select cron.schedule('site_events_prune', '17 3 * * *',
--     $$delete from public.site_events where created_at < now() - interval '400 days'$$);
