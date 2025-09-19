# NubleTrust SDK

A comprehensive authentication SDK for NubleTrust applications with React support.

## Features

- 🔐 Complete authentication flow (login, register, logout, refresh)
- 🍪 HTTP-only cookie support for refresh tokens
- ⚛️ React context provider for state management
- 🔄 Automatic token refresh
- 🛡️ TypeScript support with full type safety
- 🚀 Easy-to-use API client

## Installation

```bash
# The SDK is part of the monorepo
# Import from the SDK folder
```

## Quick Start

### React Usage

```tsx
import { AuthProvider, useAuth } from './SDK';

function App() {
  return (
    <AuthProvider baseUrl="http://localhost:3000">
      <YourApp />
    </AuthProvider>
  );
}

function YourApp() {
  const { user, isAuthenticated, login, logout, isLoading } = useAuth();

  const handleLogin = async () => {
    const response = await login({
      email: 'user@example.com',
      password: 'password',
      apiKey: 'your-api-key'
    });
    
    if (response.success) {
      console.log('Login successful!');
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.email}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

### Core Service Usage

```typescript
import { AuthService, ApiClient } from './SDK';

// Initialize auth service
const authService = new AuthService('http://localhost:3000');

// Login
const loginResponse = await authService.login({
  email: 'user@example.com',
  password: 'password',
  apiKey: 'your-api-key'
});

// Initialize API client
const apiClient = new ApiClient({
  baseUrl: 'http://localhost:3000',
  apiKey: 'your-api-key'
});

// Set access token
apiClient.setAccessToken(loginResponse.accessToken);

// Make authenticated requests
const response = await apiClient.get('protected-endpoint');
```

## API Reference

### AuthProvider Props

- `children`: React children
- `baseUrl`: Base URL for API calls (optional, defaults to current origin)

### useAuth Hook

Returns an object with:
- `user`: Current user object or null
- `accessToken`: Current access token or null
- `isAuthenticated`: Boolean indicating if user is authenticated
- `isLoading`: Boolean indicating if auth operations are in progress
- `login(credentials)`: Login function
- `register(credentials)`: Register function
- `logout()`: Logout function
- `refreshToken()`: Manual token refresh function

### AuthService Methods

- `login(credentials)`: Authenticate user
- `register(credentials)`: Register new user
- `logout()`: Logout user
- `refreshToken()`: Refresh access token

### TokenUtils Methods

- `decodeToken(token)`: Decode JWT token (client-side only)
- `isTokenExpired(token)`: Check if token is expired
- `getTimeUntilExpiry(token)`: Get time until token expires
- `shouldRefreshToken(token)`: Check if token should be refreshed

## Security Features

- HTTP-only cookies for refresh tokens
- Automatic token refresh
- Secure cookie settings (httpOnly, secure, sameSite)
- Token expiration handling
- CSRF protection

## TypeScript Support

The SDK is fully typed with TypeScript. All interfaces and types are exported for your convenience.

```typescript
import type { 
  User, 
  AuthResponse, 
  LoginCredentials,
  AuthContextType 
} from './SDK';
```
