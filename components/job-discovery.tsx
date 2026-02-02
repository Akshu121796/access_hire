"use client"

import { useEffect, useState } from "react"
import { Search, MapPin, CheckCircle2, HandshakeIcon, HeadphonesIcon as HeadphoneIcon, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { addDoc,serverTimestamp,collection, getDocs } from "firebase/firestore"
import { auth,db } from "@/lib/firebase"

interface JobDiscoveryProps {
  highContrast: boolean
}

interface Job {
  id: string
  title: string
  company: string
  location: string
  summary: string
  accessibility: { icon: any; label: string }[]
  remote?: boolean
  screenReader?: boolean
  flexibleHours?: boolean
  neurodiverse?: boolean
}

export function JobDiscovery({ highContrast }: JobDiscoveryProps) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  const [filters, setFilters] = useState({
    remote: false,
    screenReader: false,
    flexibleHours: false,
    neurodiverse: false,
  })

const handleApply = async (jobId: string) => {
  if (!auth.currentUser) {
    alert("Please login first")
    return
  }

  await addDoc(collection(db, "applications"), {
    jobId,
    candidateId: auth.currentUser.uid,
    recruiterId: "",
    status: "Applied",
    appliedAt: serverTimestamp(),
  })

  alert("Application submitted")
}
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const snapshot = await getDocs(collection(db, "jobs"))

        const jobsData: Job[] = snapshot.docs.map((doc) => {
          const data = doc.data()

          return {
            id: doc.id,
            title: data.Title,
            company: data.CompanyName,
            location: data.Location,
            summary: data.Description,
            remote: data.isRemote,
            screenReader: data.screenReader,
            flexibleHours: data.flexibleHours,
            neurodiverse: data.neurodiverse,
            accessibility: (data.Accessibility || []).map((item: string) => {
              switch (item) {
                case "Screen Reader":
                  return { icon: CheckCircle2, label: "Screen Reader Friendly" }
                case "Remote":
                  return { icon: Zap, label: "Remote Work" }
                case "Flexible Hours":
                  return { icon: HandshakeIcon, label: "Flexible Hours" }
                case "Sign Language":
                  return { icon: HeadphoneIcon, label: "Sign Language Support" }
                default:
                  return { icon: CheckCircle2, label: item }
              }
            }),
          }
        })

        setJobs(jobsData)
      } catch (err) {
        console.error("Error fetching jobs:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  
  const filteredJobs = jobs.filter((job) => {
    if (
      search &&
      !job.title.toLowerCase().includes(search.toLowerCase()) &&
      !job.company.toLowerCase().includes(search.toLowerCase())
    )
      return false

    if (filters.remote && !job.remote) return false
    if (filters.screenReader && !job.screenReader) return false
    if (filters.flexibleHours && !job.flexibleHours) return false
    if (filters.neurodiverse && !job.neurodiverse) return false

    return true
  })

  return (
    <main className="flex-1" role="main">
      {/* Page Title */}
      <h1 className="text-4xl font-bold text-gray-900 mb-12 text-balance">
        Accessible Opportunities For You
      </h1>

      {/* Search Section */}
      <div className="mb-12">
        <div className="relative mb-8">
          <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-8 h-8 text-gray-500" />
          <Input
            placeholder="Search by job title or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-16 pr-6 py-6 text-xl border-2 border-gray-300 rounded-lg focus:outline-4 focus:outline-offset-2 focus:outline-blue-600"
            aria-label="Search jobs by title or skill"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-4">
          {[
            { key: "remote", label: "Remote Only" },
            { key: "screenReader", label: "Screen Reader Friendly" },
            { key: "flexibleHours", label: "Flexible Hours" },
            { key: "neurodiverse", label: "Neurodiverse Inclusive" },
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  [filter.key]: !prev[filter.key as keyof typeof filters],
                }))
              }
              className={`px-6 py-4 text-lg font-bold rounded-lg transition-all focus:outline-4 focus:outline-offset-2 focus:outline-blue-600 ${
                filters[filter.key as keyof typeof filters]
                  ? "bg-blue-600 text-white border-2 border-blue-700"
                  : "bg-gray-100 text-gray-900 border-2 border-gray-300 hover:bg-gray-200"
              }`}
              aria-pressed={filters[filter.key as keyof typeof filters]}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Job Cards */}
      {loading ? (
        <p className="text-gray-500 text-xl">Loading jobs...</p>
      ) : (
        <div className="space-y-8">
          {filteredJobs.map((job) => (
            <article
              key={job.id}
              className="bg-white border-4 border-gray-300 rounded-lg p-8 hover:border-blue-600 transition-all"
            >
              {/* Job Info */}
              <div className="flex justify-between items-start mb-8 gap-4">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h2>
                  <div className="flex items-center gap-6 text-xl text-gray-700">
                    <span className="font-semibold">{job.company}</span>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-gray-600" />
                      {job.location}
                    </div>
                  </div>
                </div>
              </div>

              {/* Accessibility Features */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Accessibility Features:
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {job.accessibility.map((feature, idx) => (
                    <div
                      key={idx}
                      className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 flex items-center gap-3"
                    >
                      <feature.icon className="w-6 h-6 text-blue-600" />
                      <span className="font-semibold text-gray-900">{feature.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="flex justify-between items-end gap-8">
                <p className="text-xl text-gray-700 leading-relaxed max-w-2xl">
                  {job.summary}
                </p>
                <Button onClick={() => handleApply(job.id)}>
                  Apply Now
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}
