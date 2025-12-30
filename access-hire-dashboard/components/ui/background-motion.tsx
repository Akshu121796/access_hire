"use client"

import { motion, useReducedMotion } from "framer-motion"
import { useEffect, useState } from "react"

interface BackgroundGraphProps {
    variant?: "default" | "landing" | "auth" | "dashboard"
}

export function BackgroundGraph({ variant = "default" }: BackgroundGraphProps) {
    const shouldReduceMotion = useReducedMotion()
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) return null

    // Static fallback for reduced motion
    if (shouldReduceMotion) {
        return (
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-background">
                <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] rounded-full bg-blue-50/50 blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[60%] h-[60%] rounded-full bg-teal-50/50 blur-[100px]" />
            </div>
        )
    }

    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-background">
            {/* 1. Large Ambient Gradients (Breathing) */}
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.4, 0.3],
                    x: [0, 20, 0],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-blue-200/40 via-indigo-200/40 to-purple-200/40 blur-[120px]"
            />

            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.3, 0.2],
                    x: [0, -20, 0],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                }}
                className="absolute bottom-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-gradient-to-tr from-teal-200/40 via-green-200/40 to-emerald-200/40 blur-[120px]"
            />

            {/* 2. Floating Particles (Subtle Life) */}
            {variant !== "dashboard" && (
                <>
                    {/* Particle 1: Soft Orange Circle */}
                    <FloatingParticle
                        className="top-[20%] left-[10%] w-32 h-32 bg-black/30 blur-[30px] opacity-80"
                        delay={0}
                        duration={20}
                    />

                    {/* Particle 2: Lavender Blob */}
                    <FloatingParticle
                        className="top-[40%] right-[15%] w-48 h-48 bg-gray-900/30 blur-[40px] opacity-80"
                        delay={5}
                        duration={25}
                    />

                    {/* Particle 3: Mint Drift */}
                    <FloatingParticle
                        className="bottom-[15%] left-[30%] w-40 h-40 bg-black/30 blur-[35px] opacity-80"
                        delay={2}
                        duration={22}
                    />
                </>
            )}

            {/* 3. Subtle Wave (Bottom) - Only for Landing to ground it */}
            {variant === "landing" && (
                <div className="absolute bottom-0 left-0 right-0 h-32 opacity-30">
                    <svg className="w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
                        <motion.path
                            animate={{
                                d: [
                                    "M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,149.3C672,139,768,149,864,165.3C960,181,1056,203,1152,197.3C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                                    "M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,186.7C672,203,768,181,864,160C960,139,1056,117,1152,122.7C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                                    "M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,149.3C672,139,768,149,864,165.3C960,181,1056,203,1152,197.3C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                                ]
                            }}
                            transition={{
                                duration: 10,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            fill="url(#wave-gradient)"
                            fillOpacity="1"
                        />
                        <defs>
                            <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="rgba(219, 234, 254, 0.4)" />
                                <stop offset="100%" stopColor="rgba(243, 232, 255, 0.4)" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            )}
        </div>
    )
}

function FloatingParticle({ className, delay, duration }: { className: string, delay: number, duration: number }) {
    return (
        <motion.div
            animate={{
                y: [0, -40, 0],
                x: [0, 20, 0],
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.2, 1]
            }}
            transition={{
                duration: duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: delay
            }}
            className={`absolute rounded-full pointer-events-none ${className}`}
        />
    )
}
