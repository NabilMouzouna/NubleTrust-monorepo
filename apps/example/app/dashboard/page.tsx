"use client";
import AuthClient from '@/SDK/authClient';

export default function DashboardPage() {
  const auth = new AuthClient({
    baseUrl : "http://localhost:3000",
    apiKey : "nt_live_sk_2q7ehgzu1xq"
  })
    return (
      <div>
        <h1>Dashboard</h1>
        <p>Welcome,</p>
        <p>This is a protected route. You can only see this if you are logged in.</p>
        <button onClick={() => { auth.logout() }} className='border-2 border-red-500 text-red-500 px-3 py-2 my-4'>logout</button>
      </div>
    );
  }
