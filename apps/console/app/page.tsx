"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import { Shield, Zap, Lock, Users, ArrowRight, CheckCircle, Code, Globe } from "lucide-react"
import Navbar from "@/components/Navbar"

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadGSAP = async () => {
      const { gsap } = await import("gsap")
      const { ScrollTrigger } = await import("gsap/ScrollTrigger")

      gsap.registerPlugin(ScrollTrigger)

      // Hero animations
      gsap.fromTo(
        heroRef.current?.children || [],
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
        },
      )

      // Features animation
      gsap.fromTo(
        featuresRef.current?.querySelectorAll(".feature-card") || [],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 80%",
            end: "bottom 20%",
          },
        },
      )

      // Stats animation
      gsap.fromTo(
        statsRef.current?.querySelectorAll(".stat-item") || [],
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
          },
        },
      )
    }

    loadGSAP()
  }, [])

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#121212" }}>
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-blue/10" />
        <div className="container mx-auto px-4 sm:px-6 py-20 relative">
          <div ref={heroRef} className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-secondary/50 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm text-accent">Open Source Authentication Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Secure Authentication
              <span className="block text-transparent bg-gradient-to-r from-primary to-blue bg-clip-text">
                Made Simple
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-accent mb-8 max-w-2xl mx-auto leading-relaxed">
              Build secure, scalable authentication and authorization into your applications with our developer-first
              platform. Get started in minutes, not hours.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/auth"
                className="group bg-primary hover:bg-primary/90 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-primary/25 w-full sm:w-auto justify-center"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/docs"
                className="bg-secondary hover:bg-secondary/80 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <Code className="w-4 h-4" />
                View Documentation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 max-w-4xl mx-auto">
            <div className="stat-item text-center">
              <div className="text-3xl font-bold text-white mb-2">99.9%</div>
              <div className="text-accent text-sm">Uptime SLA</div>
            </div>
            <div className="stat-item text-center">
              <div className="text-3xl font-bold text-white mb-2">10M+</div>
              <div className="text-accent text-sm">API Requests/day</div>
            </div>
            <div className="stat-item text-center">
              <div className="text-3xl font-bold text-white mb-2">50K+</div>
              <div className="text-accent text-sm">Developers</div>
            </div>
            <div className="stat-item text-center">
              <div className="text-3xl font-bold text-white mb-2">150+</div>
              <div className="text-accent text-sm">Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Everything you need for authentication</h2>
            <p className="text-lg sm:text-xl text-accent max-w-2xl mx-auto">
              From simple login forms to enterprise SSO, we&apos;ve got you covered with industry-leading security and
              developer experience.
            </p>
          </div>

          <div ref={featuresRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            <div className="feature-card bg-secondary rounded-xl p-8 hover:bg-secondary/80 transition-all duration-300 group">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Lightning Fast Setup</h3>
              <p className="text-accent leading-relaxed">
                Get authentication running in your app with just a few lines of code. No complex configuration required.
              </p>
            </div>

            <div className="feature-card bg-secondary rounded-xl p-8 hover:bg-secondary/80 transition-all duration-300 group">
              <div className="w-12 h-12 bg-blue/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Lock className="w-6 h-6 text-blue" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Enterprise Security</h3>
              <p className="text-accent leading-relaxed">
                Built with security-first principles. SOC 2 compliant with advanced threat protection and monitoring.
              </p>
            </div>

            <div className="feature-card bg-secondary rounded-xl p-8 hover:bg-secondary/80 transition-all duration-300 group">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">User Management</h3>
              <p className="text-accent leading-relaxed">
                Complete user lifecycle management with roles, permissions, and advanced user analytics.
              </p>
            </div>

            <div className="feature-card bg-secondary rounded-xl p-8 hover:bg-secondary/80 transition-all duration-300 group">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Global Scale</h3>
              <p className="text-accent leading-relaxed">
                Distributed infrastructure across multiple regions for low-latency authentication worldwide.
              </p>
            </div>

            <div className="feature-card bg-secondary rounded-xl p-8 hover:bg-secondary/80 transition-all duration-300 group">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CheckCircle className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Compliance Ready</h3>
              <p className="text-accent leading-relaxed">
                GDPR, CCPA, and HIPAA compliant out of the box. Focus on building, not compliance paperwork.
              </p>
            </div>

            <div className="feature-card bg-secondary rounded-xl p-8 hover:bg-secondary/80 transition-all duration-300 group">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Code className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Developer First</h3>
              <p className="text-accent leading-relaxed">
                Comprehensive SDKs, detailed documentation, and responsive developer support when you need it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-blue/10">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to secure your application?</h2>
          <p className="text-lg sm:text-xl text-accent mb-8 max-w-2xl mx-auto">
            Join thousands of developers who trust NubleTrust for their authentication needs.
          </p>
          <Link
            href="/auth"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-primary/25"
          >
            Start Building Today
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
