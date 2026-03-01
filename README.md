# @usetransactional/auth-react

React SDK for Transactional Auth - OpenID Connect authentication for React applications.

## Installation

```bash
npm install @usetransactional/auth-react
# or
yarn add @usetransactional/auth-react
# or
pnpm add @usetransactional/auth-react
```

## Quick Start

### 1. Configure the Provider

Wrap your application with the `TransactionalAuthProvider`:

```tsx
import { TransactionalAuthProvider } from '@usetransactional/auth-react';

function App() {
  return (
    <TransactionalAuthProvider
      domain="auth.usetransactional.com"
      clientId="your-client-id"
      redirectUri={window.location.origin}
    >
      <YourApp />
    </TransactionalAuthProvider>
  );
}
```

### 2. Add Login/Logout

Use the `useAuth` hook to access authentication state and methods:

```tsx
import { useAuth } from '@usetransactional/auth-react';

function LoginButton() {
  const { isAuthenticated, isLoading, loginWithRedirect, logout, user } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return (
      <div>
        <span>Welcome, {user?.name}</span>
        <button onClick={() => logout()}>Logout</button>
      </div>
    );
  }

  return <button onClick={() => loginWithRedirect()}>Login</button>;
}
```

### 3. Protect Routes

Use the `AuthGuard` component or `withAuthenticationRequired` HOC:

```tsx
import { AuthGuard } from '@usetransactional/auth-react';

function ProtectedPage() {
  return (
    <AuthGuard fallback={<div>Loading...</div>}>
      <div>This content is only visible to authenticated users</div>
    </AuthGuard>
  );
}
```

Or with the HOC:

```tsx
import { withAuthenticationRequired } from '@usetransactional/auth-react';

function Dashboard() {
  return <div>Dashboard content</div>;
}

export default withAuthenticationRequired(Dashboard);
```

## API Reference

### TransactionalAuthProvider

The main provider component that wraps your application.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `domain` | `string` | Required | Auth domain (e.g., 'auth.usetransactional.com') |
| `clientId` | `string` | Required | Your application's client ID |
| `redirectUri` | `string` | `window.location.origin` | Redirect URI after authentication |
| `scope` | `string` | `'openid profile email'` | Scopes to request |
| `audience` | `string` | - | API audience for access token |
| `cacheLocation` | `'memory' \| 'localstorage'` | `'localstorage'` | Where to store tokens |
| `useRefreshTokens` | `boolean` | `true` | Use refresh tokens for silent renewal |
| `onRedirectCallback` | `(appState?) => void` | - | Callback after redirect from login |

### useAuth Hook

Returns the authentication context with state and methods.

```tsx
const {
  // State
  isAuthenticated,  // boolean - Whether user is authenticated
  isLoading,        // boolean - Whether auth state is loading
  user,             // TransactionalAuthUser | null
  error,            // Error | null

  // Methods
  loginWithRedirect,  // (options?) => Promise<void>
  loginWithPopup,     // (options?) => Promise<void>
  logout,             // (options?) => Promise<void>
  getAccessToken,     // () => Promise<string | undefined>
  getIdTokenClaims,   // () => Promise<object | undefined>
  hasPermission,      // (permission: string) => boolean
  hasRole,            // (role: string) => boolean
} = useAuth();
```

### useUser Hook

Returns the current authenticated user.

```tsx
const { user, isLoading } = useUser();
```

### useAccessToken Hook

Returns the current access token (or null if not authenticated).

```tsx
const accessToken = useAccessToken();
```

### AuthGuard Component

Protects content that requires authentication.

```tsx
<AuthGuard
  fallback={<Loading />}        // Shown while loading
  onUnauthenticated={() => {}}  // Called when not authenticated
  autoRedirect={true}           // Auto-redirect to login
>
  <ProtectedContent />
</AuthGuard>
```

### withAuthenticationRequired HOC

Higher-order component for protecting components.

```tsx
export default withAuthenticationRequired(Component, {
  fallback: <Loading />,
  onUnauthenticated: () => {},
  returnTo: '/dashboard',
});
```

## Making API Calls

Use the access token to authenticate API requests:

```tsx
import { useAuth } from '@usetransactional/auth-react';

function ApiExample() {
  const { getAccessToken } = useAuth();

  async function fetchData() {
    const token = await getAccessToken();

    const response = await fetch('https://api.example.com/data', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.json();
  }

  // ...
}
```

## Next.js App Router

For Next.js 13+ with the App Router, mark components as client components:

```tsx
'use client';

import { TransactionalAuthProvider } from '@usetransactional/auth-react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <TransactionalAuthProvider
      domain="auth.usetransactional.com"
      clientId="your-client-id"
    >
      {children}
    </TransactionalAuthProvider>
  );
}
```

## License

MIT
