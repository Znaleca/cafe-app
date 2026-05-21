import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

if (typeof window !== 'undefined') {
  console.log('[Supabase] URL:', supabaseUrl);
  console.log('[Supabase] Key prefix:', supabaseAnonKey?.slice(0, 20));
}

const globalForSupabase = globalThis;

if (!globalForSupabase.supabase) {
  globalForSupabase.supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

export const supabase = globalForSupabase.supabase;
