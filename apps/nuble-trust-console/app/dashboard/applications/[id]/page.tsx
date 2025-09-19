"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { AppsConsumer } from "@/components/dashboard/apps-provider"
import { AppDetails } from "@/components/dashboard/app-details"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function ApplicationDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { apps } = AppsConsumer()
  const [notFound, setNotFound] = useState(false)

  const appId = useMemo(() => (params?.id as string) || "", [params])
  const app = useMemo(() => apps.find((a) => a.id === appId), [apps, appId])

  useEffect(() => {
    if (!appId) return
    if (!app) setNotFound(true)
  }, [appId, app])

  if (notFound) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between"
        >
          <h1 className="text-2xl font-bold text-foreground">Application not found</h1>
          <Button variant="outline" onClick={() => router.push("/dashboard/applications")}>Back to Applications</Button>
        </motion.div>
        <p className="text-muted-foreground">It may have been removed or you navigated here directly before loading the list.</p>
      </div>
    )
  }

  return app ? (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-3xl font-bold text-foreground">{app.name}</h1>
        <Button variant="outline" onClick={() => router.push("/dashboard/applications")}>Back</Button>
      </motion.div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <AppDetails app={app} />
        </TabsContent>

        <TabsContent value="users" className="mt-4">
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              Connect your user directory or start receiving users via your SDKs. (Coming soon)
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground space-y-2">
              <div>- API Key rotation</div>
              <div>- Allowed origins management</div>
              <div>- Webhook signing & audit logs</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-4">
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              Edit application name, description, and regenerate credentials. (Coming soon)
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  ) : null
}


