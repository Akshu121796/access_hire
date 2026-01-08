"use client"

import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { db } from "@/lib/firebase"
import { collection, onSnapshot, query, orderBy, limit, Timestamp } from "firebase/firestore"
import { useRouter } from "next/navigation"

export function NotificationManager() {
    const { toast } = useToast()
    const router = useRouter()
    const [lastJobId, setLastJobId] = useState<string | null>(null)
    const [init, setInit] = useState(false)

    useEffect(() => {
        // Listen for ONE most recent job
        const q = query(collection(db, "jobs"), orderBy("createdAt", "desc"), limit(1))

        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (snapshot.empty) return

            const jobDoc = snapshot.docs[0]
            const jobData = jobDoc.data()
            const jobId = jobDoc.id

            // If we are just initializing, don't show toast, just record the ID
            if (!init) {
                setLastJobId(jobId)
                setInit(true)
                return
            }

            // If a NEW job appears (diff ID) and it's fresh (created recently)
            if (jobId !== lastJobId) {
                setLastJobId(jobId)

                // Check if it's actually new (within last 10 seconds to avoid stale updates triggering)
                const createdAt = jobData.createdAt as Timestamp
                const now = new Date()
                if (createdAt && (now.getTime() - createdAt.toDate().getTime() < 10000)) {
                    toast({
                        title: "New Job Alert! 🚀",
                        description: `${jobData.title} at ${jobData.company} was just posted.`,
                        action: (
                            <div
                                className="bg-white text-black px-3 py-2 rounded-md text-sm font-semibold cursor-pointer hover:bg-gray-100"
                                onClick={() => router.push(`/jobs/${jobId}`)}
                            >
                                View
                            </div>
                        ),
                        duration: 5000,
                    })
                }
            }
        })

        return () => unsubscribe()
    }, [init, lastJobId, router, toast])

    return null // Headless component
}
