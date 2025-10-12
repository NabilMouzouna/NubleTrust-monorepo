'use client';

import { useState } from 'react';
import { useNubleTrust } from '@nubletrust/sdk';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { authentication, isLoading } = useNubleTrust();
  const router = useRouter();

  console.log("[LoginPage] isLoading:", isLoading);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[LoginPage] handleSubmit: Attempting login for email:", email);

    try {
      await authentication('login', email, password);
      console.log("[LoginPage] handleSubmit: Login successful, attempting redirect to /dashboard");
      router.push('/dashboard'); // Redirect to dashboard on successful login
    } catch (error) {
      console.error('[LoginPage] handleSubmit: Login failed:', error);
      alert((error as Error).message);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="bg-white px-3 py-2 text-black">
          Login
        </button>
      </form>
    </div>
  );
}