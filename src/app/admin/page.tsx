"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { platformsTable, subscriptionsTable } from "@/lib/supabase/client"
import { Platform, Subscription } from "@/lib/supabase/types"

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    platformCount: 0,
    subscriptionCount: 0,
    categories: 0,
    // We'll add order stats later when we implement that functionality
  })

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const platforms = await platformsTable.getAll()
        
        // Calculate stats
        const platformCount = platforms.length
        const categories = new Set(platforms.map((p: Platform) => p.category)).size
        
        // Count total subscriptions
        let subscriptionCount = 0
        platforms.forEach((platform: Platform) => {
          if (platform.subscriptions) {
            subscriptionCount += platform.subscriptions.length
          }
        })
        
        setStats({
          platformCount,
          subscriptionCount,
          categories,
        })
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>
      
      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Platforms"
              value={stats.platformCount}
              description="AI platforms available"
              href="/admin/platforms"
            />
            <StatCard
              title="Subscriptions"
              value={stats.subscriptionCount}
              description="Subscription options"
              href="/admin/subscriptions"
            />
            <StatCard
              title="Categories"
              value={stats.categories}
              description="Platform categories"
              href="/admin/platforms"
            />
            <StatCard
              title="Orders"
              value={0}
              description="Total gift orders"
              href="/admin/orders"
            />
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest updates to your platforms and subscriptions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6 text-muted-foreground">
                  Activity data will appear here once you start adding platforms
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common administrative tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link 
                    href="/admin/platforms/new" 
                    className="block w-full rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    Add New Platform
                  </Link>
                  <Link 
                    href="/admin/subscriptions/new" 
                    className="block w-full rounded-md bg-secondary px-4 py-2 text-center text-sm font-medium text-secondary-foreground hover:bg-secondary/90"
                  >
                    Add New Subscription
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}

function StatCard({ 
  title, 
  value, 
  description, 
  href 
}: { 
  title: string
  value: number
  description: string
  href: string
}) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
