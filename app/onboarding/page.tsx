'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { completeOnboarding } from './_actions'
import { UserInfoForm } from '@/components/UserInfoFormOnboarding'
import { ThemeProvider } from '@/components/theme-provider'

export default function OnboardingPage() {
  const [error, setError] = React.useState('')
  const router = useRouter()

  const handleSave = async (data: { bio: string; interests: string[]; profilePhoto?: File }) => {
    try {
      setError('');
      const formData = new FormData();
      formData.append('bio', data.bio);
      formData.append('interests', JSON.stringify(data.interests));
      if (data.profilePhoto) {
        formData.append('profilePhoto', data.profilePhoto);
      }

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
    <div className="grid place-items-center p-4 bg-background text-foreground">
      {error && (
        <p className="text-destructive text-sm mb-4 text-center">Error: {error}</p>
      )}
      <UserInfoForm onSave={handleSave} />
    </div>
  );
}