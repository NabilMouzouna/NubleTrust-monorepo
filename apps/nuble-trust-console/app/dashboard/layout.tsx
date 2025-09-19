"use client"
import { SessionProvider } from "next-auth/react";
import { AppsProvider } from "@/components/dashboard/apps-provider";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <main className="font-body antialiased">
        <SessionProvider>
          <AppsProvider>
            {children}
          </AppsProvider>
        </SessionProvider>
      </main>
  );
}
