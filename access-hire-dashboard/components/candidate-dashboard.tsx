"use client"

import React, { useRef, useState } from "react"
import { Mic, Star, MapPin, Briefcase, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StaggerContainer, StaggerItem, FadeIn, ScaleButton, HoverCard } from "@/components/ui/motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useVoiceRecognition } from "@/hooks/use-voice-recognition"
import { useToast } from "@/hooks/use-toast"

interface CandidateDashboardProps {
  onLogout: () => void
  userName?: string
}

export function CandidateDashboard({ onLogout, userName = "Jane Doe" }: CandidateDashboardProps) {
  const pathname = usePathname()
  const firstName = userName.split(" ")[0]
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  // Search and voice recognition state
  const [searchQuery, setSearchQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const { isListening, transcript, isSupported, error, startListening, stopListening, clearTranscript } = useVoiceRecognition()
  const { toast } = useToast()

  // Resume upload state
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [resumeFileName, setResumeFileName] = useState<string | null>(null)

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return

    const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!allowed.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or Word document.",
        variant: "destructive",
      })
      e.currentTarget.value = ""
      return
    }

    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5 MB.",
        variant: "destructive",
      })
      e.currentTarget.value = ""
      return
    }

    // For now we only keep the filename and show a toast. Real upload can be implemented later.
    setResumeFileName(file.name)
    toast({
      title: "Resume selected",
      description: `Selected file: ${file.name}`,
    })
    e.currentTarget.value = ""
  }

  // Search suggestions database
  const allSearchSuggestions = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "React Developer",
    "TypeScript",
    "Remote OK",
    "Flexible Hours",
    "Sign Language Support",
    "Career Development",
    "Tech Corp",
    "Creative Studio",
    "Design Labs",
    "UX Designer",
    "Content Writer",
    "Product Manager",
    "Data Scientist",
    "San Francisco",
    "New York",
    "Remote",
  ]

  // Get filtered suggestions based on current query
  const getFilteredSuggestions = (query: string) => {
    if (!query.trim()) return []
    const lowerQuery = query.toLowerCase()
    return allSearchSuggestions.filter(
      (suggestion) =>
        suggestion.toLowerCase().includes(lowerQuery) &&
        suggestion.toLowerCase() !== lowerQuery
    ).slice(0, 5)
  }

  const suggestions = getFilteredSuggestions(searchQuery)

  // Update search query when voice transcript is received
  React.useEffect(() => {
    if (transcript) {
      setSearchQuery(transcript)
      clearTranscript()
      toast({
        title: "Voice Search Complete",
        description: `Searching for: "${transcript}"`,
      })
    }
  }, [transcript, clearTranscript, toast])

  // Handle voice recognition errors
  React.useEffect(() => {
    if (error) {
      toast({
        title: "Voice Search Error",
        description: error,
        variant: "destructive",
      })
    }
  }, [error, toast])

  const navigationItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "My Applications", path: "/my-applications" },
    { name: "Skill Training", path: "/skill-training" },
  ]

  const jobs = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "Tech Corp",
      location: "Remote",
      tags: ["Remote OK", "Flexible Hours", "Remote Interview"],
      matches: 98,
      color: "bg-blue-50 text-blue-700 border-blue-100",
    },
    {
      id: 2,
      title: "Content Writer",
      company: "Creative Studio",
      location: "New York, NY",
      tags: ["Remote OK", "Sign Language Support"],
      matches: 85,
      color: "bg-purple-50 text-purple-700 border-purple-100",
    },
    {
      id: 3,
      title: "UX Researcher",
      company: "Design Labs",
      location: "San Francisco, CA",
      tags: ["Accessible Workplace", "Career Development"],
      matches: 92,
      color: "bg-teal-50 text-teal-700 border-teal-100",
    },
  ]

  return (
    <main className="min-h-screen bg-gray-50 relative z-10 flex flex-col md:flex-row">
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
                <Link
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
                </Link>
              )
            })}
          </nav>
        </FadeIn>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        <FadeIn delay={0.2} direction="up" className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Hello, {firstName}! ☀️</h1>
            <p className="text-gray-600">We found <span className="font-semibold text-indigo-600">{jobs.length} new opportunities</span> for you today.</p>
          </div>

          <div className="flex items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
              aria-hidden="true"
            />

            <Button
              variant="outline"
              className="gap-2 bg-white hover:bg-gray-50 text-gray-700 border-gray-200 shadow-sm"
              aria-label="Upload your resume"
              onClick={handleUploadClick}
            >
              <Briefcase className="w-4 h-4 text-indigo-500" aria-hidden="true" />
              Upload Resume
            </Button>

            {resumeFileName && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">Selected:</span> {resumeFileName}
              </div>
            )}
          </div>
        </FadeIn>

        {/* Search Bar */}
        <FadeIn delay={0.3} className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1 group">
            <button
              onClick={() => {
                if (searchQuery.trim()) {
                  setShowSuggestions(false)
                  toast({
                    title: "Search Initiated",
                    description: `Searching for: "${searchQuery}"`,
                  })
                }
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-indigo-500 group-focus-within:text-indigo-500 transition-colors cursor-pointer"
              aria-label="Perform search"
              title="Click to search"
            >
              <Search className="w-5 h-5" aria-hidden="true" />
            </button>
            <input
              type="text"
              placeholder="Search by title, skill, or company..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setShowSuggestions(true)
              }}
              onFocus={() => searchQuery && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="relative w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 text-gray-900 placeholder:text-gray-400 transition-all shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-md"
              aria-label="Search jobs"
              aria-autocomplete="list"
              aria-controls="search-suggestions"
              aria-expanded={showSuggestions && suggestions.length > 0}
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("")
                  setShowSuggestions(false)
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            )}
            
            {/* Search Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                id="search-suggestions"
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg z-50"
                role="listbox"
              >
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearchQuery(suggestion)
                      setShowSuggestions(false)
                      toast({
                        title: "Search Updated",
                        description: `Now searching for: "${suggestion}"`,
                      })
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-indigo-50 transition-colors text-gray-700 text-sm border-b border-gray-100 last:border-b-0 flex items-center gap-2 focus:outline-none focus:bg-indigo-50"
                    role="option"
                  >
                    <Search className="w-4 h-4 text-gray-400" aria-hidden="true" />
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
          <ScaleButton>
            <div
              className={`bg-gradient-to-r from-blue-600 to-indigo-600 text-white h-auto py-4 px-8 rounded-full flex items-center shadow-lg shadow-indigo-200 transition-all ${
                isListening ? 'bg-gradient-to-r from-red-500 to-red-600 shadow-red-200' : 'hover:shadow-xl'
              } ${!isSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
              role="button"
              aria-label={isListening ? "Stop voice search" : "Start voice search for jobs"}
              onClick={isSupported ? (isListening ? stopListening : startListening) : undefined}
              title={!isSupported ? "Voice search is not supported in this browser" : ""}
            >
              <Mic className={`w-5 h-5 mr-2 transition-transform ${isListening ? 'animate-pulse' : ''}`} aria-hidden="true" />
              {isListening ? "Listening..." : "Voice Search"}
            </div>
          </ScaleButton>
        </FadeIn>

        {/* Job Cards */}
        {(() => {
          const filteredJobs = jobs.filter((job) =>
            searchQuery === "" ||
            job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
          );

          return (
            <>
              {filteredJobs.length > 0 && (
                <div className="mb-6">
                  <p className="text-gray-600">
                    Showing {filteredJobs.length} job{filteredJobs.length === 1 ? '' : 's'}
                    {searchQuery ? ` matching "${searchQuery}"` : ''}
                  </p>
                </div>
              )}

              <StaggerContainer className="grid gap-6" role="main" aria-label="Job opportunities">
                {filteredJobs.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" aria-hidden="true" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No jobs found</h3>
                    <p className="text-gray-500">
                      {searchQuery ? `No jobs match "${searchQuery}". Try adjusting your search terms.` : "No jobs are currently available."}
                    </p>
                  </div>
                ) : (
                  filteredJobs.map((job) => (
                    <StaggerItem key={job.id}>
              <HoverCard
                className="group relative bg-white p-6 md:p-8 rounded-3xl border border-gray-100 hover:border-indigo-100 transition-colors duration-300 shadow-sm"
                role="article"
                aria-labelledby={`job-title-${job.id}`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 id={`job-title-${job.id}`} className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                      <span className="px-2 py-1 rounded text-xs font-bold bg-green-50 text-green-700 border border-green-100" aria-label={`${job.matches}% match with your profile`}>
                        {job.matches}% Match
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm md:text-base">
                      <span className="flex items-center gap-1.5" aria-label={`Company: ${job.company}`}>
                        <Briefcase className="w-4 h-4 text-gray-400" aria-hidden="true" /> {job.company}
                      </span>
                      <span className="flex items-center gap-1.5" aria-label={`Location: ${job.location}`}>
                        <MapPin className="w-4 h-4 text-gray-400" aria-hidden="true" /> {job.location}
                      </span>
                    </div>
                  </div>

                  <ScaleButton className="shrink-0">
                    <div className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100 px-8 py-3 rounded-full font-semibold transition-colors" role="button" aria-label={`Apply for ${job.title} position at ${job.company}`}>
                      Apply Now
                    </div>
                  </ScaleButton>
                </div>

                {/* Accessibility Tags */}
                <div className="flex flex-wrap gap-2" role="list" aria-label="Accessibility features">
                  {job.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`bg-white border border-gray-100 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 text-gray-600 hover:border-indigo-200 hover:text-indigo-700 transition-colors cursor-default`}
                      role="listitem"
                      aria-label={`Accessibility feature: ${tag}`}
                    >
                      <Star size={14} className="fill-amber-400 text-amber-400" aria-hidden="true" />
                      {tag}
                    </span>
                  ))}
                </div>
              </HoverCard>
            </StaggerItem>
                  ))
                )}
              </StaggerContainer>
            </>
          )
        })()}
      </div>
    </main>
  )
}
