// components/UserProfileInitializer.tsx
"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

export default function UserProfileInitializer() {
  const { userId, isLoaded } = useAuth();

  useEffect(() => {
    // Only run if authentication is loaded and we have a userId
    if (isLoaded && userId) {
      // Create user profile in Supabase
      fetch('/api/user/profile', {
        method: 'POST',
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to create user profile');
          return res.json();
        })
        .catch(error => {
          console.error('Error initializing user profile:', error);
        });
    }
  }, [userId, isLoaded]);

  // This component doesn't render anything
  return null;
}