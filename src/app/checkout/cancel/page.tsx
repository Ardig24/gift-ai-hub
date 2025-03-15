"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { XCircle } from 'lucide-react'

export default function CheckoutCancelPage() {
  return (
    <div className="container max-w-md mx-auto py-12">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl">Payment Cancelled</CardTitle>
          <CardDescription>Your order was not completed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center">
            You have cancelled the payment process. No charges have been made to your account.
          </p>
          
          <p className="text-center text-sm text-muted-foreground">
            If you experienced any issues during checkout, please try again or contact our support team.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Link href="/">
            <Button variant="outline">Return to Home</Button>
          </Link>
          <Link href="/platforms">
            <Button>Try Again</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
