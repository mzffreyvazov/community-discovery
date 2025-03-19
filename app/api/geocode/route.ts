// app/api/geocode/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 });
  }

  try {
    // Use OpenCage to get location details
    const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const result = data.results[0].components;
      
      return NextResponse.json({
        city: result.city || result.town || result.village || result.hamlet || '',
        country: result.country || '',
        formatted: data.results[0].formatted
      });
    }
    
    return NextResponse.json({ error: 'Location not found' }, { status: 404 });
  } catch (error) {
    console.error('Geocoding error:', error);
    return NextResponse.json(
      { error: 'Failed to process geocoding request' },
      { status: 500 }
    );
  }
}