import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qtnbhtumjykvllaxbueh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0bmJodHVtanlrdmxsYXhidWVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4ODAzODYsImV4cCI6MjA2NjQ1NjM4Nn0.OPk1QlDNVIo_VOu_m7MG4c_g8R2-Z2XvWhAgj-dqbzw';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    await supabase.auth.exchangeCodeForSession(code);
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin);
} 