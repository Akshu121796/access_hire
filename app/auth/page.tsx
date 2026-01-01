"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Footer } from "@/components/footer"
import { Mail, Linkedin } from "lucide-react"

export default function AuthPage() {
  const [activeRole, setActiveRole] = useState("candidate")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [accessibilityPreference, setAccessibilityPreference] = useState("")
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleValidation = (role: string) => {
    const newErrors: { [key: string]: string } = {}

    if (role === "candidate") {
      if (!email) newErrors.email = "Email is required"
      if (!password) newErrors.password = "Password is required"
      if (!accessibilityPreference) newErrors.accessibility = "Please select an accessibility preference"
    } else {
      if (!email) newErrors.email = "Company email is required"
      if (!password) newErrors.password = "Password is required"
      if (!companyName) newErrors.companyName = "Company name is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContinue = () => {
    if (handleValidation(activeRole)) {
      console.log("Form submitted:", { activeRole, email, password, companyName, accessibilityPreference })
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <Card className="w-full max-w-2xl border-2 border-foreground shadow-lg">
          {/* Header */}
          <div className="px-8 py-6 border-b-2 border-foreground bg-primary text-primary-foreground">
            <h1 className="text-4xl font-bold tracking-tight">AccessHire</h1>
            <p className="text-lg mt-2 opacity-90">Empowering inclusive hiring for everyone.</p>
          </div>

          {/* Role Switcher */}
          <div className="px-8 py-8">
            <Tabs value={activeRole} onValueChange={setActiveRole} className="w-full">
              <TabsList className="grid w-full grid-cols-2 gap-4 bg-transparent p-0 border-b-2 border-foreground">
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

              {/* Candidate Sign-up/Login */}
              <TabsContent value="candidate" className="py-8 space-y-6">
                <div>
                  <Label htmlFor="candidate-email" className="text-base font-semibold mb-2 block">
                    Email Address
                  </Label>
                  <Input
                    id="candidate-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-lg h-12 border-2 border-foreground placeholder:text-muted-foreground"
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="text-destructive font-semibold mt-2">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="candidate-password" className="text-base font-semibold mb-2 block">
                    Password
                  </Label>
                  <Input
                    id="candidate-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="text-lg h-12 border-2 border-foreground placeholder:text-muted-foreground"
                    aria-describedby={errors.password ? "password-error" : undefined}
                  />
                  {errors.password && (
                    <p id="password-error" className="text-destructive font-semibold mt-2">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="accessibility-pref" className="text-base font-semibold mb-2 block">
                    Primary Accessibility Preference
                  </Label>
                  <Select value={accessibilityPreference} onValueChange={setAccessibilityPreference}>
                    <SelectTrigger
                      id="accessibility-pref"
                      className="text-lg h-12 border-2 border-foreground placeholder:text-muted-foreground"
                      aria-describedby={errors.accessibility ? "accessibility-error" : undefined}
                    >
                      <SelectValue placeholder="Select your preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="screen-reader">Screen Reader Optimized</SelectItem>
                      <SelectItem value="keyboard-only">Keyboard Only</SelectItem>
                      <SelectItem value="high-contrast">Visual Aids/High Contrast</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.accessibility && (
                    <p id="accessibility-error" className="text-destructive font-semibold mt-2">
                      {errors.accessibility}
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleContinue}
                  className="w-full h-12 text-lg font-semibold border-2 border-primary bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-4 focus:outline-offset-2 focus:outline-primary"
                >
                  Continue
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
                  <Button
                    variant="outline"
                    className="h-12 text-base font-semibold border-2 border-foreground hover:bg-secondary focus:outline-4 focus:outline-offset-2 focus:outline-primary bg-transparent"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Google
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 text-base font-semibold border-2 border-foreground hover:bg-secondary focus:outline-4 focus:outline-offset-2 focus:outline-primary bg-transparent"
                  >
                    <Linkedin className="w-5 h-5 mr-2" />
                    LinkedIn
                  </Button>
                </div>

                <div className="text-center">
                  <a
                    href="#"
                    className="text-primary font-semibold text-base hover:underline focus:outline-2 focus:outline-offset-2 focus:outline-primary"
                  >
                    Forgot password?
                  </a>
                </div>
              </TabsContent>

              {/* Employer Sign-up/Login */}
              <TabsContent value="employer" className="py-8 space-y-6">
                <div>
                  <Label htmlFor="company-email" className="text-base font-semibold mb-2 block">
                    Company Email
                  </Label>
                  <Input
                    id="company-email"
                    type="email"
                    placeholder="company@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-lg h-12 border-2 border-foreground placeholder:text-muted-foreground"
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="text-destructive font-semibold mt-2">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="company-name" className="text-base font-semibold mb-2 block">
                    Company Name
                  </Label>
                  <Input
                    id="company-name"
                    type="text"
                    placeholder="Your Company Name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="text-lg h-12 border-2 border-foreground placeholder:text-muted-foreground"
                    aria-describedby={errors.companyName ? "company-error" : undefined}
                  />
                  {errors.companyName && (
                    <p id="company-error" className="text-destructive font-semibold mt-2">
                      {errors.companyName}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="employer-password" className="text-base font-semibold mb-2 block">
                    Password
                  </Label>
                  <Input
                    id="employer-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="text-lg h-12 border-2 border-foreground placeholder:text-muted-foreground"
                    aria-describedby={errors.password ? "password-error" : undefined}
                  />
                  {errors.password && (
                    <p id="password-error" className="text-destructive font-semibold mt-2">
                      {errors.password}
                    </p>
                  )}
                </div>

                <p className="text-base text-muted-foreground font-medium">Join 500+ MSMEs hiring inclusively.</p>

                <Button
                  onClick={handleContinue}
                  className="w-full h-12 text-lg font-semibold border-2 border-primary bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-4 focus:outline-offset-2 focus:outline-primary"
                >
                  Employer Login
                </Button>

                <div className="text-center">
                  <a
                    href="#"
                    className="text-primary font-semibold text-base hover:underline focus:outline-2 focus:outline-offset-2 focus:outline-primary"
                  >
                    Forgot password?
                  </a>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </Card>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
