create extension if not exists pgcrypto;

create table if not exists public.question_requests (
  id uuid primary key default gen_random_uuid(),
  question_text text not null,
  category text not null check (category in ('Business', 'Operational', 'Technical')),
  systems text not null,
  owner text not null,
  response_type text not null check (response_type in ('scale', 'yes_partial_no')),
  reason text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'denied')),
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  denied_at timestamptz
);

alter table public.question_requests enable row level security;

drop policy if exists "public can insert question requests" on public.question_requests;
create policy "public can insert question requests"
on public.question_requests
for insert
to anon, authenticated
with check (status = 'pending');

drop policy if exists "public can read approved question requests" on public.question_requests;
create policy "public can read approved question requests"
on public.question_requests
for select
to anon, authenticated
using (status = 'approved');

drop policy if exists "admin can read all question requests" on public.question_requests;
create policy "admin can read all question requests"
on public.question_requests
for select
to authenticated
using ((auth.jwt() ->> 'email') in (
  'kxl5821@psu.edu',
  'vcp5105@psu.edu',
  'ttn5290@psu.edu',
  'smd7053@psu.edu',
  'djs7704@psu.edu'
));

drop policy if exists "admin can update question requests" on public.question_requests;
create policy "admin can update question requests"
on public.question_requests
for update
to authenticated
using ((auth.jwt() ->> 'email') in (
  'kxl5821@psu.edu',
  'vcp5105@psu.edu',
  'ttn5290@psu.edu',
  'smd7053@psu.edu',
  'djs7704@psu.edu'
))
with check ((auth.jwt() ->> 'email') in (
  'kxl5821@psu.edu',
  'vcp5105@psu.edu',
  'ttn5290@psu.edu',
  'smd7053@psu.edu',
  'djs7704@psu.edu'
));
