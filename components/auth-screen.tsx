"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ScaleButton } from "@/components/ui/motion"
import { BackgroundGraph } from "@/components/ui/background-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AuthScreenProps {
  onCandidateSignUp: (name: string) => void
  onEmployerSignUp: () => void
}

export function AuthScreen({ onCandidateSignUp, onEmployerSignUp }: AuthScreenProps) {
  const [role, setRole] = useState<"candidate" | "employer">("candidate")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [accessibility, setAccessibility] = useState("none")

  const handleCandidateSignUp = (e: React.FormEvent) => {
    e.preventDefault()
    onCandidateSignUp(fullName)
  }

  const handleEmployerSignUp = (e: React.FormEvent) => {
    e.preventDefault()
    onEmployerSignUp()
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12 relative z-10 overflow-hidden">
      <BackgroundGraph variant="auth" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl border border-gray-100/50 p-8 shadow-[0_20px_40px_rgba(0,0,0,0.08)] relative z-20"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            Welcome! 👋
          </h2>
          <p className="text-gray-500 mt-2 text-lg">
            Let's get you ready for your new journey.
          </p>
        </div>

        {/* Tabs with Layout Animation */}
        <div className="flex p-1 bg-gray-50/80 rounded-2xl mb-8 border border-gray-200/50 relative">
          <button
            onClick={() => setRole("candidate")}
            className={`flex-1 px-6 py-3 text-sm font-semibold rounded-xl transition-colors duration-200 relative z-10 ${role === "candidate" ? "text-indigo-600" : "text-gray-500 hover:text-gray-900"
              }`}
          >
            {role === "candidate" && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-white rounded-xl shadow-sm border border-gray-100"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">Candidate</span>
          </button>

          <button
            onClick={() => setRole("employer")}
            className={`flex-1 px-6 py-3 text-sm font-semibold rounded-xl transition-colors duration-200 relative z-10 ${role === "employer" ? "text-indigo-600" : "text-gray-500 hover:text-gray-900"
              }`}
          >
            {role === "employer" && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-white rounded-xl shadow-sm border border-gray-100"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">Employer</span>
          </button>
        </div>

        {/* Form Content Fade Transition */}
        <div className="overflow-visible min-h-[400px]">
          <AnimatePresence mode="wait">
            {role === "candidate" ? (
              <motion.form
                key="candidate"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleCandidateSignUp}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <Label htmlFor="fullname">Full Name</Label>
                  <Input
                    id="fullname"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-12 bg-gray-50/50 border-gray-200 focus:bg-white transition-all rounded-xl"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 bg-gray-50/50 border-gray-200 focus:bg-white transition-all rounded-xl"
                    placeholder="name@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 bg-gray-50/50 border-gray-200 focus:bg-white transition-all rounded-xl"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accessibility">Accessibility Preference</Label>
                  <Select value={accessibility} onValueChange={setAccessibility}>
                    <SelectTrigger id="accessibility" className="h-12 bg-gray-50/50 border-gray-200 focus:bg-white transition-all rounded-xl">
                      <SelectValue placeholder="Select preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="screen-reader">Screen Reader</SelectItem>
                      <SelectItem value="high-contrast">High Contrast</SelectItem>
                      <SelectItem value="keyboard">Keyboard Navigation</SelectItem>
                      <SelectItem value="captions">Captions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <ScaleButton type="submit" className="w-full">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 h-12 w-full rounded-full flex items-center justify-center text-base font-semibold shadow-lg shadow-blue-200/50 transition-all">
                    Sign Up as Candidate
                  </div>
                </ScaleButton>
              </motion.form>
            ) : (
              <motion.form
                key="employer"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleEmployerSignUp}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="h-12 bg-gray-50/50 border-gray-200 focus:bg-white transition-all rounded-xl"
                    placeholder="Acme Inc."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email-emp">Work Email</Label>
                  <Input
                    id="email-emp"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 bg-gray-50/50 border-gray-200 focus:bg-white transition-all rounded-xl"
                    placeholder="name@company.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password-emp">Password</Label>
                  <Input
                    id="password-emp"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 bg-gray-50/50 border-gray-200 focus:bg-white transition-all rounded-xl"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <ScaleButton type="submit" className="w-full">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 h-12 w-full rounded-full flex items-center justify-center text-base font-semibold shadow-lg shadow-blue-200/50 transition-all">
                    Sign Up as Employer
                  </div>
                </ScaleButton>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </main>
  )
}
