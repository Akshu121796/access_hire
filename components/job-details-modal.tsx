"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Share2, MapPin, DollarSign, Clock, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

export interface Job {
    id: string
    title: string
    company: string
    location: string
    salary: string
    description: string
    accessibility: string[]
    createdAt?: any
}

interface JobDetailsModalProps {
    job: Job | null
    isOpen: boolean
    onClose: () => void
}

export function JobDetailsModal({ job, isOpen, onClose }: JobDetailsModalProps) {
    const { toast } = useToast()
    const [applying, setApplying] = useState(false)

    if (!job) return null

    const handleApply = async () => {
        if (!auth.currentUser) {
            toast({
                title: "Login Required",
                description: "Please login to apply for jobs.",
                variant: "destructive",
            })
            return
        }

        setApplying(true)
        try {
            await addDoc(collection(db, "applications"), {
                jobId: job.id,
                jobRole: job.title,
                CompanyName: job.company, // Store for easy display
                CandidateID: auth.currentUser.uid,
                Status: "Applied",
                appliedAt: serverTimestamp(),
            })

            toast({
                title: "Applied Successfully! 🎉",
                description: `You have applied to ${job.title} at ${job.company}.`,
                duration: 3000,
            })
            onClose()
        } catch (error) {
            console.error("Error applying:", error)
            toast({
                title: "Application Failed",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
            })
        } finally {
            setApplying(false)
        }
    }

    // Calculate time ago
    const timeAgo = job.createdAt ? "Recently" : "Recently" // Placeholder logic

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto p-0 gap-0 border-0 bg-gray-50/50">

                {/* Header Section */}
                <div className="bg-white p-8 border-b border-gray-100">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <DialogTitle className="text-3xl font-bold text-gray-900 mb-2">{job.title}</DialogTitle>
                            <div className="flex items-center gap-2 text-gray-600 font-medium">
                                <span className="uppercase tracking-wide text-sm font-bold">{job.company}</span>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="rounded-full bg-gray-100 text-gray-600">
                            <Share2 className="w-5 h-5" />
                        </Button>
                    </div>

                    <div className="flex gap-4 text-sm font-semibold text-gray-600">
                        <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-lg">
                            <MapPin className="w-4 h-4 text-purple-600" />
                            {job.location}
                        </div>
                        {job.salary && (
                            <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-lg text-green-700">
                                <DollarSign className="w-4 h-4" />
                                {job.salary}
                            </div>
                        )}
                        <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-lg text-blue-700">
                            <Clock className="w-4 h-4" />
                            {timeAgo}
                        </div>
                    </div>
                </div>

                <div className="p-8 grid md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="text-purple-600">💼</span> Job Description
                            </h3>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {job.description}
                            </p>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Accessibility & Perks */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Accessibility & Perks</h3>
                            <div className="flex flex-wrap gap-2">
                                {job.accessibility.map((tag, i) => (
                                    <Badge key={i} variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1 text-sm">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Apply CTA */}
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl shadow-lg text-white text-center">
                            <h3 className="text-xl font-bold mb-2">Ready to apply?</h3>
                            <p className="opacity-90 text-sm mb-6">Join {job.company} and make an impact.</p>
                            <Button
                                onClick={handleApply}
                                className="w-full bg-white text-blue-700 hover:bg-blue-50 font-bold h-12 rounded-xl text-lg transition-transform active:scale-95"
                                disabled={applying}
                            >
                                {applying ? "Applying..." : "Apply Now 🚀"}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
