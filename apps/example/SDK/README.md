# NubleTrust SDK

Welcome to the NubleTrust SDK! This guide will walk you through integrating our authentication services into your React application.

## Table of Contents

- [NubleTrust SDK](#nubletrust-sdk)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Wrapping Your App](#wrapping-your-app)
  - [Accessing Authentication State](#accessing-authentication-state)
    - [useNubleTrust Hook](#usenubletrust-hook)
  - [Login and Registration](#login-and-registration)
    - [Login](#login)
    - [Registration](#registration)
  - [Logging Out](#logging-out)
  - [Protecting Routes](#protecting-routes)

## Installation

First, ensure you have the necessary dependencies installed. This SDK is built with React and Next.js in mind, but it can be adapted for other React-based projects.

## Configuration

Before you can use the SDK, you need to configure it with your API key and base URL. Create a `nt.config.ts` file in your application's root directory (e.g., `@/app/nt.config.ts`) and add the following configuration:

```typescript
// @/app/nt.config.ts

import { ConfigType } from "@/SDK/types";

export const ntConfig: ConfigType = {
    apiKey: "YOUR_API_KEY", // Replace with your actual API key
    baseUrl: "http://localhost:3000" // Replace with your API's base URL
};
```

## Wrapping Your App

To enable authentication throughout your application, you need to wrap your root component with the `NTProvider`. This is typically done in your `layout.tsx` file in a Next.js application.

```typescript
// @/app/layout.tsx

import { NTProvider } from "@/SDK/react/authProvider";
import { ntConfig } from "./nt.config";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NTProvider config={ntConfig}>
          {children}
        </NTProvider>
      </body>
    </html>
  );
}
```

## Accessing Authentication State

The `useNubleTrust` hook provides access to the authentication context, which includes the user's authentication status, user information, and loading state.

### useNubleTrust Hook

The hook returns an object with the following properties:

-   `isAuthenticated` (boolean): `true` if the user is authenticated, `false` otherwise.
-   `isLoading` (boolean): `true` while the SDK is checking the user's session or performing an authentication action.
-   `user` (User | null): An object containing user information (`id`, `email`) if authenticated, otherwise `null`.
-   `authentication` (function): A function to handle login and registration.
-   `logout` (function): A function to log the user out.

Here's how you can use it in a component:

```typescript
// components/SomeComponent.tsx

"use client";

import { useNubleTrust } from "@/SDK/react/authProvider";

export default function SomeComponent() {
  const { isAuthenticated, user, isLoading }.tsx = useNubleTrust();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return <div>Welcome, {user?.email}!</div>;
  }

  return <div>Please log in.</div>;
}
```

## Login and Registration

The `authentication` function provided by the `useNubleTrust` hook handles both login and registration.

### Login

To log in a user, call the `authentication` function with the type `'login'` and the user's credentials.

```typescript
// app/login/page.tsx

"use client";

import { useNubleTrust } from "@/SDK/react/authProvider";
import { useState } from "react";

export default function LoginPage() {
  const { authentication } = useNubleTrust();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authentication("login", email, password);
      // Redirect to dashboard or another protected page
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Log In</button>
    </form>
  );
}
```

### Registration

Registration is similar to login. Call the `authentication` function with the type `'register'`.

```typescript
// app/register/page.tsx

"use client";

import { useNubleTrust } from "@/SDK/react/authProvider";
import { useState } from "react";

export default function RegisterPage() {
  const { authentication } = useNubleTrust();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authentication("register", email, password);
      // Redirect to dashboard or another protected page
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Register</button>
    </form>
  );
}
```

## Logging Out

To log a user out, call the `logout` function.

```typescript
// components/LogoutButton.tsx

"use client";

import { useNubleTrust } from "@/SDK/react/authProvider";

export default function LogoutButton() {
  const { logout } = useNubleTrust();

  return <button onClick={logout}>Log Out</button>;
}
```

## Protecting Routes

You can create a higher-order component (HOC) or a wrapper component to protect routes that require authentication.

```typescript
// components/ProtectedRoute.tsx

"use client";

import { useNubleTrust } from "@/SDK/react/authProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useNubleTrust();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  return <>{children}</>;
}
```

You can then use this component to wrap your protected pages:

```typescript
// app/dashboard/page.tsx

import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <h1>Dashboard</h1>
      <p>This is a protected page.</p>
    </ProtectedRoute>
  );
}
```
