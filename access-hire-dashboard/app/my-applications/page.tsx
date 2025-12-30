"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { TopNavigation } from "@/components/top-navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FadeIn, StaggerContainer, StaggerItem, ScaleButton, HoverCard } from "@/components/ui/motion"
import { Eye, X, Calendar, Building, Briefcase } from "lucide-react"
import { useHighContrast } from "@/hooks/use-high-contrast"

interface Application {
  id: number
  jobRole: string
  companyName: string
  appliedDate: string
  status: "Applied" | "Under Review" | "Interview" | "Selected" | "Rejected"
}

const mockApplications: Application[] = [
  {
    id: 1,
    jobRole: "Frontend Developer",
    companyName: "Tech Corp",
    appliedDate: "2024-01-15",
    status: "Under Review",
  },
  {
    id: 2,
    jobRole: "UX Designer",
    companyName: "Design Labs",
    appliedDate: "2024-01-10",
    status: "Applied",
  },
  {
    id: 3,
    jobRole: "Content Writer",
    companyName: "Creative Studio",
    appliedDate: "2024-01-08",
    status: "Interview",
  },
  {
    id: 4,
    jobRole: "Data Analyst",
    companyName: "Analytics Inc",
    appliedDate: "2024-01-05",
    status: "Rejected",
  },
  {
    id: 5,
    jobRole: "Software Engineer",
    companyName: "InnovateTech",
    appliedDate: "2024-01-03",
    status: "Selected",
  },
]

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
  const [userName] = useState("Jane Doe")

  const handleNavToAuth = () => {
    // Navigate to auth or logout
  }

  const handleLogoClick = () => {
    // Navigate to home
  }

  const filteredApplications = filter === "All"
    ? mockApplications
    : mockApplications.filter(app => app.status === filter)

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
        onLoginClick={handleNavToAuth}
        currentView="candidate-dash"
        companyName="Tech Corp"
        onLogoClick={handleLogoClick}
      />

      <main className="pt-20 min-h-screen bg-gray-50 flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-80 shrink-0 sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto bg-white border-r border-gray-100 shadow-sm self-start">
          <FadeIn direction="right" className="h-full p-6 flex flex-col gap-8">
            {/* Profile Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-3xl shadow-sm border border-indigo-100 relative overflow-hidden group">
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-xl font-bold text-indigo-600 shadow-sm border border-indigo-50">
                  {initials}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{userName}</h3>
                  <p className="text-sm text-gray-600">Software Engineer</p>
                </div>
              </div>

              {/* Blue Dot Badge */}
              <div className="bg-white text-indigo-600 px-3 py-1.5 rounded-full inline-flex items-center gap-2 text-sm font-bold shadow-sm border border-indigo-50">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                Blue Dot Verified
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-2" role="navigation" aria-label="Dashboard navigation">
              {navigationItems.map((item) => {
                const isActive = pathname === item.path
                return (
                  <a
                    key={item.name}
                    href={item.path}
                    className={`w-full text-left px-5 py-3 text-sm font-semibold rounded-xl transition-all duration-200 border border-transparent ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700 border-indigo-100 shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                    aria-label={`Navigate to ${item.name}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-indigo-500" : "bg-transparent"} transition-colors`} aria-hidden="true" />
                      {item.name}
                    </div>
                  </a>
                )
              })}
            </nav>
          </FadeIn>
        </aside>

        {/* Main Content */}
        <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
          <FadeIn delay={0.2} direction="up" className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">My Applications</h1>
              <p className="text-gray-600">Track and manage your job applications.</p>
            </div>
          </FadeIn>

          {/* Filter */}
          <FadeIn delay={0.3} className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="relative flex-1 group">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="relative w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 text-gray-900 placeholder:text-gray-400 transition-all shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-md" aria-label="Filter applications by status">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Applications</SelectItem>
                  <SelectItem value="Applied">Applied</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="Interview">Interview</SelectItem>
                  <SelectItem value="Selected">Selected</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </FadeIn>

          {/* Results announcement for screen readers */}
          <div aria-live="polite" aria-atomic="true" className="sr-only">
            {filteredApplications.length === 0
              ? "No applications found with the selected filter."
              : `Showing ${filteredApplications.length} application${filteredApplications.length === 1 ? '' : 's'}${filter !== 'All' ? ` with status: ${filter}` : ''}.`
            }
          </div>

          {/* Applications List */}
          <StaggerContainer className="grid gap-6" role="main" aria-label="Job applications">
            {filteredApplications.map((application, index) => (
              <StaggerItem key={application.id}>
                <HoverCard
                  className="group relative bg-white p-6 md:p-8 rounded-3xl border border-gray-100 hover:border-indigo-100 transition-colors duration-300 shadow-sm"
                  role="article"
                  aria-labelledby={`application-title-${application.id}`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 id={`application-title-${application.id}`} className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{application.jobRole}</h3>
                        <span className={`${statusColors[application.status].replace('bg-', 'px-2 py-1 rounded text-xs font-bold bg-').replace('text-', 'text-').replace('border-', 'border-')} border`} aria-label={`Application status: ${application.status}`}>
                          {application.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm md:text-base">
                        <span className="flex items-center gap-1.5" aria-label={`Company: ${application.companyName}`}>
                          <Building className="w-4 h-4 text-gray-400" aria-hidden="true" /> {application.companyName}
                        </span>
                        <span className="flex items-center gap-1.5" aria-label={`Applied date: ${new Date(application.appliedDate).toLocaleDateString()}`}>
                          <Calendar className="w-4 h-4 text-gray-400" aria-hidden="true" /> Applied {new Date(application.appliedDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      <ScaleButton>
                        <div className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100 px-6 py-3 rounded-full font-semibold transition-colors flex items-center gap-2" role="button" aria-label={`View details for ${application.jobRole} application at ${application.companyName}`}>
                          <Eye className="w-4 h-4" aria-hidden="true" />
                          View Details
                        </div>
                      </ScaleButton>
                      <ScaleButton>
                        <div className="bg-red-50 text-red-700 hover:bg-red-100 border border-red-100 px-6 py-3 rounded-full font-semibold transition-colors flex items-center gap-2" role="button" aria-label={`Withdraw application for ${application.jobRole} at ${application.companyName}`}>
                          <X className="w-4 h-4" aria-hidden="true" />
                          Withdraw
                        </div>
                      </ScaleButton>
                    </div>
                  </div>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {filteredApplications.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No applications found with the selected filter.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}