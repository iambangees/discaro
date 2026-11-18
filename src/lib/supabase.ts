import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/*
  Supabase access for Discaro.

  The publishable key is designed to be exposed publicly — Row Level
  Security (see supabase/schema.sql) is what protects the data: public
  visitors can only read published content. Writes happen through the
  admin (Phase 4) with a secret key that never ships to the browser.

  When the env vars are absent (e.g. a fresh clone), getSupabase()
  returns null and the data layer falls back to empty results, so the
  site still builds and renders its honest empty states.
*/

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const supabaseConfigured = Boolean(url && publishableKey);

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!supabaseConfigured) return null;
  if (!client) {
    client = createClient(url!, publishableKey!, {
      auth: { persistSession: false },
    });
  }
  return client;
}
