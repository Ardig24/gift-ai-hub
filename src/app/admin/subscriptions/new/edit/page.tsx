"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { platformsTable } from "@/lib/supabase/client"
import { Platform, Subscription } from "@/lib/supabase/types"
import { createSubscription } from "../../actions"
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

export default function NewSubscriptionPage() {
  const router = useRouter()
  const isNewSubscription = true
  
  const [subscription, setSubscription] = useState<Partial<Subscription>>({
    platform_id: "",
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
    setIsLoading(false)
  }, [])

  const fetchPlatforms = async () => {
    try {
      const data = await platformsTable.getAll()
      setPlatforms(data)
    } catch (error) {
      console.error("Error fetching platforms:", error)
      setError("Failed to load platforms")
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

      // Use server action to create subscription
      const response = await createSubscription(subscription)
      
      if (response.success) {
        router.push(`/admin/platforms/${subscription.platform_id}`)
      } else {
        setError(response.error || "Failed to create subscription")
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
          Add Subscription
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
              <Label htmlFor="price">Price ($) *</Label>
              <Input
                type="number"
                name="price"
                value={subscription.price}
                onChange={handleNumberChange}
                step="0.01"
                min="0"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tier">Tier (optional)</Label>
              <Input
                type="text"
                name="tier"
                value={subscription.tier || ""}
                onChange={handleChange}
                placeholder="e.g. Basic, Pro, Enterprise"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="credits">Credits (optional)</Label>
              <Input
                type="text"
                name="credits"
                value={subscription.credits || ""}
                onChange={handleChange}
                placeholder="e.g. 100 credits"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="popular"
                name="popular"
                checked={subscription.popular || false}
                onCheckedChange={(checked) => 
                  setSubscription({ ...subscription, popular: checked === true })
                }
              />
              <Label htmlFor="popular" className="cursor-pointer">
                Mark as popular option
              </Label>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => router.push("/admin/subscriptions")}
              type="button"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>
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
