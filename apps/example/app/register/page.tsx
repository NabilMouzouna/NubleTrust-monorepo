"use client";
import AuthClient  from "@/SDK/authClient";
import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[RegisterPage] Submitting registration form...');
    try {
      // const data =await auth.register(email, password)
      // console.log('client side register page l22',data);
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
          register
        </button>
      </form>
    </div>
  );
}
