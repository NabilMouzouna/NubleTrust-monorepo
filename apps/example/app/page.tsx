'use client';

import { useNubleTrust } from '@/SDK/src/react/authProvider';
import Link from 'next/link';

export default function Home() {
  const { isAuthenticated, user, logout, isLoading } = useNubleTrust();

  console.log("[HomePage] isAuthenticated:", isAuthenticated, "user:", user, "isLoading:", isLoading);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>NubleTrust SDK Demo</h1>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.email}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <div>
          <Link href="/login">Login Page</Link>
          <br />
          <Link href="/register">Register Page</Link>
        </div>
      )}
    </div>
  );
}