"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { useCart } from "../../contexts/CartContext"

// Define types
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

type Subscription = {
  period: string;
  price: number;
  tier?: string;
  credits?: string;
  popular?: boolean;
}

type RecommendedPack = {
  platforms: Platform[];
  totalPrice: number;
  savings: number;
}

// Mock data for platforms (using the same data structure as in platforms page)
const platforms: Platform[] = [
  {
    id: "chatgpt",
    name: "ChatGPT Plus",
    company: "OpenAI",
    category: "AI Chatbots & Virtual Assistants",
    description: "Advanced AI assistant with GPT-4 capabilities, DALL·E image generation, and more.",
    features: [
      "Access to GPT-4 model",
      "DALL·E image generation",
      "Voice conversations",
      "Custom instructions",
      "Priority access during peak times"
    ],
    subscriptions: [
      { period: "1 month", price: 20, popular: true },
      { period: "3 months", price: 57, popular: true },
      { period: "1 year", price: 200, popular: true }
    ],
    color: "from-green-500 to-blue-600"
  },
  {
    id: "midjourney",
    name: "Midjourney",
    category: "AI Image Generation & Editing",
    description: "Create stunning, photorealistic images and artwork with simple text prompts.",
    features: [
      "High-quality image generation",
      "Fast rendering times",
      "Style customization",
      "Private messaging",
      "Commercial usage rights"
    ],
    subscriptions: [
      { period: "1 month Basic", price: 10, tier: "Basic" },
      { period: "1 month Standard", price: 30, tier: "Standard", popular: true },
      { period: "1 month Pro", price: 60, tier: "Pro" },
      { period: "1 year Standard", price: 300, tier: "Standard", popular: true }
    ],
    color: "from-blue-500 to-purple-600"
  },
  {
    id: "copilot",
    name: "GitHub Copilot",
    company: "GitHub",
    category: "AI Code Generation & Development Tools",
    description: "AI pair programmer that helps you write code faster with suggestions based on comments and context.",
    features: [
      "Real-time code suggestions",
      "Multiple programming languages support",
      "Works in VS Code, Visual Studio, and JetBrains IDEs",
      "Contextual code completion",
      "Natural language to code conversion"
    ],
    subscriptions: [
      { period: "1 month", price: 10, popular: true },
      { period: "1 year", price: 100, popular: true }
    ],
    color: "from-gray-700 to-gray-900"
  },
  {
    id: "dalle",
    name: "DALL·E API",
    company: "OpenAI",
    category: "AI Image Generation & Editing",
    description: "Generate and edit images programmatically with the power of DALL·E.",
    features: [
      "Image generation from text",
      "Image editing capabilities",
      "Variations of existing images",
      "High-resolution output",
      "Commercial usage rights"
    ],
    subscriptions: [
      { period: "Pay-as-you-go", price: 15, credits: "115 credits (~460 images)" },
      { period: "Pay-as-you-go", price: 50, credits: "380 credits (~1,520 images)", popular: true }
    ],
    color: "from-red-500 to-orange-500"
  },
  {
    id: "claude",
    name: "Claude Pro",
    company: "Anthropic",
    category: "AI Chatbots & Virtual Assistants",
    description: "Advanced AI assistant focused on helpfulness, harmlessness, and honesty.",
    features: [
      "Longer context windows",
      "Faster response times",
      "Priority access during high traffic",
      "Higher usage caps",
      "Early access to new features"
    ],
    subscriptions: [
      { period: "1 month", price: 20, popular: true },
      { period: "1 year", price: 200 }
    ],
    color: "from-purple-500 to-pink-500"
  },
  {
    id: "windsurf",
    name: "Windsurf",
    company: "Codeium",
    category: "AI Code Generation & Development Tools",
    description: "The world's first agentic IDE with AI Flow, enabling you to build software faster than ever.",
    features: [
      "AI-powered code generation",
      "Automatic debugging",
      "Code explanation and documentation",
      "Intelligent refactoring",
      "Natural language to code conversion"
    ],
    subscriptions: [
      { period: "1 month", price: 25, popular: true },
      { period: "1 year", price: 250, popular: true }
    ],
    color: "from-blue-600 to-cyan-500"
  }
];

