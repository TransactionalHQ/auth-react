/**
 * Transactional Auth React - withAuthenticationRequired HOC
 */

'use client';

import * as React from 'react';
import { AuthGuard } from './AuthGuard';

export interface WithAuthenticationRequiredOptions {
  /** Content to show while loading */
  fallback?: React.ReactNode;
  /** Callback when user is not authenticated */
  onUnauthenticated?: () => void;
  /** Return URL after login */
  returnTo?: string;
}

/**
 * Higher-order component that wraps a component to require authentication.
 *
 * @example
 * ```tsx
 * import { withAuthenticationRequired } from 'transactional-auth-react';
 *
 * function Dashboard() {
 *   return <div>Dashboard content</div>;
 * }
 *
 * export default withAuthenticationRequired(Dashboard, {
 *   fallback: <div>Loading...</div>,
 * });
 * ```
 */
export function withAuthenticationRequired<P extends object>(
  Component: React.ComponentType<P>,
  options?: WithAuthenticationRequiredOptions
): React.ComponentType<P> {
  const WrappedComponent = function WithAuthenticationRequired(props: P) {
    return (
      <AuthGuard
        fallback={options?.fallback}
        onUnauthenticated={options?.onUnauthenticated}
      >
        <Component {...props} />
      </AuthGuard>
    );
  };

  WrappedComponent.displayName = `withAuthenticationRequired(${
    Component.displayName || Component.name || 'Component'
  })`;

  return WrappedComponent;
}
