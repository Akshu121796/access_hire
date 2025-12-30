"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { TopNavigation } from "@/components/top-navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { FadeIn, StaggerContainer, StaggerItem, ScaleButton, HoverCard } from "@/components/ui/motion"
import { Search, Play, BookOpen, Volume2, Video, Hand } from "lucide-react"
import { useHighContrast } from "@/hooks/use-high-contrast"

interface SkillCourse {
  id: number
  name: string
  description: string
  duration: string
  level: "Beginner" | "Intermediate" | "Advanced"
  progress: number
  accessibility: {
    text: boolean
    audio: boolean
    video: boolean
    signLanguage: boolean
  }
}

const mockSkillCourses: SkillCourse[] = [
  {
    id: 1,
    name: "Introduction to Web Development",
    description: "Learn the basics of HTML, CSS, and JavaScript to build accessible websites.",
    duration: "8 weeks",
    level: "Beginner",
    progress: 75,
    accessibility: {
      text: true,
      audio: true,
      video: true,
      signLanguage: false,
    },
  },
  {
    id: 2,
    name: "Advanced React Patterns",
    description: "Master advanced React concepts including hooks, context, and performance optimization.",
    duration: "6 weeks",
    level: "Advanced",
    progress: 30,
    accessibility: {
      text: true,
      audio: true,
      video: true,
      signLanguage: true,
    },
  },
  {
    id: 3,
    name: "Data Analysis with Python",
    description: "Learn data manipulation, visualization, and analysis using Python and pandas.",
    duration: "10 weeks",
    level: "Intermediate",
    progress: 0,
    accessibility: {
      text: true,
      audio: false,
      video: true,
      signLanguage: false,
    },
  },
  {
    id: 4,
    name: "UX Design Fundamentals",
    description: "Understand user-centered design principles and create inclusive user experiences.",
    duration: "7 weeks",
    level: "Beginner",
    progress: 100,
    accessibility: {
      text: true,
      audio: true,
      video: true,
      signLanguage: true,
    },
  },
  {
    id: 5,
    name: "Machine Learning Basics",
    description: "Introduction to machine learning concepts and practical applications.",
    duration: "12 weeks",
    level: "Intermediate",
    progress: 50,
    accessibility: {
      text: true,
      audio: true,
      video: false,
      signLanguage: false,
    },
  },
]

const levelColors = {
  Beginner: "bg-green-100 text-green-800 border-green-200",
  Intermediate: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Advanced: "bg-red-100 text-red-800 border-red-200",
}

export default function SkillTrainingPage() {
  const pathname = usePathname()
  const [highContrast, setHighContrast] = useHighContrast()
  const [searchQuery, setSearchQuery] = useState("")
  const [levelFilter, setLevelFilter] = useState<string>("All")
  const [userName] = useState("Jane Doe")

  const handleNavToAuth = () => {
    // Navigate to auth or logout
  }

  const handleLogoClick = () => {
    // Navigate to home
  }

  const filteredCourses = mockSkillCourses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLevel = levelFilter === "All" || course.level === levelFilter
    return matchesSearch && matchesLevel
  })

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

  const AccessibilityIcon = ({ type, available }: { type: keyof SkillCourse['accessibility'], available: boolean }) => {
    if (!available) return null

    const icons = {
      text: BookOpen,
      audio: Volume2,
      video: Video,
      signLanguage: Hand,
    }

    const Icon = icons[type]
    const labels = {
      text: "Text",
      audio: "Audio",
      video: "Video",
      signLanguage: "Sign Language",
    }

    return (
      <div className="flex items-center gap-1 text-xs text-gray-500">
        <Icon className="w-3 h-3" />
        <span className="sr-only">{labels[type]}</span>
      </div>
    )
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
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Skill Training</h1>
              <p className="text-gray-600">Enhance your skills with our accessible learning courses.</p>
            </div>
          </FadeIn>

          {/* Search and Filter */}
          <FadeIn delay={0.3} className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="relative flex-1 group">
              <input
                type="text"
                placeholder="Search skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="relative w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 text-gray-900 placeholder:text-gray-400 transition-all shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-md"
                aria-label="Search skills"
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" aria-hidden="true" />
            </div>
            <div className="relative">
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="relative w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 text-gray-900 placeholder:text-gray-400 transition-all shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-md" aria-label="Filter courses by skill level">
                  <SelectValue placeholder="Filter by level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Levels</SelectItem>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </FadeIn>

          {/* Results announcement for screen readers */}
          <div aria-live="polite" aria-atomic="true" className="sr-only">
            {filteredCourses.length === 0
              ? "No courses found matching your search and filter criteria."
              : `Showing ${filteredCourses.length} course${filteredCourses.length === 1 ? '' : 's'}${searchQuery ? ` matching "${searchQuery}"` : ''}${levelFilter !== 'All' ? ` at ${levelFilter} level` : ''}.`
            }
          </div>

          {/* Courses Grid */}
          <StaggerContainer className="grid gap-6" role="main" aria-label="Skill training courses">
            {filteredCourses.map((course, index) => (
              <StaggerItem key={course.id}>
                <HoverCard
                  className="group relative bg-white p-6 md:p-8 rounded-3xl border border-gray-100 hover:border-indigo-100 transition-colors duration-300 shadow-sm"
                  role="article"
                  aria-labelledby={`course-title-${course.id}`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 id={`course-title-${course.id}`} className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{course.name}</h3>
                        <span className={`${levelColors[course.level].replace('bg-', 'px-2 py-1 rounded text-xs font-bold bg-').replace('text-', 'text-').replace('border-', 'border-')} border`} aria-label={`Skill level: ${course.level}`}>
                          {course.level}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm md:text-base">
                        <span className="flex items-center gap-1.5" aria-label={`Course duration: ${course.duration}`}>
                          <BookOpen className="w-4 h-4 text-gray-400" aria-hidden="true" /> {course.duration}
                        </span>
                      </div>

                      <p className="text-gray-600 text-sm md:text-base">{course.description}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span aria-label={`Course progress: ${course.progress} percent complete`}>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" aria-label={`Progress bar showing ${course.progress}% completion`} />
                    </div>

                    <div className="flex items-center gap-2 flex-wrap" role="list" aria-label="Available accessibility formats">
                      <AccessibilityIcon type="text" available={course.accessibility.text} />
                      <AccessibilityIcon type="audio" available={course.accessibility.audio} />
                      <AccessibilityIcon type="video" available={course.accessibility.video} />
                      <AccessibilityIcon type="signLanguage" available={course.accessibility.signLanguage} />
                    </div>

                    <div className="flex gap-2">
                      <ScaleButton className="flex-1">
                        <div className={`w-full px-6 py-3 rounded-full font-semibold transition-colors flex items-center justify-center gap-2 ${
                          course.progress > 0
                            ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100"
                            : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-200"
                        }`} role="button" aria-label={`${course.progress > 0 ? 'Continue' : 'Start'} ${course.name} course`}>
                          <Play className="w-4 h-4" aria-hidden="true" />
                          {course.progress > 0 ? "Continue" : "Start"}
                        </div>
                      </ScaleButton>
                      <ScaleButton>
                        <div className="bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-100 px-6 py-3 rounded-full font-semibold transition-colors flex items-center gap-2" role="button" aria-label={`View curriculum for ${course.name}`}>
                          <BookOpen className="w-4 h-4" aria-hidden="true" />
                          Curriculum
                        </div>
                      </ScaleButton>
                    </div>
                  </div>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No courses found matching your search and filter criteria.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}