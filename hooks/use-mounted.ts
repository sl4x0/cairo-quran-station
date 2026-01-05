"use client";

import { useLayoutEffect, useState } from "react";

/**
 * Hook to detect when a component has mounted on the client side
 * 
 * This hook is essential for Next.js applications to handle Server-Side Rendering (SSR)
 * properly. It returns `false` during SSR and `true` after the component has mounted
 * on the client, preventing hydration mismatches.
 * 
 * **Use Cases**:
 * - Conditionally render client-only features (localStorage, window APIs)
 * - Prevent SSR/client content mismatch errors
 * - Safely access browser-only APIs after mount
 * 
 * @returns {boolean} `true` if component is mounted on client, `false` during SSR
 * 
 * @example
 * function MyComponent() {
 *   const mounted = useMounted();
 *   
 *   if (!mounted) {
 *     return <div>Loading...</div>; // Shown during SSR
 *   }
 *   
 *   // Safe to use browser APIs here
 *   return <div>{localStorage.getItem('theme')}</div>;
 * }
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    // Set mounted to true immediately after component mounts on client
    // useLayoutEffect runs synchronously after DOM mutations but before paint
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return mounted;
}
