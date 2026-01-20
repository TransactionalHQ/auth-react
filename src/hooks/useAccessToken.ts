/**
 * Transactional Auth React - useAccessToken Hook
 */

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

/**
 * Hook to get the current access token.
 *
 * @example
 * ```tsx
 * import { useAccessToken } from 'transactional-auth-react';
 *
 * function ApiComponent() {
 *   const accessToken = useAccessToken();
 *
 *   useEffect(() => {
 *     if (accessToken) {
 *       fetch('/api/data', {
 *         headers: { Authorization: `Bearer ${accessToken}` }
 *       });
 *     }
 *   }, [accessToken]);
 *
 *   return <div>...</div>;
 * }
 * ```
 */
export function useAccessToken(): string | null {
  const { getAccessToken, isAuthenticated } = useAuth();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      getAccessToken().then((t) => setToken(t || null));
    } else {
      setToken(null);
    }
  }, [getAccessToken, isAuthenticated]);

  return token;
}
