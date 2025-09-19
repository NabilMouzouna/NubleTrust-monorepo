"use client"
import { SessionProvider } from "next-auth/react";
import { AppsProvider } from "@/components/dashboard/apps-provider";
import { Layout } from "@/components/layout";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <main className="font-body antialiased">
        <SessionProvider>
          <AppsProvider>
            <Layout>
              {children}
            </Layout>
          </AppsProvider>
        </SessionProvider>
      </main>
  );
}
