"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, Users, Shield, Activity } from "lucide-react"
import { motion } from "framer-motion"

interface StatsCardsProps {
  appCount: number
  userCount: number
  securityScore: number
  apiCalls: number
}

const stats = [
  {
    title: "Total Applications",
    icon: Database,
    value: "0",
    change: "No applications yet",
    color: "text-blue-600"
  },
  {
    title: "Active Users", 
    icon: Users,
    value: "0",
    change: "No users registered yet",
    color: "text-green-600"
  },
  {
    title: "Security Score",
    icon: Shield,
    value: "100%",
    change: "All systems secure",
    color: "text-emerald-600"
  },
  {
    title: "API Calls",
    icon: Activity,
    value: "0",
    change: "No API calls today",
    color: "text-purple-600"
  }
]

export function StatsCards({ appCount = 0, userCount = 0, securityScore = 100, apiCalls = 0 }: StatsCardsProps) {
  const safeAppCount = Number.isFinite(appCount) ? appCount : 0
  const safeUserCount = Number.isFinite(userCount) ? userCount : 0
  const safeSecurityScore = Number.isFinite(securityScore) ? securityScore : 100
  const safeApiCalls = Number.isFinite(apiCalls) ? apiCalls : 0

  const updatedStats = [
    { ...stats[0], value: String(safeAppCount), change: safeAppCount > 0 ? `+${safeAppCount} from last month` : "No applications yet" },
    { ...stats[1], value: String(safeUserCount), change: safeUserCount > 0 ? `+${safeUserCount} new users` : "No users registered yet" },
    { ...stats[2], value: `${safeSecurityScore}%`, change: "All systems secure" },
    { ...stats[3], value: String(safeApiCalls), change: safeApiCalls > 0 ? `+${safeApiCalls} today` : "No API calls today" }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {updatedStats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
