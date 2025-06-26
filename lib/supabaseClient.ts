import { createClient } from '@supabase/supabase-js';

// TODO: Replace with your actual Supabase project URL and anon key
const supabaseUrl = 'https://qtnbhtumjykvllaxbueh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0bmJodHVtanlrdmxsYXhidWVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4ODAzODYsImV4cCI6MjA2NjQ1NjM4Nn0.OPk1QlDNVIo_VOu_m7MG4c_g8R2-Z2XvWhAgj-dqbzw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 