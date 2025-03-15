"use client"

import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { X } from 'lucide-react'
import { useState } from 'react'
import { getStripe } from '@/lib/stripe/client'

interface CartDisplayProps {
  recipientName?: string;
  recipientEmail?: string;
  senderName?: string;
  message?: string;
}

export default function CartDisplay({ 
  recipientName, 
  recipientEmail, 
  senderName, 
  message 
}: CartDisplayProps = {}) {
  const { items, removeFromCart, clearCart, checkout, totalPrice, serviceFee, grandTotal } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async () => {
    if (items.length === 0) return
    
    // Check if we have recipient information in the first item
    const firstItem = items[0]
    
    // If form values are provided, validate them
    if (recipientName || recipientEmail || senderName) {
      if (!recipientName) {
        setError('Please enter recipient name')
        return
      }
      
      if (!recipientEmail || !recipientEmail.includes('@')) {
        setError('Please enter a valid recipient email')
        return
      }
      
      if (!senderName) {
        setError('Please enter your name')
        return
      }
    } 
    // Otherwise check if the cart item has recipient info
    else if (!firstItem.recipientName || !firstItem.recipientEmail || !firstItem.senderName) {
      setError('Please enter recipient information')
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    try {
      // Use the checkout function from CartContext
      const result = await checkout()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create checkout session')
      }
      
      // Redirect to Stripe checkout
      if (result.url) {
        window.location.href = result.url
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }
  
  if (items.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Your cart is empty</p>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Gift Package ({items.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm mb-4">
            {error}
          </div>
        )}
        
        {items.map((item, index) => (
          <div key={index} className="flex items-start justify-between p-3 border border-border rounded-md">
            <div className="flex items-start gap-3">
              <div 
                className={`h-10 w-10 rounded-lg flex items-center justify-center bg-gradient-to-br ${item.platformColor}`}
              >
                <span className="text-white font-bold">
                  {item.platformName.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="font-medium">{item.platformName}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.subscription.period} - ${item.subscription.price.toFixed(2)}
                </p>
                <p className="text-xs mt-1">
                  For: {item.recipientName} ({item.recipientEmail})
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => removeFromCart(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        
        <div className="mt-4 p-3 bg-muted rounded-md">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span>Service fee:</span>
            <span>${serviceFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-medium mt-2 pt-2 border-t border-border">
            <span>Total:</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button 
          className="w-full" 
          size="lg" 
          onClick={handleCheckout}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : `Checkout $${grandTotal.toFixed(2)}`}
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={clearCart}
          className="w-full"
        >
          Clear Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
