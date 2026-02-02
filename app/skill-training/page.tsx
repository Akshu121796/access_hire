"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { TopNavigation } from "@/components/top-navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { FadeIn, StaggerContainer, StaggerItem, ScaleButton, HoverCard } from "@/components/ui/motion"
import { Search, Play, BookOpen, Volume2, Video, Hand } from "lucide-react"
import { useHighContrast } from "@/hooks/use-high-contrast"

import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface SkillCourse {
  id: string
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

  const [courses, setCourses] = useState<SkillCourse[]>([])
  const [loading, setLoading] = useState(true)

  /* 🔹 FIREBASE FETCH (ONLY BACKEND LOGIC) */
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const snapshot = await getDocs(collection(db, "skillCourses"))

        const data: SkillCourse[] = snapshot.docs.map((doc) => {
          const d = doc.data()

          return {
            id: doc.id,
            name: d.name,
            description: d.description,
            duration: d.duration,
            level: d.level,
            progress: d.progress ?? 0,
            accessibility: {
              text: d.accessibility?.text ?? false,
              audio: d.accessibility?.audio ?? false,
              video: d.accessibility?.video ?? false,
              signLanguage: d.accessibility?.signLanguage ?? false,
            },
          }
        })

        setCourses(data)
      } catch (err) {
        console.error("Error fetching skill courses:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  /* 🔹 FILTERING (UNCHANGED LOGIC) */
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesLevel = levelFilter === "All" || course.level === levelFilter
    return matchesSearch && matchesLevel
  })

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

  const AccessibilityIcon = ({
    type,
    available,
  }: {
    type: keyof SkillCourse["accessibility"]
    available: boolean
  }) => {
    if (!available) return null

    const icons = {
      text: BookOpen,
      audio: Volume2,
      video: Video,
      signLanguage: Hand,
    }

    const Icon = icons[type]
    return <Icon className="w-3 h-3 text-gray-500" aria-hidden="true" />
  }

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
        <aside className="w-full md:w-80 shrink-0 sticky top-20 bg-white border-r border-gray-100 shadow-sm">
          <FadeIn direction="right" className="p-6 flex flex-col gap-8">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-3xl border border-indigo-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-xl font-bold text-indigo-600">
                  {initials}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{userName}</h3>
                  <p className="text-sm text-gray-600">Software Engineer</p>
                </div>
              </div>
            </div>

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
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Skill Training
            </h1>
            <p className="text-gray-600 mb-6">
              Enhance your skills with our accessible learning courses.
            </p>
          </FadeIn>

          {/* Search & Filter */}
          <FadeIn delay={0.3} className="flex gap-4 mb-10">
            <input
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-6 py-4 border rounded-2xl"
            />
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Filter by level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Levels</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </FadeIn>

          {/* Courses */}
          {loading ? (
            <p className="text-gray-500">Loading courses...</p>
          ) : (
            <StaggerContainer className="grid gap-6">
              {filteredCourses.map((course) => (
                <StaggerItem key={course.id}>
                  <HoverCard className="bg-white p-6 rounded-3xl border shadow-sm">
                    <div className="mb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">{course.name}</h3>
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold border ${levelColors[course.level]}`}
                        >
                          {course.level}
                        </span>
                      </div>
                      <p className="text-gray-600">{course.description}</p>
                    </div>

                    <Progress value={course.progress} className="h-2 mb-4" />

                    <div className="flex items-center gap-2 mb-4">
                      <AccessibilityIcon type="text" available={course.accessibility.text} />
                      <AccessibilityIcon type="audio" available={course.accessibility.audio} />
                      <AccessibilityIcon type="video" available={course.accessibility.video} />
                      <AccessibilityIcon type="signLanguage" available={course.accessibility.signLanguage} />
                    </div>

                    <Button className="w-full">
                      <Play className="w-4 h-4 mr-2" />
                      {course.progress > 0 ? "Continue" : "Start"}
                    </Button>
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
