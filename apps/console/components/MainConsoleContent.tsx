"use client"
import { useState } from "react"
import { CreateAppModal } from "./CreateAppModal"
import Link from "next/link"
import { Plus, Settings, Key, BarChart3 } from "lucide-react"

export default function ConsoleContent() {
  const [isOpen, setIsOpen] = useState(false)
  // TODO fetch this data from your database.
  const apps = [
    {
      id: "app_1",
      name: "My First App",
      description: "This is a sample application to show how the console looks.",
      status: "active",
      totalUsers: 1250,
      apiCalls: 45230,
    },
    {
      id: "app_2",
      name: "Another Cool Project",
      description: "A description for another great app.",
      status: "active",
      totalUsers: 45,
      apiCalls: 1250,
    },
  ]

  return (
    <main className="container py-6 sm:py-8 px-4 sm:px-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-blue bg-clip-text text-transparent mb-2">
          Welcome, Nabil
        </h1>
        <p className="text-gray-300 text-base sm:text-lg max-w-2xl">
          Manage your authentication applications, generate API keys, and monitor usage from your NubleTrust dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Applications Section */}
        <section className="lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-xl font-bold text-white">Your Applications</h2>
            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm font-medium transition-all w-full sm:w-auto justify-center"
            >
              <Plus className="w-4 h-4" />
              New App
            </button>
          </div>

          <div className="space-y-4">
            {apps?.length > 0 ? (
              apps.map((app) => (
                <Link
                  key={app.id}
                  href={`/dashboard/${app.id}`}
                  className="block bg-gray-800/50 hover:bg-gray-700/50 px-4 sm:px-6 py-4 sm:py-5 rounded-lg cursor-pointer transition-all group border border-gray-700/50"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-lg group-hover:text-primary transition-colors">
                        {app.name}
                      </h3>
                      <p className="text-gray-300 text-sm mt-1 mb-3">{app.description}</p>

                      <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="capitalize">{app.status}</span>
                        </div>
                        <div>{app.totalUsers.toLocaleString()} users</div>
                        <div>{app.apiCalls.toLocaleString()} API calls</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="p-2 hover:bg-white/10 rounded-md">
                        <Settings className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="p-2 hover:bg-white/10 rounded-md">
                        <Key className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="p-2 hover:bg-white/10 rounded-md">
                        <BarChart3 className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-12 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-white font-medium mb-2">No applications yet</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Create your first application to start using NubleTrust authentication
                </p>
                <button
                  onClick={() => setIsOpen(true)}
                  className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Create Application
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Quick Actions Sidebar */}
        <section className="space-y-6">
          <div className="bg-gray-800/50 rounded-lg p-4 sm:p-6 border border-gray-700/50">
            <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => setIsOpen(true)}
                className="w-full flex items-center gap-3 text-left p-3 hover:bg-white/10 rounded-md transition-all"
              >
                <Plus className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-white text-sm font-medium">New Application</div>
                  <div className="text-gray-400 text-xs">Create a new app</div>
                </div>
              </button>

              <Link
                href="/docs"
                className="w-full flex items-center gap-3 text-left p-3 hover:bg-white/10 rounded-md transition-all"
              >
                <div className="w-5 h-5 bg-primary rounded text-white text-xs flex items-center justify-center font-bold">
                  ?
                </div>
                <div>
                  <div className="text-white text-sm font-medium">Documentation</div>
                  <div className="text-gray-400 text-xs">Integration guides</div>
                </div>
              </Link>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4 sm:p-6 border border-gray-700/50">
            <h3 className="text-white font-semibold mb-4">Usage Overview</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Total Users</span>
                  <span className="text-white font-medium">
                    {apps.reduce((sum, app) => sum + app.totalUsers, 0).toLocaleString()}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">API Calls</span>
                  <span className="text-white font-medium">
                    {apps.reduce((sum, app) => sum + app.apiCalls, 0).toLocaleString()}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Active Apps</span>
                  <span className="text-white font-medium">{apps.length}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <CreateAppModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false)
        }}
      />
    </main>
  )
}
