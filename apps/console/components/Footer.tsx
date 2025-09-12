export default function Footer() {
    return (
      <footer className="mt-auto py-8 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10 backdrop-blur-sm">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                NubleTrust
              </span>
              <span className="text-gray-400">© 2024 All rights reserved</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="/docs" className="hover:text-white transition-colors">
                Documentation
              </a>
              <a href="/support" className="hover:text-white transition-colors">
                Support
              </a>
              <a href="/privacy" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="/terms" className="hover:text-white transition-colors">
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    )
  }
  