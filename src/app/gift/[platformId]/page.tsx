"use client"

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { platformsTable } from '@/lib/supabase/client'
import { Platform, Subscription } from '@/lib/supabase/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { getStripe } from '@/lib/stripe/client'
import { use } from 'react'
import SuggestedGifts from '@/components/gift/SuggestedGifts'
import CartDisplay from '@/components/cart/CartDisplay'
import { useCart } from '@/contexts/CartContext'

type PageProps = {
  params: Promise<{
    platformId: string
  }>
}

export default function GiftPage(props: PageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  // Properly unwrap the params Promise using React.use()
  const params = use(props.params)
  const platformId = params.platformId
  
  // Get the period and fromPackage parameters from query
  const periodParam = searchParams.get('period')
  const fromPackage = searchParams.get('fromPackage') === 'true'
  
  const [platform, setPlatform] = useState<Platform | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPlatform, setIsLoadingPlatform] = useState(true)
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null)
  const [recipientEmail, setRecipientEmail] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [senderName, setSenderName] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  
  // Get cart functions
  const { items, removeFromCart, addToCart, clearCart } = useCart()

  useEffect(() => {
    fetchPlatform()
    
    // If coming from a gift package, we don't need to add the platform to cart
    // as it's already been added by the gift-pack page
    if (fromPackage) {
      console.log('Coming from gift package selection - items already in cart')
      
      // Scroll to the cart section after a short delay to ensure the page is rendered
      setTimeout(() => {
        const cartElement = document.getElementById('cart-section')
        if (cartElement) {
          cartElement.scrollIntoView({ behavior: 'smooth' })
        }
      }, 500)
    }
  }, [platformId, fromPackage])

  // This function updates the cart items with recipient information
  const updateCartWithRecipientInfo = (email: string, name: string, sender: string, msg: string) => {
    // Only update if we have items in the cart
    if (items.length === 0) return;
    
    // Store recipient info in localStorage for persistence
    const recipientInfo = {
      recipientName: name,
      recipientEmail: email,
      senderName: sender,
      message: msg || ''
    };
    localStorage.setItem('giftAiRecipientInfo', JSON.stringify(recipientInfo));
    
    // Create a copy of the current items
    const currentItems = [...items];
    
    // Clear the cart
    clearCart();
    
    // Add each item back with updated recipient info
    currentItems.forEach(item => {
      addToCart({
        ...item,
        recipientEmail: email,
        recipientName: name,
        senderName: sender,
        message: msg || ''
      });
    });
  }

  const fetchPlatform = async () => {
    setIsLoadingPlatform(true)
    try {
      // Try to fetch from hardcoded data first (more reliable for now)
      try {
        const response = await fetch('/api/platforms/hardcoded')
        if (response.ok) {
          const platforms = await response.json()
          const platform = platforms.find((p: any) => p.id === platformId)
          
          if (platform) {
            setPlatform(platform)
            if (platform.subscriptions && platform.subscriptions.length > 0) {
              // If we have a period parameter, try to find a matching subscription
              if (periodParam) {
                const matchingSubscription = platform.subscriptions.find(
                  (sub: Subscription) => sub.period === periodParam
                )
                if (matchingSubscription) {
                  setSelectedSubscription(matchingSubscription)
                } else {
                  // Fallback to first subscription if no match found
                  setSelectedSubscription(platform.subscriptions[0])
                }
              } else {
                // No period parameter, use first subscription
                setSelectedSubscription(platform.subscriptions[0])
              }
            }
            setIsLoadingPlatform(false)
            return // Exit early if we found the platform
          }
        }
      } catch (hardcodedError) {
        console.error('Error fetching from hardcoded platforms:', hardcodedError)
        // Continue to try database if hardcoded fetch fails
      }
      
      // If not found in hardcoded data, try the database
      try {
        const data = await platformsTable.getById(platformId)
        if (data) {
          setPlatform(data)
          // Select the first subscription by default if available
          if (data.subscriptions && data.subscriptions.length > 0) {
            setSelectedSubscription(data.subscriptions[0])
          }
        } else {
          setError(`Platform with ID "${platformId}" not found in database or hardcoded data`)
        }
      } catch (dbError) {
        console.error('Error fetching from database:', dbError)
        setError(`Platform with ID "${platformId}" not found. Please try another platform.`)
      }
    } catch (error) {
      console.error('Error in fetchPlatform:', error)
      setError(`Unable to load platform details. Please try again later.`)
    } finally {
      setIsLoadingPlatform(false)
    }
  }

  const handleSubscriptionChange = (subscriptionId: string) => {
    if (platform?.subscriptions) {
      const subscription = platform.subscriptions.find(sub => sub.id === subscriptionId)
      if (subscription) {
        setSelectedSubscription(subscription)
      }
    }
  }

  if (isLoadingPlatform) {
    return (
      <div className="container max-w-3xl mx-auto py-12">
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    )
  }

  if (error || !platform) {
    return (
      <div className="container max-w-3xl mx-auto py-12">
        <Alert variant="destructive">
          <AlertDescription>{error || 'Platform not found'}</AlertDescription>
        </Alert>
        <div className="mt-4 flex justify-center">
          <Button onClick={() => router.push('/')}>Return to Home</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-5xl mx-auto py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Gift {platform.name}</h1>
        <p className="text-muted-foreground">
          Send a subscription as a gift to someone special
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-5">
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Recipient Information</CardTitle>
              <CardDescription>
                Enter details for your gift recipient
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="recipientEmail">Recipient Email *</Label>
                <Input
                  id="recipientEmail"
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => {
                    setRecipientEmail(e.target.value);
                    updateCartWithRecipientInfo(e.target.value, recipientName, senderName, message);
                  }}
                  placeholder="Where to send the gift"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipientName">Recipient Name *</Label>
                <Input
                  id="recipientName"
                  value={recipientName}
                  onChange={(e) => {
                    setRecipientName(e.target.value);
                    updateCartWithRecipientInfo(recipientEmail, e.target.value, senderName, message);
                  }}
                  placeholder="Who is this gift for?"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="senderName">Your Name *</Label>
                <Input
                  id="senderName"
                  value={senderName}
                  onChange={(e) => {
                    setSenderName(e.target.value);
                    updateCartWithRecipientInfo(recipientEmail, recipientName, e.target.value, message);
                  }}
                  placeholder="Who is this gift from?"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Personal Message (Optional)</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    updateCartWithRecipientInfo(recipientEmail, recipientName, senderName, e.target.value);
                  }}
                  placeholder="Add a personal message to your gift"
                  rows={3}
                />
              </div>
              
              {/* Removed the Update Gift Details button - recipient info will be saved at checkout */}
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>{platform.name}</CardTitle>
              <CardDescription>
                {platform.company}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between space-y-4">
              <div>
                <div 
                  className="w-full h-32 rounded-md bg-cover bg-center mb-4"
                  style={{ 
                    backgroundColor: platform.color || '#7c3aed'
                  }}
                />
                
                <p className="line-clamp-2">{platform.description}</p>
                
                {platform.features && platform.features.length > 0 && (
                  <div className="space-y-2 mt-4">
                    <h3 className="font-medium">Features:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {platform.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="line-clamp-1">{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="p-3 bg-muted rounded-md mt-auto">
                <div className="flex justify-between text-sm">
                  <span>Subscription:</span>
                  <span>{selectedSubscription?.period} - ${selectedSubscription?.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span>Service fee:</span>
                  <span>$4.99</span>
                </div>
                {selectedSubscription && (
                  <div className="flex justify-between font-medium mt-2 pt-2 border-t border-border">
                    <span>Total:</span>
                    <span>${(selectedSubscription.price + 4.99).toFixed(2)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Suggested Gifts Section */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Complete Your Gift Package</h2>
        <p className="text-muted-foreground mb-6">Consider adding these popular gifts before checkout</p>
        <SuggestedGifts 
          currentPlatformId={platformId} 
          selectedPeriod={selectedSubscription?.period || '3 months'} 
          recipientName={recipientName}
          recipientEmail={recipientEmail}
          senderName={senderName}
          message={message}
        />
      </div>
      
      {/* Cart Display Section */}
      <div className="mt-12" id="cart-section">
        <h2 className="text-xl font-semibold mb-4">Your Gift Package</h2>
        {fromPackage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md text-green-800">
            <p className="font-medium">Gift package selected!</p>
            <p className="text-sm">Please complete the recipient information above and proceed to checkout.</p>
          </div>
        )}
        <CartDisplay 
          recipientName={recipientName}
          recipientEmail={recipientEmail}
          senderName={senderName}
          message={message}
        />
      </div>
    </div>
  )
}
