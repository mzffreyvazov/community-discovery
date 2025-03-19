'use server'

import { auth, clerkClient } from "@clerk/nextjs/server";

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
          onboardingComplete: true
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

      return { message: "Onboarding completed successfully" };
    } catch (error) {
      console.error("Onboarding error:", error);
      return { error: "Failed to complete onboarding" };
    }
}