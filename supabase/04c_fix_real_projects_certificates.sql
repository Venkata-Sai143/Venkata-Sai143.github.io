-- ============================================================
-- 04c_fix_real_projects_certificates.sql
-- Run this if your Projects/Certificates sections are showing
-- placeholder text ("Add Project Title", "Add Certificate Title")
-- instead of your real content.
--
-- 04_seed.sql filled these two tables with generic placeholders
-- copied from the site's unfilled template — not your actual
-- portfolio content. This clears those placeholder rows out and
-- replaces them with your real projects and certificates.
--
-- Safe to run even if you've already started editing these in the
-- admin — it only deletes rows that still have the literal
-- placeholder titles, so anything you've already customized is left
-- alone.
-- ============================================================

delete from public.projects where title = 'Add Project Title';
delete from public.certificates where title = 'Add Certificate Title';

insert into public.projects (title, category, short_description, match_label, episode, github_url, sort_order) values
('HR Analytics Dashboard', 'Data Analytics',
 'Analyzed a 20,000-record HR dataset after cleaning and validation. Built KPI cards, Pivot Charts, and slicers to explore salary, performance, attendance, and city insights.',
 '20K records', 'P01', 'https://github.com/Venkata-Sai143/HR_Analytics_Dashboard', 1),
('Corporate Sales Dashboard', 'Data Visualization',
 'Built an interactive Power BI dashboard with DAX measures and a structured data model to visualize key business metrics and support data-driven decisions.',
 '9K records', 'P02', 'https://github.com/Venkata-Sai143/Power-BI-Corporate-Sales-Dashboard', 2);

insert into public.certificates (title, issuer, date_label, credential_url, sort_order) values
('Excel Using AI Workshop', 'OfficeMaster', 'Issued November 9, 2025', 'https://lnkd.in/p/dj6cF9WV', 1),
('PowerBI Workshop', 'OfficeMaster', 'Issued September 7, 2025', 'https://lnkd.in/p/ddxc7jqn', 2);
