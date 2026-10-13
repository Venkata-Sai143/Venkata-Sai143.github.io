// Static portfolio content loaders.
// The public site uses bundled local content and does not connect to a backend.

import { useEffect, useState } from 'react';
import * as fallback from './fallback';

export async function loadProfile() { return fallback.profile; }
export async function loadExpertise() { return fallback.expertise; }
export async function loadSkills() { return fallback.skillGroups; }
export async function loadFeaturedSkills() { return fallback.techBadges; }
export async function loadExperience() { return fallback.experiences; }
export async function loadProjects() { return fallback.projects; }
export async function loadCertificates() { return fallback.certificates; }

function useLoader(loader, initial) {
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    Promise.resolve()
      .then(loader)
      .then(value => { if (alive && value) setData(value); })
      .catch(error => console.warn('[portfolio]', error))
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [loader]);
  return { data, loading };
}

export const useProfile = () => useLoader(loadProfile, fallback.profile);
export const useExpertise = () => useLoader(loadExpertise, fallback.expertise);
export const useSkills = () => useLoader(loadSkills, fallback.skillGroups);
export const useFeaturedSkills = () => useLoader(loadFeaturedSkills, fallback.techBadges);
export const useExperience = () => useLoader(loadExperience, fallback.experiences);
export const useProjects = () => useLoader(loadProjects, fallback.projects);
export const useCertificates = () => useLoader(loadCertificates, fallback.certificates);