// Step types
type BudgetRange = "under-50" | "50-100" | "100-200" | "over-200";
type InterestCategory = string;
type GiftRecipient = "developer" | "designer" | "writer" | "student" | "professional" | "creative" | "other";
type GiftPurpose = "productivity" | "creativity" | "learning" | "fun" | "work";

export default function GiftPackPage() {
  const router = useRouter();
  const { clearCart, addToCart } = useCart();
  
  // Mode selection state
  const [mode, setMode] = useState<'budget' | 'custom'>('budget');
  
  // Questionnaire state for budget-based mode
  const [currentStep, setCurrentStep] = useState(1);
  const [budget, setBudget] = useState<BudgetRange | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<InterestCategory[]>([]);
  const [recipient, setRecipient] = useState<GiftRecipient | null>(null);
  const [purpose, setPurpose] = useState<GiftPurpose | null>(null);
  
  // Custom package state
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  
  // Results state
  const [recommendedPacks, setRecommendedPacks] = useState<RecommendedPack[]>([]);
  const [showResults, setShowResults] = useState(false);
  
  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);

  // All available categories
  const categories = Array.from(new Set(platforms.map(p => p.category)));

  // Handle category selection
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Move to next step
  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      generateRecommendations();
    }
  };

  // Move to previous step
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Generate gift pack recommendations based on user inputs
  const generateRecommendations = () => {
    // Convert budget range to actual numbers
    let minBudget = 0;
    let maxBudget = 1000;
    
    switch (budget) {
      case "under-50":
        maxBudget = 50;
        break;
      case "50-100":
        minBudget = 50;
        maxBudget = 100;
        break;
      case "100-200":
        minBudget = 100;
        maxBudget = 200;
        break;
      case "over-200":
        minBudget = 200;
        break;
    }

    // Filter platforms by selected categories
    let filteredPlatforms = platforms;
    if (selectedCategories.length > 0) {
      filteredPlatforms = platforms.filter(p => selectedCategories.includes(p.category));
    }

    // Further filter based on recipient and purpose
    if (recipient === "developer") {
      filteredPlatforms = filteredPlatforms.filter(p => 
        p.category.includes("Code") || p.name.includes("Copilot") || p.name.includes("Windsurf")
      );
    } else if (recipient === "designer") {
      filteredPlatforms = filteredPlatforms.filter(p => 
        p.category.includes("Image") || p.category.includes("Video") || p.category.includes("Design")
      );
    }

    if (purpose === "productivity") {
      // Prioritize tools that enhance productivity
      filteredPlatforms.sort((a, b) => {
        const aIsProductivity = a.features.some(f => f.toLowerCase().includes("faster") || f.toLowerCase().includes("time"));
        const bIsProductivity = b.features.some(f => f.toLowerCase().includes("faster") || f.toLowerCase().includes("time"));
        return (bIsProductivity ? 1 : 0) - (aIsProductivity ? 1 : 0);
      });
    } else if (purpose === "creativity") {
      // Prioritize creative tools
      filteredPlatforms.sort((a, b) => {
        const aIsCreative = a.category.includes("Image") || a.category.includes("Video") || a.category.includes("Writing");
        const bIsCreative = b.category.includes("Image") || b.category.includes("Video") || b.category.includes("Writing");
        return (bIsCreative ? 1 : 0) - (aIsCreative ? 1 : 0);
      });
    }

    // Create different pack combinations
    const packs: RecommendedPack[] = [];

    // Pack 1: Best value within budget
    if (filteredPlatforms.length >= 2) {
      const bestValuePlatforms = [...filteredPlatforms]
        .sort((a, b) => {
          const aPrice = a.subscriptions.find(s => s.popular)?.price || a.subscriptions[0].price;
          const bPrice = b.subscriptions.find(s => s.popular)?.price || b.subscriptions[0].price;
          return aPrice - bPrice;
        })
        .slice(0, 3);

      const totalPrice = bestValuePlatforms.reduce((sum, platform) => {
        const subscription = platform.subscriptions.find(s => s.popular) || platform.subscriptions[0];
        return sum + subscription.price;
      }, 0);

      if (totalPrice <= maxBudget) {
        packs.push({
          platforms: bestValuePlatforms,
          totalPrice: Math.round(totalPrice * 0.9), // 10% discount
          savings: Math.round(totalPrice * 0.1)
        });
      }
    }

    // Pack 2: Premium selection (2 platforms)
    if (filteredPlatforms.length >= 2) {
      const premiumPlatforms = [...filteredPlatforms]
        .sort((a, b) => {
          const aPrice = a.subscriptions.find(s => s.popular)?.price || a.subscriptions[0].price;
          const bPrice = b.subscriptions.find(s => s.popular)?.price || b.subscriptions[0].price;
          return bPrice - aPrice; // Sort by highest price first
        })
        .slice(0, 2);

      const totalPrice = premiumPlatforms.reduce((sum, platform) => {
        const subscription = platform.subscriptions.find(s => s.popular) || platform.subscriptions[0];
        return sum + subscription.price;
      }, 0);

      if (totalPrice <= maxBudget) {
        packs.push({
          platforms: premiumPlatforms,
          totalPrice: Math.round(totalPrice * 0.85), // 15% discount
          savings: Math.round(totalPrice * 0.15)
        });
      }
    }

    // Pack 3: Balanced selection
    if (filteredPlatforms.length >= 2) {
      // Try to include one from each selected category if possible
      const balancedPlatforms: Platform[] = [];
      const selectedCategoriesCopy = [...selectedCategories];
      
      // First try to get one platform from each selected category
      for (const category of selectedCategoriesCopy) {
        const platformFromCategory = filteredPlatforms.find(p => p.category === category);
        if (platformFromCategory && !balancedPlatforms.includes(platformFromCategory)) {
          balancedPlatforms.push(platformFromCategory);
          if (balancedPlatforms.length >= 3) break;
        }
      }
      
      // If we don't have enough, add more from the filtered platforms
      if (balancedPlatforms.length < 2) {
        for (const platform of filteredPlatforms) {
          if (!balancedPlatforms.includes(platform)) {
            balancedPlatforms.push(platform);
            if (balancedPlatforms.length >= 2) break;
          }
        }
      }

      const totalPrice = balancedPlatforms.reduce((sum, platform) => {
        const subscription = platform.subscriptions.find(s => s.popular) || platform.subscriptions[0];
        return sum + subscription.price;
      }, 0);

      if (totalPrice <= maxBudget && balancedPlatforms.length >= 2) {
        packs.push({
          platforms: balancedPlatforms,
          totalPrice: Math.round(totalPrice * 0.9), // 10% discount
          savings: Math.round(totalPrice * 0.1)
        });
      }
    }

    // If no packs were created, create a single platform recommendation
    if (packs.length === 0 && filteredPlatforms.length > 0) {
      const platform = filteredPlatforms[0];
      const subscription = platform.subscriptions.find(s => s.popular) || platform.subscriptions[0];
      
      packs.push({
        platforms: [platform],
        totalPrice: subscription.price,
        savings: 0
      });
    }

    // Sort packs by total price (ascending)
    packs.sort((a, b) => a.totalPrice - b.totalPrice);

    // Filter out packs that exceed the budget
    const affordablePacks = packs.filter(pack => pack.totalPrice <= maxBudget);

    setRecommendedPacks(affordablePacks.length > 0 ? affordablePacks : packs.slice(0, 1));
    setShowResults(true);
  };

  // Add a platform to the custom package
  const togglePlatformSelection = (platform: Platform) => {
    setSelectedPlatforms(prev => {
      const isSelected = prev.some(p => p.id === platform.id);
      if (isSelected) {
        return prev.filter(p => p.id !== platform.id);
      } else {
        return [...prev, platform];
      }
    });
  };

  // Create a custom gift package
  const createCustomPackage = () => {
    if (selectedPlatforms.length === 0) return;
    
    const totalPrice = selectedPlatforms.reduce((sum, platform) => {
      const subscription = platform.subscriptions.find(s => s.popular) || platform.subscriptions[0];
      return sum + subscription.price;
    }, 0);
    
    // Apply a discount based on the number of platforms
    const discountRate = selectedPlatforms.length >= 3 ? 0.15 : selectedPlatforms.length === 2 ? 0.1 : 0;
    const discountedPrice = Math.round(totalPrice * (1 - discountRate));
    const savings = Math.round(totalPrice * discountRate);
    
    setRecommendedPacks([{
      platforms: selectedPlatforms,
      totalPrice: discountedPrice,
      savings: savings
    }]);
    
    setShowResults(true);
  };

  // Reset the questionnaire or custom selection
  const resetSelection = () => {
    setBudget(null);
    setSelectedCategories([]);
    setRecipient(null);
    setPurpose(null);
    setCurrentStep(1);
    setSelectedPlatforms([]);
    setShowResults(false);
  };
  
  // Handle selecting a gift pack and redirecting to gift page
  const selectGiftPack = async (pack: RecommendedPack) => {
    try {
      setIsProcessing(true);
      
      // Clear the existing cart first
      clearCart();
      
      // Store the first platform ID to use for redirection
      const firstPlatformId = pack.platforms[0].id;
      
      // Get the popular subscription for each platform
      // If no popular subscription is found, use the first one
      const platformsWithSubscriptions = pack.platforms.map(platform => {
        const subscription = platform.subscriptions.find(s => s.popular) || platform.subscriptions[0];
        return { platform, subscription };
      });
      
      // Add each platform to the cart with empty recipient info (will be filled on gift page)
      for (const { platform, subscription } of platformsWithSubscriptions) {
        // Create a subscription ID based on platform ID and period
        let subscriptionId;
        
        // Special handling for Midjourney subscriptions which use a different format
        if (platform.id === 'midjourney' && subscription.tier) {
          // Use the hardcoded format for Midjourney: midjourney-{tier} (lowercase)
          subscriptionId = `midjourney-${subscription.tier.toLowerCase()}`;
        } else {
          // For other platforms, create ID based on platform ID and period
          subscriptionId = `${platform.id}-${subscription.period.replace(/\s+/g, '-')}`;
        }
        
        // Create a full subscription object with all required properties
        const fullSubscription = {
          id: subscriptionId,
          platform_id: platform.id,
          period: subscription.period,
          price: subscription.price,
          popular: subscription.popular || false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          tier: subscription.tier || '',
          credits: subscription.credits || ''
        };
        
        addToCart({
          platformId: platform.id,
          platformName: platform.name,
          platformColor: platform.color,
          subscription: fullSubscription,
          recipientName: '',
          recipientEmail: '',
          senderName: '',
          message: ''
        });
      }
      
      // Redirect to the gift page using the first platform's ID
      // The cart already contains all platforms in the package
      router.push(`/gift/${firstPlatformId}?fromPackage=true`);
    } catch (error) {
      console.error('Error selecting gift pack:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 lg:py-24">
      {/* Hero Section */}
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Create Your Perfect <span className="heading-gradient">AI Gift Pack</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Create the perfect combination of AI tools as a gift for someone special.
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex justify-center p-1 bg-muted rounded-lg mb-8">
          <button
            className={`flex-1 py-2 px-4 rounded-md text-center transition-all ${mode === 'budget' ? 'bg-white shadow-sm' : ''}`}
            onClick={() => {
              setMode('budget');
              resetSelection();
            }}
          >
            Create Based on Budget
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md text-center transition-all ${mode === 'custom' ? 'bg-white shadow-sm' : ''}`}
            onClick={() => {
              setMode('custom');
              resetSelection();
            }}
          >
            Create Custom Package
          </button>
        </div>

        {mode === 'budget' ? (
          <p className="text-center text-muted-foreground">
            Answer a few simple questions and we'll recommend the perfect combination of AI tools tailored to your needs and budget.
          </p>
        ) : (
          <p className="text-center text-muted-foreground">
            Browse our selection of AI platforms and create your own custom gift package.
          </p>
        )}
      </div>

      {!showResults ? (
        <div className="max-w-3xl mx-auto">
          {mode === 'budget' ? (
            /* Budget-based Mode */
            <>
              {/* Progress Bar */}
              <div className="mb-10">
                <div className="flex justify-between mb-2">
                  {[1, 2, 3, 4].map((step) => (
                    <div 
                      key={step}
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        currentStep >= step ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {step}
                    </div>
                  ))}
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all" 
                    style={{ width: `${(currentStep / 4) * 100}%` }}
                  ></div>
                </div>
              </div>
            </>  
          ) : (
            /* Custom Package Mode */
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center">Select AI Platforms for Your Gift Package</h2>
              <p className="text-center text-muted-foreground mb-6">
                Click on the platforms you want to include in your gift package
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {platforms.map((platform) => {
                  const isSelected = selectedPlatforms.some(p => p.id === platform.id);
                  const subscription = platform.subscriptions.find(s => s.popular) || platform.subscriptions[0];
                  
                  return (
                    <div 
                      key={platform.id} 
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${isSelected ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'}`}
                      onClick={() => togglePlatformSelection(platform)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-md bg-gradient-to-br ${platform.color} flex items-center justify-center text-white font-bold`}>
                            {platform.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium">{platform.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {subscription.period} - €{subscription.price}
                            </div>
                          </div>
                        </div>
                        <div className={`h-6 w-6 rounded-full border ${isSelected ? 'bg-primary border-primary' : 'border-muted'} flex items-center justify-center`}>
                          {isSelected && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {selectedPlatforms.length > 0 && (
                <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Your Selected Platforms</h3>
                  <div className="space-y-2 mb-4">
                    {selectedPlatforms.map(platform => {
                      const subscription = platform.subscriptions.find(s => s.popular) || platform.subscriptions[0];
                      return (
                        <div key={platform.id} className="flex justify-between">
                          <span>{platform.name} ({subscription.period})</span>
                          <span>€{subscription.price}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between font-medium border-t pt-2">
                    <span>Total</span>
                    <span>€{selectedPlatforms.reduce((sum, platform) => {
                      const subscription = platform.subscriptions.find(s => s.popular) || platform.subscriptions[0];
                      return sum + subscription.price;
                    }, 0)}</span>
                  </div>
                  {selectedPlatforms.length >= 2 && (
                    <div className="text-sm text-muted-foreground mt-1 text-right">
                      Includes {selectedPlatforms.length >= 3 ? '15%' : '10%'} package discount
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 1: Budget - Only show in budget mode */}
          {mode === 'budget' && currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center">What's your budget?</h2>
              <p className="text-center text-muted-foreground mb-6">
                Select a budget range for your AI gift pack
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant={budget === "under-50" ? "default" : "outline"}
                  className="h-20 text-lg"
                  onClick={() => setBudget("under-50")}
                >
                  Under €50
                </Button>
                <Button
                  variant={budget === "50-100" ? "default" : "outline"}
                  className="h-20 text-lg"
                  onClick={() => setBudget("50-100")}
                >
                  €50 - €100
                </Button>
                <Button
                  variant={budget === "100-200" ? "default" : "outline"}
                  className="h-20 text-lg"
                  onClick={() => setBudget("100-200")}
                >
                  €100 - €200
                </Button>
                <Button
                  variant={budget === "over-200" ? "default" : "outline"}
                  className="h-20 text-lg"
                  onClick={() => setBudget("over-200")}
                >
                  Over €200
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Categories - Only show in budget mode */}
          {mode === 'budget' && currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center">What types of AI tools are you interested in?</h2>
              <p className="text-center text-muted-foreground mb-6">
                Select one or more categories (select at least one)
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategories.includes(category) ? "default" : "outline"}
                    className="h-16 text-left justify-start"
                    onClick={() => toggleCategory(category)}
                  >
                    {category.replace("AI ", "")}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Recipient - Only show in budget mode */}
          {mode === 'budget' && currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center">Who is this gift for?</h2>
              <p className="text-center text-muted-foreground mb-6">
                Select the type of person who will be using these AI tools
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant={recipient === "developer" ? "default" : "outline"}
                  className="h-16"
                  onClick={() => setRecipient("developer")}
                >
                  Developer / Programmer
                </Button>
                <Button
                  variant={recipient === "designer" ? "default" : "outline"}
                  className="h-16"
                  onClick={() => setRecipient("designer")}
                >
                  Designer / Artist
                </Button>
                <Button
                  variant={recipient === "writer" ? "default" : "outline"}
                  className="h-16"
                  onClick={() => setRecipient("writer")}
                >
                  Writer / Content Creator
                </Button>
                <Button
                  variant={recipient === "student" ? "default" : "outline"}
                  className="h-16"
                  onClick={() => setRecipient("student")}
                >
                  Student
                </Button>
                <Button
                  variant={recipient === "professional" ? "default" : "outline"}
                  className="h-16"
                  onClick={() => setRecipient("professional")}
                >
                  Business Professional
                </Button>
                <Button
                  variant={recipient === "creative" ? "default" : "outline"}
                  className="h-16"
                  onClick={() => setRecipient("creative")}
                >
                  Creative Professional
                </Button>
                <Button
                  variant={recipient === "other" ? "default" : "outline"}
                  className="h-16 col-span-2"
                  onClick={() => setRecipient("other")}
                >
                  Other / Not Sure
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Purpose - Only show in budget mode */}
          {mode === 'budget' && currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center">What's the main purpose for these AI tools?</h2>
              <p className="text-center text-muted-foreground mb-6">
                Select the primary goal for using these AI tools
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant={purpose === "productivity" ? "default" : "outline"}
                  className="h-16"
                  onClick={() => setPurpose("productivity")}
                >
                  Boost Productivity
                </Button>
                <Button
                  variant={purpose === "creativity" ? "default" : "outline"}
                  className="h-16"
                  onClick={() => setPurpose("creativity")}
                >
                  Enhance Creativity
                </Button>
                <Button
                  variant={purpose === "learning" ? "default" : "outline"}
                  className="h-16"
                  onClick={() => setPurpose("learning")}
                >
                  Learning & Education
                </Button>
                <Button
                  variant={purpose === "fun" ? "default" : "outline"}
                  className="h-16"
                  onClick={() => setPurpose("fun")}
                >
                  Fun & Entertainment
                </Button>
                <Button
                  variant={purpose === "work" ? "default" : "outline"}
                  className="h-16 col-span-1 md:col-span-2"
                  onClick={() => setPurpose("work")}
                >
                  Work & Professional Tasks
                </Button>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-10">
            {mode === 'budget' ? (
              /* Budget Mode Navigation */
              <>
                <Button 
                  variant="outline" 
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  Back
                </Button>
                <Button 
                  onClick={nextStep}
                  disabled={(currentStep === 1 && !budget) || 
                           (currentStep === 2 && selectedCategories.length === 0) ||
                           (currentStep === 3 && !recipient) ||
                           (currentStep === 4 && !purpose)}
                >
                  {currentStep < 4 ? "Next" : "View Recommendations"}
                </Button>
              </>
            ) : (
              /* Custom Mode Navigation */
              <>
                <Button 
                  variant="outline" 
                  onClick={() => setMode('budget')}
                >
                  Switch to Budget Mode
                </Button>
                <Button 
                  onClick={createCustomPackage}
                  disabled={selectedPlatforms.length === 0}
                >
                  Create Gift Package
                </Button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-3xl font-bold text-center mb-10">Your Personalized AI Gift Packs</h2>
          
          {recommendedPacks.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {recommendedPacks.map((pack, index) => (
                <Card key={index} className="overflow-hidden flex flex-col h-full">
                  <CardHeader className="bg-gradient-to-r from-primary/80 to-primary text-white">
                    <CardTitle>
                      {index === 0 ? "Best Value Pack" : index === 1 ? "Premium Pack" : "Custom Pack"}
                    </CardTitle>
                    <CardDescription className="text-white/90">
                      {pack.platforms.length} AI Platform{pack.platforms.length > 1 ? "s" : ""}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 flex-grow flex flex-col">
                    <div className="mb-4 text-center">
                      <div className="text-3xl font-bold">€{pack.totalPrice}</div>
                      {pack.savings > 0 && (
                        <div className="text-sm text-muted-foreground">
                          Save €{pack.savings} ({Math.round((pack.savings / (pack.totalPrice + pack.savings)) * 100)}%)
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      {pack.platforms.map((platform) => (
                        <div key={platform.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                          <div className={`h-10 w-10 rounded-md bg-gradient-to-br ${platform.color} flex items-center justify-center text-white font-bold`}>
                            {platform.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium">{platform.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {platform.subscriptions.find(s => s.popular)?.period || platform.subscriptions[0].period}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex-grow"></div>
                    
                    <Button 
                      className="w-full" 
                      onClick={() => selectGiftPack(pack)}
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Processing..." : "Select This Pack"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-muted rounded-lg">
              <p className="text-lg mb-4">
                We couldn't find a perfect match for your criteria. Please try adjusting your preferences.
              </p>
              <Button onClick={resetSelection}>Start Over</Button>
            </div>
          )}
          
          <div className="mt-10 text-center">
            <Button variant="outline" onClick={resetSelection}>
              Start Over
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
