"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { getStripe } from '@/lib/stripe/client'
import { Platform, Subscription } from '@/lib/supabase/types'

interface CheckoutButtonProps {
  platform: Platform
  subscription: Subscription
  recipientEmail?: string
  recipientName?: string
  senderName?: string
  message?: string
  className?: string
}

export default function CheckoutButton({
  platform,
  subscription,
  recipientEmail,
  recipientName,
  senderName,
  message,
  className,
}: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async () => {
    setIsLoading(true)

    try {
      // Create a checkout session on the server
      // Validate required fields
      if (!recipientEmail || !recipientName || !senderName) {
        alert('Please fill in all required fields');
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platformId: platform.id,
          platformName: platform.name,
          subscriptionId: subscription.id,
          period: subscription.period,
          price: subscription.price,
          recipientEmail,
          recipientName,
          senderName,
          message,
        }),
      })

      // Parse the response once
      const data = await response.json()
      console.log('Checkout response:', data)

      // Check if the response contains a URL or sessionId
      if (data.url) {
        // Redirect to Stripe Checkout using the URL
        window.location.href = data.url
      } else if (data.sessionId) {
        // If we have a sessionId but no URL, use Stripe.js to redirect
        const stripe = await getStripe()
        await stripe?.redirectToCheckout({ sessionId: data.sessionId })
      } else {
        throw new Error('No checkout URL or session ID returned')
      }
    } catch (error) {
      console.error('Error during checkout:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate total price including service fee
  const serviceFee = 4.99; // $4.99 service fee
  const totalPrice = subscription.price + serviceFee;

  return (
    <Button 
      onClick={handleCheckout} 
      disabled={isLoading}
      className={className}
    >
      {isLoading ? (
        <>
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
          Processing...
        </>
      ) : (
        `Complete Purchase ($${totalPrice.toFixed(2)})`
      )}
    </Button>
  )
}
