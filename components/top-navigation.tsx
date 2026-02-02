"use client"

import { LogOut, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useState } from "react"
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis"
// voice recognition removed from navbar

interface TopNavigationProps {
  highContrast: boolean
  onToggleContrast: (value: boolean) => void
  onLoginClick: () => void
  currentView?: "landing" | "auth" | "candidate-dash" | "employer-dash"
  companyName?: string
  onLogoClick?: () => void
}

export function TopNavigation({
  highContrast,
  onToggleContrast,
  onLoginClick,
  currentView = "landing",
  companyName,
  onLogoClick,
}: TopNavigationProps) {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)
  const { isReading, isSupported: speechSupported, readPageContent } = useSpeechSynthesis()

  return (
    <header className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm transition-all duration-300" role="banner">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={onLogoClick}
          className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-lg px-2"
          aria-label="AccessHire - Go to home page"
        >
          AccessHire
        </button>

        {currentView === "landing" && (
          <nav className="hidden md:flex gap-2 mx-auto" role="navigation" aria-label="Main navigation" onMouseLeave={() => setHoveredTab(null)}>
            {["Find Jobs", "Hire Inclusively"].map((item) => (
              <button
                key={item}
                onClick={onLoginClick}
                onMouseEnter={() => setHoveredTab(item)}
                className="relative px-6 py-2 text-base font-medium text-gray-600 hover:text-primary transition-colors z-10"
                aria-label={`${item} - Navigate to ${item.toLowerCase()} section`}
              >
                {hoveredTab === item && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-indigo-50 rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                {item}
              </button>
            ))}
          </nav>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* High Contrast Toggle */}
          <div className="flex items-center gap-3 mr-4" role="group" aria-labelledby="contrast-label">
            <label id="contrast-label" htmlFor="contrast-toggle" className="text-sm font-medium text-gray-600 hidden sm:block">
              High Contrast
            </label>
            <button
              id="contrast-toggle"
              onClick={() => onToggleContrast(!highContrast)}
              className={`relative w-12 h-7 rounded-full transition-all shadow-inner ${highContrast ? "bg-primary" : "bg-gray-200"
                }`}
              role="switch"
              aria-checked={highContrast}
              aria-label="Toggle high contrast mode"
              title="High Contrast mode improves accessibility by providing better color contrast, clearer focus indicators, and enhanced visibility for users with visual impairments. Meets WCAG AA standards."
            >
              <span
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${highContrast ? "translate-x-5" : ""
                  }`}
              />
            </button>
          </div>

          {currentView !== "landing" && speechSupported && (
            <Button
              variant="outline"
              className={`gap-2 border-primary/20 hover:border-primary/50 hover:bg-primary/5 text-primary ${isReading ? 'bg-primary/10 border-primary/50' : ''}`}
              onClick={readPageContent}
              aria-label={isReading ? "Stop reading page content" : "Read page content aloud"}
              aria-pressed={isReading}
            >
              <Volume2 className="w-4 h-4 text-primary" aria-hidden="true" />
              <span className="hidden sm:inline">{isReading ? "Stop Reading" : "Read Page"}</span>
            </Button>
          )}

          {/* Voice Search button removed from navbar */}

          {currentView === "landing" && (
            <Button
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all rounded-full px-8"
              onClick={onLoginClick}
            >
              Login
            </Button>
          )}

          {currentView !== "landing" && (
            <button
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-center border border-transparent hover:border-red-100"
              aria-label="Sign out"
              title="Sign out"
              onClick={() => {
                onLogoClick?.()
              }}
            >
              <LogOut className="w-5 h-5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
