"use client";

import { useEffect, useState } from "react";

// Helper function to safely get initial state on the client side
const getInitialClientState = (query: string): boolean => {
  if (typeof window !== 'undefined') {
    return window.matchMedia(query).matches;
  }
  // Return a default value for SSR or environments without window
  // Consider if 'false' is always the right default for your SSR strategy
  return false;
};


export function useMediaQuery(query: string): boolean {
  // Initialize state using the helper function to avoid hydration mismatch
  // The function passed to useState runs only on the initial render
  const [matches, setMatches] = useState<boolean>(() => getInitialClientState(query));

  useEffect(() => {
    // Ensure this code runs only in the browser
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQueryList = window.matchMedia(query);

    // Handler for when the media query status changes
    const listener = (event: MediaQueryListEvent) => {
      // Update state with the new match status
      setMatches(event.matches);
    };

    // --- Correction after initial render ---
    // It's possible the state initialized by getInitialClientState is already stale
    // by the time this effect runs (e.g., window resized between render and effect).
    // Set the state again here to ensure it's correct on mount.
    // This should be safe as it only runs once on mount (per query change).
    setMatches(mediaQueryList.matches);


    // Add the event listener
    // Note: 'addEventListener' is preferred over the deprecated 'addListener'
    mediaQueryList.addEventListener('change', listener);

    // Cleanup function: remove the listener when the component unmounts or the query changes
    return () => {
      mediaQueryList.removeEventListener('change', listener);
    };
  }, [query]); // <-- Correct Dependency: Only re-run the effect if the query string changes

  return matches;
}