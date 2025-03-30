'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Component that scrolls the window to the top when the route changes
 * Particularly useful for mobile views where pages may not automatically scroll to top
 */
export function ScrollToTop() {
  const pathname = usePathname();
  
  useEffect(() => {
    // Scroll to the top of the page when the component mounts or pathname changes
    window.scrollTo(0, 0);
  }, [pathname]);
  
  // This component doesn't render anything visible
  return null;
}
