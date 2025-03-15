"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ChevronDown } from "lucide-react"
import { useCart } from "@/contexts/CartContext"

// Import types from supabase
import { Platform as PlatformType, Subscription as SubscriptionType } from '@/lib/supabase/types'

// Define local types for platform data
type Subscription = {
  period: string;
  price: number;
  popular: boolean;
  savings?: string;
  tier?: string;
  credits?: string;
  id?: string;
}

type Platform = {
  id: string;
  name: string;
  company?: string;
  category: string;
  description: string;
  features: string[];
  subscriptions: Subscription[];
  color: string;
}

// Platform categories
const categories = [
  "AI Chatbots & Virtual Assistants",
  "AI Image Generation & Editing",
  "AI Video & Animation Tools",
  "AI Voice & Speech Tools",
  "AI Writing & Content Generation",
  "AI Productivity & Research Tools",
  "AI Design & Branding Tools",
  "AI Game Development & 3D Modeling",
  "AI Music & Audio Generation",
  "AI Code Generation & Development Tools",
  "AI Full-Stack Development Platforms",
  "AI Smart Home & Personal Assistants",
  "AI Business & Sales Tools",
  "AI Search & Discovery",
  "AI Marketing & Social Media Tools"
];

// Platform data
const platforms: Platform[] = [
  {
    id: "chatgpt",
    name: "ChatGPT Plus",
    company: "OpenAI",
    category: "AI Chatbots & Virtual Assistants",
    description: "Access GPT-4o, GPT-4, and other advanced AI models with faster response times and priority access during peak times.",
    features: [
      "Access to GPT-4o and GPT-4 models",
      "Priority access during peak times",
      "Faster response times",
      "Access to DALL·E 3 image generation",
      "Access to Advanced Data Analysis",
      "Web browsing capabilities"
    ],
    subscriptions: [
      { period: "1 month", price: 20, popular: false },
      { period: "3 months", price: 57, popular: true, savings: "5%" },
      { period: "1 year", price: 192, popular: false, savings: "20%" }
    ],
    color: "from-green-500 to-blue-600"
  },
  {
    id: "claude",
    name: "Claude Pro",
    company: "Anthropic",
    category: "AI Chatbots & Virtual Assistants",
    description: "Unlock the full power of Claude with higher message limits, priority access, and the ability to upload and analyze files.",
    features: [
      "5x more messages than free tier",
      "Priority access during peak times",
      "Longer context window",
      "Ability to upload and analyze files",
      "Access to Claude 3 Opus model",
      "Early access to new features"
    ],
    subscriptions: [
      { period: "1 month", price: 20, popular: false },
      { period: "3 months", price: 57, popular: true, savings: "5%" },
      { period: "1 year", price: 192, popular: false, savings: "20%" }
    ],
    color: "from-purple-500 to-indigo-600"
  },
  {
    id: "midjourney",
    name: "Midjourney",
    category: "AI Image Generation & Editing",
    description: "Create stunning AI-generated artwork and images with one of the most powerful image generation models available.",
    features: [
      "Generate high-quality AI images",
      "Fast GPU time for image generation",
      "Access to latest Midjourney model",
      "Commercial usage rights",
      "Upscaling capabilities",
      "Variation generation"
    ],
    subscriptions: [
      { period: "1 month", price: 10, popular: false, tier: "Basic" },
      { period: "1 month", price: 30, popular: true, tier: "Standard" },
      { period: "1 month", price: 60, popular: false, tier: "Pro" }
    ],
    color: "from-pink-500 to-rose-600"
  },
  {
    id: "perplexity",
    name: "Perplexity Pro",
    category: "AI Chatbots & Virtual Assistants",
    description: "Enhance your research with AI-powered search, unlimited questions, and access to GPT-4 and Claude models.",
    features: [
      "Unlimited AI searches",
      "Access to GPT-4 and Claude models",
      "Higher daily question limit",
      "Longer conversations",
      "Priority support",
      "Early access to new features"
    ],
    subscriptions: [
      { period: "1 month", price: 20, popular: false },
      { period: "3 months", price: 57, popular: true, savings: "5%" },
      { period: "1 year", price: 192, popular: false, savings: "20%" }
    ],
    color: "from-blue-500 to-cyan-600"
  },
  {
    id: "copilot",
    name: "GitHub Copilot",
    company: "GitHub",
    category: "AI Code Generation & Development Tools",
    description: "AI pair programmer that helps developers write better code faster with autocomplete suggestions and full function generation.",
    features: [
      "AI code completion",
      "Code generation from comments",
      "Works in multiple IDEs",
      "Supports 20+ programming languages",
      "Contextual suggestions",
      "Explains code on demand"
    ],
    subscriptions: [
      { period: "1 month", price: 10, popular: false, tier: "Individual" },
      { period: "1 year", price: 100, popular: true, tier: "Individual", savings: "17%" },
      { period: "1 month", price: 19, popular: false, tier: "Business" }
    ],
    color: "from-gray-700 to-gray-900"
  },
  {
    id: "anthropic-claude",
    name: "Anthropic Claude API",
    company: "Anthropic",
    category: "AI Chatbots & Virtual Assistants",
    description: "Access to Claude API for developers to build AI applications with one of the most capable AI assistants.",
    features: [
      "API access to Claude models",
      "100K context window",
      "Developer documentation",
      "Pay-as-you-go pricing",
      "Commercial usage rights",
      "Technical support"
    ],
    subscriptions: [
      { period: "Credit Pack", price: 25, popular: false, credits: "$25 API credits" },
      { period: "Credit Pack", price: 100, popular: true, credits: "$100 API credits" },
      { period: "Credit Pack", price: 500, popular: false, credits: "$500 API credits" }
    ],
    color: "from-indigo-500 to-purple-600"
  }
]

