-- Legal Center (/legal) review acknowledgements. Applied to the Supabase project
-- "website" on 2026-10-19 via the Supabase MCP (migration name: legal_acknowledgements).
-- Kept here so the schema is tracked next to supabase_setup.sql. Re-runnable.
create table if not exists public.legal_acknowledgements (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  audience text not null check (audience in ('shop_buyer', 'household', 'building', 'partner')),
  name text not null check (char_length(name) between 1 and 100),
  organization text check (organization is null or char_length(organization) <= 200),
  email text not null check (char_length(email) between 3 and 254),
  phone text check (phone is null or char_length(phone) <= 40),
  documents text[] not null check (cardinality(documents) between 1 and 10),
  versions jsonb not null default '{}'::jsonb,
  note text check (note is null or char_length(note) <= 2000),
  locale text check (locale is null or char_length(locale) <= 8),
  accepted boolean not null default true check (accepted = true),
  ip_hash text check (ip_hash is null or char_length(ip_hash) <= 64),
  user_agent text check (user_agent is null or char_length(user_agent) <= 300)
);
create index if not exists legal_acknowledgements_created_at_idx on public.legal_acknowledgements (created_at desc);
create index if not exists legal_acknowledgements_audience_idx on public.legal_acknowledgements (audience);
alter table public.legal_acknowledgements enable row level security;
drop policy if exists "anon can insert acknowledgements" on public.legal_acknowledgements;
create policy "anon can insert acknowledgements" on public.legal_acknowledgements
  for insert to anon with check (accepted = true);
-- No SELECT / UPDATE / DELETE policy for anon: api/admin/legal-acknowledgements.ts reads with the service role.
grant insert on public.legal_acknowledgements to anon;
revoke select, update, delete on public.legal_acknowledgements from anon;
