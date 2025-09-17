"use client";

import { registerAppReturn } from "@/lib/utils";
import { useState } from "react";

export default function Home() {
  const [app, setApp] = useState<registerAppReturn | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("app-name") as string;
    const description = formData.get("app-description") as string;

      const res = await fetch("/api/apps/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, description })
    });
    const result = await res.json()
    setApp(result);
  }

  return (
    <main>
      <form onSubmit={handleSubmit} className="mt-8">
        <label htmlFor="app-name">app name : </label>
        <input type="text" name="app-name" className="border border-white px-4 py-3 text-gray-200"/><br />
        <label htmlFor="app-description">app description : </label>
        <input type="text" name="app-description" className="border border-white px-4 py-3 text-gray-200"/>
        <button className="px-4 py-3 bg-white text-black">register app</button>

        {app && (
          <div>
            <h1>{app.id}</h1>
            <h1>{app.description}</h1>
            <h1>{app.developerId}</h1>
            <div className="px-4 py-2 border-2 border-white">{app.apiKey}</div>
            <i>{app.createdAt.toLocaleString()}</i>
          </div>
        )}
      </form>
    </main>
  );
}