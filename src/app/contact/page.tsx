import Link from "next/link"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "../../components/ui/card"

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16 lg:py-24">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Get in <span className="heading-gradient">Touch</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Have questions about gifting AI memberships? Our team is here to help you find the perfect tech gift.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        {/* Contact Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Send Us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you within 24 hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="first-name" className="text-sm font-medium">
                      First Name
                    </label>
                    <Input id="first-name" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="last-name" className="text-sm font-medium">
                      Last Name
                    </label>
                    <Input id="last-name" placeholder="Doe" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input id="email" type="email" placeholder="john.doe@example.com" />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <Input id="subject" placeholder="How can we help you?" />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea 
                    id="message" 
                    placeholder="Please provide details about your inquiry..." 
                    rows={5}
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        {/* Contact Info */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
            <p className="text-muted-foreground mb-6">
              Our team is available Monday through Friday, 9am to 5pm PST.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Email</h3>
                  <a href="mailto:support@giftaihub.com" className="text-primary hover:underline">
                    support@giftaihub.com
                  </a>
                  <p className="text-sm text-muted-foreground mt-1">
                    For general inquiries and support
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <a href="tel:+18005551234" className="text-primary hover:underline">
                    +1 (800) 555-1234
                  </a>
                  <p className="text-sm text-muted-foreground mt-1">
                    Monday-Friday, 9am-5pm PST
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Live Chat</h3>
                  <p className="text-primary">
                    Available on our website
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    For immediate assistance
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-medium mb-1">How do I track my gift order?</h3>
                <p className="text-sm text-muted-foreground">
                  You can track your order by logging into your account or using the tracking link sent to your email.
                </p>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-medium mb-1">Can I change the delivery date after ordering?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes, you can modify the delivery date up to 24 hours before the scheduled delivery time.
                </p>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-medium mb-1">Do you offer corporate gifting options?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes! Contact our sales team for bulk orders and corporate gifting solutions.
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <Link href="/how-it-works">
                <Button variant="outline" className="w-full">
                  View All FAQs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-20 bg-card border border-border rounded-xl p-8 md:p-12 text-center max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Need Help Choosing the Perfect AI Gift?</h2>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-8">
          Our gift experts can help you select the ideal AI platform based on your recipient's interests and needs.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button size="lg" className="px-8">
            Schedule a Consultation
          </Button>
          <Link href="/platforms">
            <Button size="lg" variant="outline" className="px-8">
              Browse AI Platforms
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
