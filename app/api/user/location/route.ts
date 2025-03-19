// app/api/user/location/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase admin client
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

export async function PUT(request: Request) {
  try {
    const session = await auth();
    const userId = session.userId;
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { city, country, latitude, longitude } = body;

    if (!city || !country) {
      return NextResponse.json({ error: 'City and country are required' }, { status: 400 });
    }

    // Update user's location in Supabase - using the correct column names
    // based on the error, the columns are likely named location_latitude and location_longitude
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({
        city,
        country,
        location_latitude: latitude || null,  // Changed from latitude to location_latitude
        location_longitude: longitude || null, // Changed from longitude to location_longitude
        updated_at: new Date().toISOString()
      })
      .eq('clerk_user_id', userId.toString())
      .select()
      .single();

    if (error) {
      console.error('Error updating user location:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user: data });
  } catch (error) {
    console.error('Error updating location:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}