/**
 * Transactional Auth React - AuthGuard Component
 */

'use client';

import * as React from 'react';
import { useAuth } from '../hooks/useAuth';

export interface AuthGuardProps {
  /** Content to show while authenticated */
  children: React.ReactNode;
  /** Content to show while loading */
  fallback?: React.ReactNode;
  /** Callback when user is not authenticated */
  onUnauthenticated?: () => void;
  /** Whether to automatically redirect to login */
  autoRedirect?: boolean;
}

/**
 * Component that guards content for authenticated users only.
 *
 * @example
 * ```tsx
 * import { AuthGuard } from '@usetransactional/auth-react';
 *
 * function ProtectedPage() {
 *   return (
 *     <AuthGuard fallback={<div>Loading...</div>}>
 *       <div>Protected content</div>
 *     </AuthGuard>
 *   );
 * }
 * ```
 */
export function AuthGuard({
  children,
  fallback,
  onUnauthenticated,
  autoRedirect = true,
}: AuthGuardProps) {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      if (onUnauthenticated) {
        onUnauthenticated();
      } else if (autoRedirect && typeof window !== 'undefined') {
        loginWithRedirect({ returnTo: window.location.pathname });
      }
    }
  }, [isLoading, isAuthenticated, onUnauthenticated, autoRedirect, loginWithRedirect]);

  if (isLoading) {
    return <>{fallback ?? null}</>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
