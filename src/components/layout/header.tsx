"use client"

import Link from "next/link"
import { useState } from "react"
import { ThemeToggle } from "../../components/ui/theme-toggle"
import { useCart } from "@/contexts/CartContext"
import { ShoppingCart } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { items } = useCart()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-1 hover-lift">
              <span className="text-2xl font-bold heading-gradient">IntelliGift</span>
              <span className="text-2xl font-bold"></span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/platforms" 
              className="text-sm font-medium transition-colors hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
            >
              AI Platforms
            </Link>
            <Link 
              href="/gift-pack" 
              className="text-sm font-medium transition-colors hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
            >
              Gift Packs
            </Link>
            <Link 
              href="/how-it-works" 
              className="text-sm font-medium transition-colors hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
            >
              How It Works
            </Link>
            <Link 
              href="/pricing" 
              className="text-sm font-medium transition-colors hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
            >
              Pricing
            </Link>
            <Link 
              href="/contact" 
              className="text-sm font-medium transition-colors hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
            >
              Contact
            </Link>
            <Link 
              href="/redeem" 
              className="text-sm font-medium transition-colors hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
            >
              Redeem
            </Link>
            <div className="pl-4">
              <ThemeToggle />
            </div>
            <Link 
              href="/cart" 
              className="relative inline-flex items-center justify-center p-2 text-foreground hover:text-primary"
            >
              <ShoppingCart className="h-5 w-5" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {items.length}
                </span>
              )}
            </Link>
            <Link 
              href="/gift" 
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-primary/20 hover:-translate-y-0.5"
            >
              Send a Gift
            </Link>
          </nav>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <Link 
              href="/cart" 
              className="relative inline-flex items-center justify-center p-2 mr-2 text-foreground hover:text-primary"
            >
              <ShoppingCart className="h-5 w-5" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {items.length}
                </span>
              )}
            </Link>
            <ThemeToggle />
            <button
              type="button"
              className="ml-4 inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-muted"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="space-y-1 px-4 py-3 bg-background/95 backdrop-blur-md">
            <Link 
              href="/platforms" 
              className="block px-3 py-2 text-base font-medium hover:bg-muted rounded-md transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              AI Platforms
            </Link>
            <Link 
              href="/how-it-works" 
              className="block px-3 py-2 text-base font-medium hover:bg-muted rounded-md transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link 
              href="/pricing" 
              className="block px-3 py-2 text-base font-medium hover:bg-muted rounded-md transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              href="/contact" 
              className="block px-3 py-2 text-base font-medium hover:bg-muted rounded-md transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Link 
              href="/redeem" 
              className="block px-3 py-2 text-base font-medium hover:bg-muted rounded-md transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Redeem
            </Link>
            <Link 
              href="/gift" 
              className="block px-4 py-3 mt-4 text-base font-medium bg-primary text-primary-foreground rounded-md shadow-md hover:bg-primary/90 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Send a Gift
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
