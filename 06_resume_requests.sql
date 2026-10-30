-- ============================================================
-- 06_resume_requests.sql
-- Stores the name / mobile / email that visitors enter before
-- downloading your resume. Run once in Supabase -> SQL Editor.
--   * Visitors (anon) can ONLY add a row. They cannot read anything.
--   * Only admins (your login) can read and delete the list.
-- Safe to run more than once.
-- ============================================================

create table if not exists public.resume_requests (
  id         uuid primary key default gen_random_uuid(),
  full_name  text not null,
  mobile     text not null,
  email      text not null,
  created_at timestamptz not null default now()
);

alter table public.resume_requests add column if not exists company text;
alter table public.resume_requests add column if not exists website text;

alter table public.resume_requests enable row level security;

drop policy if exists resume_requests_public_insert on public.resume_requests;
create policy resume_requests_public_insert on public.resume_requests
  for insert to anon, authenticated
  with check (
    char_length(trim(full_name)) between 2 and 100
    and char_length(trim(mobile)) between 7 and 20
    and email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
    and char_length(email) <= 150
    and (company is null or char_length(company) <= 150)
    and (website is null or char_length(website) <= 250)
  );

drop policy if exists resume_requests_admin_read on public.resume_requests;
create policy resume_requests_admin_read on public.resume_requests
  for select using (public.is_admin());

drop policy if exists resume_requests_admin_delete on public.resume_requests;
create policy resume_requests_admin_delete on public.resume_requests
  for delete using (public.is_admin());

grant insert on public.resume_requests to anon, authenticated;
grant select, delete on public.resume_requests to authenticated;
