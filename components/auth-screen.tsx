"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ScaleButton } from "@/components/ui/motion"
import { BackgroundGraph } from "@/components/ui/background-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"

interface AuthScreenProps {
  onCandidateSignUp: (name: string) => void
  onEmployerSignUp: () => void
}

export function AuthScreen({ onCandidateSignUp, onEmployerSignUp }: AuthScreenProps) {
  const [role, setRole] = useState<"candidate" | "employer">("candidate")
  const [isLogin, setIsLogin] = useState(true) // Toggle between Login and Sign Up
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [accessibility, setAccessibility] = useState("none")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isLogin) {
        // Login Logic
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        // Sign Up Logic
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        // You can also update the profile name here if needed
        // await updateProfile(userCredential.user, { displayName: fullName || companyName })
      }

      // Navigate based on role
      if (role === "candidate") {
        onCandidateSignUp(fullName || "Candidate")
      } else {
        onEmployerSignUp()
      }
    } catch (err: any) {
      console.error("Auth error:", err)
      let msg = "Authentication failed."
      if (err.code === "auth/email-already-in-use") msg = "Email already in use."
      if (err.code === "auth/invalid-credential") msg = "Invalid email or password."
      if (err.code === "auth/weak-password") msg = "Password should be at least 6 characters."
      setError(msg)
    } finally {
      setLoading(false)
    }
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
            {isLogin ? "Welcome Back! 👋" : "Join Us! 🚀"}
          </h2>
          <p className="text-gray-500 mt-2 text-lg">
            {isLogin ? "Login to access your dashboard." : "Let's get you ready for your new journey."}
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

        {/* Form Content */}
        <form onSubmit={handleAuth} className="space-y-6">
          {!isLogin && role === "candidate" && (
            <div className="space-y-2">
              <Label htmlFor="fullname">Full Name</Label>
              <Input
                id="fullname"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-12 bg-gray-50/50 border-gray-200 focus:bg-white transition-all rounded-xl"
                placeholder="John Doe"
                required={!isLogin}
              />
            </div>
          )}

          {!isLogin && role === "employer" && (
            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="h-12 bg-gray-50/50 border-gray-200 focus:bg-white transition-all rounded-xl"
                placeholder="Acme Inc."
                required={!isLogin}
              />
            </div>
          )}

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

          {!isLogin && role === "candidate" && (
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
          )}

          {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}

          <ScaleButton type="submit" className="w-full">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 h-12 w-full rounded-full flex items-center justify-center text-base font-semibold shadow-lg shadow-blue-200/50 transition-all">
              {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
            </div>
          </ScaleButton>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-indigo-600 font-semibold hover:underline"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </motion.div>
    </main>
  )
}
