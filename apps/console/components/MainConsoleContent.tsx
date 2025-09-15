"use client"
import { useEffect, useState } from "react"
import { CreateAppModal } from "./CreateAppModal"
import { getApps } from "@/lib/helpers"
import AppsSection from "./AppsSection"
import QuickActionsSideBar from "./QuickActionsSideBar"

export default function ConsoleContent() {
  const [isOpen, setIsOpen] = useState(false)
  const [apps, setApps] = useState([])

  useEffect(() => { 
      (async() => { setApps(await getApps()) })()
   },[])
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
        <AppsSection setIsOpen={setIsOpen} apps={apps}/>

        {/* Quick Actions Sidebar */}
        <QuickActionsSideBar setIsOpen={setIsOpen} apps={apps}/>
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
