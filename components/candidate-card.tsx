"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export function CandidateCard() {
  return (
    <aside
      className="bg-white border-4 border-gray-300 rounded-lg p-8 sticky top-28"
      role="complementary"
      aria-label="Candidate profile"
    >
      {/* Profile Photo Placeholder */}
      <div className="w-full h-48 bg-gray-300 rounded-lg mb-8 border-2 border-gray-400 flex items-center justify-center">
        <span className="text-gray-600 text-lg font-semibold">Photo</span>
      </div>

      {/* Name */}
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Alex Chen</h2>

      {/* Blue Dot Verified Badge */}
      <div className="bg-blue-600 text-white rounded-lg p-6 mb-8 border-4 border-blue-700 shadow-lg shadow-blue-600/50">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
            <Check className="w-8 h-8 text-blue-600 font-bold" strokeWidth={3} />
          </div>
          <h3 className="text-2xl font-bold">Blue Dot Verified</h3>
        </div>
        <p className="text-lg font-semibold text-blue-100">Disability Status Confirmed</p>
      </div>

      {/* Profile Readiness */}
      <div className="mb-8">
        <label htmlFor="profile-progress" className="block text-xl font-bold text-gray-900 mb-4">
          Profile Readiness: 90%
        </label>
        <Progress value={90} id="profile-progress" className="h-4" />
      </div>

      {/* Update Accommodations Button */}
      <Button
        size="lg"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-8 focus:outline-4 focus:outline-offset-2 focus:outline-blue-600"
        aria-label="Update your accommodations and accessibility needs"
      >
        Update Accommodations
      </Button>
    </aside>
  )
}
