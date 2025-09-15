"use client";

import { useEffect } from 'react';
import { useAuth } from '@/SDK/AuthProvider';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait until the initial authentication check is complete before acting
    if (!isLoading && !isAuthenticated) {
      // If not authenticated, redirect to the login page
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // While the session is being restored, show a loading indicator
  if (isLoading) {
    return <div>Loading session...</div>;
  }

  // If the user is authenticated, render the dashboard content
  if (isAuthenticated) {
    return (
      <div>
        <h1>Dashboard</h1>
        <p>Welcome, {user?.id}!</p>
        <p>This is a protected route. You can only see this if you are logged in.</p>
        <button onClick={() => { logout() }} className='border-2 border-red-500 text-red-500 px-3 py-2 my-4'>logout</button>
      </div>
    );
  }

  // If the user is not authenticated, render nothing while the redirect happens.
  return null;
}
