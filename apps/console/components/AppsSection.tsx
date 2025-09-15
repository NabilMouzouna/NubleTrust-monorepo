"use client"

import { BarChart3, Key, Plus, Settings } from "lucide-react";
import Link from "next/link";

export default function AppsSection({setIsOpen,apps}:{setIsOpen : any, apps: any}){
    
    return (
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
              apps.map((app : any) => (
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
    )
}