"use client"

import { useEffect, useState } from "react"
import { TrendingUp, FileText, Briefcase, Users, CheckCircle, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { PostJobModal } from "./post-job-modal"
import { JobDetailsModal } from "./job-details-modal"


interface EmployerDashboardProps {
  companyName: string
  onLogout: () => void
}

export function EmployerDashboard({ companyName, onLogout }: EmployerDashboardProps) {
  const [showChecklist, setShowChecklist] = useState(false)
  const [showResources, setShowResources] = useState(false)

  // 🔹 SAVE RECRUITER PROFILE (FIXED)
  // 🔹 SAVE RECRUITER PROFILE (FIXED)
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Fetch jobs
        fetchEmployerJobs(user.uid)

        try {
          await setDoc(
            doc(db, "recruiters", user.uid),
            {
              userID: user.uid,
              CompanyName: companyName,
              ContactEmail: user.email,
              verified: true,
              createdAt: new Date(),
            },
            { merge: true }
          )
        } catch (err) {
          console.error("Error saving profile:", err)
          // Optional: Add toast here if needed
        }
      }
    })

    return () => unsubscribe()
  }, [companyName])

  /* 🔹 FETCH EMPLOYER JOBS */
  const [jobs, setJobs] = useState<any[]>([])
  const [loadingJobs, setLoadingJobs] = useState(true)
  const [selectedJob, setSelectedJob] = useState<any | null>(null)

  const fetchEmployerJobs = async (uid: string) => {
    try {
      const q = query(collection(db, "jobs"), where("employerId", "==", uid))
      const snapshot = await getDocs(q)
      const fetchedJobs = snapshot.docs.map((d: any) => ({
        id: d.id,
        title: d.data().Title,
        company: d.data().CompanyName || "My Company",
        location: d.data().Location,
        salary: d.data().Salary,
        description: d.data().Description,
        accessibility: d.data().Accessibility || [],
        createdAt: d.data().createdAt
      }))
      setJobs(fetchedJobs)
    } catch (err) {
      console.error("Error fetching jobs:", err)
    } finally {
      setLoadingJobs(false)
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchEmployerJobs(user.uid)
      } else {
        setLoadingJobs(false)
      }
    })
    return () => unsubscribe()
  }, [])

  return (
    <main className="min-h-screen p-10 bg-background">
      <h1 className="text-4xl font-bold mb-10">
        Welcome back, {companyName}
      </h1>

      <div className="grid grid-cols-3 gap-8 mb-12">
        <div className="bg-card p-8 rounded-lg border">
          <Users className="w-8 h-8 mb-4" />
          <p className="text-3xl font-bold">24</p>
          <p>Diversity Hires</p>
        </div>

        <div className="bg-card p-8 rounded-lg border">
          <TrendingUp className="w-8 h-8 mb-4" />
          <p className="text-3xl font-bold">$127,500</p>
          <p>Tax Credits</p>
        </div>

        <div className="bg-card p-8 rounded-lg border">
          <Briefcase className="w-8 h-8 mb-4" />
          <p className="text-3xl font-bold">{jobs.length}</p>
          <p>Active Jobs</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Your Posted Jobs</h2>
        <Button size="lg" onClick={() => setShowChecklist(true)}>Post Accessible Job</Button>
      </div>

      <div className="grid gap-6">
        {loadingJobs ? (
          <p>Loading your jobs...</p>
        ) : jobs.length === 0 ? (
          <div className="text-center p-10 border-2 border-dashed rounded-xl">
            <p className="text-gray-500 mb-4">You haven't posted any jobs yet.</p>
            <Button variant="outline" onClick={() => setShowChecklist(true)}>Create Your First Job</Button>
          </div>
        ) : (
          jobs.map(job => (
            <div key={job.id} onClick={() => setSelectedJob(job)} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                  <p className="text-gray-600">{job.company}</p>
                </div>
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">Active</span>
              </div>
              <div className="flex gap-2 mb-4 flex-wrap">
                {job.accessibility.slice(0, 3).map((tag: string, i: number) => (
                  <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md">{tag}</span>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{job.location}</span>
                <Button size="sm" onClick={(e) => {
                  e.stopPropagation()
                  setSelectedJob(job)
                }}>Apply (Preview)</Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Post Job Modal */}
      <PostJobModal
        isOpen={showChecklist}
        onClose={() => setShowChecklist(false)}
        onSuccess={() => {
          if (auth.currentUser) fetchEmployerJobs(auth.currentUser.uid)
        }}
      />

      <JobDetailsModal
        job={selectedJob}
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
      />
    </main>
  )
}
