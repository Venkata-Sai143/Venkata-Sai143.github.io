-- ============================================================
-- 00_reset_old_tables.sql
-- Run this FIRST, before 01_schema.sql, ONLY if you already ran the
-- earlier, simpler schema (the one with tables named `projects`,
-- `certificates`, `skill_categories`) from the first admin setup.
--
-- Why: 01_schema.sql uses `create table if not exists`, so if a table
-- called `projects` or `certificates` already exists with the OLD,
-- incompatible columns, it will be silently left as-is — and then
-- 04_seed.sql will fail with "column does not exist" errors.
--
-- This only removes the 3 tables (and their data) from the earlier,
-- simpler setup. If you never ran that earlier schema, this is a
-- harmless no-op (IF EXISTS makes it safe either way).
-- ============================================================

drop table if exists public.skill_categories cascade;
drop table if exists public.certificates cascade;
drop table if exists public.projects cascade;
