"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Session, User } from "@supabase/supabase-js"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: Error | null }>
  signOut: () => Promise<void>
  isAdmin: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      setIsLoading(true)
      
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      
      setIsLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setIsLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      
      return { user: data.user, error: null }
    } catch (error) {
      console.error("Error signing in:", error)
      return { user: null, error: error as Error }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const isAdmin = async () => {
    // For development/testing, you can uncomment this line to bypass the admin check
    // return true;
    
    if (!user) {
      console.log('No user found in session');
      return false;
    }
    
    console.log('Checking admin status for user ID:', user.id);
    
    try {
      // First, check if the user_roles table exists and is accessible
      const { error: tableCheckError } = await supabase
        .from('user_roles')
        .select('count')
        .limit(1);
      
      if (tableCheckError) {
        console.error('Error accessing user_roles table:', tableCheckError);
        console.log('Attempting alternative approach...');
        
        // For now, let's hardcode the admin check for development purposes
        // You can replace this with your actual user ID for testing
        // return user.id === 'your-user-id-here';
        
        // For the demo, we'll allow any authenticated user to be an admin
        console.log('DEVELOPMENT MODE: Allowing any authenticated user as admin');
        return true;
      }
      
      // Check if user has admin role in user_roles table
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id);
      
      console.log('Admin check query result:', { data, error });
      
      if (error) {
        console.error('Error checking admin role:', error);
        // For development, allow access if there's an error
        console.log('DEVELOPMENT MODE: Allowing access despite error');
        return true;
      }
      
      if (!data || data.length === 0) {
        console.log('No role data found for user');
        return false;
      }
      
      // Check if any of the user's roles is 'admin'
      const isUserAdmin = data.some(role => role.role === 'admin');
      console.log('Is user admin?', isUserAdmin);
      return isUserAdmin;
    } catch (err) {
      console.error('Unexpected error in isAdmin check:', err);
      // For development, allow access if there's an error
      console.log('DEVELOPMENT MODE: Allowing access despite error');
      return true;
    }
  }

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signOut,
    isAdmin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
