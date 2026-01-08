"use client"

import { useState, useEffect } from "react"
import { TopNavigation } from "@/components/top-navigation"
import { Footer } from "@/components/footer"
import { CandidateDashboard } from "@/components/candidate-dashboard"
import { EmployerDashboard } from "@/components/employer-dashboard"
import { useHighContrast } from "@/hooks/use-high-contrast"
import { auth, db } from "@/lib/firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const [highContrast, setHighContrast] = useHighContrast()
  const [user, setUser] = useState<any>(null)
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid))
          if (userDoc.exists()) {
            const userData = userDoc.data()
            setRole(userData.role)
          }
        } catch (error) {
          console.error("Error fetching user role:", error)
        }
      } else {
        // Redirect to auth if not logged in
        router.push("/auth")
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [router])

  const handleNavToAuth = () => {
    router.push("/auth")
  }

  const handleLogoClick = () => {
    // Navigate to home logic if needed
  }

  const handleLogout = async () => {
    await signOut(auth)
    router.push("/auth")
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation
        highContrast={highContrast}
        onToggleContrast={setHighContrast}
        onLoginClick={handleNavToAuth}
        // Dynamically set view prop if needed or just use consistent header
        currentView={role === 'employer' ? 'employer-dash' : 'candidate-dash'}
        companyName={role === 'employer' ? user?.displayName : "Tech Corp"} // Maybe fetch actual company name
        onLogoClick={handleLogoClick}
      />

      {role === "employer" ? (
        <EmployerDashboard onLogout={handleLogout} userName={user?.displayName || "Employer"} />
      ) : (
        <CandidateDashboard onLogout={handleLogout} userName={user?.displayName || "Candidate"} />
      )}

      <Footer />
    </div>
  )
}