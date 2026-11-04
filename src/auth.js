import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || '').trim();
export const SUPABASE_PUBLISHABLE_KEY = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '').trim();
const apiBase = (import.meta.env.VITE_CARTA_API_URL || '').trim();

export const supabase = SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null;

function requireSupabase() {
  if (!supabase) throw new Error('CARTA is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.');
  return supabase;
}

export async function getSessionUser() {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error(error.message || 'Could not load your session.');
  return data.session?.user || null;
}

export async function getAccessToken() {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error(error.message || 'Could not obtain a secure session token.');
  return data.session?.access_token || null;
}

export async function signInWithEmail(email, password) {
  const { data, error } = await requireSupabase().auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message || 'Sign in failed.');
  return data.user || null;
}

export async function signUpWithEmail(email, password, name) {
  const { data, error } = await requireSupabase().auth.signUp({
    email,
    password,
    options: { data: { display_name: String(name || '').trim() } },
  });
  if (error) throw new Error(error.message || 'Account creation failed.');
  // With email confirmation enabled, Supabase creates the user but does not create a session yet.
  return data.session ? data.user : null;
}

export async function signOut() {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message || 'Sign out failed.');
}

export const CARTA_API_BASE = apiBase.replace(/\/$/, '');

export function apiUrl(path) {
  if (!CARTA_API_BASE) throw new Error('CARTA API is not configured. Set VITE_CARTA_API_URL.');
  const cleanPath = String(path || '').replace(/^\//, '');
  return `${CARTA_API_BASE}/api/${cleanPath}`;
}

export async function apiFetch(path, options = {}) {
  if (!SUPABASE_PUBLISHABLE_KEY) throw new Error('Supabase publishable key is not configured.');
  const headers = new Headers(options.headers || {});
  headers.set('apikey', SUPABASE_PUBLISHABLE_KEY);
  if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  const token = await getAccessToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return fetch(apiUrl(path), { ...options, headers, credentials: 'omit' });
}
