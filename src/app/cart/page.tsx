"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useCart } from '@/contexts/CartContext'
import { ShoppingCart, Trash2, ArrowLeft, Gift } from 'lucide-react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { SERVICE_FEE } from '@/lib/stripe/server'

export default function CartPage() {
  const router = useRouter()
  const { items, removeFromCart, clearCart, checkout } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  
  // Calculate subtotal
  const subtotal = items.reduce((total, item) => total + item.subscription.price, 0)
  const total = subtotal + (SERVICE_FEE / 100) // SERVICE_FEE is in cents
  
  const handleCheckout = async () => {
    if (items.length === 0) return
    
    setIsLoading(true)
    
    try {
      // Use the checkout function from the cart context
      const result = await checkout()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create checkout session')
      }
      
      // Redirect to Stripe checkout
      if (result.url) {
        window.location.href = result.url
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('There was an error processing your checkout. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="flex items-center mb-8">
        <ShoppingCart className="mr-2 h-6 w-6" />
        <h1 className="text-3xl font-bold">Your Gift Package</h1>
      </div>
      
      {items.length === 0 ? (
        <Card className="w-full">
          <CardContent className="pt-6 text-center">
            <div className="flex flex-col items-center justify-center py-12">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Your gift package is empty</h2>
              <p className="text-muted-foreground mb-6">Add some AI gifts to make someone's day!</p>
              <Link href="/platforms">
                <Button>
                  <Gift className="mr-2 h-4 w-4" />
                  Browse AI Platforms
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Gift Items ({items.length})</CardTitle>
                <CardDescription>Review your selected gifts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg">
                    <div className={`w-full sm:w-16 h-16 rounded-md bg-gradient-to-br ${item.platformColor} flex items-center justify-center text-white font-bold text-lg`}>
                      {item.platformName.substring(0, 2)}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <h3 className="font-semibold">{item.platformName}</h3>
                        <div className="font-semibold">{formatPrice(item.subscription.price)}</div>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.subscription.period} subscription</p>
                      <div className="mt-2 text-sm">
                        <p>To: {item.recipientName} ({item.recipientEmail})</p>
                        <p>From: {item.senderName}</p>
                        {item.message && <p className="mt-1 italic">"{item.message}"</p>}
                      </div>
                    </div>
                    <div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeFromCart(index)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => clearCart()}>
                  Clear All
                </Button>
                <Link href="/platforms?preserve_cart=true">
                  <Button variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Add More Gifts
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Fee</span>
                  <span>{formatPrice(SERVICE_FEE / 100)}</span>
                </div>
                <div className="border-t pt-4 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={handleCheckout}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                      Processing...
                    </>
                  ) : (
                    'Proceed to Checkout'
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
