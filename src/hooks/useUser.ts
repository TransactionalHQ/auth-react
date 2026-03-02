/**
 * Transactional Auth React - useUser Hook
 */

'use client';

import { useAuth } from './useAuth';
import type { TransactionalAuthUser } from '../types';

interface UseUserResult {
  user: TransactionalAuthUser | null;
  isLoading: boolean;
}

/**
 * Hook to access the current authenticated user.
 *
 * @example
 * ```tsx
 * import { useUser } from '@usetransactional/auth-react';
 *
 * function Profile() {
 *   const { user, isLoading } = useUser();
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (!user) return <div>Not logged in</div>;
 *
 *   return (
 *     <div>
 *       <img src={user.picture} alt={user.name} />
 *       <h1>{user.name}</h1>
 *       <p>{user.email}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useUser(): UseUserResult {
  const { user, isLoading } = useAuth();
  return { user, isLoading };
}
