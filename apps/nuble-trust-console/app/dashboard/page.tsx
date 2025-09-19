"use client";

import { registerAppReturn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Layout } from "@/components/layout";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { AppCreationForm } from "@/components/dashboard/app-creation-form";
import { AppDetails } from "@/components/dashboard/app-details";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { AppsConsumer } from "@/components/dashboard/apps-provider";

export default function Home() {
  const [app, setApp] = useState<registerAppReturn | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { data : session ,status } = useSession()

  const { setApps, apps } = AppsConsumer()
  useEffect(() => {
    const fetchApps = async () => {
        const data = await fetch(`/api/apps?developerId=${session?.user?.id}`)
        const dataJson = await data.json()
        setApps(dataJson)
    }
    fetchApps()
  }, [ session?.user?.id, setApps, app])
  async function handleSubmit(name: string, description: string) {
    setIsLoading(true);
  
    try {
      if (!session?.user?.id) {
        console.error("Missing developerId: user not authenticated yet");
        return;
      }
      const res = await fetch("/api/apps/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, developerId: session.user.id }),
      });
  
      if (!res.ok) {
        const raw = await res.text();
        let errorData: unknown = raw;
        try { errorData = JSON.parse(raw); } catch {}
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
          appCount={apps.length}
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