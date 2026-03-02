/**
 * Transactional Auth React - Provider Component
 *
 * Wraps your application and provides authentication context.
 */

'use client';

import * as React from 'react';
import { UserManager, WebStorageStateStore, User } from 'oidc-client-ts';
import { TransactionalAuthContext } from './context';
import type {
  TransactionalAuthProviderProps,
  TransactionalAuthState,
  TransactionalAuthUser,
  TransactionalAuthContextValue,
  LoginOptions,
  LogoutOptions,
} from './types';

/**
 * Map OIDC user to our user type
 */
function mapUser(user: User): TransactionalAuthUser {
  return {
    sub: user.profile.sub,
    email: user.profile.email,
    emailVerified: user.profile.email_verified,
    name: user.profile.name,
    givenName: user.profile.given_name,
    familyName: user.profile.family_name,
    picture: user.profile.picture,
    phoneNumber: user.profile.phone_number,
    phoneNumberVerified: user.profile.phone_number_verified,
  };
}

/**
 * TransactionalAuthProvider Component
 *
 * Provides authentication context to your React application.
 *
 * @example
 * ```tsx
 * import { TransactionalAuthProvider } from '@usetransactional/auth-react';
 *
 * function App() {
 *   return (
 *     <TransactionalAuthProvider
 *       domain="auth.usetransactional.com"
 *       clientId="your-client-id"
 *       redirectUri={window.location.origin}
 *     >
 *       <YourApp />
 *     </TransactionalAuthProvider>
 *   );
 * }
 * ```
 */
export function TransactionalAuthProvider({
  domain,
  clientId,
  redirectUri,
  scope = 'openid profile email',
  audience,
  cacheLocation = 'localstorage',
  useRefreshTokens = true,
  onRedirectCallback,
  children,
}: TransactionalAuthProviderProps) {
  const [state, setState] = React.useState<TransactionalAuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    error: null,
  });

  const userManagerRef = React.useRef<UserManager | null>(null);
  const [permissions, setPermissions] = React.useState<string[]>([]);
  const [roles, setRoles] = React.useState<string[]>([]);

  // Initialize UserManager
  React.useEffect(() => {
    const effectiveRedirectUri = redirectUri || (typeof window !== 'undefined' ? window.location.origin : '');
    const effectiveScope = useRefreshTokens ? `${scope} offline_access` : scope;

    const manager = new UserManager({
      authority: `https://${domain}`,
      client_id: clientId,
      redirect_uri: effectiveRedirectUri,
      post_logout_redirect_uri: effectiveRedirectUri,
      scope: effectiveScope,
      response_type: 'code',
      automaticSilentRenew: useRefreshTokens,
      userStore:
        typeof window !== 'undefined'
          ? cacheLocation === 'localstorage'
            ? new WebStorageStateStore({ store: window.localStorage })
            : new WebStorageStateStore({ store: window.sessionStorage })
          : undefined,
      extraQueryParams: audience ? { audience } : undefined,
    });

    userManagerRef.current = manager;

    // Check for existing user
    manager
      .getUser()
      .then((user) => {
        if (user && !user.expired) {
          setState({
            isAuthenticated: true,
            isLoading: false,
            user: mapUser(user),
            error: null,
          });

          // Extract roles and permissions from access token claims
          const accessToken = user.access_token;
          if (accessToken) {
            try {
              const payload = JSON.parse(atob(accessToken.split('.')[1]));
              setRoles(payload.roles || []);
              setPermissions(payload.permissions || []);
            } catch {
              // Ignore parsing errors
            }
          }
        } else {
          setState((s) => ({ ...s, isLoading: false }));
        }
      })
      .catch((error) => {
        setState((s) => ({ ...s, isLoading: false, error }));
      });

    // Handle redirect callback
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.has('code') || params.has('error')) {
        manager
          .signinRedirectCallback()
          .then((user) => {
            setState({
              isAuthenticated: true,
              isLoading: false,
              user: mapUser(user),
              error: null,
            });
            onRedirectCallback?.(user.state as Record<string, unknown>);
            window.history.replaceState({}, '', window.location.pathname);
          })
          .catch((error) => {
            setState((s) => ({ ...s, isLoading: false, error }));
          });
      }
    }

    // Event listeners
    const handleUserLoaded = (user: User) => {
      setState({
        isAuthenticated: true,
        isLoading: false,
        user: mapUser(user),
        error: null,
      });
    };

    const handleUserUnloaded = () => {
      setState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: null,
      });
      setRoles([]);
      setPermissions([]);
    };

    const handleSilentRenewError = (error: Error) => {
      console.error('Silent renew error:', error);
    };

    manager.events.addUserLoaded(handleUserLoaded);
    manager.events.addUserUnloaded(handleUserUnloaded);
    manager.events.addSilentRenewError(handleSilentRenewError);

    return () => {
      manager.events.removeUserLoaded(handleUserLoaded);
      manager.events.removeUserUnloaded(handleUserUnloaded);
      manager.events.removeSilentRenewError(handleSilentRenewError);
    };
  }, [domain, clientId, redirectUri, scope, audience, cacheLocation, useRefreshTokens, onRedirectCallback]);

  // Context value
  const contextValue: TransactionalAuthContextValue = React.useMemo(
    () => ({
      ...state,

      loginWithRedirect: async (options?: LoginOptions) => {
        await userManagerRef.current?.signinRedirect({
          state: options?.appState,
          extraQueryParams: {
            ...(options?.connection ? { connection: options.connection } : {}),
            ...(options?.loginHint ? { login_hint: options.loginHint } : {}),
            ...(options?.uiLocales ? { ui_locales: options.uiLocales } : {}),
          },
          redirect_uri: options?.returnTo,
        });
      },

      loginWithPopup: async (options?: LoginOptions) => {
        const user = await userManagerRef.current?.signinPopup({
          extraQueryParams: {
            ...(options?.connection ? { connection: options.connection } : {}),
            ...(options?.loginHint ? { login_hint: options.loginHint } : {}),
          },
        });
        if (user) {
          setState({
            isAuthenticated: true,
            isLoading: false,
            user: mapUser(user),
            error: null,
          });
        }
      },

      logout: async (options?: LogoutOptions) => {
        await userManagerRef.current?.signoutRedirect({
          post_logout_redirect_uri: options?.returnTo,
        });
      },

      getAccessToken: async () => {
        const user = await userManagerRef.current?.getUser();
        return user?.access_token;
      },

      getIdTokenClaims: async () => {
        const user = await userManagerRef.current?.getUser();
        return user?.profile as Record<string, unknown>;
      },

      hasPermission: (permission: string) => {
        return permissions.includes(permission);
      },

      hasRole: (role: string) => {
        return roles.includes(role);
      },
    }),
    [state, permissions, roles]
  );

  return (
    <TransactionalAuthContext.Provider value={contextValue}>
      {children}
    </TransactionalAuthContext.Provider>
  );
}
