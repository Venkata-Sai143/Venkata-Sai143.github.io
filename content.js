// src/lib/content.js
//
// Loaders + hooks for every section. Each loader returns data shaped exactly
// like the arrays currently hard-coded in your components, so wiring a
// component up is a one-line change and the JSX stays untouched.
//
// Every loader falls back to the bundled defaults if Supabase is unreachable,
// so a network blip shows the old site rather than an empty page.

import { useEffect, useState } from 'react';
import { supabase, hasBackend } from './supabase';
import * as fallback from './fallback';

const ok = (res, alt) => (res.error ? (console.warn('[portfolio]', res.error.message), alt) : (res.data ?? alt));

/* ---------------- profile ---------------- */
export async function loadProfile() {
  if (!hasBackend) return fallback.profile;
  const res = await supabase.from('profiles').select('*').limit(1).maybeSingle();
  return ok(res, fallback.profile) || fallback.profile;
}

/* ---------------- expertise ---------------- */
export async function loadExpertise() {
  if (!hasBackend) return fallback.expertise;
  const res = await supabase.from('expertise').select('*')
    .eq('is_published', true).order('sort_order', { ascending: true });
  const rows = ok(res, fallback.expertise);
  return rows.map(r => ({
    number: r.number,
    title: r.title,
    text: r.text,
    className: r.position_class,   // keeps the exact layout + rotation
    aosType: r.aos_type,
    aosDelay: r.aos_delay,
  }));
}

/* ---------------- skills ---------------- */
// Returns [{ category, skills: [name, …] }] — the shape your skill cards use.
export async function loadSkills() {
  if (!hasBackend) return fallback.skillGroups;
  const res = await supabase.from('skills').select('*')
    .eq('is_published', true).order('sort_order', { ascending: true });
  const rows = ok(res, null);
  if (!rows) return fallback.skillGroups;

  const order = [];
  const byCat = {};
  for (const r of rows) {
    if (!byCat[r.category]) { byCat[r.category] = []; order.push(r.category); }
    byCat[r.category].push(r.name);
  }
  return order.map(category => ({ category, skills: byCat[category] }));
}

// The four icon badges in the About strip: [{ name, icon }]
export async function loadFeaturedSkills() {
  if (!hasBackend) return fallback.techBadges;
  const res = await supabase.from('skills').select('name, icon_url')
    .eq('is_published', true).eq('is_featured', true)
    .order('sort_order', { ascending: true });
  const rows = ok(res, null);
  if (!rows || !rows.length) return fallback.techBadges;
  return rows.map(r => ({
    name: r.name,
    // fall back to the bundled base64 icon if none has been uploaded yet
    icon: r.icon_url || (fallback.techBadges.find(b => b.name === r.name)?.icon ?? ''),
  }));
}

/* ---------------- experience ---------------- */
export async function loadExperience() {
  if (!hasBackend) return fallback.experiences;
  const res = await supabase.from('experiences').select('*')
    .eq('is_published', true).order('sort_order', { ascending: true });
  const rows = ok(res, fallback.experiences);
  return rows.map(r => ({
    ...r,
    period: r.period_label || formatPeriod(r.start_date, r.end_date, r.is_current),
  }));
}
function formatPeriod(start, end, current) {
  const f = d => d ? new Date(d).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : '';
  if (!start) return '';
  return `${f(start)} — ${current ? 'Present' : (f(end) || 'Present')}`;
}

/* ---------------- projects ---------------- */
export async function loadProjects() {
  if (!hasBackend) return fallback.projects;
  const res = await supabase.from('projects').select('*')
    .eq('is_published', true).order('sort_order', { ascending: true });
  const rows = ok(res, fallback.projects);
  return rows.map(r => ({
    // exactly the keys your existing project card destructures
    title: r.title,
    category: r.category,
    description: r.short_description,
    tags: r.tags || [],
    match: r.match_label,
    episode: r.episode,
    // everything else, for the detail view
    id: r.id,
    slug: r.slug,
    fullDescription: r.full_description,
    businessProblem: r.business_problem,
    tools: r.tools || [],
    dataset: r.dataset,
    kpis: r.kpis || [],
    insights: r.insights || [],
    recommendations: r.recommendations || [],
    githubUrl: r.github_url,
    liveUrl: r.live_url,
    demoVideoUrl: r.demo_video_url,
    thumbnail: r.thumbnail_url,
    gallery: r.gallery || [],
    featured: r.is_featured,
  }));
}

/* ---------------- certificates ---------------- */
export async function loadCertificates() {
  if (!hasBackend) return fallback.certificates;
  const res = await supabase.from('certificates').select('*')
    .eq('is_published', true).order('sort_order', { ascending: true });
  const rows = ok(res, fallback.certificates);
  return rows.map(r => ({
    title: r.title,
    issuer: r.issuer,
    date: r.date_label || (r.issue_date ? new Date(r.issue_date).getFullYear().toString() : ''),
    id: r.id,
    credentialId: r.credential_id,
    credentialUrl: r.credential_url,
    description: r.description,
    imageUrl: r.image_url,
    pdfUrl: r.pdf_url,
  }));
}

/* ---------------- hooks ---------------- */
function useLoader(loader, initial) {
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    loader()
      .then(d => { if (alive && d) setData(d); })
      .catch(e => console.warn('[portfolio]', e))
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);
  return { data, loading };
}

export const useProfile        = () => useLoader(loadProfile,        fallback.profile);
export const useExpertise      = () => useLoader(loadExpertise,      fallback.expertise);
export const useSkills         = () => useLoader(loadSkills,         fallback.skillGroups);
export const useFeaturedSkills = () => useLoader(loadFeaturedSkills, fallback.techBadges);
export const useExperience     = () => useLoader(loadExperience,     fallback.experiences);
export const useProjects       = () => useLoader(loadProjects,       fallback.projects);
export const useCertificates   = () => useLoader(loadCertificates,   fallback.certificates);
