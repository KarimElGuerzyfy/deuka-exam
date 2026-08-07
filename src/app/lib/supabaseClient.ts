import { createClient } from "@supabase/supabase-js";

// Public anon key — safe in the browser. RLS restricts this key to
// SELECT on public.exams. It CANNOT write exams or read user tables
// (those get their own RLS once they exist).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
