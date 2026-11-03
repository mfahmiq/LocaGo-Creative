import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mnxbnddjmkruzabhlrtq.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_H-meffsrYDjKI6UuwybniA_EsyPmg46';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
