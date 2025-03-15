"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function NewSubscriptionRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to the edit page with id "new"
    router.push("/admin/subscriptions/new/edit")
  }, [router])
  
  return (
    <div className="flex h-40 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>
  )
}
