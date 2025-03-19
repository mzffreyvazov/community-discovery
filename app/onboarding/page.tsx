'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { completeOnboarding } from './_actions'

export default function OnboardingPage() {
  const [error, setError] = React.useState('')
  const router = useRouter()

// app/onboarding/page.tsx - Update the handleSubmit function
const handleSubmit = async (formData: FormData) => {
    try {
      setError('');
      const res = await completeOnboarding(formData);
      
      if (res?.message) {
        // Instead of relying on metadata changes and reloading the user
        // Just directly navigate to the next page
        router.push('/onboarding/location');
      }
      
      if (res?.error) {
        setError(res?.error);
      }
    } catch  { // Changed 'err' to '_err' to indicate intentionally unused parameter
      setError('An unexpected error occurred');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Complete Your Profile</h1>
        
        <form action={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="bio" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tell us about yourself
            </label>
            <p className="text-sm text-gray-500 mb-2">
              Share a little about yourself, your interests, or what brings you here.
            </p>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              minLength={10}
              maxLength={500}
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm">Error: {error}</p>
          )}

          <div className="flex justify-end">
            <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                Continue to Next Step
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}