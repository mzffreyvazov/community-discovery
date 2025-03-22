'use server'

import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase";

export async function getUserId(): Promise<number | null> {
  const { userId } = await auth();
  
  if (!userId) return null;
  
  const supabase = createAdminClient();
  
  // Find the corresponding internal user ID in the users table
  const { data, error } = await supabase
    .from('users')
    .select('useri_id')
    .eq('clerk_user_id', userId)
    .single();
  
  if (error || !data) {
    console.error('Error getting user ID:', error);
    return null;
  }
  
  return data.useri_id;
}