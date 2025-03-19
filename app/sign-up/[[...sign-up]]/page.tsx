'use client'

import { SignUp } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";

export default function SignUpPage() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <SignUp 
        appearance={{
          baseTheme: theme === 'dark' ? dark : undefined,
          elements: {
            rootBox: "mx-auto",
            card: "bg-background shadow-none",
          }
        }}
        redirectUrl="/discover"
      />
    </div>
  );
}