export default function PlatformsPage() {
  const router = useRouter()
  const { addToCart, clearCart } = useCart()
  const [selectedPeriod, setSelectedPeriod] = useState("3 months")
  const [selectedCategory, setSelectedCategory] = useState("All")
  
  // Check URL parameters to see if we should preserve the cart
  // This is used when navigating from the cart page via "Add more gifts" button
  const [preserveCart, setPreserveCart] = useState(false)
  
  // Use a ref to track if we've already initialized
  const initializedRef = useRef(false)
  
  // Effect to check URL parameters on component mount
  useEffect(() => {
    // Only run this once on component mount
    if (!initializedRef.current) {
      initializedRef.current = true
      
      // Get the current URL and parse the query parameters
      const url = new URL(window.location.href)
      const params = new URLSearchParams(url.search)
      const shouldPreserveCart = params.get('preserve_cart') === 'true'
      
      setPreserveCart(shouldPreserveCart)
      
      // Only clear the cart if we're not supposed to preserve it
      if (!shouldPreserveCart) {
        // Clear the cart when navigating to the platforms page
        // This ensures a fresh start for new gift selections
        clearCart()
      }
    }
  }, [])
  
  return (
    <div className="container mx-auto px-4 py-12 md:py-16 lg:py-24">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Gift <span className="heading-gradient">Premium AI</span> Memberships
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Choose from the best AI platforms and gift a premium membership to friends, family, or colleagues.
          All gifts come with easy redemption and no recurring charges.
        </p>
      </div>
      
      {/* Category and Subscription Period Selectors */}
      <div className="mb-12 space-y-8">
        {/* Category Selector */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-center">Categories</h2>
          <div className="max-w-4xl mx-auto">
            {/* Main category tabs for popular categories */}
            <Tabs defaultValue="All" onValueChange={setSelectedCategory} className="w-full mb-2">
              <TabsList className="w-full grid grid-cols-5 mb-2">
                <TabsTrigger value="All">All</TabsTrigger>
                <TabsTrigger value="AI Chatbots & Virtual Assistants">Chatbots</TabsTrigger>
                <TabsTrigger value="AI Image Generation & Editing">Images</TabsTrigger>
                <TabsTrigger value="AI Video & Animation Tools">Video</TabsTrigger>
                <TabsTrigger value="AI Code Generation & Development Tools">Code</TabsTrigger>
              </TabsList>
            </Tabs>
            
            {/* Dropdown for other categories */}
            <div className="flex justify-center">
              <div className="relative inline-block">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-1"
                  onClick={() => document.getElementById('category-dropdown')?.classList.toggle('hidden')}
                >
                  More Categories <ChevronDown className="h-4 w-4" />
                </Button>
                <div 
                  id="category-dropdown" 
                  className="hidden absolute z-10 mt-2 w-72 rounded-md bg-card shadow-lg border border-border"
                >
                  <div className="py-1 max-h-80 overflow-y-auto">
                    {categories
                      .filter(cat => 
                        !['AI Chatbots & Virtual Assistants', 'AI Image Generation & Editing', 'AI Video & Animation Tools', 'AI Code Generation & Development Tools'].includes(cat)
                      )
                      .map((category) => (
                        <button
                          key={category}
                          className={`block w-full text-left px-4 py-2 text-sm ${selectedCategory === category ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}
                          onClick={() => {
                            setSelectedCategory(category);
                            document.getElementById('category-dropdown')?.classList.add('hidden');
                          }}
                        >
                          {category.replace("AI ", "")}
                        </button>
                      ))
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Period Selector */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-center">Subscription Length</h2>
          <div className="mx-auto max-w-md">
            <Tabs defaultValue="3 months" onValueChange={setSelectedPeriod} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="1 month">1 Month</TabsTrigger>
                <TabsTrigger value="3 months">3 Months</TabsTrigger>
                <TabsTrigger value="1 year">1 Year</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Select a subscription period to see pricing for all platforms
            </p>
            <p className="mt-2 text-sm font-medium text-primary">
              A $4.99 service fee is added to all gift purchases
            </p>
          </div>
        </div>
      </div>
      
      {/* Platforms Grid */}
      <div className="mb-8">
        <p className="text-muted-foreground mb-4 text-center">
          Showing {selectedCategory === "All" ? "all platforms" : `${selectedCategory.replace("AI ", "")} platforms`} with {selectedPeriod} pricing
        </p>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {platforms
            .filter(platform => selectedCategory === "All" || platform.category === selectedCategory)
            .map((platform) => (
          <div 
            key={platform.id}
            className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 flex flex-col h-full"
          >
            {/* Platform Header */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-12 w-12 rounded-lg flex items-center justify-center bg-gradient-to-br ${platform.color}`}>
                  <span className="text-white font-bold text-lg">
                    {platform.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{platform.name}</h3>
                  {platform.company && (
                    <p className="text-xs text-muted-foreground">{platform.company}</p>
                  )}
                </div>
              </div>
              
              <div 
                className={`h-8 w-8 rounded-full bg-gradient-to-r ${platform.color} opacity-80`}
              />
            </div>
            
            {/* Platform Description */}
            <p className="mb-6 text-muted-foreground">
              {platform.description}
            </p>
            
            {/* Features */}
            <div className="mb-6">
              <h4 className="mb-3 text-sm font-medium">Key Features</h4>
              <ul className="space-y-2">
                {platform.features.slice(0, 4).map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <svg 
                      className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Subscription Price */}
            <div className="mb-6">
              {platform.subscriptions.map((sub) => {
                if (sub.period === selectedPeriod || 
                   (selectedPeriod === "1 month" && sub.period.includes("1 month") && sub.popular) ||
                   (selectedPeriod === "1 year" && sub.period.includes("1 year") && sub.popular)) {
                  return (
                    <div key={`${platform.id}-${sub.period}-${sub.price}`} className="flex flex-col items-center">
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold">${sub.price}</span>
                        <span className="ml-1 text-muted-foreground">
                          {sub.credits ? sub.credits : sub.tier ? `/ ${sub.period} (${sub.tier})` : `/ ${sub.period}`}
                        </span>
                      </div>
                      {sub.savings && (
                        <Badge variant="outline" className="mt-1 bg-primary/10 text-primary">
                          Save {sub.savings}
                        </Badge>
                      )}
                    </div>
                  )
                }
                return null
              })}
            </div>
            
            {/* Spacer to push button to bottom */}
            <div className="flex-grow"></div>
            
            {/* Gift Button */}
            <Button 
              className="w-full" 
              size="lg"
              onClick={() => {
                // Find the selected subscription
                const selectedSub = platform.subscriptions.find(sub => 
                  sub.period === selectedPeriod || 
                  (selectedPeriod === "1 month" && sub.period.includes("1 month") && sub.popular) ||
                  (selectedPeriod === "1 year" && sub.period.includes("1 year") && sub.popular)
                );
                
                if (selectedSub) {
                  // Create a valid subscription object for the cart
                  const subscriptionObj = {
                    id: selectedSub.id || `${platform.id}-${selectedSub.period}`,
                    platform_id: platform.id,
                    period: selectedSub.period,
                    price: selectedSub.price,
                    popular: !!selectedSub.popular,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  };
                  
                  // Check if we should preserve the cart (coming from the cart page)
                  if (!preserveCart) {
                    // If not preserving cart, clear it first to start fresh
                    clearCart();
                  }
                  
                  // Try to get saved recipient info from localStorage
                  let recipientName = '';
                  let recipientEmail = '';
                  let senderName = '';
                  let message = '';
                  
                  try {
                    const savedRecipientInfo = localStorage.getItem('giftAiRecipientInfo');
                    if (savedRecipientInfo) {
                      const recipientInfo = JSON.parse(savedRecipientInfo);
                      recipientName = recipientInfo.recipientName || '';
                      recipientEmail = recipientInfo.recipientEmail || '';
                      senderName = recipientInfo.senderName || '';
                      message = recipientInfo.message || '';
                    }
                  } catch (error) {
                    console.error('Failed to parse recipient info:', error);
                  }
                  
                  // Add the new item to the cart with any saved recipient info
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
                  
                  // Navigate to the gift page
                  router.push(`/gift/${platform.id}?period=${encodeURIComponent(selectedPeriod)}`);
                }
              }}
            >
              Gift {platform.name}
            </Button>
          </div>
        ))}
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="mt-24">
        <h2 className="mb-8 text-center text-3xl font-bold">Frequently Asked Questions</h2>
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-3 text-lg font-medium">How does gifting work?</h3>
            <p className="text-muted-foreground">
              When you purchase a gift membership, the recipient will receive an email with instructions on how to redeem their gift.
              They'll get full access to the platform for the duration you selected, with no auto-renewal.
            </p>
          </div>
          
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-3 text-lg font-medium">Can I schedule when the gift is delivered?</h3>
            <p className="text-muted-foreground">
              Yes! You can choose to send the gift immediately or schedule it for a future date, perfect for birthdays and special occasions.
            </p>
          </div>
          
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-3 text-lg font-medium">Will the recipient be charged after the gift period?</h3>
            <p className="text-muted-foreground">
              No. The membership will simply expire after the gifted period. There are no automatic renewals or hidden charges.
            </p>
          </div>
          
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-3 text-lg font-medium">Can I gift to someone who already has a subscription?</h3>
            <p className="text-muted-foreground">
              Yes! If they already have a paid subscription, they can apply your gift once their current billing period ends.
            </p>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="mt-24 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 p-8 text-center backdrop-blur-sm md:p-12">
        <h2 className="mb-4 text-2xl font-bold md:text-3xl">Ready to give the gift of AI?</h2>
        <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
          Choose from the best AI platforms above and gift a premium membership. Perfect for birthdays, holidays, or just because.
        </p>
        <Button size="lg" className="animate-pulse">
          Explore Platforms
        </Button>
      </div>
    </div>
  )
}
