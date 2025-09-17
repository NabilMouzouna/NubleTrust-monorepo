import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <h1 className="text-8xl font-bold bg-gradient-to-r from-primary to-blue bg-clip-text text-transparent mb-4">
          404
        </h1>

        <h2 className="text-2xl font-semibold text-foreground mb-4">Page Not Found</h2>

        <p className="text-muted-foreground mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button>
              Go Home
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline">
              Go to Console
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
