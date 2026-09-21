// src/lib/fallback.js
//
// The content currently hard-coded in v5, kept as the offline fallback.
// If Supabase is down or the env vars are missing, the site renders exactly
// as it does today instead of showing empty sections.
//
// Keep this in sync with supabase/04_seed.sql.

export const profile = {
  name: 'Venkata Sai',
  headline: 'Data Analyst',
  short_bio: 'Data Analyst turning raw data into clear insights using Excel, SQL, Power BI, and Python.',
  about: 'Hi, my name is Venkata Sai, a Data Analyst based in Andhra Pradesh, India, dedicated to turning raw data into clear, actionable insights.',
  location: 'Andhra Pradesh, India',
  profile_image_url: '/assets/image-DaXzU-ni.png',
  hero_video_url: '/assets/herovideo-DoafQIuO.mp4',
  hero_cta_primary_label: 'View My Work',
  hero_cta_primary_href: '#projects',
  hero_cta_secondary_label: 'Contact Me',
  hero_cta_secondary_href: '#contact',
  about_heading: 'Hello!',
  expertise_badge: 'My Expertise',
  expertise_heading: 'Turning Data Into Clear, Actionable Insights',
  expertise_subtext: 'Combining spreadsheets, databases, and visualization tools to explore data and tell the story behind it.',
  expertise_note: 'Turning data into decisions!',
  skills_badge: 'Technical Stack',
  skills_heading: 'Technologies I Work With',
  email: '', linkedin_url: '', github_url: '', resume_url: '',
};

export const expertise = [
  { number: '01', title: 'Excel & Advanced Excel',
    text: 'Cleaning, organizing, and analyzing data with formulas, pivot tables, and dashboards to surface trends quickly.',
    className: 'md:absolute md:top-[10px] md:right-[5%] lg:right-[10%] rotate-2 md:rotate-6',
    aosType: 'fade-left', aosDelay: '100' },
  { number: '02', title: 'SQL & Databases',
    text: 'Writing SQL queries to extract, join, and summarize data from relational databases like MySQL for reporting and analysis.',
    className: 'md:absolute md:top-[450px] md:left-[5%] lg:left-[10%] -rotate-2 md:-rotate-6',
    aosType: 'fade-right', aosDelay: '200' },
  { number: '03', title: 'Power BI & Tableau',
    text: 'Building interactive dashboards and visual reports that turn raw numbers into stories stakeholders can act on.',
    className: 'md:absolute md:top-[700px] md:right-[5%] lg:right-[15%] rotate-1 md:rotate-3',
    aosType: 'fade-left', aosDelay: '300' },
  { number: '04', title: 'Python & Statistics',
    text: 'Using Python for data analysis and applying statistical concepts to validate findings and support decisions.',
    className: 'md:absolute md:top-[1050px] md:left-[15%] lg:left-[25%] -rotate-1 md:-rotate-3',
    aosType: 'fade-right', aosDelay: '400' },
];

export const skillGroups = [
  { category: 'Spreadsheets & Reporting', skills: ['Excel', 'Advanced Excel', 'Pivot Tables', 'Google Sheets'] },
  { category: 'Databases & Querying',     skills: ['SQL', 'MySQL', 'Data Cleaning', 'Joins & Aggregations'] },
  { category: 'Data Visualization',       skills: ['Power BI', 'Tableau', 'Dashboards', 'Data Storytelling'] },
  { category: 'Programming & Statistics', skills: ['Python', 'Statistics', 'Jira', 'Git', 'GitHub'] },
];

// The four About-strip badges. Replace the `icon` values with the base64
// strings already in your source (the existing `Md` array) — they are yours
// and they are what the current site renders.
export const techBadges = [
  { name: 'Excel',    icon: '' },
  { name: 'SQL',      icon: '' },
  { name: 'Power BI', icon: '' },
  { name: 'Python',   icon: '' },
];

export const experiences = [];

export const projects = [
  { title: 'Add Project Title', category: 'Data Analysis',
    description: 'Add a short description of what this project does and what you learned.',
    tags: ['Excel', 'SQL'], match: 'New', episode: 'P01' },
  { title: 'Add Project Title', category: 'Data Visualization',
    description: 'Add a short description of what this project does and what you learned.',
    tags: ['Power BI'], match: 'New', episode: 'P02' },
  { title: 'Add Project Title', category: 'Data Analysis',
    description: 'Add a short description of what this project does and what you learned.',
    tags: ['Python'], match: 'New', episode: 'P03' },
  { title: 'Add Project Title', category: 'Databases',
    description: 'Add a short description of what this project does and what you learned.',
    tags: ['SQL', 'MySQL'], match: 'New', episode: 'P04' },
];

export const certificates = [
  { title: 'Add Certificate Title', issuer: 'Add Issuer Name', date: 'Add Date' },
  { title: 'Add Certificate Title', issuer: 'Add Issuer Name', date: 'Add Date' },
  { title: 'Add Certificate Title', issuer: 'Add Issuer Name', date: 'Add Date' },
];
