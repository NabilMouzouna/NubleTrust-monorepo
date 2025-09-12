import type React from "react"
import ConsoleNav from "@/components/ConsoleDashboardNav"
import Footer from "@/components/Footer"

export default function ConsoleLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col">
      <ConsoleNav />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
