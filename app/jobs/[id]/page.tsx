"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { TopNavigation } from "@/components/top-navigation"
import { Footer } from "@/components/footer"
import { useHighContrast } from "@/hooks/use-high-contrast"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Briefcase, MapPin, DollarSign, Clock, Calendar, Share2, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"

interface Job {
    id: string
    title: string
    company: string
    location: string
    description: string
    salary: string
    tags: string[]
    createdAt: any
}

export default function JobDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const { toast } = useToast()
    const [highContrast, setHighContrast] = useHighContrast()

    const [job, setJob] = useState<Job | null>(null)
    const [loading, setLoading] = useState(true)
    const [applying, setApplying] = useState(false)

    useEffect(() => {
        async function fetchJob() {
            if (!params.id) return

            try {
                const docRef = doc(db, "jobs", params.id as string)
                const docSnap = await getDoc(docRef)

                if (docSnap.exists()) {
                    setJob({ id: docSnap.id, ...docSnap.data() } as Job)
                } else {
                    console.log("No such job!")
                }
            } catch (error) {
                console.error("Error getting job:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchJob()
    }, [params.id])

    const handleApply = () => {
        setApplying(true)
        // Simulate API call
        setTimeout(() => {
            setApplying(false)
            toast({
                title: "Application Submitted! 🎉",
                description: `You have successfully applied for ${job?.title}.`,
            })
        }, 1500)
    }

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href)
        toast({ title: "Link Copied", description: "Job link copied to clipboard." })
    }

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    if (!job) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold">Job Not Found</h1>
                <Button onClick={() => router.push("/dashboard")}>Return to Dashboard</Button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <TopNavigation
                highContrast={highContrast}
                onToggleContrast={setHighContrast}
                onLoginClick={() => router.push("/auth")}
                currentView="candidate-dash text-gray-900"
                companyName="AccessHire"
                onLogoClick={() => router.push("/")}
            />

            <main className="flex-1 max-w-4xl mx-auto w-full p-6 md:p-10">
                <Button
                    variant="ghost"
                    className="mb-6 pl-0 hover:bg-transparent hover:text-indigo-600"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                </Button>

                <div className="grid gap-8">
                    {/* Header Section */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-8 -mt-8 opacity-50" />

                        <div className="relative z-10">
                            <div className="flex justify-between items-start gap-4 mb-4">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{job.title}</h1>
                                    <div className="flex items-center gap-2 text-xl text-gray-600 font-medium">
                                        <Briefcase className="w-5 h-5" />
                                        {job.company}
                                    </div>
                                </div>
                                <Button variant="outline" size="icon" onClick={handleShare}>
                                    <Share2 className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="flex flex-wrap gap-4 mt-6 text-gray-600">
                                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                    <MapPin className="w-4 h-4 text-indigo-500" />
                                    {job.location}
                                </div>
                                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                    <DollarSign className="w-4 h-4 text-green-600" />
                                    {job.salary || "Competitive"}
                                </div>
                                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                    <Clock className="w-4 h-4 text-blue-500" />
                                    {job.createdAt?.toDate ? formatDistanceToNow(job.createdAt.toDate(), { addSuffix: true }) : "Recently"}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="md:col-span-2 space-y-8">
                            <Card className="p-8 border-gray-100 shadow-sm rounded-3xl">
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-indigo-500" />
                                    Job Description
                                </h2>
                                <div className="prose prose-gray max-w-none text-gray-600 whitespace-pre-wrap leading-relaxed">
                                    {job.description}
                                </div>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <Card className="p-6 border-gray-100 shadow-sm rounded-3xl bg-white">
                                <h3 className="font-semibold mb-4 text-gray-900">Accessibility & Perks</h3>
                                <div className="flex flex-wrap gap-2">
                                    {job.tags.map(tag => (
                                        <Badge key={tag} variant="secondary" className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-100">
                                            <Star className="w-3 h-3 mr-1 fill-indigo-200" /> {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </Card>

                            <Card className="p-6 border-gray-100 shadow-sm rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
                                <h3 className="text-xl font-bold mb-2">Ready to apply?</h3>
                                <p className="text-indigo-100 mb-6 text-sm">Join {job.company} and make an impact.</p>

                                <Button
                                    className="w-full bg-white text-indigo-600 hover:bg-gray-50 font-bold h-12 text-lg shadow-lg"
                                    onClick={handleApply}
                                    disabled={applying}
                                >
                                    {applying ? "Submitting..." : "Apply Now"}
                                </Button>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
