"use client"

import { useState } from "react"
import { TopNavigation } from "@/components/top-navigation"
import { Footer } from "@/components/footer"
import { CandidateDashboard } from "@/components/candidate-dashboard"
import { useHighContrast } from "@/hooks/use-high-contrast"

export default function DashboardPage() {
  const [highContrast, setHighContrast] = useHighContrast()
  const [userName] = useState("Jane Doe")

  const handleNavToAuth = () => {
    // Navigate to auth or logout
  }

  const handleLogoClick = () => {
    // Navigate to home
  }

  const handleLogout = () => {
    // Handle logout
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation
        highContrast={highContrast}
        onToggleContrast={setHighContrast}
        onLoginClick={handleNavToAuth}
        currentView="candidate-dash"
        companyName="Tech Corp"
        onLogoClick={handleLogoClick}
      />

      <CandidateDashboard onLogout={handleLogout} userName={userName} />

      <Footer />
    </div>
  )
}