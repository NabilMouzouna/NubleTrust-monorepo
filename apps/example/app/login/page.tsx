"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[LoginPage] Submitting login form...');
    try {
      console.log('[LoginPage] Login successful, redirecting to /dashboard...');
      router.push('/dashboard');
    } catch (error) {
      console.error("[LoginPage] Login failed:", error);
      alert((error as Error).message);
    }
  };

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
        <button type="submit" className="bg-white px-3 py-2 text-black">Login</button>
      </form>
    </div>
  );
}