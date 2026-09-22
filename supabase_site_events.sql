-- Site behaviour events (what visitors look at and click).
-- Written by /api/track with the anon key; read by /api/admin/site-analytics
-- with the service-role key (bypasses RLS). Run ONCE in the Supabase SQL editor
-- of project "website". Safe to re-run: every statement is idempotent.
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
create index if not exists site_events_event_idx      on public.site_events (event, created_at desc);

alter table public.site_events enable row level security;

-- The browser (anon key) may only append. No select policy for anon: reads
-- happen server-side with the service role.
drop policy if exists "site_events anon insert" on public.site_events;
create policy "site_events anon insert" on public.site_events
  for insert to anon with check (true);

-- Explicit grants so the insert works even if this project's default
-- privileges for anon were tightened. bigserial needs the sequence too.
grant insert on table public.site_events to anon;
grant usage, select on sequence public.site_events_id_seq to anon;
grant all on table public.site_events to service_role;
grant usage, select on sequence public.site_events_id_seq to service_role;

-- Optional housekeeping (only if the pg_cron extension is enabled): keep 400 days.
--   select cron.schedule('site_events_prune', '17 3 * * *',
--     $$delete from public.site_events where created_at < now() - interval '400 days'$$);
