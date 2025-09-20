'use client';

import { useState } from 'react';
import { useNubleTrust } from '@/SDK/src/react/authProvider';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { authentication, isLoading } = useNubleTrust();
  const router = useRouter();

  console.log("[RegisterPage] isLoading:", isLoading);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[RegisterPage] handleSubmit: Attempting registration for email:", email);

    try {
      await authentication('register', email, password);
      console.log("[RegisterPage] handleSubmit: Registration successful, attempting redirect to /dashboard");
      router.push('/dashboard'); // Redirect to dashboard on successful registration
    } catch (error) {
      console.error('[RegisterPage] handleSubmit: Registration failed:', error);
      alert((error as Error).message);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Register</h1>
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
          Register
        </button>
      </form>
    </div>
  );
}
