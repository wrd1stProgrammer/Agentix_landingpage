import { createClient } from "@supabase/supabase-js";

// Replace these with your actual Supabase Project URL and Anon Key
// You can find them in Project Settings > API
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials are missing. Please add them to your environment variables.");
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co", 
  supabaseAnonKey || "placeholder"
);
