"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

type Platform = {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  link: string
}

export function MovingPlatforms() {
  const [width, setWidth] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Update width on mount and on window resize
    const handleResize = () => {
      setWidth(window.innerWidth)
      setIsMobile(window.innerWidth < 768)
    }
    
    handleResize()
    window.addEventListener("resize", handleResize)
    
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const platforms: Platform[] = [
    {
      id: "chatgpt",
      name: "ChatGPT Plus",
      description: "Access to GPT-4o, faster response times, and priority access to new features.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-10 w-10 text-primary"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      ),
      link: "/platforms/chatgpt",
    },
    {
      id: "claude",
      name: "Claude Pro",
      description: "Higher message limits, priority access, and support for larger files.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-10 w-10 text-primary"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 16v-4"></path>
          <path d="M12 8h.01"></path>
        </svg>
      ),
      link: "/platforms/claude",
    },
    {
      id: "midjourney",
      name: "Midjourney",
      description: "Generate stunning AI art and imagery with advanced prompting capabilities.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-10 w-10 text-primary"
        >
          <path d="M15 6H9a6 6 0 1 0 0 12h6a6 6 0 1 0 0-12z"></path>
          <circle cx="9" cy="12" r="1"></circle>
          <circle cx="15" cy="12" r="1"></circle>
        </svg>
      ),
      link: "/platforms/midjourney",
    },
    {
      id: "perplexity",
      name: "Perplexity Pro",
      description: "Advanced AI research assistant with unlimited searches and GPT-4 access.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-10 w-10 text-primary"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      ),
      link: "/platforms/perplexity",
    },
    {
      id: "github-copilot",
      name: "GitHub Copilot",
      description: "AI pair programmer that helps you write better code, faster.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-10 w-10 text-primary"
        >
          <path d="M16 22l5-10 5 10"></path>
          <path d="M2 22l5-10 5 10"></path>
          <path d="M4 3h18"></path>
          <path d="M12 3v18"></path>
        </svg>
      ),
      link: "/platforms/github-copilot",
    },
    {
      id: "anthropic",
      name: "Anthropic Claude API",
      description: "Build with Claude AI models for your applications and services.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-10 w-10 text-primary"
        >
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
      ),
      link: "/platforms/anthropic",
    },
  ]

  // Duplicate the platforms for seamless looping
  const duplicatedPlatforms = [...platforms, ...platforms]

  return (
    <div className="relative w-full overflow-hidden py-10">
      {/* Gradient overlay on left */}
      <div className="absolute left-0 top-0 z-10 h-full w-[100px] bg-gradient-to-r from-background to-transparent"></div>
      
      {/* Gradient overlay on right */}
      <div className="absolute right-0 top-0 z-10 h-full w-[100px] bg-gradient-to-l from-background to-transparent"></div>
      
      <motion.div
        className="flex gap-6"
        animate={{
          x: isMobile ? [0, -1500] : [0, -2000],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 30,
            ease: "linear",
          },
        }}
      >
        {duplicatedPlatforms.map((platform, index) => (
          <div
            key={`${platform.id}-${index}`}
            className="flex-shrink-0 w-[300px] flex flex-col items-center space-y-4 rounded-lg border p-8 shadow-sm transition-all hover:shadow-md bg-background"
          >
            <div className="p-3 bg-primary/10 rounded-full">
              {platform.icon}
            </div>
            <h3 className="text-xl font-bold">{platform.name}</h3>
            <p className="text-center text-muted-foreground">
              {platform.description}
            </p>
            <Link
              href={platform.link}
              className="inline-flex h-10 items-center justify-center rounded-md border border-primary text-primary bg-transparent px-6 py-2 text-sm font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              Learn More
            </Link>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
