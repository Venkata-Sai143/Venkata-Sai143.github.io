-- ============================================================
-- 03_storage.sql — buckets + policies
-- Files are publicly readable (they appear on your website).
-- Only an admin can upload, replace or delete them.
-- ============================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('portfolio-images',       'portfolio-images',       true,  10485760,  array['image/png','image/jpeg','image/webp','image/gif','image/svg+xml']),
  ('portfolio-videos',       'portfolio-videos',       true,  209715200, array['video/mp4','video/webm','video/quicktime']),
  ('portfolio-certificates', 'portfolio-certificates', true,  26214400,  array['application/pdf','image/png','image/jpeg','image/webp']),
  ('portfolio-documents',    'portfolio-documents',    true,  26214400,  array['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- anyone may read
drop policy if exists portfolio_public_read on storage.objects;
create policy portfolio_public_read on storage.objects
  for select using (
    bucket_id in ('portfolio-images','portfolio-videos','portfolio-certificates','portfolio-documents')
  );

-- only an admin may write
drop policy if exists portfolio_admin_insert on storage.objects;
create policy portfolio_admin_insert on storage.objects
  for insert to authenticated with check (
    public.is_admin() and
    bucket_id in ('portfolio-images','portfolio-videos','portfolio-certificates','portfolio-documents')
  );

drop policy if exists portfolio_admin_update on storage.objects;
create policy portfolio_admin_update on storage.objects
  for update to authenticated using (
    public.is_admin() and
    bucket_id in ('portfolio-images','portfolio-videos','portfolio-certificates','portfolio-documents')
  );

drop policy if exists portfolio_admin_delete on storage.objects;
create policy portfolio_admin_delete on storage.objects
  for delete to authenticated using (
    public.is_admin() and
    bucket_id in ('portfolio-images','portfolio-videos','portfolio-certificates','portfolio-documents')
  );
