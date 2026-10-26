-- ============================================================
-- 02_rls.sql — Row Level Security
-- Public (anon key): can read published rows only.
-- Admin (a row in public.admins): full read/write.
-- Nothing is publicly writable.
-- ============================================================

alter table public.admins       enable row level security;
alter table public.profiles     enable row level security;
alter table public.expertise    enable row level security;
alter table public.skills       enable row level security;
alter table public.experiences  enable row level security;
alter table public.projects     enable row level security;
alter table public.certificates enable row level security;
alter table public.media        enable row level security;

-- admins: you can see your own row, nobody can write through the API.
drop policy if exists admins_self_read on public.admins;
create policy admins_self_read on public.admins
  for select using (user_id = auth.uid());

-- ------------------------------------------------------------
-- profiles: single row, always readable (it is your public bio)
-- ------------------------------------------------------------
drop policy if exists profiles_public_read on public.profiles;
create policy profiles_public_read on public.profiles
  for select using (true);

drop policy if exists profiles_admin_write on public.profiles;
create policy profiles_admin_write on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- ------------------------------------------------------------
-- content tables: public sees published rows, admin sees all
-- ------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['expertise','skills','experiences','projects','certificates']
  loop
    execute format($f$
      drop policy if exists %1$s_public_read on public.%1$s;
      create policy %1$s_public_read on public.%1$s
        for select using (is_published = true);

      drop policy if exists %1$s_admin_read on public.%1$s;
      create policy %1$s_admin_read on public.%1$s
        for select using (public.is_admin());

      drop policy if exists %1$s_admin_insert on public.%1$s;
      create policy %1$s_admin_insert on public.%1$s
        for insert with check (public.is_admin());

      drop policy if exists %1$s_admin_update on public.%1$s;
      create policy %1$s_admin_update on public.%1$s
        for update using (public.is_admin()) with check (public.is_admin());

      drop policy if exists %1$s_admin_delete on public.%1$s;
      create policy %1$s_admin_delete on public.%1$s
        for delete using (public.is_admin());
    $f$, t);
  end loop;
end $$;

-- ------------------------------------------------------------
-- media: admin only. The files themselves are public in Storage;
-- the catalogue of them is not.
-- ------------------------------------------------------------
drop policy if exists media_admin_all on public.media;
create policy media_admin_all on public.media
  for all using (public.is_admin()) with check (public.is_admin());

-- ------------------------------------------------------------
-- Lock down the schema surface the anon key can reach.
-- ------------------------------------------------------------
revoke all on public.admins from anon;
grant execute on function public.media_usage(text) to authenticated;
revoke execute on function public.media_usage(text) from anon;
