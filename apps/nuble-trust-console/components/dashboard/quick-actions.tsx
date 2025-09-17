"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Database, Users, Shield, BarChart3, Key, Settings } from "lucide-react"
import { motion } from "framer-motion"

const actions = [
  {
    title: "View Applications",
    description: "Manage your registered applications",
    icon: Database,
    color: "text-blue-600",
    bgColor: "bg-blue-50 hover:bg-blue-100"
  },
  {
    title: "Manage Users",
    description: "View and manage user accounts",
    icon: Users,
    color: "text-green-600",
    bgColor: "bg-green-50 hover:bg-green-100"
  },
  {
    title: "Security Settings",
    description: "Configure security policies",
    icon: Shield,
    color: "text-red-600",
    bgColor: "bg-red-50 hover:bg-red-100"
  },
  {
    title: "Analytics",
    description: "View usage analytics and metrics",
    icon: BarChart3,
    color: "text-purple-600",
    bgColor: "bg-purple-50 hover:bg-purple-100"
  },
  {
    title: "API Keys",
    description: "Manage API keys and permissions",
    icon: Key,
    color: "text-orange-600",
    bgColor: "bg-orange-50 hover:bg-orange-100"
  },
  {
    title: "Settings",
    description: "Configure your account settings",
    icon: Settings,
    color: "text-gray-600",
    bgColor: "bg-gray-50 hover:bg-gray-100"
  }
]

export function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks to get you started with NubleTrust
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {actions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  className={`h-24 flex-col space-y-2 w-full ${action.bgColor} border-0 hover:shadow-md transition-all duration-200`}
                >
                  <action.icon className={`h-6 w-6 ${action.color}`} />
                  <div className="text-center">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {action.description}
                    </div>
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
