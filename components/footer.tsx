"use client"

import { Mail, Linkedin, Twitter, Github, Heart } from "lucide-react"
import { FadeIn } from "@/components/ui/motion"

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-0 relative z-10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <FadeIn delay={0.2} className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent inline-block">
                AccessHire
              </h3>
              <p className="text-gray-500 leading-relaxed">
                Empowering inclusive hiring for everyone. We believe in ability over perception.
              </p>
            </div>

            <div className="flex gap-4">
              {[Twitter, Linkedin, Github, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-300 hover:scale-110"
                  aria-label="Social Link"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {[
            {
              title: "For Candidates",
              links: ["Browse Jobs", "Create Profile"]
            },
            {
              title: "For Employers",
              links: ["Post a Job","Accessibility Guide"]
            },
            {
              title: "Support",
              links: ["Help Center" ,"Privacy Policy"]
            }
          ].map((column, idx) => (
            <div key={idx} className="space-y-6">
              <h4 className="text-lg font-semibold text-gray-900">{column.title}</h4>
              <ul className="space-y-4">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-500 hover:text-indigo-600 transition-colors block hover:translate-x-1 duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </FadeIn>

        {/* Bottom Bar */}
        <FadeIn delay={0.3}>
          <div className="border-t border-gray-100 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <p>© 2025 AccessHire Inc. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-400 fill-red-400 animate-pulse" />
              <span>for an inclusive future.</span>
            </div>
          </div>
        </FadeIn>
      </div>
    </footer>
  )
}
