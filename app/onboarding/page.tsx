'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { completeOnboarding } from './_actions'

export default function OnboardingPage() {
  const [error, setError] = React.useState('')
  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    try {
      setError('');
      const res = await completeOnboarding(formData);
      
      if (res?.message) {
        router.push('/onboarding/location');
      }
      
      if (res?.error) {
        setError(res?.error);
      }
    } catch {
      setError('An unexpected error occurred');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md bg-card rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-foreground">Complete Your Profile</h1>
        
        <form action={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="bio" 
              className="block text-sm font-medium text-foreground mb-1"
            >
              Tell us about yourself
            </label>
            <p className="text-sm text-muted-foreground mb-2">
              Share a little about yourself, your interests, or what brings you here.
            </p>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              className="w-full px-3 py-2 border bg-background text-foreground border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
              required
              minLength={10}
              maxLength={500}
            />
          </div>

          {error && (
            <p className="text-destructive text-sm">Error: {error}</p>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
            >
              Continue to Next Step
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}