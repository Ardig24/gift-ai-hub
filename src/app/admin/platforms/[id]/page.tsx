"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { platformsTable, subscriptionsTable } from "@/lib/supabase/client"
import { Platform, Subscription } from "@/lib/supabase/types"
import { deletePlatform, getPlatformById } from "../actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Using React.use to handle the params Promise
type PageProps = {
  params: Promise<{
    id: string
  }>
}

export default function PlatformDetailPage(props: PageProps) {
  const router = useRouter()
  // Unwrap params using React.use
  const params = use(props.params)
  const id = params.id
  
  const [platform, setPlatform] = useState<Platform | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  useEffect(() => {
    fetchPlatform()
  }, [id])

  const fetchPlatform = async () => {
    try {
      // Use server action to get platform by ID
      const response = await getPlatformById(id)
      
      if (response.success && response.data) {
        setPlatform(response.data)
      } else {
        setError(response.error || "Platform not found")
      }
    } catch (error: any) {
      console.error("Error fetching platform:", error)
      setError(error.message || "Failed to load platform")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      // Use server action to delete platform
      const response = await deletePlatform(id)
      
      if (response.success) {
        router.push("/admin/platforms")
      } else {
        setError(response.error || "Failed to delete platform")
      }
    } catch (error: any) {
      console.error("Error deleting platform:", error)
      setError(`Failed to delete platform: ${error.message || JSON.stringify(error)}`)
    } finally {
      setDeleteDialogOpen(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (error || !platform) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Platform Details</h1>
          <Button variant="outline" onClick={() => router.push("/admin/platforms")}>
            Back to Platforms
          </Button>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-muted-foreground">
              {error || "Platform not found"}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{platform.name}</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/admin/platforms")}>
            Back
          </Button>
          <Link href={`/admin/platforms/${id}/edit`}>
            <Button variant="secondary">Edit</Button>
          </Link>
          <Button 
            variant="destructive" 
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Platform Details</CardTitle>
            <CardDescription>
              Basic information about this platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                <dd className="mt-1">{platform.name}</dd>
              </div>
              
              {platform.company && (
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Company</dt>
                  <dd className="mt-1">{platform.company}</dd>
                </div>
              )}
              
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Category</dt>
                <dd className="mt-1">
                  <Badge variant="outline">{platform.category}</Badge>
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Description</dt>
                <dd className="mt-1">{platform.description}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Brand Color</dt>
                <dd className="mt-1 flex items-center gap-2">
                  <div 
                    className="h-6 w-6 rounded-full border" 
                    style={{ backgroundColor: platform.color }}
                  />
                  {platform.color}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
            <CardDescription>
              What this platform offers to users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {platform.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2 mt-1 h-2 w-2 rounded-full bg-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Subscriptions</CardTitle>
            <CardDescription>
              Available subscription options for this platform
            </CardDescription>
          </div>
          <Link href={`/admin/subscriptions/new?platformId=${platform.id}`}>
            <Button size="sm">Add Subscription</Button>
          </Link>
        </CardHeader>
        <CardContent>
          {!platform.subscriptions || platform.subscriptions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No subscriptions found for this platform. Add your first subscription option.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Popular</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {platform.subscriptions.map((subscription) => (
                    <TableRow key={subscription.id}>
                      <TableCell className="font-medium">{subscription.period}</TableCell>
                      <TableCell>${subscription.price.toFixed(2)}</TableCell>
                      <TableCell>{subscription.tier || "-"}</TableCell>
                      <TableCell>
                        {subscription.popular ? (
                          <Badge className="bg-green-500">Popular</Badge>
                        ) : (
                          <Badge variant="outline">No</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/subscriptions/${subscription.id}/edit`}>
                            <Button variant="ghost" size="sm">Edit</Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => {
                              // We'll implement subscription deletion later
                              alert("Delete subscription functionality coming soon")
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the platform &quot;{platform.name}&quot; and all associated subscriptions.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
