"use client"

import { Plus } from "lucide-react";
import Link from "next/link";


export default function QuickActionsSideBar({setIsOpen,apps}:{setIsOpen : any, apps : any}){
    return (
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
                    {/* {apps.reduce((sum : any, app : any) => sum + app.totalUsers, 0).toLocaleString()} */}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">API Calls</span>
                  <span className="text-white font-medium">
                    {/* {apps.reduce((sum : any, app : any) => sum + app.apiCalls, 0).toLocaleString()} */}
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
    )
}