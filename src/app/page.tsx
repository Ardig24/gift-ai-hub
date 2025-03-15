import Image from "next/image"
import Link from "next/link"
import { MovingPlatforms } from "@/components/ui/moving-platforms"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted/30">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none heading-gradient">
                  Gift Premium AI Memberships to Anyone
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  The perfect gift for tech enthusiasts, professionals, and creatives. 
                  Give the gift of AI with memberships to ChatGPT, Claude, Midjourney, and more.
                </p>
              </div>
              <div className="flex flex-col gap-3 min-[400px]:flex-row">
                <Link
                  href="/platforms"
                  className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-primary/20 hover:-translate-y-0.5"
                >
                  Browse Platforms
                </Link>
                <Link
                  href="/redeem"
                  className="inline-flex h-11 items-center justify-center rounded-md border border-primary bg-transparent px-8 text-sm font-medium text-primary shadow-sm transition-all hover:bg-primary/10 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  Redeem Gift
                </Link>
                <Link
                  href="#how-it-works"
                  className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-all hover:bg-accent hover:text-accent-foreground hover:-translate-y-0.5"
                >
                  How It Works
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-[500px] aspect-square overflow-hidden rounded-lg shadow-xl glass-card animate-fade-in bg-gradient-to-br from-primary/80 via-primary/50 to-primary/30 flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
                <div className="text-4xl font-bold text-white/90 p-8 text-center">
                  The Perfect AI Gift
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Platforms */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl heading-gradient">
                Popular AI Platforms
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Choose from a wide selection of premium AI services to gift
              </p>
            </div>
          </div>
          <div className="mt-12">
            <MovingPlatforms />
          </div>
          <div className="flex justify-center mt-12">
            <Link
              href="/platforms"
              className="inline-flex h-11 items-center justify-center rounded-md bg-primary/10 px-8 text-sm font-medium text-primary shadow-sm transition-all hover:bg-primary hover:text-primary-foreground hover:-translate-y-0.5"
            >
              View All Platforms
            </Link>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl heading-gradient">
                How It Works
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Gifting an AI membership is simple and takes just a few minutes
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg bg-background border shadow-sm hover-lift">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold">Choose a Platform</h3>
              <p className="text-muted-foreground">
                Select from our wide range of premium AI platforms and choose a subscription length.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg bg-background border shadow-sm hover-lift">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold">Personalize Your Gift</h3>
              <p className="text-muted-foreground">
                Add a personal message and schedule delivery for a specific date if desired.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg bg-background border shadow-sm hover-lift">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold">Recipient Redeems</h3>
              <p className="text-muted-foreground">
                The recipient gets an email with a unique code and instructions to redeem their gift.
              </p>
            </div>
          </div>
          <div className="flex justify-center mt-12">
            <Link
              href="/how-it-works"
              className="inline-flex h-11 items-center justify-center rounded-md bg-primary/10 px-8 text-sm font-medium text-primary shadow-sm transition-all hover:bg-primary hover:text-primary-foreground hover:-translate-y-0.5"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl heading-gradient">
                What Our Customers Say
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Hear from people who have gifted AI memberships to their friends and family
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {/* Testimonial 1 */}
            <div className="flex flex-col space-y-4 rounded-lg border p-6 shadow-sm bg-background hover-lift">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-primary/10 p-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-primary"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">Sarah Johnson</p>
                  <p className="text-sm text-muted-foreground">Designer</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "I gifted my brother a Midjourney subscription for his birthday. He's been creating amazing artwork ever since. The gifting process was smooth and he received the code instantly."
              </p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="flex flex-col space-y-4 rounded-lg border p-6 shadow-sm bg-background hover-lift">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-primary/10 p-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-primary"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">Michael Chen</p>
                  <p className="text-sm text-muted-foreground">Developer</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "ChatGPT Plus has been a game-changer for my dad who's learning to code. I gifted him a 3-month subscription and he's been using it daily. Best gift I've ever given him!"
              </p>
            </div>
            
            {/* Testimonial 3 */}
            <div className="flex flex-col space-y-4 rounded-lg border p-6 shadow-sm bg-background hover-lift">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-primary/10 p-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-primary"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">Emily Rodriguez</p>
                  <p className="text-sm text-muted-foreground">Writer</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "I received Claude Pro as a gift from my colleague. It's been incredibly helpful for my writing projects. The redemption process was simple and I was up and running in minutes."
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary/5">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl heading-gradient">
                Ready to Gift the Power of AI?
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Give a gift that keeps on giving. Start the gifting process today.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Link
                href="/gift"
                className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-primary/20 hover:-translate-y-0.5"
              >
                Send a Gift Now
              </Link>
              <Link
                href="/platforms"
                className="inline-flex h-11 items-center justify-center rounded-md border border-primary bg-transparent px-8 text-sm font-medium text-primary shadow-sm transition-all hover:bg-primary/10 hover:-translate-y-0.5"
              >
                Explore Platforms
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
