'use server'

import { auth, clerkClient } from "@clerk/nextjs/server";

// app/onboarding/_actions.ts
export async function completeOnboarding(formData: FormData) {
    try {
      const { userId, getToken } = await auth();
      if (!userId) {
        return { error: "Unauthorized" };
      }
  
      const bio = formData.get('bio') as string;
      const client = await clerkClient();
  
      // Get the session token
      const token = await getToken();
  
      // Update user metadata with bio
      await client.users.updateUser(userId, {
        unsafeMetadata: {
          bio,
        },
        publicMetadata: {
          onboardingBioComplete: true  // Track bio completion separately
        }
      });
  
      // Update Supabase using the API route
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ bio }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update bio in Supabase');
      }
  
      return { message: "Bio updated successfully" };
    } catch (error) {
      console.error("Onboarding error:", error);
      return { error: "Failed to complete onboarding" };
    }
  }

// app/onboarding/_actions.ts - Add this function
// app/onboarding/_actions.ts - completeLocationOnboarding function
export async function completeLocationOnboarding(formData: FormData) {
    try {
      const { userId, getToken } = await auth();
      if (!userId) {
        return { error: "Unauthorized" };
      }
  
      // Get location data from form
      const city = formData.get('city') as string;
      const country = formData.get('country') as string;
      const latitude = formData.get('latitude') as string;
      const longitude = formData.get('longitude') as string;
  
      // Validate required fields
      if (!city || !country) {
        return { error: "City and country are required" };
      }
  
      const client = await clerkClient();
      const token = await getToken();
  
      // Update user metadata in Clerk - now marking the ENTIRE onboarding as complete
      await client.users.updateUser(userId, {
        publicMetadata: {
          onboardingComplete: true,
          location: {
            city,
            country
          }
        }
      });
  
      // Update Supabase using the API route
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/user/location`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          city, 
          country, 
          latitude: latitude || null, 
          longitude: longitude || null 
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update location in Supabase');
      }
  
      return { message: "Location updated successfully" };
    } catch (error) {
      console.error("Location update error:", error);
      return { error: "Failed to update location" };
    }
  }