-- ============================================================
-- 01_schema.sql — tables, triggers, indexes
-- Run this first in Supabase → SQL Editor.
-- ============================================================

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- who is allowed to write. Keep this table tiny: one row, you.
-- ------------------------------------------------------------
create table if not exists public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid());
$$;

-- ------------------------------------------------------------
-- updated_at trigger
-- ------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ------------------------------------------------------------
-- profiles — single row. Drives hero, about and contact.
-- Column names follow the props your existing components already use.
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id                uuid primary key default gen_random_uuid(),
  singleton         boolean not null default true,

  name              text not null default 'Venkata Sai',
  headline          text,                       -- "Data Analyst"
  short_bio         text,                       -- hero paragraph
  about             text,                       -- About section paragraph
  location          text,

  email             text,
  phone             text,
  linkedin_url      text,
  github_url        text,
  resume_url        text,

  profile_image_url text,                       -- /assets/image-DaXzU-ni.png
  hero_video_url    text,                       -- /assets/herovideo-DoafQIuO.mp4
  hero_cta_primary_label   text default 'View My Work',
  hero_cta_primary_href    text default '#projects',
  hero_cta_secondary_label text default 'Contact Me',
  hero_cta_secondary_href  text default '#contact',

  about_heading     text default 'Hello!',
  expertise_badge   text default 'My Expertise',
  expertise_heading text,
  expertise_subtext text,
  expertise_note    text default 'Turning data into decisions!',
  skills_badge      text default 'Technical Stack',
  skills_heading    text default 'Technologies I Work With',

  meta_title        text,
  meta_description  text,

  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),

  constraint profiles_singleton_unique unique (singleton)
);
create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

-- ------------------------------------------------------------
-- expertise — the four numbered cards along the dotted path.
-- position_class / aos_* are stored so the existing layout and
-- scroll animation stay exactly as designed.
-- ------------------------------------------------------------
create table if not exists public.expertise (
  id             uuid primary key default gen_random_uuid(),
  number         text not null default '01',      -- "01".."04"
  title          text not null,
  text           text,
  position_class text,                            -- the md:absolute / rotate classes
  aos_type       text default 'fade-left',
  aos_delay      text default '100',
  sort_order     int  not null default 0,
  is_published   boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create trigger expertise_touch before update on public.expertise
  for each row execute function public.touch_updated_at();

-- ------------------------------------------------------------
-- skills — grouped by category into the existing skill cards.
-- is_featured = also shown as an icon badge in the About strip.
-- ------------------------------------------------------------
create table if not exists public.skills (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  category     text not null default 'Data Analysis',
  description  text,
  icon_url     text,
  is_featured  boolean not null default false,
  sort_order   int not null default 0,
  is_published boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create trigger skills_touch before update on public.skills
  for each row execute function public.touch_updated_at();

-- ------------------------------------------------------------
-- experiences
-- ------------------------------------------------------------
create table if not exists public.experiences (
  id               uuid primary key default gen_random_uuid(),
  company          text not null,
  job_title        text not null,
  location         text,
  start_date       date,
  end_date         date,
  is_current       boolean not null default false,
  period_label     text,                    -- free text override, e.g. "AUG 2023 — SEP 2025"
  description      text,
  responsibilities text[] default '{}',
  tools            text[] default '{}',
  sort_order       int not null default 0,
  is_published     boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create trigger experiences_touch before update on public.experiences
  for each row execute function public.touch_updated_at();

-- ------------------------------------------------------------
-- projects — first six columns map 1:1 onto your existing card
-- ------------------------------------------------------------
create table if not exists public.projects (
  id                uuid primary key default gen_random_uuid(),
  title             text not null,
  slug              text unique,
  category          text,                        -- "Data Analysis", "Databases"…
  short_description text,                        -- the card's `description`
  tags              text[] default '{}',         -- the card's `tags`
  match_label       text default 'New',          -- the card's `match`
  episode           text,                        -- "P01".."P04"

  full_description  text,
  business_problem  text,
  tools             text[] default '{}',
  dataset           text,
  kpis              jsonb default '[]'::jsonb,   -- [{"label":"On-time %","value":"+14%"}]
  insights          text[] default '{}',
  recommendations   text[] default '{}',

  github_url        text,
  live_url          text,
  demo_video_url    text,                        -- YouTube, Cloudinary or Supabase Storage
  thumbnail_url     text,
  gallery           jsonb default '[]'::jsonb,   -- ["https://…", …]

  is_featured       boolean not null default false,
  is_published      boolean not null default true,
  sort_order        int not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create trigger projects_touch before update on public.projects
  for each row execute function public.touch_updated_at();

-- ------------------------------------------------------------
-- certificates
-- ------------------------------------------------------------
create table if not exists public.certificates (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  issuer         text,
  issue_date     date,
  date_label     text,                     -- free text shown on the card
  credential_id  text,
  credential_url text,
  description    text,
  image_url      text,
  pdf_url        text,
  sort_order     int not null default 0,
  is_published   boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create trigger certificates_touch before update on public.certificates
  for each row execute function public.touch_updated_at();

-- ------------------------------------------------------------
-- media — a catalogue of everything in Storage, so the admin can
-- preview, copy URLs and be warned before deleting something in use.
-- ------------------------------------------------------------
create table if not exists public.media (
  id         uuid primary key default gen_random_uuid(),
  bucket     text not null,
  path       text not null,
  public_url text not null,
  file_name  text,
  mime_type  text,
  size_bytes bigint,
  kind       text,                          -- image | video | certificate | document
  alt_text   text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (bucket, path)
);
create trigger media_touch before update on public.media
  for each row execute function public.touch_updated_at();

-- ------------------------------------------------------------
-- indexes
-- ------------------------------------------------------------
create index if not exists idx_expertise_order    on public.expertise    (is_published, sort_order);
create index if not exists idx_skills_order       on public.skills       (is_published, category, sort_order);
create index if not exists idx_experiences_order  on public.experiences  (is_published, sort_order);
create index if not exists idx_projects_order     on public.projects     (is_published, sort_order);
create index if not exists idx_certificates_order on public.certificates (is_published, sort_order);
create index if not exists idx_media_kind         on public.media        (kind, created_at desc);

-- ------------------------------------------------------------
-- "is this media file still referenced?" — used by the admin
-- before it lets you delete a file.
-- ------------------------------------------------------------
create or replace function public.media_usage(p_url text)
returns table (source text, id uuid, label text)
language sql stable as $$
  select 'projects', p.id, p.title from public.projects p
    where p.thumbnail_url = p_url or p.demo_video_url = p_url
       or p.gallery ? p_url
  union all
  select 'certificates', c.id, c.title from public.certificates c
    where c.image_url = p_url or c.pdf_url = p_url
  union all
  select 'skills', s.id, s.name from public.skills s
    where s.icon_url = p_url
  union all
  select 'profile', pr.id, pr.name from public.profiles pr
    where pr.profile_image_url = p_url or pr.hero_video_url = p_url or pr.resume_url = p_url;
$$;
