"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ScaleButton } from "@/components/ui/motion"
import { BackgroundGraph } from "@/components/ui/background-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { auth } from "@/lib/firebase"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { useToast } from "@/hooks/use-toast"

interface AuthScreenProps {
  onCandidateSignUp: (name: string) => void
  onEmployerSignUp: () => void
}

export function AuthScreen({ onCandidateSignUp, onEmployerSignUp }: AuthScreenProps) {
  const [role, setRole] = useState<"candidate" | "employer">("candidate")
  const [isLogin, setIsLogin] = useState(false)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [accessibility, setAccessibility] = useState("none")
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  // Clear specific fields when switching modes
  const toggleMode = () => {
    setIsLogin(!isLogin)
    setErrors({})
  }

  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Reuse the import, checking if we need to add signInWithEmailAndPassword to imports
  // It was not imported in the original file, so I will add it to the import list below.

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      if (isLogin) {
        // LOGIN LOGIC
        const { signInWithEmailAndPassword } = await import("firebase/auth")
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const user = userCredential.user

        toast({
          title: "Welcome back!",
          description: "You have successfully logged in."
        })

        // We need to determine if they are a candidate or employer to route generic landing
        // For this simple simplified flow, we might just assume the role they selected matches, 
        // or just let them into the dashboard.
        // The parent component expects a callback.
        if (role === 'candidate') {
          onCandidateSignUp(user.displayName || "User")
        } else {
          onEmployerSignUp()
        }

      } else {
        // SIGN UP LOGIC
        // Client-side password validation to avoid Firebase weak-password error
        if (!password || password.length < 6) {
          const msg = "Password should be at least 6 characters."
          setErrors({ password: msg })
          toast({ title: "Weak password", description: msg, variant: "destructive" })
          setLoading(false)
          return
        }
        if (role === 'candidate') {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password)
          await updateProfile(userCredential.user, {
            displayName: fullName
          })
          onCandidateSignUp(fullName)
        } else {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password)
          await updateProfile(userCredential.user, {
            displayName: companyName
          })
          onEmployerSignUp()
        }
      }
    } catch (error: any) {
      console.error(error)
      let title = "Authentication failed"
      let description = error.message

      if (error.code === 'auth/email-already-in-use') {
        title = "Account already exists"
        description = "This email is already registered. Please log in instead."
        // Optionally auto-switch to login or show button, for now just clear message
      } else if (error.code === 'auth/invalid-credential') {
        description = "Invalid email or password."
      }

      toast({
        title,
        description,
        variant: "destructive"
      })
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
            {isLogin ? "Welcome Back! 👋" : "Welcome! 👋"}
          </h2>
          <p className="text-gray-500 mt-2 text-lg">
            {isLogin ? "Enter your credentials to access your account." : "Let's get you ready for your new journey."}
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
        <div className="overflow-visible min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.form
              key={role + (isLogin ? '-login' : '-signup')}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleAuth}
              className="space-y-6"
            >
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
                    required
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
                    required
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

              <ScaleButton type="submit" className="w-full" disabled={loading}>
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 h-12 w-full rounded-full flex items-center justify-center text-base font-semibold shadow-lg shadow-blue-200/50 transition-all">
                  {loading ? (isLogin ? "Logging in..." : "Signing up...") : (isLogin ? "Log In" : (role === "candidate" ? "Sign Up as Candidate" : "Sign Up as Employer"))}
                </div>
              </ScaleButton>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold hover:underline transition-all"
                >
                  {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
                </button>
              </div>

            </motion.form>
          </AnimatePresence>
        </div>
      </motion.div>
    </main>
  )
}
