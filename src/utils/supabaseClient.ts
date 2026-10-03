// src/utils/supabaseClient.ts
// =========================================================================
// Singleton Supabase Client
// Membaca kredensial publik dari .env.local (TIDAK pernah di-commit).
// =========================================================================
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "[Supabase] NEXT_PUBLIC_SUPABASE_URL atau NEXT_PUBLIC_SUPABASE_ANON_KEY belum di-set. " +
      "Pastikan file .env.local ada di root proyek, lalu restart dev server."
  );
}

/**
 * Satu instance untuk seluruh aplikasi, agar tidak membuat koneksi ganda
 * saat hot-reload di mode development.
 */
const globalForSupabase = globalThis as unknown as {
  __supabase?: SupabaseClient;
};

export const supabase: SupabaseClient =
  globalForSupabase.__supabase ??
  createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForSupabase.__supabase = supabase;
}
