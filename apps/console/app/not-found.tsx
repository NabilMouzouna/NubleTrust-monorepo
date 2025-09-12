import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <h1 className="text-8xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
          404
        </h1>

        <h2 className="text-2xl font-semibold text-white mb-4">Page Not Found</h2>

        <p className="text-gray-400 mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-8 justify-center">
          <button
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            <Link href="/">Go Home</Link>
          </button>

          <button
            className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white bg-transparent px-4 py-2 rounded-md text-sm font-medium"
          >
            <Link href="/dashboard">Go to Console</Link>
          </button>
        </div>
      </div>
    </div>
  )
}
