// app/onboarding/location/page.tsx
'use client'

import * as React from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { completeLocationOnboarding } from '../_actions'


export default function LocationOnboardingPage() {
  const [error, setError] = React.useState('')
  // const [isLoading, setIsLoading] = React.useState(false)
  const [locationData, setLocationData] = React.useState({
    country: '',
    city: '',
    latitude: null as number | null,
    longitude: null as number | null
  })
  const { user } = useUser()
  const router = useRouter()


  // const handleGeolocation = async () => {
  //   setIsLoading(true)
    
  //   if (!navigator.geolocation) {
  //     setError('Geolocation is not supported by your browser')
  //     setIsLoading(false)
  //     return
  //   }
    
  //   navigator.geolocation.getCurrentPosition(
  //     async (position) => {
  //       try {
  //           const { latitude, longitude } = position.coords
            
  //           // Fetch city and country using OpenCage
  //           const response = await fetch(`/api/geocode?lat=${latitude}&lng=${longitude}`)
            
  //           if (!response.ok) {
  //             throw new Error('Failed to fetch location data')
  //           }
            
  //           const data = await response.json()
            
  //           setLocationData({
  //             country: data.country,
  //             city: data.city,
  //             latitude,
  //             longitude
  //           })
  //           setIsLoading(false)
  //         } catch { // Changed to _err to indicate it's intentionally unused
  //           setError('Failed to get location details')
  //           setIsLoading(false)
  //         }
  //       },
  //       () => { // Changed to _err to indicate it's intentionally unused
  //         setError('Unable to retrieve your location')
  //         setIsLoading(false)
  //       }
  //   )
  // }

  const handleSubmit = async (formData: FormData) => {
    const res = await completeLocationOnboarding(formData)
    if (res?.message) {
      // Reload user data from Clerk API
      await user?.reload()
      router.push('/discover')
    }
    if (res?.error) {
      setError(res?.error)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md bg-card rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-foreground">Where are you located?</h1>
        
        <div className="mb-6">
          <button
            // onClick={handleGeolocation}
            disabled={true}
            className="w-full py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-foreground bg-muted hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring disabled:opacity-50 cursor-not-allowed"
          >
            Use my current location
          </button>
          <p className="text-xs text-yellow-500 dark:text-yellow-400 mt-1 text-center">
            ⚡ Coming soon! This feature is currently under development.
          </p>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Please manually enter your location below
          </p>
        </div>
        
        <form action={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="country" 
              className="block text-sm font-medium text-foreground mb-1"
            >
              Country
            </label>
            <input
              id="country"
              name="country"
              type="text"
              value={locationData.country}
              onChange={(e) => setLocationData({...locationData, country: e.target.value})}
              className="w-full px-3 py-2 border bg-background text-foreground border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
              required
            />
          </div>
          
          <div>
            <label 
              htmlFor="city" 
              className="block text-sm font-medium text-foreground mb-1"
            >
              City
            </label>
            <input
              id="city"
              name="city"
              type="text"
              value={locationData.city}
              onChange={(e) => setLocationData({...locationData, city: e.target.value})}
              className="w-full px-3 py-2 border bg-background text-foreground border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
              required
            />
          </div>
          
          {/* Hidden fields to pass coordinates if available */}
          <input type="hidden" name="latitude" value={locationData.latitude || ''} />
          <input type="hidden" name="longitude" value={locationData.longitude || ''} />

          {error && (
            <p className="text-destructive text-sm">Error: {error}</p>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
            >
              Complete Onboarding
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}