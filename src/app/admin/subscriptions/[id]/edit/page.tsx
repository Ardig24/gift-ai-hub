"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { platformsTable } from "@/lib/supabase/client"
import { Platform, Subscription } from "@/lib/supabase/types"
import { createSubscription, updateSubscription, getSubscriptionById } from "../../actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Using a type assertion to handle the params warning
type PageProps = {
  params: {
    id: string
  }
}

export default function EditSubscriptionPage(props: PageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  // Access params safely with type assertion
  const id = String(props.params.id)
  const isNewSubscription = id === "new"
  const platformIdFromQuery = searchParams.get("platformId")
  
  const [subscription, setSubscription] = useState<Partial<Subscription>>({
    platform_id: platformIdFromQuery || "",
    period: "1 month",
    price: 0,
    tier: "",
    credits: "",
    popular: false,
  })
  
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPlatforms()
    
    if (!isNewSubscription) {
      fetchSubscription()
    } else {
      setIsLoading(false)
    }
  }, [isNewSubscription, id])

  const fetchPlatforms = async () => {
    try {
      const data = await platformsTable.getAll()
      setPlatforms(data)
    } catch (error) {
      console.error("Error fetching platforms:", error)
      setError("Failed to load platforms")
    }
  }

  const fetchSubscription = async () => {
    try {
      // Use server action to get subscription by ID
      const response = await getSubscriptionById(id)
      
      if (response.success && response.data) {
        setSubscription(response.data)
      } else {
        setError(response.error || "Subscription not found")
      }
    } catch (error: any) {
      console.error("Error fetching subscription:", error)
      setError(error.message || "Failed to load subscription")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setSubscription({ 
      ...subscription, 
      [name]: type === "checkbox" ? checked : value 
    })
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSubscription({ 
      ...subscription, 
      [name]: value === "" ? 0 : parseFloat(value) 
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setSubscription({ ...subscription, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)

    try {
      if (!subscription.platform_id) {
        throw new Error("Please select a platform")
      }

      let response;
      
      if (isNewSubscription) {
        // Use server action to create subscription
        response = await createSubscription(subscription)
      } else {
        // Use server action to update subscription
        response = await updateSubscription(id, subscription)
      }
      
      if (response.success) {
        router.push(`/admin/platforms/${subscription.platform_id}`)
      } else {
        setError(response.error || `Failed to ${isNewSubscription ? 'create' : 'update'} subscription`)
        setIsSaving(false)
      }
    } catch (error: any) {
      console.error("Error saving subscription:", error)
      setError(error.message || "Failed to save subscription")
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {isNewSubscription ? "Add Subscription" : "Edit Subscription"}
        </h1>
        <Button variant="outline" onClick={() => router.push("/admin/subscriptions")}>
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Subscription Details</CardTitle>
            <CardDescription>
              Enter the details for this subscription option
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="platform_id">Platform *</Label>
              <Select
                value={subscription.platform_id || ""}
                onValueChange={(value: string) => handleSelectChange("platform_id", value)}
                disabled={!!platformIdFromQuery}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a platform" />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map((platform) => (
                    <SelectItem key={platform.id} value={platform.id}>
                      {platform.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="period">Subscription Period *</Label>
              <Select
                value={subscription.period}
                onValueChange={(value: string) => handleSelectChange("period", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1 month">1 Month</SelectItem>
                  <SelectItem value="3 months">3 Months</SelectItem>
                  <SelectItem value="6 months">6 Months</SelectItem>
                  <SelectItem value="1 year">1 Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Price (USD) *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={subscription.price === 0 ? "" : subscription.price}
                  onChange={handleNumberChange}
                  className="pl-7"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tier">Tier (Optional)</Label>
              <Input
                id="tier"
                name="tier"
                value={subscription.tier || ""}
                onChange={handleChange}
                placeholder="e.g. Basic, Pro, Enterprise"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="credits">Credits/Limits (Optional)</Label>
              <Input
                id="credits"
                name="credits"
                value={subscription.credits || ""}
                onChange={handleChange}
                placeholder="e.g. 100 credits, Unlimited usage"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="popular"
                name="popular"
                checked={subscription.popular || false}
                onCheckedChange={(checked: boolean | 'indeterminate') => 
                  setSubscription({ ...subscription, popular: checked === true })
                }
              />
              <Label htmlFor="popular" className="font-normal">
                Mark as popular (highlighted to users)
              </Label>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/subscriptions")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></span>
                  Saving...
                </>
              ) : (
                "Save Subscription"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
