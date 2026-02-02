"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { TopNavigation } from "@/components/top-navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FadeIn, StaggerContainer, StaggerItem, ScaleButton, HoverCard } from "@/components/ui/motion"
import { Eye, X, Calendar, Building } from "lucide-react"
import { useHighContrast } from "@/hooks/use-high-contrast"

import { collection, getDocs, query, where } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"

interface Application {
  id: string
  jobRole: string
  companyName: string
  appliedDate: string
  status: "Applied" | "Under Review" | "Interview" | "Selected" | "Rejected"
}

const statusColors = {
  Applied: "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Under Review": "bg-blue-100 text-blue-800 border-blue-200",
  Interview: "bg-purple-100 text-purple-800 border-purple-200",
  Selected: "bg-green-100 text-green-800 border-green-200",
  Rejected: "bg-red-100 text-red-800 border-red-200",
}

export default function MyApplicationsPage() {
  const pathname = usePathname()
  const [highContrast, setHighContrast] = useHighContrast()
  const [filter, setFilter] = useState<string>("All")
  const [userName, setUserName] = useState("")

  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  /* 🔹 AUTH + FIRESTORE FETCH (ONLY NEW LOGIC) */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false)
        return
      }

      setUserName(user.displayName || "Candidate")

      const q = query(
        collection(db, "applications"),
        where("CandidateID", "==", user.uid)
      )

      const snapshot = await getDocs(q)

      const apps: Application[] = snapshot.docs.map((doc) => {
        const data = doc.data()

        return {
          id: doc.id,
          jobRole: data.jobID || "Unknown Role",
          companyName: data.CompanyName || "Company",
          appliedDate: data.appliedAt?.toDate().toISOString() || new Date().toISOString(),
          status: (data.Status || "Applied") as Application["status"],
        }
      })

      setApplications(apps)
      setLoading(false)
    })

    return () => unsub()
  }, [])

  const filteredApplications =
    filter === "All"
      ? applications
      : applications.filter((app) => app.status === filter)

  const firstName = userName.split(" ")[0]
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const navigationItems = [
    { name: "Dashboard", path: "/" },
    { name: "My Applications", path: "/my-applications" },
    { name: "Skill Training", path: "/skill-training" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation
        highContrast={highContrast}
        onToggleContrast={setHighContrast}
        onLoginClick={() => {}}
        currentView="candidate-dash"
        companyName="AccessHire"
        onLogoClick={() => {}}
      />

      <main className="pt-20 min-h-screen bg-gray-50 flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-80 shrink-0 sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto bg-white border-r border-gray-100 shadow-sm self-start">
          <FadeIn direction="right" className="h-full p-6 flex flex-col gap-8">
            {/* Profile Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-3xl shadow-sm border border-indigo-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-xl font-bold text-indigo-600">
                  {initials}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{userName}</h3>
                  <p className="text-sm text-gray-600">Candidate</p>
                </div>
              </div>

              <div className="bg-white text-indigo-600 px-3 py-1.5 rounded-full inline-flex items-center gap-2 text-sm font-bold">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                Blue Dot Verified
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const isActive = pathname === item.path
                return (
                  <a
                    key={item.name}
                    href={item.path}
                    className={`px-5 py-3 rounded-xl text-sm font-semibold ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {item.name}
                  </a>
                )
              })}
            </nav>
          </FadeIn>
        </aside>

        {/* Main Content */}
        <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
          <FadeIn delay={0.2}>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              My Applications
            </h1>
            <p className="text-gray-600 mb-6">
              Track and manage your job applications.
            </p>
          </FadeIn>

          {/* Filter */}
          <FadeIn delay={0.3} className="mb-10">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Applied">Applied</SelectItem>
                <SelectItem value="Under Review">Under Review</SelectItem>
                <SelectItem value="Interview">Interview</SelectItem>
                <SelectItem value="Selected">Selected</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </FadeIn>

          {/* Applications */}
          {loading ? (
            <p className="text-gray-500">Loading applications...</p>
          ) : (
            <StaggerContainer className="grid gap-6">
              {filteredApplications.map((application) => (
                <StaggerItem key={application.id}>
                  <HoverCard className="bg-white p-6 rounded-3xl border shadow-sm">
                    <div className="flex justify-between gap-6">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold">
                            {application.jobRole}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded text-xs font-bold border ${statusColors[application.status]}`}
                          >
                            {application.status}
                          </span>
                        </div>

                        <div className="flex gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Building className="w-4 h-4" />
                            {application.companyName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(application.appliedDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <ScaleButton>
                          <Button variant="outline">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </ScaleButton>
                        <ScaleButton>
                          <Button variant="destructive">
                            <X className="w-4 h-4 mr-2" />
                            Withdraw
                          </Button>
                        </ScaleButton>
                      </div>
                    </div>
                  </HoverCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
