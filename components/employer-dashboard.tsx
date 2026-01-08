"use client"

import React, { useState, useEffect } from "react"
import { Plus, Briefcase, MapPin, DollarSign, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { auth, db } from "@/lib/firebase"
import { collection, addDoc, query, where, onSnapshot, getDocs, orderBy, serverTimestamp } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"

interface Job {
  id: string
  title: string
  company: string
  location: string
  description: string
  salary: string
  tags: string[]
  employerId: string
  createdAt: any
}

interface EmployerDashboardProps {
  onLogout: () => void
  userName?: string
}

export function EmployerDashboard({ onLogout, userName }: EmployerDashboardProps) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  // Form State
  const [newJob, setNewJob] = useState({
    title: "",
    location: "",
    salary: "",
    tags: "",
    description: ""
  })

  // Auth User State
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  // Fetch Jobs
  useEffect(() => {
    if (!user) return

    const q = query(
      collection(db, "jobs"),
      where("employerId", "==", user.uid),
      orderBy("createdAt", "desc")
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const jobsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job))
        setJobs(jobsData)
        setLoading(false)
      },
      async (error) => {
        console.error("Firestore snapshot error:", error)
        // If the query requires a composite index, fall back to a single-field query
        if (error && (error.code === "failed-precondition" || (error.message && error.message.includes("requires an index")))) {
          try {
            const fallbackQ = query(collection(db, "jobs"), where("employerId", "==", user.uid))
            const fallbackSnap = await getDocs(fallbackQ)
            const jobsData = fallbackSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job))
            const toMillis = (ts: any) => {
              if (!ts) return 0
              if (typeof ts === "number") return ts
              if (ts.toDate) return ts.toDate().getTime()
              return 0
            }
            jobsData.sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt))
            setJobs(jobsData)
          } catch (e) {
            console.error("Fallback fetch failed:", e)
          } finally {
            setLoading(false)
          }
        } else {
          setLoading(false)
        }
      }
    )

    return () => unsubscribe()
  }, [user])

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Attempting to post job...", newJob)

    if (!user) {
      console.error("No user found when trying to post job")
      toast({ title: "Error", description: "You must be logged in to post a job.", variant: "destructive" })
      return
    }

    if (!newJob.title || !newJob.location || !newJob.description) {
      toast({ title: "Error", description: "Please fill in all required fields.", variant: "destructive" })
      return
    }

    setSubmitting(true)

    try {
      const jobData = {
        title: newJob.title,
        company: user.displayName || "Unknown Company",
        location: newJob.location,
        salary: newJob.salary,
        description: newJob.description,
        tags: newJob.tags.split(",").map(tag => tag.trim()).filter(tag => tag !== ""),
        employerId: user.uid,
        createdAt: serverTimestamp()
      }
      console.log("Writing to Firestore:", jobData)

      await addDoc(collection(db, "jobs"), jobData)

      console.log("Job posted successfully")
      toast({ title: "Success", description: "Job posted successfully!" })
      setOpen(false)
      setNewJob({ title: "", location: "", salary: "", tags: "", description: "" })
    } catch (error) {
      console.error("Error adding document: ", error)
      toast({ title: "Error", description: "Failed to post job. Check console for details.", variant: "destructive" })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
            <p className="text-gray-600">Manage your job postings.</p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-primary text-primary-foreground font-semibold">
                <Plus className="w-5 h-5 mr-2" /> Post a Job
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Post a New Job</DialogTitle>
              </DialogHeader>
              <form onSubmit={handlePostJob} className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input id="title" required value={newJob.title} onChange={e => setNewJob({ ...newJob, title: e.target.value })} placeholder="e.g. Senior Frontend Engineer" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" required value={newJob.location} onChange={e => setNewJob({ ...newJob, location: e.target.value })} placeholder="e.g. Remote / New York" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="salary">Salary Range (Optional)</Label>
                    <Input id="salary" value={newJob.salary} onChange={e => setNewJob({ ...newJob, salary: e.target.value })} placeholder="e.g. $100k - $120k" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tags">Tags (Comma separated)</Label>
                  <Input id="tags" value={newJob.tags} onChange={e => setNewJob({ ...newJob, tags: e.target.value })} placeholder="React, Accessiblity, Remote" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" required value={newJob.description} onChange={e => setNewJob({ ...newJob, description: e.target.value })} placeholder="Job details..." className="h-40" />
                </div>
                <Button type="submit" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {submitting ? "Posting..." : "Publish Job"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No jobs posted yet</h3>
            <p className="text-gray-500 mb-6">Create your first job posting to attract candidates.</p>
            <Button onClick={() => setOpen(true)}>Post a Job</Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {jobs.map(job => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900">{job.title}</CardTitle>
                    <p className="text-sm text-gray-500 font-medium mt-1">{job.company}</p>
                  </div>
                  <div className="flex gap-2">
                    {/* Edit/Delete actions could go here */}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {job.location}
                    </span>
                    {job.salary && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" /> {job.salary}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 rounded-md text-xs font-semibold text-gray-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
