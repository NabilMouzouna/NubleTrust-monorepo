import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";


export const metadata: Metadata = {
  title: "NubleTrust Console",
  description: "Developer console for managing NubleTrust applications",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <main className="font-body antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </main>
  );
}
