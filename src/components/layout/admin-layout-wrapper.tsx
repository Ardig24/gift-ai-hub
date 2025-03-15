"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith("/admin") || false

  useEffect(() => {
    // If this is an admin page, hide the header and footer
    if (isAdminPage) {
      // Find the header and footer elements
      const header = document.querySelector("header")
      const footer = document.querySelector("footer")
      const main = document.querySelector("main")
      
      // Hide them
      if (header) header.style.display = "none"
      if (footer) footer.style.display = "none"
      
      // Remove padding from main
      if (main) {
        main.style.padding = "0"
        main.style.margin = "0"
      }
    }
    
    // Cleanup function to restore visibility when navigating away
    return () => {
      if (isAdminPage) {
        const header = document.querySelector("header")
        const footer = document.querySelector("footer")
        const main = document.querySelector("main")
        
        if (header) header.style.display = ""
        if (footer) footer.style.display = ""
        
        if (main) {
          main.style.padding = ""
          main.style.margin = ""
        }
      }
    }
  }, [isAdminPage, pathname])

  return <>{children}</>
}
