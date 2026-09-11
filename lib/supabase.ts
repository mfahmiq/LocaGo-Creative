import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mnxbnddjmkruzabhlrtq.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ueGJuZGRqbWtydXphYmhscnRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkxMDA1MDMsImV4cCI6MjEwNDY3NjUwM30.lRHG8QqfHYu8qNww5A3fRLNyIplI39nXWRMdVfbsy5g';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
