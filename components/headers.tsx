// components/headers.tsx
"use client";

import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import * as React from "react"
import { Moon, Sun, Menu } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
  const { setTheme } = useTheme()
 
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function MobileAuthMenu() {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <SignInButton mode="modal">
          <DropdownMenuItem>
            Sign In
          </DropdownMenuItem>
        </SignInButton>
        <DropdownMenuItem asChild>
          <Link href="/sign-up">Sign Up</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function Header() {
  return (
    <header className="fixed top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="container flex h-14 items-center justify-between px-4 mx-auto">
        <Link href="/" className="font-bold text-lg flex-shrink-0">
          dost.social
        </Link>

        <div className="flex items-center gap-3">
          {/* Signed In State */}
          <SignedIn>
            {/* Desktop */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/discover"
                className="text-sm font-medium hover:text-foreground/80 flex-shrink-0"
              >
                Discover
              </Link>
              <div className="flex-shrink-0">
                <ModeToggle />
              </div>
            </nav>
            
            {/* Mobile */}
            <div className="md:hidden flex-shrink-0">
              <ModeToggle />
            </div>
            
            <div className="flex-shrink-0">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                  },
                }}
              />
            </div>
          </SignedIn>

          {/* Signed Out State */}
          <SignedOut>
            {/* Desktop */}
            <nav className="hidden md:flex items-center gap-4">
              <div className="flex-shrink-0">
                <ModeToggle />
              </div>
              <SignInButton mode="modal">
                <button className="text-sm font-medium hover:text-foreground/80 flex-shrink-0">
                  Sign In
                </button>
              </SignInButton>
              <Link
                href="/sign-up"
                className="bg-foreground text-background hover:bg-foreground/90 px-4 py-2 rounded-full text-sm font-medium flex-shrink-0"
              >
                Sign Up
              </Link>
            </nav>
            
            {/* Mobile */}
            <div className="md:hidden flex items-center gap-2">
              <div className="flex-shrink-0">
                <ModeToggle />
              </div>
              <div className="flex-shrink-0">
                <MobileAuthMenu />
              </div>
            </div>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}