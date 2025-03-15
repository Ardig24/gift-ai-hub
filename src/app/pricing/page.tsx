import Link from "next/link"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16 lg:py-24">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Simple, Transparent <span className="heading-gradient">Pricing</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          No hidden fees, no recurring charges. Just straightforward pricing for gifting premium AI memberships.
        </p>
      </div>

      {/* Pricing Explanation */}
      <div className="mb-16 max-w-3xl mx-auto">
        <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-4">How Our Pricing Works</h2>
          <p className="text-muted-foreground mb-6">
            At GiftAI Hub, we believe in transparent pricing. When you purchase a gift membership, you pay:
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                <span className="text-primary font-medium text-sm">1</span>
              </div>
              <div>
                <h3 className="font-medium">The Platform's Subscription Cost</h3>
                <p className="text-sm text-muted-foreground">
                  We charge the exact same price as if you were subscribing directly with the AI platform.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                <span className="text-primary font-medium text-sm">2</span>
              </div>
              <div>
                <h3 className="font-medium">A Small Service Fee <Badge variant="outline" className="ml-2">$4.99</Badge></h3>
                <p className="text-sm text-muted-foreground">
                  This covers our gift delivery system, customer support, and platform maintenance.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                <span className="text-primary font-medium text-sm">3</span>
              </div>
              <div>
                <h3 className="font-medium">That's It!</h3>
                <p className="text-sm text-muted-foreground">
                  No hidden charges, no auto-renewals, no surprises. The recipient gets the full subscription period with no obligations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Examples */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-10">Example Pricing</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* ChatGPT Plus */}
          <div className="bg-card border border-border rounded-xl overflow-hidden transition-all hover:shadow-md">
            <div className="bg-gradient-to-r from-green-500 to-blue-600 p-6 text-white">
              <h3 className="text-xl font-bold mb-1">ChatGPT Plus</h3>
              <p className="text-sm opacity-90">OpenAI</p>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-sm text-muted-foreground">Platform Cost</span>
                  <span className="font-medium">$20.00</span>
                </div>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-sm text-muted-foreground">Service Fee</span>
                  <span className="font-medium">$4.99</span>
                </div>
                <div className="border-t border-border mt-2 pt-2 flex justify-between items-baseline">
                  <span className="font-medium">Total</span>
                  <span className="text-xl font-bold">$24.99</span>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground mb-6">
                1-month subscription with access to GPT-4, DALL·E, and more.
              </div>
              
              <Link href="/platforms" className="w-full">
                <Button className="w-full">Gift Now</Button>
              </Link>
            </div>
          </div>
          
          {/* Midjourney */}
          <div className="bg-card border border-border rounded-xl overflow-hidden transition-all hover:shadow-md flex flex-col h-full">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
              <h3 className="text-xl font-bold mb-1">Midjourney</h3>
              <p className="text-sm opacity-90">Standard Plan</p>
            </div>
            
            <div className="p-6 flex flex-col flex-grow">
              <div className="mb-4">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-sm text-muted-foreground">Platform Cost</span>
                  <span className="font-medium">$30.00</span>
                </div>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-sm text-muted-foreground">Service Fee</span>
                  <span className="font-medium">$4.99</span>
                </div>
                <div className="border-t border-border mt-2 pt-2 flex justify-between items-baseline">
                  <span className="font-medium">Total</span>
                  <span className="text-xl font-bold">$34.99</span>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground mb-6">
                1-month subscription with high-quality AI image generation.
              </div>
              
              <div className="mt-auto">
                <Link href="/platforms" className="w-full">
                  <Button className="w-full">Gift Now</Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* GitHub Copilot */}
          <div className="bg-card border border-border rounded-xl overflow-hidden transition-all hover:shadow-md flex flex-col h-full">
            <div className="bg-gradient-to-r from-gray-700 to-gray-900 p-6 text-white">
              <h3 className="text-xl font-bold mb-1">GitHub Copilot</h3>
              <p className="text-sm opacity-90">Individual Plan</p>
            </div>
            
            <div className="p-6 flex flex-col flex-grow">
              <div className="mb-4">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-sm text-muted-foreground">Platform Cost</span>
                  <span className="font-medium">$100.00</span>
                </div>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-sm text-muted-foreground">Service Fee</span>
                  <span className="font-medium">$4.99</span>
                </div>
                <div className="border-t border-border mt-2 pt-2 flex justify-between items-baseline">
                  <span className="font-medium">Total</span>
                  <span className="text-xl font-bold">$104.99</span>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground mb-6">
                1-year subscription with AI-powered code completion.
              </div>
              
              <div className="mt-auto">
                <Link href="/platforms" className="w-full">
                  <Button className="w-full">Gift Now</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
        
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">Are there any recurring charges?</h3>
            <p className="text-muted-foreground">
              No. When you purchase a gift membership, you pay once for the exact duration you select. There are no auto-renewals or recurring charges.
            </p>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">Can I get a refund if the recipient doesn't use the gift?</h3>
            <p className="text-muted-foreground">
              We offer a 14-day refund policy if the gift hasn't been redeemed. Once redeemed, the subscription is active and cannot be refunded.
            </p>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">Do you offer bulk discounts for businesses?</h3>
            <p className="text-muted-foreground">
              Yes! If you're looking to purchase multiple AI memberships for your team or as corporate gifts, please contact us for special bulk pricing.
            </p>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">How does the recipient redeem their gift?</h3>
            <p className="text-muted-foreground">
              Recipients receive an email with a unique redemption code and instructions. They simply click the link, enter the code, and follow the steps to activate their subscription.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-20 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Gift Amazing AI Tools?</h2>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-8">
          Browse our selection of premium AI platforms and find the perfect gift for the tech enthusiast in your life.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/platforms">
            <Button size="lg" className="px-8">
              Explore AI Platforms
            </Button>
          </Link>
          <Link href="/contact">
            <Button size="lg" variant="outline" className="px-8">
              Contact Sales
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
