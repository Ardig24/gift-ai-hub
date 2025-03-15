"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useForm } from "react-hook-form"

// Define the form data type
type RedeemFormData = {
  giftCode: string
  email: string
}

export default function RedeemPage() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [giftDetails, setGiftDetails] = useState<any>(null)
  
  const { register, handleSubmit, formState: { errors } } = useForm<RedeemFormData>({
    defaultValues: {
      giftCode: "",
      email: ""
    }
  })
  
  // Handle form submission
  const onSubmit = async (data: RedeemFormData) => {
    setIsSubmitting(true)
    
    // In a real application, this would verify the gift code with your backend
    console.log("Redeem form data:", data)
    
    // Simulate API call and successful gift code verification
    setTimeout(() => {
      setIsSubmitting(false)
      
      // Mock gift details that would come from the backend
      setGiftDetails({
        platform: {
          id: "chatgpt",
          name: "ChatGPT Plus",
          description: "Access to GPT-4o, faster response times, and priority features",
          basePrice: 20,
          icon: "chat"
        },
        subscription: {
          id: "3months",
          name: "3 Months",
          expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString()
        },
        sender: {
          name: "Alex Johnson"
        },
        message: "Happy birthday! I thought you'd enjoy exploring AI with this subscription. Enjoy!"
      })
      
      setStep(2)
    }, 1500)
  }
  
  // Handle redemption confirmation
  const handleConfirmRedemption = () => {
    setIsSubmitting(true)
    
    // In a real application, this would complete the redemption process with your backend
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
    }, 1500)
  }
  
  // Get icon component based on platform icon type
  const getIconComponent = (iconType: string) => {
    switch (iconType) {
      case "chat":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
            <path d="M12 2v4"></path>
            <path d="M12 18v4"></path>
            <path d="M4.93 4.93l2.83 2.83"></path>
            <path d="M16.24 16.24l2.83 2.83"></path>
            <path d="M2 12h4"></path>
            <path d="M18 12h4"></path>
            <path d="M4.93 19.07l2.83-2.83"></path>
            <path d="M16.24 7.76l2.83-2.83"></path>
          </svg>
        )
    }
  }
  
  // If success, show success message
  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="max-w-md mx-auto text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 h-8 w-8">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">Gift Redeemed Successfully!</h1>
          <p className="text-muted-foreground mb-8">
            Your {giftDetails?.platform.name} subscription has been activated. You will receive an email with instructions on how to access your new AI platform.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              Back to Home
            </Link>
            <a
              href={`https://${giftDetails?.platform.id === 'chatgpt' ? 'chat.openai.com' : giftDetails?.platform.id}.com`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Go to {giftDetails?.platform.name}
            </a>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Redeem Your AI Gift</h1>
          <p className="mt-4 text-muted-foreground md:text-xl">
            Enter your gift code to activate your AI platform membership
          </p>
        </div>
        
        {step === 1 && (
          <div className="bg-muted/30 rounded-lg p-6 shadow-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="giftCode" className="text-sm font-medium">
                    Gift Code
                  </label>
                  <input
                    id="giftCode"
                    type="text"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Enter your gift code (e.g., GIFT-1234-ABCD)"
                    {...register("giftCode", { 
                      required: "Gift code is required",
                      pattern: {
                        value: /^[A-Z0-9-]{10,}$/i,
                        message: "Please enter a valid gift code"
                      }
                    })}
                  />
                  {errors.giftCode && (
                    <p className="text-sm text-red-500">{errors.giftCode.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Your Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Enter your email address"
                    {...register("email", { 
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </>
                ) : (
                  "Verify Gift Code"
                )}
              </button>
            </form>
            
            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="text-sm font-medium mb-4">Don't have a gift code?</h3>
              <Link
                href="/gift"
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground w-full"
              >
                Send a Gift
              </Link>
            </div>
          </div>
        )}
        
        {step === 2 && giftDetails && (
          <div className="bg-muted/30 rounded-lg p-6 shadow-sm">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                  {getIconComponent(giftDetails.platform.icon)}
                </div>
                <div>
                  <h3 className="font-bold">{giftDetails.platform.name}</h3>
                  <p className="text-sm text-muted-foreground">{giftDetails.subscription.name} Subscription</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-background rounded-lg p-4 border border-border">
                  <h3 className="font-medium text-sm mb-2">Gift Details</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Platform:</span>
                      <span className="font-medium">{giftDetails.platform.name}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">{giftDetails.subscription.name}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Expires On:</span>
                      <span className="font-medium">{giftDetails.subscription.expiresAt}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">From:</span>
                      <span className="font-medium">{giftDetails.sender.name}</span>
                    </li>
                  </ul>
                </div>
                
                {giftDetails.message && (
                  <div className="bg-background rounded-lg p-4 border border-border">
                    <h3 className="font-medium text-sm mb-2">Personal Message</h3>
                    <p className="text-sm italic">"{giftDetails.message}"</p>
                  </div>
                )}
                
                <div className="bg-background rounded-lg p-4 border border-border">
                  <h3 className="font-medium text-sm mb-2">About {giftDetails.platform.name}</h3>
                  <p className="text-sm text-muted-foreground">{giftDetails.platform.description}</p>
                </div>
              </div>
              
              <button
                type="button"
                className="w-full inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50"
                onClick={handleConfirmRedemption}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Redeem Gift"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
