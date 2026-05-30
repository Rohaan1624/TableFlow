// src/hooks/useTheme.ts
import { useState, useEffect } from "react"

const STORAGE_KEY = "theme"

export function useTheme() {
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored !== null) return stored === "dark"
    return window.matchMedia("(prefers-color-scheme: dark)").matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
    localStorage.setItem(STORAGE_KEY, dark ? "dark" : "light")
  }, [dark])

  return { dark, setDark }
}