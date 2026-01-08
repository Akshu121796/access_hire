"use client"

import { useState } from "react"
import { Search, MapPin, CheckCircle2, HandshakeIcon, HeadphonesIcon as HeadphoneIcon, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"

interface JobDiscoveryProps {
  highContrast: boolean
}

export function JobDiscovery({ highContrast }: JobDiscoveryProps) {
  const [filters, setFilters] = useState({
    remote: false,
    screenReader: false,
    flexibleHours: false,
    neurodiverse: false,
  })

  const jobs = [
    {
      id: "job-1",
      title: "Product Designer",
      company: "TechCorp",
      location: "San Francisco, CA",
      summary:
        "Design intuitive user interfaces for our platform. Work with cross-functional teams to create accessible experiences.",
      accessibility: [
        { icon: HeadphoneIcon, label: "Sign Language Support" },
        { icon: Zap, label: "Ergonomic Station" },
        { icon: CheckCircle2, label: "Assistive Tech Provided" },
        { icon: HandshakeIcon, label: "Flexible Schedule" },
      ],
    },
    {
      id: "job-2",
      title: "Content Strategist",
      company: "MediaHub",
      location: "Remote",
      summary:
        "Create compelling content and manage editorial calendars. Collaborate with writers and editors on inclusive storytelling.",
      accessibility: [
        { icon: CheckCircle2, label: "Screen Reader Friendly" },
        { icon: Zap, label: "Work From Home" },
        { icon: HandshakeIcon, label: "Flexible Hours" },
        { icon: HeadphoneIcon, label: "Captions Provided" },
      ],
    },
    {
      id: "job-3",
      title: "QA Engineer",
      company: "SoftWare Solutions",
      location: "Remote",
      summary:
        "Test software for bugs and accessibility compliance. Ensure all features meet WCAG standards and user needs.",
      accessibility: [
        { icon: Zap, label: "Flexible Breaks" },
        { icon: CheckCircle2, label: "Assistive Tech Support" },
        { icon: HandshakeIcon, label: "Neurodiverse Friendly" },
        { icon: HeadphoneIcon, label: "Remote Work" },
      ],
    },
  ]

  const handleApply = async (job: any) => {
    if (!auth.currentUser) {
      alert("Please login to apply")
      return
    }

    await addDoc(collection(db, "applications"), {
      jobId: job.id,
      jobRole: job.title,
      companyName: job.company,
      candidateId: auth.currentUser.uid,
      status: "Applied",
      appliedAt: serverTimestamp(),
    })

    alert("Application submitted")
  }

  return (
    <main className="flex-1" role="main">
      <h1 className="text-4xl font-bold text-gray-900 mb-12 text-balance">
        Accessible Opportunities For You
      </h1>

      <div className="mb-12">
        <div className="relative mb-8">
          <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-8 h-8 text-gray-500" />
          <Input
            placeholder="Search by job title or skill..."
            className="w-full pl-16 pr-6 py-6 text-xl border-2 border-gray-300 rounded-lg"
          />
        </div>
      </div>

      <div className="space-y-8">
        {jobs.map((job) => (
          <article key={job.id} className="bg-white border-4 border-gray-300 rounded-lg p-8">
            <h2 className="text-3xl font-bold">{job.title}</h2>
            <p className="text-xl">{job.company} • {job.location}</p>
            <p className="mt-4">{job.summary}</p>

            <Button
              className="mt-6 bg-blue-600 text-white"
              onClick={() => handleApply(job)}
            >
              Apply Now
            </Button>
          </article>
        ))}
      </div>
    </main>
  )
}
