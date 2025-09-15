"use client";
import { useAuth } from "@/SDK/AuthProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {register, isLoading, isAuthenticated} = useAuth()

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[RegisterPage] Submitting registration form...');
    try {
      await register(email, password)
      console.log('[RegisterPage] Registration successful, redirecting to /dashboard...');
      if(isAuthenticated) router.push('/dashboard');
    } catch (error) {
      console.error("[RegisterPage] Registration failed:", error);
      alert((error as Error).message);
    }
  };

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
          {isLoading? "loading" : "register"}
        </button>
      </form>
    </div>
  );
}
