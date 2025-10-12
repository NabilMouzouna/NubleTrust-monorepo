"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import { ArrowRight, Code, Globe, Lock, Shield, Users, Zap, CheckCircle } from "lucide-react"

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const gradientRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const run = async () => {
      const { gsap } = await import("gsap")
      const { ScrollTrigger } = await import("gsap/ScrollTrigger")
      gsap.registerPlugin(ScrollTrigger)

      // Hero content fade-up
      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current.children,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.15 }
        )
      }

      // Animated gradient blobs
      if (gradientRef.current) {
        const blobs = gradientRef.current.querySelectorAll(".blob")
        blobs.forEach((b, i) => {
          gsap.to(b, {
            x: () => gsap.utils.random(-50, 50),
            y: () => gsap.utils.random(-30, 30),
            rotate: () => gsap.utils.random(-10, 10),
            scale: () => gsap.utils.random(0.9, 1.1),
            duration: 6 + i,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          })
        })
      }

      // Features reveal on scroll
      if (featuresRef.current) {
        const cards = featuresRef.current.querySelectorAll(".feature-card")
        gsap.fromTo(
          cards,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: { trigger: featuresRef.current, start: "top 80%" },
          }
        )
      }

      // Stats pop-in
      if (statsRef.current) {
        const items = statsRef.current.querySelectorAll(".stat-item")
        gsap.fromTo(
          items,
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.06,
            ease: "back.out(1.6)",
            scrollTrigger: { trigger: statsRef.current, start: "top 85%" },
          }
        )
      }
    }
    run()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20">
        {/* Artistic animated gradient background */}
        <div ref={gradientRef} className="pointer-events-none absolute inset-0">
          <div className="blob absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-30 bg-primary/40 dark:bg-primary/30" />
          <div className="blob absolute -bottom-24 -right-16 h-80 w-80 rounded-full blur-3xl opacity-25 bg-blue/40 dark:bg-blue/30" />
          <div className="blob absolute top-1/3 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full blur-3xl opacity-20 bg-accent/50" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 py-20 relative">
          <div ref={heroRef} className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-secondary/50 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Zero Trust Authentication Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              NubleTrust
              <span className="block text-transparent bg-gradient-to-r from-primary to-blue bg-clip-text">
                Secure. Scalable. Developer‑First.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              NubleTrust gives you risk‑based authentication, session intelligence, and zero‑trust access control
              built for modern applications. Secure your APIs and users in minutes, not hours.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/dashboard"
                className="group bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-primary/25 w-full sm:w-auto justify-center"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/docs"
                className="border border-input hover:bg-accent hover:text-accent-foreground text-foreground px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 w-full sm:w-auto justify-center"
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
              <div className="text-3xl font-bold text-foreground mb-2">99.9%</div>
              <div className="text-muted-foreground text-sm">Uptime Guarantee</div>
            </div>
            <div className="stat-item text-center">
              <div className="text-3xl font-bold text-foreground mb-2">10M+</div>
              <div className="text-muted-foreground text-sm">Sessions Secured Daily</div>
            </div>
            <div className="stat-item text-center">
              <div className="text-3xl font-bold text-foreground mb-2">50K+</div>
              <div className="text-muted-foreground text-sm">Developers Trust NubleTrust</div>
            </div>
            <div className="stat-item text-center">
              <div className="text-3xl font-bold text-foreground mb-2">150+</div>
              <div className="text-muted-foreground text-sm">Countries Protected</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Authentication without compromise</h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              From passwordless login to continuous risk checks, NubleTrust gives you a full zero‑trust stack designed
              for modern teams and enterprises.
            </p>
          </div>

          <div ref={featuresRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            <div className="feature-card rounded-xl p-8 border hover:bg-accent transition-all duration-300">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Fast Integration</h3>
              <p className="text-muted-foreground leading-relaxed">
                Add authentication and risk‑aware session management to your app with just a few lines of code.
              </p>
            </div>

            <div className="feature-card rounded-xl p-8 border hover:bg-accent transition-all duration-300">
              <div className="w-12 h-12 bg-blue/20 rounded-lg flex items-center justify-center mb-6">
                <Lock className="w-6 h-6 text-blue" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Zero Trust Security</h3>
              <p className="text-muted-foreground leading-relaxed">
                Enforce continuous verification and risk checks. Every request, every session, always verified.
              </p>
            </div>

            <div className="feature-card rounded-xl p-8 border hover:bg-accent transition-all duration-300">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Smart Session Management</h3>
              <p className="text-muted-foreground leading-relaxed">
                Track devices, locations, and risk scores in real time. Terminate risky sessions automatically.
              </p>
            </div>

            <div className="feature-card rounded-xl p-8 border hover:bg-accent transition-all duration-300">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-6">
                <Globe className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Global Scale</h3>
              <p className="text-muted-foreground leading-relaxed">
                Built on distributed infrastructure across multiple regions for low‑latency, secure authentication
                worldwide.
              </p>
            </div>

            <div className="feature-card rounded-xl p-8 border hover:bg-accent transition-all duration-300">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-6">
                <CheckCircle className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Compliance Ready</h3>
              <p className="text-muted-foreground leading-relaxed">
                GDPR, CCPA, and HIPAA compliant by design. Secure your stack without extra compliance overhead.
              </p>
            </div>

            <div className="feature-card rounded-xl p-8 border hover:bg-accent transition-all duration-300">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-6">
                <Code className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Developer First</h3>
              <p className="text-muted-foreground leading-relaxed">
                SDKs, APIs, and docs built for productivity. Empowering developers to integrate auth in minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-blue/10">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Ready to build with Zero Trust?</h2>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of developers adopting NubleTrust to secure their applications, APIs, and users.
          </p>
          <Link
            href="/auth"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-primary/25"
          >
            Start Building Today
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
