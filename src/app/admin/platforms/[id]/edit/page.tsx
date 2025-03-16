"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { platformsTable } from "@/lib/supabase/client"
import { Platform } from "@/lib/supabase/types"
import { createPlatform, updatePlatform, getPlatformById } from "../../actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Using React.use to handle the params Promise
type PageProps = {
  params: Promise<{
    id: string
  }>
}

export default function EditPlatformPage(props: PageProps) {
  const router = useRouter()
  // Unwrap params using React.use
  const params = use(props.params)
  const id = params.id
  const isNewPlatform = id === "new"
  
  const [platform, setPlatform] = useState<Partial<Platform>>({
    name: "",
    company: "",
    category: "",
    description: "",
    features: [],
    color: "#7c3aed", // Default purple color
  })
  
  const [featuresInput, setFeaturesInput] = useState("")
  const [isLoading, setIsLoading] = useState(!isNewPlatform)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isNewPlatform) {
      fetchPlatform()
    }
  }, [isNewPlatform, id])

  const fetchPlatform = async () => {
    try {
      // Use server action to get platform by ID
      const response = await getPlatformById(id)
      
      if (response.success && response.data) {
        setPlatform(response.data)
        if (response.data.features && Array.isArray(response.data.features)) {
          setFeaturesInput(response.data.features.join("\n"))
        }
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPlatform({ ...platform, [name]: value })
  }

  const handleFeaturesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeaturesInput(e.target.value)
    // Convert the textarea input into an array of features
    const features = e.target.value
      .split("\n")
      .map(line => line.trim())
      .filter(line => line !== "")
    
    setPlatform({ ...platform, features })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)

    try {
      let response;
      
      if (isNewPlatform) {
        // Use server action to create platform
        response = await createPlatform(platform)
      } else {
        // Use server action to update platform
        response = await updatePlatform(id, platform)
      }
      
      if (response.success) {
        router.push("/admin/platforms")
      } else {
        setError(response.error || `Failed to ${isNewPlatform ? 'create' : 'update'} platform`)
        setIsSaving(false)
      }
    } catch (error: any) {
      console.error("Error saving platform:", error)
      setError(`Error ${isNewPlatform ? 'creating' : 'updating'} platform: ${error.message || JSON.stringify(error)}`)
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
          {isNewPlatform ? "Add Platform" : "Edit Platform"}
        </h1>
        <Button variant="outline" onClick={() => router.push("/admin/platforms")}>
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Platform Details</CardTitle>
            <CardDescription>
              Enter the details for this AI platform
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="name">Platform Name *</Label>
              <Input
                id="name"
                name="name"
                value={platform.name}
                onChange={handleChange}
                placeholder="e.g. ChatGPT Plus"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                name="company"
                value={platform.company || ""}
                onChange={handleChange}
                placeholder="e.g. OpenAI"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                name="category"
                value={platform.category}
                onChange={handleChange}
                placeholder="e.g. AI Assistant"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={platform.description}
                onChange={handleChange}
                placeholder="Describe what this platform offers..."
                rows={4}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="features">Features (one per line) *</Label>
              <Textarea
                id="features"
                value={featuresInput}
                onChange={handleFeaturesChange}
                placeholder="Access to GPT-4\nUnlimited messages\nImage generation"
                rows={5}
                required
              />
              <p className="text-xs text-muted-foreground">
                Enter each feature on a new line
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="color">Brand Color</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="color"
                  name="color"
                  type="color"
                  value={platform.color}
                  onChange={handleChange}
                  className="w-16 h-10 p-1"
                />
                <Input
                  name="color"
                  value={platform.color}
                  onChange={handleChange}
                  placeholder="#7c3aed"
                  className="flex-1"
                />
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/platforms")}
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
                "Save Platform"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
