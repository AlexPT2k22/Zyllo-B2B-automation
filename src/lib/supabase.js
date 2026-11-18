import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// During the build-time prerender (import.meta.env.SSR) this module is
// imported but the client is never used — Supabase calls only run inside
// effects in the browser. Use a placeholder there so the build doesn't need
// the env vars. In the browser, real values are still required.
const isPrerender = import.meta.env.SSR;

if (!isPrerender && (!supabaseUrl || !supabaseAnonKey)) {
  console.error(
    "Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Add them to .env (local) or to the Vercel project's Environment Variables.",
  );
}

export const supabase = createClient(
  supabaseUrl || (isPrerender ? "http://localhost:54321" : supabaseUrl),
  supabaseAnonKey || (isPrerender ? "prerender-placeholder" : supabaseAnonKey),
);
