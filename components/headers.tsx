// components/headers.tsx
"use client";

import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function Header() {
  return (
    <header className="fixed top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50"> {/* Added z-50 */}
      <div className="container flex h-14 max-w-screen items-center justify-between px-4">
        <Link href="/" className="font-bold text-lg">
          dost.social
        </Link>

        <div className="flex items-center gap-6">
          <SignedIn>
            <nav className="flex items-center gap-6">
              <Link
                href="/discover"
                className="text-sm font-medium hover:text-foreground/80"
              >
                Discover
              </Link>
            </nav>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                },
              }}
            />
          </SignedIn>

          <SignedOut>
            <nav className="flex items-center gap-4">
              <SignInButton mode="modal">
                <button className="text-sm font-medium hover:text-foreground/80">
                  Sign In
                </button>
              </SignInButton>
              <Link
                href="/sign-up"
                className="bg-foreground text-background hover:bg-foreground/90 px-4 py-2 rounded-full text-sm font-medium"
              >
                Sign Up
              </Link>
            </nav>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}