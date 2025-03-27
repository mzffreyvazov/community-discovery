// api/user/profile/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase admin client with service role key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function POST() {
  try {
    const session = await auth();
    const userId = session.userId;
    
    if (!userId) {
      console.error('No userId found in auth');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Checking if user exists in Supabase');
    
    // MODIFIED: Use stringified clerk_user_id
    const { data: existingUser, error: selectError } = await supabaseAdmin
      .from('users')
      .select('*')  // Be explicit about what you're selecting
      .eq('clerk_user_id', userId)  // Ensure it's treated as a string
      .single();

    if (selectError && selectError.code !== 'PGRST116') { // Ignore not found error
      console.error('Error checking for existing user:', selectError);
      throw selectError;
    }

    if (!existingUser) {
      console.log('User not found, creating new profile');
      
      // MODIFIED: Use an explicit insert without trying to directly use the userId
      const { data: newUser, error: insertError } = await supabaseAdmin
        .from('users')
        .insert({
          clerk_user_id: userId,  // Ensure it's treated as a string
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          bio: null // Initialize bio to null
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating new user:', insertError);
        throw insertError;
      }
      
      console.log('New user created successfully:', newUser);
      return NextResponse.json({ user: newUser });
    }

    console.log('Existing user found:', existingUser);
    return NextResponse.json({ user: existingUser });
  } catch (error) {
    console.error('Error in profile creation:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
// a new PUT endpoint to handle bio updates
// ...existing code...

export async function PUT(request: Request) {
  try {
    const session = await auth();
    const userId = session.userId;
    
    if (!userId) {
      console.error('No userId found in auth');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { bio } = body;

    if (!bio) {
      return NextResponse.json({ error: 'Bio is required' }, { status: 400 });
    }

    console.log('Updating bio for user:', userId);

    // Update user's bio in Supabase
    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        bio,
        updated_at: new Date().toISOString()
      })
      .eq('clerk_user_id', userId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating user bio:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('Bio updated successfully:', updatedUser);
    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Error updating bio:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}