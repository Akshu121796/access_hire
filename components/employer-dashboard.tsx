"use client"

import { TrendingUp, FileText, Briefcase, Users, CheckCircle, Download, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface EmployerDashboardProps {
  companyName: string
  onLogout: () => void
}

export function EmployerDashboard({ companyName, onLogout }: EmployerDashboardProps) {
  const [showChecklist, setShowChecklist] = useState(false)
  const [showResources, setShowResources] = useState(false)

  // Dummy data for checklist items
  const checklistItems = [
    {
      id: 1,
      title: "Pre-Interview Preparation",
      items: [
        "Review candidate's accessibility requirements from their profile",
        "Ensure interview platform supports screen readers",
        "Prepare alternative communication methods if needed",
        "Schedule interview at candidate's preferred time considering accommodations"
      ]
    },
    {
      id: 2,
      title: "During Interview",
      items: [
        "Use clear, simple language and avoid idioms",
        "Allow extra time for responses if requested",
        "Provide written versions of verbal questions when possible",
        "Ensure video/audio quality is optimal for assistive technologies"
      ]
    },
    {
      id: 3,
      title: "Post-Interview Process",
      items: [
        "Provide feedback in writing as well as verbally",
        "Document any accommodations provided during the process",
        "Ensure offer letters are accessible (PDF with proper tagging)",
        "Follow up on any accessibility concerns raised"
      ]
    }
  ]

  // Dummy data for downloadable resources
  const resources = [
    {
      id: 1,
      title: "WCAG 2.1 Compliance Checklist",
      description: "Complete guide to web accessibility standards",
      type: "PDF",
      size: "2.4 MB",
      downloadUrl: "#"
    },
    {
      id: 2,
      title: "Inclusive Job Posting Template",
      description: "Word template for creating accessible job descriptions",
      type: "DOCX",
      size: "156 KB",
      downloadUrl: "#"
    },
    {
      id: 3,
      title: "Accessibility Interview Guide",
      description: "Best practices for conducting inclusive interviews",
      type: "PDF",
      size: "1.8 MB",
      downloadUrl: "#"
    },
    {
      id: 4,
      title: "Disability Inclusion Policy Template",
      description: "Sample workplace inclusion policies",
      type: "PDF",
      size: "892 KB",
      downloadUrl: "#"
    }
  ]

  const handleViewChecklist = () => {
    setShowChecklist(!showChecklist)
    setShowResources(false) // Close resources if open
  }

  const handleDownloadResources = () => {
    setShowResources(!showResources)
    setShowChecklist(false) // Close checklist if open
  }

  const handleDownloadResource = (resource: typeof resources[0]) => {
    // In a real app, this would trigger an actual download
    alert(`Downloading: ${resource.title}\n\nIn a real application, this would download the ${resource.type} file.`)
  }

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <h1 className="text-4xl font-bold text-foreground mb-12">Welcome back, {companyName}</h1>

        {/* Analytics Row */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-card p-8 rounded-lg border-2 border-border">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <Users className="text-primary-foreground w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Diversity Hires</h3>
            </div>
            <p className="text-4xl font-bold text-primary">24</p>
            <p className="text-lg text-muted-foreground mt-2">+8 this quarter</p>
          </div>

          <div className="bg-card p-8 rounded-lg border-2 border-border">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <TrendingUp className="text-primary-foreground w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Tax Credits Earned</h3>
            </div>
            <p className="text-4xl font-bold text-primary">$127,500</p>
            <p className="text-lg text-muted-foreground mt-2">For this fiscal year</p>
          </div>

          <div className="bg-card p-8 rounded-lg border-2 border-border">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <Briefcase className="text-primary-foreground w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Active Listings</h3>
            </div>
            <p className="text-4xl font-bold text-primary">12</p>
            <p className="text-lg text-muted-foreground mt-2">Open positions</p>
          </div>
        </div>

        {/* Toolkit Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-8">Employer Toolkit</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card p-8 rounded-lg border-2 border-border">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                  <FileText className="text-primary-foreground w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Inclusive Interview Checklist</h3>
              </div>
              <p className="text-lg text-muted-foreground mb-6">
                Ensure your interview process is accessible and inclusive for all candidates.
              </p>
              <Button
                size="lg"
                variant="outline"
                className="w-full py-6 h-auto text-lg bg-transparent"
                onClick={handleViewChecklist}
                aria-expanded={showChecklist}
                aria-controls="checklist-content"
              >
                {showChecklist ? "Hide Checklist" : "View Checklist"}
              </Button>

              {/* Expanded Checklist Content */}
              {showChecklist && (
                <div id="checklist-content" className="mt-6 space-y-6 animate-in slide-in-from-top-2 duration-300">
                  {checklistItems.map((section) => (
                    <div key={section.id} className="border-t border-border pt-4">
                      <h4 className="text-xl font-semibold text-foreground mb-3">{section.title}</h4>
                      <ul className="space-y-2">
                        {section.items.map((item, index) => (
                          <li key={index} className="flex items-start gap-3 text-muted-foreground">
                            <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 mt-6">
                    <p className="text-sm text-primary font-medium">
                      💡 Tip: Use this checklist for every interview to ensure consistent accessibility practices across your organization.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-card p-8 rounded-lg border-2 border-border">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                  <FileText className="text-primary-foreground w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Accessibility Compliance Docs</h3>
              </div>
              <p className="text-lg text-muted-foreground mb-6">
                Access templates and guidelines for accessibility compliance and best practices.
              </p>
              <Button
                size="lg"
                variant="outline"
                className="w-full py-6 h-auto text-lg bg-transparent"
                onClick={handleDownloadResources}
                aria-expanded={showResources}
                aria-controls="resources-content"
              >
                {showResources ? "Hide Resources" : "Download Resources"}
              </Button>

              {/* Expanded Resources Content */}
              {showResources && (
                <div id="resources-content" className="mt-6 space-y-4 animate-in slide-in-from-top-2 duration-300">
                  {resources.map((resource) => (
                    <div key={resource.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <h5 className="font-semibold text-foreground">{resource.title}</h5>
                        <p className="text-sm text-muted-foreground">{resource.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded">{resource.type}</span>
                          <span>{resource.size}</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadResource(resource)}
                        className="ml-4"
                        aria-label={`Download ${resource.title}`}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                  <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 mt-6">
                    <p className="text-sm text-primary font-medium flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Need more resources? Visit our comprehensive accessibility library at accesshire.com/resources
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Post Job Button */}
        <Button size="lg" className="w-full py-8 h-auto text-2xl font-bold">
          Post Accessible Job
        </Button>
      </div>
    </main>
  )
}
