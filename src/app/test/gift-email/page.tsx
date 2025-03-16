"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'

type TestEmailFormData = {
  recipientEmail: string
  recipientName: string
  senderName: string
  message: string
  platformId: string
  subscriptionId: string
}

export default function TestGiftEmailPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<any>(null)
  
  const { register, handleSubmit, formState: { errors } } = useForm<TestEmailFormData>({
    defaultValues: {
      recipientEmail: '',
      recipientName: 'Test Recipient',
      senderName: 'Test Sender',
      message: 'This is a test gift message!',
      platformId: 'chatgpt',
      subscriptionId: '3months'
    }
  })
  
  const onSubmit = async (data: TestEmailFormData) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/test/gift-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      const result = await response.json()
      setResult(result)
    } catch (error) {
      console.error('Error sending test email:', error)
      setResult({ success: false, message: 'Error sending test email' })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Test Gift Email</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="recipientEmail" className="text-sm font-medium">
              Recipient Email *
            </label>
            <input
              id="recipientEmail"
              type="email"
              className="w-full rounded-md border border-gray-300 p-2"
              {...register("recipientEmail", { required: "Recipient email is required" })}
            />
            {errors.recipientEmail && (
              <p className="text-sm text-red-500">{errors.recipientEmail.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="recipientName" className="text-sm font-medium">
              Recipient Name
            </label>
            <input
              id="recipientName"
              type="text"
              className="w-full rounded-md border border-gray-300 p-2"
              {...register("recipientName")}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="senderName" className="text-sm font-medium">
              Sender Name
            </label>
            <input
              id="senderName"
              type="text"
              className="w-full rounded-md border border-gray-300 p-2"
              {...register("senderName")}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Gift Message
            </label>
            <textarea
              id="message"
              className="w-full rounded-md border border-gray-300 p-2"
              rows={3}
              {...register("message")}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="platformId" className="text-sm font-medium">
              Platform
            </label>
            <select
              id="platformId"
              className="w-full rounded-md border border-gray-300 p-2"
              {...register("platformId")}
            >
              <option value="chatgpt">ChatGPT Plus</option>
              <option value="claude">Claude Pro</option>
              <option value="midjourney">Midjourney</option>
              <option value="perplexity">Perplexity Pro</option>
              <option value="github-copilot">GitHub Copilot</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="subscriptionId" className="text-sm font-medium">
              Subscription Period
            </label>
            <select
              id="subscriptionId"
              className="w-full rounded-md border border-gray-300 p-2"
              {...register("subscriptionId")}
            >
              <option value="1month">1 Month</option>
              <option value="3months">3 Months</option>
              <option value="1year">1 Year</option>
            </select>
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Test Email'}
          </button>
        </form>
        
        {result && (
          <div className={`mt-6 p-4 rounded-md ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <h3 className="font-medium">{result.success ? 'Success!' : 'Error'}</h3>
            <p>{result.message}</p>
            {result.giftCode && (
              <p className="mt-2">
                <span className="font-medium">Gift Code:</span> {result.giftCode}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
