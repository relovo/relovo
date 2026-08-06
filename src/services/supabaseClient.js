import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://weafkpbifpnqfwmqefus.supabase.co";

const supabaseAnonKey =
  "sb_publishable_6LqtrQzdeV6cDI-EQAeNvw_cIDtjsoV";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);