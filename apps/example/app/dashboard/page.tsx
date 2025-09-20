'use client';

import { useNubleTrust } from '@/SDK/src/react/authProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { isAuthenticated, user, logout, isLoading } = useNubleTrust();
  const router = useRouter();

  console.log("[DashboardPage] isAuthenticated:", isAuthenticated, "user:", user, "isLoading:", isLoading);

  useEffect(() => {
    console.log("[DashboardPage] useEffect: isAuthenticated:", isAuthenticated, "isLoading:", isLoading);
    if (!isLoading && !isAuthenticated) {
      console.log("[DashboardPage] useEffect: Not authenticated and not loading, redirecting to /login");
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    console.log("[DashboardPage] Not authenticated, returning null (redirect handled by useEffect)");
    return null; // Or a loading spinner, as the redirect will happen in useEffect
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.email}!</p>
      <p>This is a protected route. You can only see this if you are logged in.</p>
      <button onClick={() => { console.log("[DashboardPage] Logout button clicked"); logout(); }} className='border-2 border-red-500 text-red-500 px-3 py-2 my-4'>
        Logout
      </button>
    </div>
  );
}
