-- ============================================================
-- 04b_seed_experience_optional.sql
-- OPTIONAL — run this after 04_seed.sql if you want it.
--
-- 04_seed.sql deliberately leaves `experiences` empty, because its author
-- only read the original compiled JS bundle, which has no real work history
-- in it (just three generic placeholder-ish entries).
--
-- But your live site already has real experience content on it — the one
-- we wrote together earlier (Mahindra Logistics/Zepto, Ratnadeep Retail,
-- your Data Analyst training). This inserts exactly that, so the admin
-- starts out matching what's already live instead of empty.
--
-- Skip this file entirely if you'd rather start from scratch and type
-- your experience into the admin by hand.
-- ============================================================

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
