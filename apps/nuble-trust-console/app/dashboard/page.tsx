"use client";

import { registerAppReturn } from "@/lib/utils";
import { useState } from "react";
import { Layout } from "@/components/layout";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { AppCreationForm } from "@/components/dashboard/app-creation-form";
import { AppDetails } from "@/components/dashboard/app-details";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Home() {
  const [app, setApp] = useState<registerAppReturn | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { data : session ,status } = useSession()
  async function handleSubmit(name: string, description: string) {
    setIsLoading(true);
  
    try {
      const res = await fetch("/api/apps/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
  
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("API Error:", errorData);
        return; // ❌ don’t setApp if backend failed
      }
  
      const result = await res.json();
      setApp(result);
    } catch (error) {
      console.error("Error creating app:", error);
    } finally {
      setIsLoading(false);
    }
  }
  if(status === "loading") return (<h1>Loading...</h1>)
  if(status === "unauthenticated") {
    redirect("/auth")
  }
  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your NubleTrust applications and monitor user activity
          </p>
          {!!session?.user && session.user.id && <i>developerID : {session.user.id}</i>}
        </motion.div>

        {/* Stats Cards */}
        <StatsCards 
          appCount={app ? 1 : 0}
          userCount={0}
          securityScore={100}
          apiCalls={0}
        />

        {/* Create Application Form and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AppCreationForm onSubmit={handleSubmit} isLoading={isLoading} />
          {app && <AppDetails app={app} />}
        </div>

        {/* Quick Actions */}
        <QuickActions />
      </div>
    </Layout>
  );
}