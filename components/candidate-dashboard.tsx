"use client"

import React, { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { StaggerContainer, StaggerItem, FadeIn, ScaleButton, HoverCard } from "@/components/ui/motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useVoiceRecognition } from "@/hooks/use-voice-recognition"
import { useToast } from "@/hooks/use-toast"
import { collection, getDocs, doc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { JobDetailsModal, Job } from "./job-details-modal"

interface CandidateDashboardProps {
  onLogout: () => void
  userName?: string
}

export function CandidateDashboard({ onLogout, userName = "Jane Doe" }: CandidateDashboardProps) {
  const pathname = usePathname()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<"dashboard" | "applications" | "training">("dashboard")

  // 🔹 SAVE CANDIDATE PROFILE (FIXED)
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          await setDoc(
            doc(db, "candidates", user.uid),
            {
              userID: user.uid,
              Education: "B.Tech",
              Experience: "Fresher",
              Location: "Mumbai",
              disabilityType: "Visual",
              disabilityLevel: "Medium",
              preferredJobType: "Remote",
              skills: ["Python", "Excel"],
              ResumeURL: "",
              createdAt: new Date(),
            },
            { merge: true }
          )
        } catch (err) {
          console.error("Error saving profile:", err)
          toast({ variant: "destructive", title: "Profile Error", description: "Could not save profile data." })
        }
      }
    })

    return () => unsubscribe()
  }, [])

  const initials = userName
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  /* 🔹 VOICE RECOGNITION */
  const { isListening, transcript, startListening, stopListening } = useVoiceRecognition()
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (transcript) {
      setSearchQuery(transcript)
    }
  }, [transcript])

  /* 🔹 REAL DATA FETCHING */
  const [jobs, setJobs] = useState<Job[]>([])
  const [loadingJobs, setLoadingJobs] = useState(true)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const snapshot = await getDocs(collection(db, "jobs"))
        const fetchedJobs = snapshot.docs
          .map((doc) => {
            const data = doc.data()
            if (!data.Title) return null
            return {
              id: doc.id,
              title: data.Title,
              company: data.CompanyName || "Company",
              location: data.Location,
              salary: data.Salary || "Competitive",
              description: data.Description || "No description provided.",
              accessibility: Array.isArray(data.Accessibility) ? data.Accessibility : [],
              createdAt: data.createdAt
            } as Job
          })
          .filter((job): job is Job => job !== null)
        setJobs(fetchedJobs)
      } catch (err) {
        console.error("Error fetching jobs", err)
      } finally {
        setLoadingJobs(false)
      }
    }
    fetchJobs()
  }, [])

  const applications = [
    { id: 1, role: "Frontend Developer", company: "Tech Corp", status: "Under Review" },
    { id: 2, role: "UX Designer", company: "Designify", status: "Applied" },
  ]

  const courses = [
    { id: 1, title: "Web Accessibility 101", progress: 45 },
    { id: 2, title: "Python for Data Science", progress: 10 },
  ]

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-white border-r border-gray-100 p-6 fixed h-full hidden md:flex flex-col">
        {/* Profile Card */}
        <div className="bg-indigo-50 rounded-2xl p-4 flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
            {initials}
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-900 truncate max-w-[120px]">{userName}</p>
            <p className="text-xs text-gray-500">Candidate</p>
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "dashboard" ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-50"
              }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("applications")}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "applications" ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-50"
              }`}
          >
            My Applications
          </button>
          <button
            onClick={() => setActiveTab("training")}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "training" ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-50"
              }`}
          >
            Skill Training
          </button>
        </nav>

        <button
          onClick={onLogout}
          className="mt-auto flex items-center text-gray-500 hover:text-red-600 px-4 py-3 text-sm font-medium transition-colors"
        >
          Sign Out
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 md:ml-64 p-8">
        {activeTab === "dashboard" && (
          <FadeIn>
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Recommended Jobs</h1>
              <div className="relative">
                {/* Voice Search Integration */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Search jobs..."
                    className="border border-gray-300 rounded-full py-2 px-4 w-64 focus:outline-indigo-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button
                    onClick={isListening ? stopListening : startListening}
                    variant="outline"
                    className={`rounded-full ${isListening ? "bg-red-50 border-red-200 text-red-600" : ""}`}
                  >
                    {isListening ? "Listening..." : "🎤 Voice Search"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              {loadingJobs ? <p>Loading jobs...</p> : jobs
                .filter(j => j.title.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(job => (
                  <div key={job.id} onClick={() => setSelectedJob(job)} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                        <p className="text-gray-600">{job.company}</p>
                      </div>
                      {/* Match score placeholder or random for demo if not calculated */}
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">90% Match</span>
                    </div>
                    <div className="flex gap-2 mb-4 flex-wrap">
                      {job.accessibility.slice(0, 3).map((tag, i) => (
                        <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md">{tag}</span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">{job.location}</span>
                      <Button size="sm" onClick={(e) => {
                        e.stopPropagation()
                        setSelectedJob(job)
                      }}>Apply Now</Button>
                    </div>
                  </div>
                ))}
            </div>

            <JobDetailsModal
              job={selectedJob}
              isOpen={!!selectedJob}
              onClose={() => setSelectedJob(null)}
            />
          </FadeIn>
        )}

        {activeTab === "applications" && (
          <FadeIn>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Applications</h1>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {applications.map((app, i) => (
                <div key={app.id} className={`p-6 flex justify-between items-center ${i !== applications.length - 1 ? "border-b border-gray-100" : ""}`}>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{app.role}</h3>
                    <p className="text-gray-500">{app.company}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${app.status === "Applied" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          </FadeIn>
        )}

        {activeTab === "training" && (
          <FadeIn>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Skill Training</h1>
            <div className="grid md:grid-cols-2 gap-6">
              {courses.map(course => (
                <div key={course.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{course.title}</h3>
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
                  </div>
                  <Button variant="outline" className="w-full">Continue Learning</Button>
                </div>
              ))}
            </div>
          </FadeIn>
        )}
      </main>
    </div>
  )
}