"use client"

import { useState, useEffect } from "react"

export function useHighContrast() {
  const [highContrast, setHighContrast] = useState(false)

  // Load preference from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("highContrast")
    if (saved === "true") {
      setHighContrast(true)
      document.body.classList.add("high-contrast")
    }
  }, [])

  const toggleHighContrast = (value: boolean) => {
    setHighContrast(value)
    if (value) {
      document.body.classList.add("high-contrast")
      localStorage.setItem("highContrast", "true")
    } else {
      document.body.classList.remove("high-contrast")
      localStorage.setItem("highContrast", "false")
    }
  }

  return [highContrast, toggleHighContrast] as const
}