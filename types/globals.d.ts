// types/globals.d.ts
export {}

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboardingComplete?: boolean,
      onboardingStep?: 'bio-completed' | 'location-completed',
      bio?: string,
      location?: {
        city: string,
        country: string
      }
    }
  }
}