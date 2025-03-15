"use client"

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (sessionId) {
      fetchOrderDetails()
    } else {
      setIsLoading(false)
    }
  }, [sessionId])

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/checkout/session?sessionId=${sessionId}`)
      const data = await response.json()
      setOrderDetails(data)
    } catch (error) {
      console.error('Error fetching order details:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container max-w-md mx-auto py-12">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Processing Your Order</CardTitle>
            <CardDescription>Please wait while we confirm your payment...</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-md mx-auto py-12">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Thank You!</CardTitle>
          <CardDescription>Your gift purchase was successful</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center">
            We&apos;ve sent a confirmation email to you with all the details.
          </p>
          
          {orderDetails && (
            <div className="rounded-lg bg-muted p-4 text-sm">
              <p><strong>Order Reference:</strong> {orderDetails.id}</p>
              <p><strong>Platform:</strong> {orderDetails.platformName}</p>
              <p><strong>Subscription:</strong> {orderDetails.period}</p>
              <p><strong>Amount:</strong> ${orderDetails.amount.toFixed(2)}</p>
            </div>
          )}
          
          <p className="text-center text-sm text-muted-foreground">
            The recipient will receive an email with instructions on how to redeem their gift.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/">
            <Button>Return to Home</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
