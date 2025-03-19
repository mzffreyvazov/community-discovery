// app/onboarding/layout.tsx
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { ThemeProvider } from '@/components/theme-provider'
export default async function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const { sessionClaims } = await auth();
  
  // If the entire onboarding is complete, redirect to home
  if (sessionClaims?.metadata.onboardingComplete === true) {
    redirect('/')
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}