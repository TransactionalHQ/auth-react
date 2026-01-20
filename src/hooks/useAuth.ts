/**
 * Transactional Auth React - useAuth Hook
 */

'use client';

import { useContext } from 'react';
import { TransactionalAuthContext } from '../context';
import type { TransactionalAuthContextValue } from '../types';

/**
 * Hook to access authentication state and methods.
 *
 * @example
 * ```tsx
 * import { useAuth } from 'transactional-auth-react';
 *
 * function LoginButton() {
 *   const { isAuthenticated, loginWithRedirect, logout, user } = useAuth();
 *
 *   if (isAuthenticated) {
 *     return (
 *       <div>
 *         <span>Welcome, {user?.name}</span>
 *         <button onClick={() => logout()}>Logout</button>
 *       </div>
 *     );
 *   }
 *
 *   return <button onClick={() => loginWithRedirect()}>Login</button>;
 * }
 * ```
 */
export function useAuth(): TransactionalAuthContextValue {
  const context = useContext(TransactionalAuthContext);

  if (!context) {
    throw new Error('useAuth must be used within a TransactionalAuthProvider');
  }

  return context;
}
