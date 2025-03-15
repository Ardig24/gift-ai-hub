"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Platform } from '@/lib/supabase/types'
import { useCart } from '@/contexts/CartContext'

interface SuggestedGiftsProps {
  currentPlatformId: string
  selectedPeriod: string
  recipientName: string
  recipientEmail: string
  senderName: string
  message: string
}

export default function SuggestedGifts({ currentPlatformId, selectedPeriod, recipientName, recipientEmail, senderName, message }: SuggestedGiftsProps) {
  const { addToCart } = useCart()
  const [suggestions, setSuggestions] = useState<Platform[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSuggestions = async () => {
      setIsLoading(true)
      try {
        // Fetch all platforms
        const response = await fetch('/api/platforms/hardcoded')
        if (response.ok) {
          const allPlatforms = await response.json()
          
          // Filter out the current platform
          const otherPlatforms = allPlatforms.filter(
            (platform: Platform) => platform.id !== currentPlatformId
          )
          
          // Get 2 random platforms as suggestions
          const randomSuggestions = getRandomItems(otherPlatforms, 2)
          setSuggestions(randomSuggestions)
        }
      } catch (error) {
        console.error('Error fetching suggested platforms:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchSuggestions()
  }, [currentPlatformId])
  
  // Helper function to get random items from an array
  const getRandomItems = (array: any[], count: number) => {
    const shuffled = [...array].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }
  
  if (isLoading || suggestions.length === 0) {
    return null
  }
  
  return (
    <div>
      {/* Heading and description are now moved to the parent component */}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {suggestions.map((platform) => {
          // Find the subscription that matches the selected period
          const matchingSubscription = platform.subscriptions?.find(
            sub => sub.period === selectedPeriod
          ) || (platform.subscriptions && platform.subscriptions.length > 0 ? platform.subscriptions[0] : { period: '1 month', price: 0 })
          
          return (
            <Card key={platform.id} className="border border-border/50 hover:border-primary/30 transition-all">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div 
                    className={`h-10 w-10 rounded-lg flex items-center justify-center bg-gradient-to-br ${platform.color}`}
                  >
                    <span className="text-white font-bold">
                      {platform.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">{platform.name}</CardTitle>
                    <CardDescription>
                      {platform.company || 'Popular AI Platform'}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-sm line-clamp-2 text-muted-foreground">
                  {platform.description}
                </p>
                <div className="mt-3 flex items-baseline">
                  <span className="text-lg font-bold">${matchingSubscription.price.toFixed(2)}</span>
                  <span className="ml-1 text-sm text-muted-foreground">
                    / {matchingSubscription.period}
                  </span>
                  <span className="ml-2 text-xs text-primary">+ $4.99 service fee</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    // Validate the form data
                    if (!recipientName) {
                      alert('Please enter a recipient name in the form above');
                      return;
                    }
                    
                    if (!recipientEmail || !recipientEmail.includes('@')) {
                      alert('Please enter a valid recipient email in the form above');
                      return;
                    }
                    
                    if (!senderName) {
                      alert('Please enter your name in the form above');
                      return;
                    }
                    
                    // Create a valid subscription object from the matching subscription
                    const subscriptionObj = {
                      id: typeof matchingSubscription === 'object' && 'id' in matchingSubscription && matchingSubscription.id ? 
                          matchingSubscription.id : `${platform.id}-${matchingSubscription.period}`,
                      platform_id: platform.id,
                      period: matchingSubscription.period,
                      price: matchingSubscription.price,
                      popular: typeof matchingSubscription === 'object' && 'popular' in matchingSubscription ? 
                          !!matchingSubscription.popular : false,
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString()
                    };
                    
                    // Add to cart with recipient information
                    addToCart({
                      platformId: platform.id,
                      platformName: platform.name,
                      platformColor: platform.color || 'from-blue-500 to-indigo-600',
                      subscription: subscriptionObj,
                      recipientName,
                      recipientEmail,
                      senderName,
                      message
                    });
                    
                    // Show a more subtle notification
                    const notification = document.createElement('div');
                    notification.className = 'fixed bottom-4 right-4 bg-primary text-white px-4 py-2 rounded-md shadow-lg';
                    notification.textContent = `Added ${platform.name} to your gift package!`;
                    document.body.appendChild(notification);
                    
                    // Remove notification after 3 seconds
                    setTimeout(() => {
                      notification.remove();
                    }, 3000);
                  }}
                >
                  Add This Gift
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
