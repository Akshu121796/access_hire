"use client"

import { useState } from "react"
import { Search, MapPin, CheckCircle2, HandshakeIcon, HeadphonesIcon as HeadphoneIcon, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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
      id: 1,
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
      id: 2,
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
      id: 3,
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

  return (
    <main className="flex-1" role="main">
      {/* Page Title */}
      <h1 className="text-4xl font-bold text-gray-900 mb-12 text-balance">Accessible Opportunities For You</h1>

      {/* Search Section */}
      <div className="mb-12">
        <div className="relative mb-8">
          <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-8 h-8 text-gray-500" />
          <Input
            placeholder="Search by job title or skill..."
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
                setFilters((prev) => ({ ...prev, [filter.key]: !prev[filter.key as keyof typeof filters] }))
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
      <div className="space-y-8">
        {jobs.map((job) => (
          <article
            key={job.id}
            className="bg-white border-4 border-gray-300 rounded-lg p-8 hover:border-blue-600 transition-all focus-within:outline-4 focus-within:outline-offset-2 focus-within:outline-blue-600"
          >
            {/* Top Row - Job Info */}
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
              <h3 className="text-xl font-bold text-gray-900 mb-4">Accessibility Features:</h3>
              <div className="grid grid-cols-2 gap-4">
                {job.accessibility.map((feature, idx) => (
                  <div key={idx} className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 flex items-center gap-3">
                    <feature.icon className="w-6 h-6 text-blue-600 flex-shrink-0" />
                    <span className="font-semibold text-gray-900">{feature.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary and Apply Button */}
            <div className="flex justify-between items-end gap-8">
              <p className="text-xl text-gray-700 leading-relaxed max-w-2xl">{job.summary}</p>
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold px-8 py-8 flex-shrink-0 focus:outline-4 focus:outline-offset-2 focus:outline-blue-600"
                aria-label={`Apply for ${job.title} at ${job.company}`}
              >
                Apply Now
              </Button>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}
