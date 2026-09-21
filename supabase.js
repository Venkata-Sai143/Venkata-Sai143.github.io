// src/lib/supabase.js
// The public site only ever uses the anon key. Row Level Security is what
// keeps the data safe, not the key — see supabase/02_rls.sql.
import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.warn('[portfolio] Supabase env vars missing — falling back to bundled content.');
}

export const supabase = (url && key)
  ? createClient(url, key, { auth: { persistSession: false } })
  : null;

export const hasBackend = Boolean(supabase);
