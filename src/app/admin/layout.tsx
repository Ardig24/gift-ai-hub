"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/components/providers/supabase-auth-provider"
import AdminLayoutWrapper from "@/components/layout/admin-layout-wrapper"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const { isAdmin: checkIsAdmin, user, signOut } = useAuth()

  useEffect(() => {
    const checkAdmin = async () => {
      setIsLoading(true)
      
      // For development mode, we'll skip the admin check
      // and allow all authenticated users
      setIsAdmin(true)
      setIsLoading(false)
      
      // Uncomment this for production mode
      // const isUserAdmin = await checkIsAdmin()
      // setIsAdmin(isUserAdmin)
      // 
      // if (!isUserAdmin && pathname !== "/admin/login") {
      //   router.push("/admin/login")
      // }
      // 
      // setIsLoading(false)
    }
    
    if (user) {
      checkAdmin()
    } else if (pathname !== "/admin/login") {
      router.push("/admin/login")
    } else {
      setIsLoading(false)
    }
  }, [pathname, router, user])

  // If on login page, just render the login component
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return null // Will redirect to login in useEffect
  }

  return (
    <AdminLayoutWrapper>
      <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border p-4">
        <div className="mb-8">
          <h1 className="text-xl font-bold">GiftAI Hub Admin</h1>
        </div>
        
        <nav className="space-y-1">
          <NavLink href="/admin" exact>
            Dashboard
          </NavLink>
          <NavLink href="/admin/platforms">
            Platforms
          </NavLink>
          <NavLink href="/admin/subscriptions">
            Subscriptions
          </NavLink>
          <NavLink href="/admin/orders">
            Orders
          </NavLink>
          <NavLink href="/admin/users">
            Users
          </NavLink>
          <NavLink href="/admin/settings">
            Settings
          </NavLink>
        </nav>
        
        <div className="mt-auto pt-6">
          <button 
            onClick={async () => {
              await signOut()
              router.push("/admin/login")
            }}
            className="w-full rounded bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/20"
          >
            Sign Out
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
    </AdminLayoutWrapper>
  )
}

function NavLink({ 
  href, 
  exact = false, 
  children 
}: { 
  href: string
  exact?: boolean
  children: React.ReactNode 
}) {
  const pathname = usePathname()
  const isActive = exact 
    ? pathname === href
    : pathname?.startsWith(href)
  
  return (
    <Link
      href={href}
      className={`block rounded px-3 py-2 text-sm font-medium transition-colors ${
        isActive 
          ? "bg-primary text-primary-foreground" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {children}
    </Link>
  )
}
