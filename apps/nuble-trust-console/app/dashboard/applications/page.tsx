"use client"

import Link from "next/link"
import { useEffect } from "react"
import { motion } from "framer-motion"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { AppsConsumer } from "@/components/dashboard/apps-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"

export default function ApplicationsPage() {
  const { data: session, status } = useSession()
  const { apps, setApps } = AppsConsumer()

  useEffect(() => {
    if (!session?.user?.id) return
    const fetchApps = async () => {
      try {
        const res = await fetch(`/api/apps?developerId=${session.user.id}`)
        if (!res.ok) return
        const data = await res.json()
        if (Array.isArray(data)) setApps(data)
      } catch (e) {
        console.error("Failed to load apps", e)
      }
    }
    // Only fetch if we don't already have apps
    if (!apps || apps.length === 0) fetchApps()
  }, [session?.user?.id])

  if (status === "loading") return <h1>Loading...</h1>
  if (status === "unauthenticated") redirect("/auth")

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">Applications</h1>
          <p className="text-muted-foreground mt-2">
            Browse and manage your registered applications
          </p>
        </div>
        <div className="flex w-full md:w-auto items-center gap-2">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search applications..." className="pl-9" />
          </div>
          <Link href="/dashboard">
            <Button className="gap-2"><Plus className="h-4 w-4" /> New</Button>
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {(apps ?? []).map((app) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link href={`/dashboard/applications/${app.id}`}>
              <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-foreground">
                    <span className="truncate">{app.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {app.description || "No description provided."}
                  </p>
                  <p className="text-xs text-muted-foreground">Created {new Date(app.createdAt).toLocaleDateString()}</p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
        {apps.length === 0 && (
          <div className="col-span-full text-muted-foreground">No applications yet.</div>
        )}
      </div>
    </div>
  )
}


