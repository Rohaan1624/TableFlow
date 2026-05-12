"use client"

import * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type ColorScheme = "dark-green" | "pastel-pink" | "pastel-blue" | "pastel-lavender"

interface ThemeContextType {
  colorScheme: ColorScheme
  setColorScheme: (scheme: ColorScheme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("dark-green")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("color-scheme") as ColorScheme | null
    if (saved) {
      setColorScheme(saved)
      document.documentElement.setAttribute("data-theme", saved)
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("color-scheme", colorScheme)
      document.documentElement.setAttribute("data-theme", colorScheme)
    }
  }, [colorScheme, mounted])

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeContext.Provider value={{ colorScheme, setColorScheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
