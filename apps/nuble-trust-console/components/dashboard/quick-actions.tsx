"use client"

import { Database, Users, Shield, BarChart3, Key, Settings } from "lucide-react"
import { motion } from "framer-motion"

const actions = [
  { title: "View Applications", description: "Manage your registered applications", icon: Database },
  { title: "Manage Users", description: "View and manage user accounts", icon: Users },
  { title: "Security Settings", description: "Configure security policies", icon: Shield },
  { title: "Analytics", description: "View usage analytics and metrics", icon: BarChart3 },
  { title: "API Keys", description: "Manage API keys and permissions", icon: Key },
  { title: "Settings", description: "Configure your account settings", icon: Settings }
]

export function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">Quick Actions</h3>
          <p className="text-sm text-muted-foreground">
            Common tasks to get you started with NubleTrust
          </p>
        </div>
        <div className="p-6 pt-0">
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
                <button
                  className={
                    "h-24 flex-col space-y-2 w-full border border-border bg-accent/10 hover:bg-accent/20 hover:shadow-md transition-all duration-200 text-foreground"
                  }
                >
                  <div>
                  <action.icon className="h-6 w-6 text-primary mx-auto" />
                  <div className="text-center">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {action.description}
                    </div>
                  </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
