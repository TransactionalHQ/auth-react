/**
 * Transactional Auth React - Types
 */

export interface TransactionalAuthUser {
  sub: string;
  email?: string;
  emailVerified?: boolean;
  name?: string;
  givenName?: string;
  familyName?: string;
  picture?: string;
  phoneNumber?: string;
  phoneNumberVerified?: boolean;
}

export interface TransactionalAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: TransactionalAuthUser | null;
  error: Error | null;
}

export interface LoginOptions {
  /** Return URL after login */
  returnTo?: string;
  /** State to pass through the authentication flow */
  appState?: Record<string, unknown>;
  /** Force specific connection (e.g., 'google', 'github') */
  connection?: string;
  /** Login hint (pre-fill email) */
  loginHint?: string;
  /** UI locales */
  uiLocales?: string;
}

export interface LogoutOptions {
  /** Return URL after logout */
  returnTo?: string;
  /** Whether to logout from the identity provider as well */
  federated?: boolean;
}

export interface TransactionalAuthContextValue extends TransactionalAuthState {
  /** Redirect to login page */
  loginWithRedirect: (options?: LoginOptions) => Promise<void>;
  /** Open login popup */
  loginWithPopup: (options?: LoginOptions) => Promise<void>;
  /** Logout the user */
  logout: (options?: LogoutOptions) => Promise<void>;
  /** Get the access token (silently refreshes if needed) */
  getAccessToken: () => Promise<string | undefined>;
  /** Get ID token claims */
  getIdTokenClaims: () => Promise<Record<string, unknown> | undefined>;
  /** Check if user has specific permission */
  hasPermission: (permission: string) => boolean;
  /** Check if user has specific role */
  hasRole: (role: string) => boolean;
}

export interface TransactionalAuthProviderProps {
  /** Auth domain (e.g., 'auth.usetransactional.com' or 'myapp.auth.usetransactional.com') */
  domain: string;
  /** Client ID of your application */
  clientId: string;
  /** Redirect URI after authentication (defaults to window.location.origin) */
  redirectUri?: string;
  /** Scopes to request (defaults to 'openid profile email') */
  scope?: string;
  /** API audience for access token */
  audience?: string;
  /** Where to store tokens: 'memory' or 'localstorage' */
  cacheLocation?: 'memory' | 'localstorage';
  /** Use refresh tokens for silent renewal */
  useRefreshTokens?: boolean;
  /** Callback after redirect from login */
  onRedirectCallback?: (appState?: Record<string, unknown>) => void;
  /** Children components */
  children: React.ReactNode;
}
