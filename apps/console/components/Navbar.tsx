"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
      style={{ backgroundColor: "rgba(18, 18, 18, 0.9)" }}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo/logo-192x192.png" alt="NubleTrust" width={50} height={50} />
            <span className="text-xl font-bold text-white">NubleTrust</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/docs" className="text-accent hover:text-white transition-colors">
              Documentation
            </Link>
            <Link href="/pricing" className="text-accent hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/about" className="text-accent hover:text-white transition-colors">
              About
            </Link>
            <Link
              href="/auth"
              className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-all"
            >
              Console
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-accent hover:text-white transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link
              href="/docs"
              className="block text-accent hover:text-white transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Documentation
            </Link>
            <Link
              href="/pricing"
              className="block text-accent hover:text-white transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="block text-accent hover:text-white transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/auth"
              className="block bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-all w-fit"
              onClick={() => setIsMenuOpen(false)}
            >
              Console
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
