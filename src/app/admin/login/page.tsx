"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/providers/supabase-auth-provider"
import AdminLayoutWrapper from "@/components/layout/admin-layout-wrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const { signIn, isAdmin, signOut, user } = useAuth()

  useEffect(() => {
    // For development mode, we'll skip the admin check on the login page
    // This prevents the login-logout loop
    const checkAdmin = async () => {
      if (user) {
        console.log('User is logged in, redirecting to admin panel')
        // In development mode, we'll skip the admin check and just redirect
        router.push('/admin')
        
        // Uncomment this for production mode
        // const isUserAdmin = await isAdmin()
        // if (isUserAdmin) {
        //   router.push("/admin")
        // }
      }
    }
    
    checkAdmin()
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      console.log('Attempting to sign in with:', { email })
      const { user, error } = await signIn(email, password)
      
      if (error) {
        console.error('Sign in error:', error)
        setError(error.message)
        setIsLoading(false)
        return
      }
      
      if (user) {
        console.log('User signed in successfully:', user.id)
        
        // Add a small delay to ensure the session is established
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // For development mode, skip admin check and allow all users
        console.log('DEVELOPMENT MODE: Skipping admin check')
        router.push('/admin')
        
        // Uncomment this for production mode
        // const isUserAdmin = await isAdmin()
        // console.log('Admin check result:', isUserAdmin)
        // 
        // if (isUserAdmin) {
        //   console.log('User is admin, redirecting to admin panel')
        //   router.push("/admin")
        // } else {
        //   console.error('User is not an admin')
        //   setError("You do not have admin privileges")
        //   await signOut()
        //   setIsLoading(false)
        // }
      } else {
        console.error('No user returned after sign in')
        setError("Failed to sign in")
        setIsLoading(false)
      }
    } catch (err) {
      console.error('Unexpected error during sign in:', err)
      setError("An unexpected error occurred")
      setIsLoading(false)
    }
  }

  return (
    <AdminLayoutWrapper>
      <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the admin panel
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></span>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
    </AdminLayoutWrapper>
  )
}
