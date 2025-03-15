"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function GiftPage() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to platforms page
    router.push('/platforms')
  }, [])
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex h-40 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    </div>
  )
}
