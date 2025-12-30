"use client"

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion"
import { ReactNode } from "react"
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// Primitives
// -----------------------------------------------------------------------------

// Gentle transition settings
const smoothEase: [number, number, number, number] = [0.4, 0, 0.2, 1] // Custom refined easing
const defaultDuration = 0.5

interface FadeInProps extends HTMLMotionProps<"div"> {
    children: ReactNode
    delay?: number
    direction?: "up" | "down" | "left" | "right" | "none"
    distance?: number
    className?: string
}

export function FadeIn({
    children,
    delay = 0,
    direction = "up",
    distance = 20,
    className,
    ...props
}: FadeInProps) {
    const shouldReduceMotion = useReducedMotion()

    const directions = {
        up: { y: distance },
        down: { y: -distance },
        left: { x: distance },
        right: { x: -distance },
        none: { x: 0, y: 0 },
    }

    const initial = shouldReduceMotion ? { opacity: 0 } : { opacity: 0, ...directions[direction] }
    const animate = { opacity: 1, x: 0, y: 0 }

    return (
        <motion.div
            initial={initial}
            animate={animate}
            transition={{
                duration: defaultDuration,
                delay,
                ease: smoothEase,
            }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    )
}

export function StaggerContainer({
    children,
    delay = 0,
    staggerDelay = 0.1,
    className,
    ...props
}: HTMLMotionProps<"div"> & { delay?: number; staggerDelay?: number }) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
                visible: {
                    transition: {
                        staggerChildren: staggerDelay,
                        delayChildren: delay,
                    },
                },
            }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    )
}

export function StaggerItem({ children, className, ...props }: HTMLMotionProps<"div">) {
    const shouldReduceMotion = useReducedMotion()

    const variants = {
        hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: smoothEase
            }
        },
    }

    return (
        <motion.div variants={variants} className={className} {...props}>
            {children}
        </motion.div>
    )
}

export function ScaleButton({ children, className, onClick, ...props }: HTMLMotionProps<"button">) {
    return (
        <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)" }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            onClick={onClick}
            className={cn("relative", className)}
            {...props}
        >
            {children}
        </motion.button>
    )
}


export function HoverCard({ children, className, ...props }: HTMLMotionProps<"div">) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    )
}
