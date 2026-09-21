-- ============================================================
-- 04_seed.sql — migration of the content currently hard-coded in
-- portfolio-for-root-domain-v5. Every string below was read out of
-- assets/index-3yaRcJLA.js. Nothing here is invented.
--
-- Where the live site itself contains placeholder copy
-- ("Add Project Title", "Add Certificate Title") that placeholder is
-- carried over as-is, so the site looks identical on day one and you
-- replace it from the admin.
-- ============================================================

-- ---------- profile ----------
insert into public.profiles (
  name, headline, short_bio, about, location,
  profile_image_url, hero_video_url,
  hero_cta_primary_label, hero_cta_primary_href,
  hero_cta_secondary_label, hero_cta_secondary_href,
  about_heading, expertise_badge, expertise_heading, expertise_subtext, expertise_note,
  skills_badge, skills_heading,
  meta_title, meta_description
) values (
  'Venkata Sai',
  'Data Analyst',
  'Data Analyst turning raw data into clear insights using Excel, SQL, Power BI, and Python.',
  'Hi, my name is Venkata Sai, a Data Analyst based in Andhra Pradesh, India, dedicated to turning raw data into clear, actionable insights.',
  'Andhra Pradesh, India',
  '/assets/image-DaXzU-ni.png',
  '/assets/herovideo-DoafQIuO.mp4',
  'View My Work', '#projects',
  'Contact Me',   '#contact',
  'Hello!',
  'My Expertise',
  'Turning Data Into Clear, Actionable Insights',
  'Combining spreadsheets, databases, and visualization tools to explore data and tell the story behind it.',
  'Turning data into decisions!',
  'Technical Stack',
  'Technologies I Work With',
  'Venkata Sai | Data Analyst Portfolio',
  'Data Analyst turning raw data into clear insights using Excel, SQL, Power BI, and Python.'
) on conflict (singleton) do nothing;

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

-- the four icon badges in the About strip.
-- Their icons are currently inline base64 inside the JS bundle. Re-upload
-- them through Admin → Media and paste the URLs here, or leave icon_url null
-- and keep passing the bundled icons for now (see README step 6).
update public.skills set is_featured = true
 where name in ('Excel','SQL','Power BI','Python');

-- ---------- projects ----------
-- v5 ships four placeholder cards. Carried over verbatim.
insert into public.projects (title, category, short_description, tags, match_label, episode, sort_order) values
 ('Add Project Title','Data Analysis',
  'Add a short description of what this project does and what you learned.',
  array['Excel','SQL'],'New','P01',1),
 ('Add Project Title','Data Visualization',
  'Add a short description of what this project does and what you learned.',
  array['Power BI'],'New','P02',2),
 ('Add Project Title','Data Analysis',
  'Add a short description of what this project does and what you learned.',
  array['Python'],'New','P03',3),
 ('Add Project Title','Databases',
  'Add a short description of what this project does and what you learned.',
  array['SQL','MySQL'],'New','P04',4);

-- ---------- certificates ----------
-- v5 ships three placeholder cards. Carried over verbatim.
insert into public.certificates (title, issuer, date_label, sort_order) values
 ('Add Certificate Title','Add Issuer Name','Add Date',1),
 ('Add Certificate Title','Add Issuer Name','Add Date',2),
 ('Add Certificate Title','Add Issuer Name','Add Date',3);

-- ---------- experiences ----------
-- v5 has NO experience section and no experience content, so there is
-- nothing to migrate. The table is left empty on purpose rather than
-- filled with invented roles. Add yours from Admin → Experience.
