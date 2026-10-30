-- ============================================================
-- 05_complete_reset_and_reseed.sql
--
-- Run this ONE file to fix duplicates and get a completely clean,
-- correct state — regardless of how many times 04_seed.sql, 04b, or
-- 04c were run before (each one adds new rows rather than replacing,
-- so repeats = duplicates).
--
-- What this does:
--   1. Empties all 5 content tables (expertise, skills, experiences,
--      projects, certificates) — admins and profiles are untouched.
--   2. Re-inserts the correct, final content for all 5 — one of each,
--      no duplicates, your real project/certificate content (not the
--      generic placeholders), and your real work experience.
--
-- Safe to run more than once — it always ends in the same clean state.
-- Only run this if you have NOT yet made edits in the admin panel that
-- you want to keep; this replaces everything in these 5 tables.
-- ============================================================

truncate table public.expertise, public.skills, public.experiences, public.projects, public.certificates;

-- ---------- expertise (the four cards on the dotted path) ----------
insert into public.expertise (number, title, text, position_class, aos_type, aos_delay, sort_order) values
 ('01','Excel & Advanced Excel',
  'Cleaning, organizing, and analyzing data with formulas, pivot tables, and dashboards to surface trends quickly.',
  'md:absolute md:top-[10px] md:right-[5%] lg:right-[10%] rotate-2 md:rotate-6','fade-left','100',1),
 ('02','SQL & Databases',
  'Writing SQL queries to extract, join, and summarize data from relational databases like MySQL for reporting and analysis.',
  'md:absolute md:top-[450px] md:left-[5%] lg:left-[10%] -rotate-2 md:-rotate-6','fade-right','200',2),
 ('03','Power BI & Tableau',
  'Building interactive dashboards and visual reports that turn raw numbers into stories stakeholders can act on.',
  'md:absolute md:top-[700px] md:right-[5%] lg:right-[15%] rotate-1 md:rotate-3','fade-left','300',3),
 ('04','Python & Statistics',
  'Using Python for data analysis and applying statistical concepts to validate findings and support decisions.',
  'md:absolute md:top-[1050px] md:left-[15%] lg:left-[25%] -rotate-1 md:-rotate-3','fade-right','400',4);

-- ---------- skills (four category cards) ----------
insert into public.skills (name, category, sort_order) values
 ('Excel','Spreadsheets & Reporting',1),
 ('Advanced Excel','Spreadsheets & Reporting',2),
 ('Pivot Tables','Spreadsheets & Reporting',3),
 ('Google Sheets','Spreadsheets & Reporting',4),

 ('SQL','Databases & Querying',5),
 ('MySQL','Databases & Querying',6),
 ('Data Cleaning','Databases & Querying',7),
 ('Joins & Aggregations','Databases & Querying',8),

 ('Power BI','Data Visualization',9),
 ('Tableau','Data Visualization',10),
 ('Dashboards','Data Visualization',11),
 ('Data Storytelling','Data Visualization',12),

 ('Python','Programming & Statistics',13),
 ('Statistics','Programming & Statistics',14),
 ('Jira','Programming & Statistics',15),
 ('Git','Programming & Statistics',16),
 ('GitHub','Programming & Statistics',17);

update public.skills set is_featured = true
 where name in ('Excel','SQL','Power BI','Python');

-- ---------- experiences (your real work history) ----------
insert into public.experiences (company, job_title, period_label, location, responsibilities, sort_order) values
('Mahindra Logistics Limited (Zepto)', 'Supervisor', 'DEC 2025 - APR 2026', 'Operations & Dispatch', array[
  'Led daily warehouse operations and supervised staff, ensuring smooth functioning of a high-volume quick-commerce fulfillment center.',
  'Drove dispatch planning with transporters, maintaining consistent on-time delivery performance.',
  'Analyzed daily operational data in Advanced Excel to prepare reports tracking productivity, stock accuracy and dispatch performance.',
  'Maintained accurate warehouse records, improving inventory reliability and reducing reporting errors across daily operations.'
], 1),
('Ratnadeep Retail Pvt Ltd', 'System Operator', 'AUG 2023 - SEP 2025', 'WMS & Logistics', array[
  'Generated accurate, GST-compliant E-Way Bills on a daily basis, ensuring smooth and uninterrupted movement of goods.',
  'Tracked stock and dispatch data using WMS and Suvega Tracker to maintain stock accuracy.',
  'Analyzed and prepared daily and monthly MIS reports in Advanced Excel to support management decisions on stock and dispatch.',
  'Collaborated with transporters, store teams and warehouse staff to keep daily dispatch operations consistently on schedule.'
], 2),
('Guided program with trainer support', 'Data Analyst Training', 'AUG 2026 - PRESENT', 'Data Analytics', array[
  'Completed modules in Advanced Excel and Power BI (DAX, data modeling, dashboard design); currently developing SQL skills, with Python, Tableau and Statistics modules upcoming.',
  'Publishing practical projects on GitHub as each module is completed.'
], 3);

-- ---------- projects (your real projects, not placeholders) ----------
insert into public.projects (title, category, short_description, match_label, episode, github_url, sort_order) values
('HR Analytics Dashboard', 'Data Analytics',
 'Analyzed a 20,000-record HR dataset after cleaning and validation. Built KPI cards, Pivot Charts, and slicers to explore salary, performance, attendance, and city insights.',
 '20K records', 'P01', 'https://github.com/Venkata-Sai143/HR_Analytics_Dashboard', 1),
('Corporate Sales Dashboard', 'Data Visualization',
 'Built an interactive Power BI dashboard with DAX measures and a structured data model to visualize key business metrics and support data-driven decisions.',
 '9K records', 'P02', 'https://github.com/Venkata-Sai143/Power-BI-Corporate-Sales-Dashboard', 2);

-- ---------- certificates (your real certificates, not placeholders) ----------
insert into public.certificates (title, issuer, date_label, credential_url, sort_order) values
('Excel Using AI Workshop', 'OfficeMaster', 'Issued November 9, 2025', 'https://lnkd.in/p/dj6cF9WV', 1),
('PowerBI Workshop', 'OfficeMaster', 'Issued September 7, 2025', 'https://lnkd.in/p/ddxc7jqn', 2);
