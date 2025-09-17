"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"
import * as React from "react"

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const isDark = resolvedTheme === "dark"

  return React.createElement(
    Button,
    {
      variant: "ghost",
      size: "icon",
      "aria-label": "Toggle theme",
      onClick: () => setTheme(isDark ? "light" : "dark"),
    },
    isDark ? React.createElement(Sun, { className: "h-5 w-5 cursor-pointer" }) : React.createElement(Moon, { className: "h-5 w-5 cursor-pointer" })
  )
}


