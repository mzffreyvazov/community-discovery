// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// For server components and API routes
export const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase credentials');
  }
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

// For client components only
export const createBrowserClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase credentials');
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
};

// Fetching interests from tags table
interface Interest {
  id: string;
  label: string;
}

export async function fetchInterests(): Promise<Interest[]> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from('tags')
    .select('id, name')
    .order('name');

  if (error) {
    console.error('Error fetching interests:', error);
    return [];
  }

  return data.map(interest => ({
    id: interest.id.toString(),
    label: interest.name
  }));
}