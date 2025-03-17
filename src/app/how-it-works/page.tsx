import Link from "next/link"
import { Button } from "../../components/ui/button"

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16 lg:py-24">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          How <span className="heading-gradient">IntelliGift</span> Works
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Gifting premium AI memberships has never been easier. Follow these simple steps to give the perfect tech gift.
        </p>
      </div>

      {/* Steps */}
      <div className="grid gap-12 md:gap-16">
        {/* Step 1 */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <div className="inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
              Step 1
            </div>
            <h2 className="text-3xl font-bold mb-4">Choose an AI Platform</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Browse our curated selection of premium AI platforms. From ChatGPT Plus to Midjourney, we offer the best AI services available today.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2">
                <svg className="mt-1 h-5 w-5 flex-shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>15+ premium AI platforms to choose from</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-1 h-5 w-5 flex-shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Detailed descriptions of features and benefits</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-1 h-5 w-5 flex-shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Categories for every interest and need</span>
              </li>
            </ul>
            <Link href="/platforms">
              <Button size="lg">
                Browse AI Platforms
              </Button>
            </Link>
          </div>
          <div className="order-1 md:order-2 bg-gradient-to-br from-primary/30 to-primary/10 rounded-xl p-8 aspect-square max-w-md mx-auto w-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🤖</div>
              <div className="text-xl font-semibold">Select Your Platform</div>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="bg-gradient-to-br from-primary/30 to-primary/10 rounded-xl p-8 aspect-square max-w-md mx-auto w-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">⏱️</div>
              <div className="text-xl font-semibold">Choose Subscription Length</div>
            </div>
          </div>
          <div>
            <div className="inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
              Step 2
            </div>
            <h2 className="text-3xl font-bold mb-4">Select Subscription Length</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Choose how long you want to gift the AI membership. We offer flexible options to fit any budget and need.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2">
                <svg className="mt-1 h-5 w-5 flex-shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>1-month subscriptions for a quick trial</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-1 h-5 w-5 flex-shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>3-month subscriptions for extended use</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-1 h-5 w-5 flex-shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>1-year subscriptions with the best savings</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Step 3 */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <div className="inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
              Step 3
            </div>
            <h2 className="text-3xl font-bold mb-4">Personalize Your Gift</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Add a personal touch to your gift with a custom message and delivery date. Make it special for the recipient.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2">
                <svg className="mt-1 h-5 w-5 flex-shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Add a personalized message</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-1 h-5 w-5 flex-shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Schedule delivery for a specific date</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-1 h-5 w-5 flex-shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Choose from beautiful digital card designs</span>
              </li>
            </ul>
          </div>
          <div className="order-1 md:order-2 bg-gradient-to-br from-primary/30 to-primary/10 rounded-xl p-8 aspect-square max-w-md mx-auto w-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">✉️</div>
              <div className="text-xl font-semibold">Personalize Your Gift</div>
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="bg-gradient-to-br from-primary/30 to-primary/10 rounded-xl p-8 aspect-square max-w-md mx-auto w-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">💳</div>
              <div className="text-xl font-semibold">Secure Checkout</div>
            </div>
          </div>
          <div>
            <div className="inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
              Step 4
            </div>
            <h2 className="text-3xl font-bold mb-4">Secure Checkout</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Complete your purchase with our secure checkout process. We accept all major credit cards and PayPal.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2">
                <svg className="mt-1 h-5 w-5 flex-shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Secure payment processing via Stripe</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-1 h-5 w-5 flex-shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>No recurring charges or hidden fees</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-1 h-5 w-5 flex-shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Instant order confirmation</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Step 5 */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <div className="inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
              Step 5
            </div>
            <h2 className="text-3xl font-bold mb-4">Gift Delivery</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Your gift will be delivered via email on your selected date. The recipient will receive redemption instructions and your personal message.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2">
                <svg className="mt-1 h-5 w-5 flex-shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Email delivery on your chosen date</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-1 h-5 w-5 flex-shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Beautiful digital gift presentation</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-1 h-5 w-5 flex-shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Easy redemption process for recipients</span>
              </li>
            </ul>
          </div>
          <div className="order-1 md:order-2 bg-gradient-to-br from-primary/30 to-primary/10 rounded-xl p-8 aspect-square max-w-md mx-auto w-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🎁</div>
              <div className="text-xl font-semibold">Gift Delivery</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-20 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Gift Amazing AI Tools?</h2>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-8">
          Browse our selection of premium AI platforms and find the perfect gift for the tech enthusiast in your life.
        </p>
        <Link href="/platforms">
          <Button size="lg" className="px-8">
            Explore AI Platforms
          </Button>
        </Link>
      </div>
    </div>
  )
}
