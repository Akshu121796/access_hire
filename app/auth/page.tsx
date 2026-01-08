"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Footer } from "@/components/footer"
import { Mail, Linkedin, Loader2 } from "lucide-react"
import { auth, db } from "@/lib/firebase"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function AuthPage() {
  const [activeRole, setActiveRole] = useState("candidate")
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("") // Unified name field (Candidate Name or Company Name)
  const [accessibilityPreference, setAccessibilityPreference] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  
  const router = useRouter()
  const { toast } = useToast()

  const handleValidation = () => {
    const newErrors: { [key: string]: string } = {}

    if (!email) newErrors.email = "Email is required"
    if (!password) newErrors.password = "Password is required"
    else if (password.length < 6) newErrors.password = "Password should be at least 6 characters"
    if (!isLogin && !name) newErrors.name = activeRole === "candidate" ? "Full Name is required" : "Company Name is required"
    
    // Accessibility is optional strictly speaking, but good to have for candidates
    if (!isLogin && activeRole === "candidate" && !accessibilityPreference) {
       // Optional: enforce or leave optional. Let's make it optional for MVP simplicity or require it.
       // newErrors.accessibility = "Please select an accessibility preference"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAuth = async () => {
    if (!handleValidation()) return

    setIsLoading(true)
    try {
      if (isLogin) {
        // Login Logic
        await signInWithEmailAndPassword(auth, email, password)
        toast({ title: "Welcome back!", description: "Logged in successfully." })
        router.push("/dashboard")
      } else {
        // Sign Up Logic
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user

        await updateProfile(user, { displayName: name })

        // Store user role and extra data in Firestore
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: name,
          role: activeRole, // 'candidate' or 'employer'
          accessibilityPreference: activeRole === "candidate" ? accessibilityPreference : null,
          createdAt: new Date().toISOString(),
        })

        toast({ title: "Account created!", description: "Welcome to AccessHire." })
        router.push("/dashboard")
      }
    } catch (error: any) {
      console.error("Auth error:", error)
      let msg = "An error occurred."
      if (error.code === "auth/email-already-in-use") msg = "Email already in use."
      if (error.code === "auth/invalid-email") msg = "Invalid email address."
      if (error.code === "auth/weak-password") msg = "Password should be at least 6 characters."
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") msg = "Invalid email or password."
      
      toast({ title: "Error", description: msg, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <Card className="w-full max-w-2xl border-2 border-foreground shadow-lg">
          <div className="px-8 py-6 border-b-2 border-foreground bg-primary text-primary-foreground">
            <h1 className="text-4xl font-bold tracking-tight">AccessHire</h1>
            <p className="text-lg mt-2 opacity-90">Empowering inclusive hiring for everyone.</p>
          </div>

          <div className="px-8 py-8">
            <Tabs value={activeRole} onValueChange={setActiveRole} className="w-full">
              <TabsList className="grid w-full grid-cols-2 gap-4 bg-transparent p-0 border-b-2 border-foreground mb-6">
                <TabsTrigger
                  value="candidate"
                  className="text-lg font-semibold py-4 px-0 rounded-none border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-foreground"
                >
                  I am a Candidate
                </TabsTrigger>
                <TabsTrigger
                  value="employer"
                  className="text-lg font-semibold py-4 px-0 rounded-none border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-foreground"
                >
                  I am an Employer
                </TabsTrigger>
              </TabsList>

              <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                   <h2 className="text-2xl font-bold">{isLogin ? "Login" : "Create Account"}</h2>
                   <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="text-primary text-base">
                     {isLogin ? "Need an account? Sign Up" : "Already have an account? Login"}
                   </Button>
                </div>

                {!isLogin && (
                    <div>
                    <Label htmlFor="name" className="text-base font-semibold mb-2 block">
                        {activeRole === "candidate" ? "Full Name" : "Company Name"}
                    </Label>
                    <Input
                        id="name"
                        type="text"
                        placeholder={activeRole === "candidate" ? "Your Name" : "Company Ltd."}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="text-lg h-12 border-2 border-foreground placeholder:text-muted-foreground"
                    />
                     {errors.name && <p className="text-destructive font-semibold mt-2">{errors.name}</p>}
                    </div>
                )}

                <div>
                  <Label htmlFor="email" className="text-base font-semibold mb-2 block">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-lg h-12 border-2 border-foreground placeholder:text-muted-foreground"
                  />
                  {errors.email && <p className="text-destructive font-semibold mt-2">{errors.email}</p>}
                </div>

                <div>
                  <Label htmlFor="password" className="text-base font-semibold mb-2 block">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="text-lg h-12 border-2 border-foreground placeholder:text-muted-foreground"
                  />
                  {errors.password && <p className="text-destructive font-semibold mt-2">{errors.password}</p>}
                </div>

                {!isLogin && activeRole === "candidate" && (
                    <div>
                    <Label htmlFor="accessibility-pref" className="text-base font-semibold mb-2 block">
                        Primary Accessibility Preference
                    </Label>
                    <Select value={accessibilityPreference} onValueChange={setAccessibilityPreference}>
                        <SelectTrigger id="accessibility-pref" className="text-lg h-12 border-2 border-foreground placeholder:text-muted-foreground">
                        <SelectValue placeholder="Select your preference" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="screen-reader">Screen Reader Optimized</SelectItem>
                        <SelectItem value="keyboard-only">Keyboard Only</SelectItem>
                        <SelectItem value="high-contrast">Visual Aids/High Contrast</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                        </SelectContent>
                    </Select>
                    </div>
                )}

                <Button
                  onClick={handleAuth}
                  disabled={isLoading}
                  className="w-full h-12 text-lg font-semibold border-2 border-primary bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-4 focus:outline-offset-2 focus:outline-primary"
                >
                  {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
                  {isLogin ? "Login" : "Continue"}
                </Button>
                
                 <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-foreground"></div>
                  </div>
                  <div className="relative flex justify-center text-base">
                    <span className="px-2 bg-background font-semibold">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-12 text-base font-semibold border-2 border-foreground hover:bg-secondary bg-transparent">
                    <Mail className="w-5 h-5 mr-2" /> Google
                  </Button>
                  <Button variant="outline" className="h-12 text-base font-semibold border-2 border-foreground hover:bg-secondary bg-transparent">
                    <Linkedin className="w-5 h-5 mr-2" /> LinkedIn
                  </Button>
                </div>
              </div>
            </Tabs>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
