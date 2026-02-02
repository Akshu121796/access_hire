"use client"

import { useState } from "react"
import { TopNavigation } from "@/components/top-navigation"
import { Footer } from "@/components/footer"
import { AuthScreen } from "@/components/auth-screen"
import { CandidateDashboard } from "@/components/candidate-dashboard"
import { EmployerDashboard } from "@/components/employer-dashboard"
import { BackgroundGraph } from "@/components/ui/background-motion"
import { FadeIn, StaggerContainer, StaggerItem, ScaleButton, HoverCard } from "@/components/ui/motion"
import { Accessibility, Shield, TrendingUp, ArrowRight, Sparkles } from "lucide-react"
import { useHighContrast } from "@/hooks/use-high-contrast"

export default function Page() {
  const [view, setView] = useState<"landing" | "auth" | "candidate-dash" | "employer-dash">("landing")
  const [highContrast, setHighContrast] = useHighContrast()
  const [companyName, setCompanyName] = useState("Tech Corp")
  const [userName, setUserName] = useState("Jane Doe")

  const handleNavToAuth = () => setView("auth")
  const handleLogoClick = () => setView("landing")

  return (
    <div className="min-h-screen bg-background relative pt-20">
      <BackgroundGraph variant="landing" />

      <TopNavigation
        highContrast={highContrast}
        onToggleContrast={setHighContrast}
        onLoginClick={handleNavToAuth}
        currentView={view}
        companyName={companyName}
        onLogoClick={handleLogoClick}
      />

      {view === "landing" && (
        <main className="flex flex-col relative z-10 w-full overflow-hidden">
          {/* Hero Section */}
          <section className="px-6 py-24 md:py-32 flex flex-col items-center text-center relative max-w-7xl mx-auto">

            <FadeIn delay={0.1}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-indigo-100 text-sm font-semibold text-indigo-600 mb-8 shadow-sm hover:shadow-md transition-all">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Empowering Inclusive Workplaces
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 tracking-tight leading-[1.1]">
                Where <span className="text-indigo-600">Ability</span> Meets <br className="hidden md:block" />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Limitless Opportunity</span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.3}>
              <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl leading-relaxed">
                Find a workplace that celebrates you. We connect talented individuals with forward-thinking employers who prioritize potential over perception.
              </p>
            </FadeIn>

            <FadeIn delay={0.4} className="flex flex-col sm:flex-row gap-6 w-full max-w-md mx-auto">
              <ScaleButton className="w-full" onClick={handleNavToAuth}>
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 h-12 md:h-14 px-8 rounded-full flex items-center justify-center text-lg font-semibold shadow-lg shadow-blue-200">
                  Find a Job <ArrowRight className="ml-2 w-5 h-5" />
                </div>
              </ScaleButton>

              <ScaleButton className="w-full" onClick={handleNavToAuth}>
                <div className="h-12 md:h-14 px-8 rounded-full flex items-center justify-center text-lg font-semibold border-2 border-indigo-100 bg-white text-indigo-700 hover:bg-indigo-50 hover:border-indigo-200">
                  Hire Inclusively
                </div>
              </ScaleButton>
            </FadeIn>
          </section>

          {/* Feature Grid */}
          <section className="px-6 py-24 bg-white/50 backdrop-blur-sm relative">
            <div className="max-w-7xl mx-auto">
              <FadeIn className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Why AccessHire?</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  We've reimagined the hiring process to be seamless, accessible, and empowering for everyone.
                </p>
              </FadeIn>

              <StaggerContainer className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    icon: Shield,
                    title: "Verified Inclusive",
                    desc: "Every employer is vetted for accessibility commitments. No more guessing games.",
                    color: "text-blue-600",
                    bg: "bg-blue-50"
                  },
                  {
                    icon: Accessibility,
                    title: "Adaptive Applications",
                    desc: "Apply your way. Our flows adapt to your specific needs and preferences.",
                    color: "text-purple-600",
                    bg: "bg-purple-50"
                  },
                  {
                    icon: TrendingUp,
                    title: "Career Growth",
                    desc: "Don't just find a job. Find a career path with mentorship and tax incentives for growth.",
                    color: "text-teal-600",
                    bg: "bg-teal-50"
                  }
                ].map((feature, i) => (
                  <StaggerItem key={i}>
                    <HoverCard className="group p-8 rounded-3xl bg-white border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-shadow duration-300 h-full">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${feature.bg} ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon size={28} />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                      <p className="text-lg text-gray-600 leading-relaxed">
                        {feature.desc}
                      </p>
                    </HoverCard>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </section>
        </main>
      )}

      {view === "auth" && (
        <div className="relative z-10">
          <AuthScreen
            onCandidateSignUp={(name) => {
              setUserName(name || "Candidate")
              setView("candidate-dash")
            }}
            onEmployerSignUp={() => setView("employer-dash")}
          />
        </div>
      )}

      {view === "candidate-dash" && (
        <div className="relative z-10">
          <CandidateDashboard userName={userName} onLogout={handleLogoClick} />
        </div>
      )}

      {view === "employer-dash" && (
        <div className="relative z-10">
          <EmployerDashboard companyName={companyName} onLogout={handleLogoClick} />
        </div>
      )}

      <Footer />
    </div>
  )
}
