/**
 * Transactional Auth React
 *
 * React SDK for Transactional Auth - OpenID Connect authentication for React applications.
 *
 * @example
 * ```tsx
 * import { TransactionalAuthProvider, useAuth, AuthGuard } from 'transactional-auth-react';
 *
 * function App() {
 *   return (
 *     <TransactionalAuthProvider
 *       domain="auth.usetransactional.com"
 *       clientId="your-client-id"
 *     >
 *       <YourApp />
 *     </TransactionalAuthProvider>
 *   );
 * }
 *
 * function LoginButton() {
 *   const { isAuthenticated, loginWithRedirect, logout, user } = useAuth();
 *
 *   if (isAuthenticated) {
 *     return <button onClick={() => logout()}>Logout</button>;
 *   }
 *
 *   return <button onClick={() => loginWithRedirect()}>Login</button>;
 * }
 *
 * function ProtectedRoute() {
 *   return (
 *     <AuthGuard>
 *       <ProtectedContent />
 *     </AuthGuard>
 *   );
 * }
 * ```
 */

// Provider
export { TransactionalAuthProvider } from './TransactionalAuthProvider';

// Context
export { TransactionalAuthContext } from './context';

// Hooks
export { useAuth } from './hooks/useAuth';
export { useUser } from './hooks/useUser';
export { useAccessToken } from './hooks/useAccessToken';

// Components
export { AuthGuard } from './components/AuthGuard';
export { withAuthenticationRequired } from './components/withAuthenticationRequired';

// Types
export type {
  TransactionalAuthUser,
  TransactionalAuthState,
  TransactionalAuthContextValue,
  TransactionalAuthProviderProps,
  LoginOptions,
  LogoutOptions,
} from './types';
