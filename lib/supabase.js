import { createClient } from '@supabase/supabase-js';

/* Server-only. Uses the service role key, which bypasses row-level security —
   never import this from a client component or expose it to the browser. */
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);
