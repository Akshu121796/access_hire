"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"

export default function MyApplications() {
  const [applications, setApplications] = useState<any[]>([])

  useEffect(() => {
    if (!auth.currentUser) return

    const fetchApplications = async () => {
      const q = query(
        collection(db, "applications"),
        where("candidateId", "==", auth.currentUser!.uid)
      )

      const snap = await getDocs(q)
      setApplications(snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })))
    }

    fetchApplications()
  }, [])

  return (
    <div className="space-y-4">
      {applications.map(app => (
        <div key={app.id}>
          {/* reuse your existing card UI here */}
          Applied for Job ID: {app.jobId}
        </div>
      ))}
    </div>
  )
}
