import { NextResponse } from 'next/server';

// Define types for platform data
type Subscription = {
  period: string;
  price: number;
  popular: boolean;
  savings?: string;
  tier?: string;
  credits?: string;
  id?: string; // Add ID for compatibility with database
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

// Platform data - same as defined in platforms page
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
      { id: "chatgpt-1-month", period: "1 month", price: 20, popular: false },
      { id: "chatgpt-3-months", period: "3 months", price: 57, popular: true, savings: "5%" },
      { id: "chatgpt-1-year", period: "1 year", price: 192, popular: false, savings: "20%" }
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
      { id: "claude-1-month", period: "1 month", price: 20, popular: false },
      { id: "claude-3-months", period: "3 months", price: 57, popular: true, savings: "5%" },
      { id: "claude-1-year", period: "1 year", price: 192, popular: false, savings: "20%" }
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
      "Fast image generation",
      "Variety of artistic styles",
      "Detailed control over image output",
      "Commercial usage rights",
      "Community features"
    ],
    subscriptions: [
      { id: "midjourney-basic", period: "1 month", price: 10, popular: false, tier: "Basic" },
      { id: "midjourney-standard", period: "1 month", price: 30, popular: true, tier: "Standard" },
      { id: "midjourney-pro", period: "1 month", price: 60, popular: false, tier: "Pro" },
      { id: "midjourney-mega", period: "1 month", price: 120, popular: false, tier: "Mega" }
    ],
    color: "from-blue-500 to-indigo-600"
  },
  {
    id: "perplexity",
    name: "Perplexity Pro",
    category: "AI Research & Discovery",
    description: "Enhance your research with AI-powered search that provides accurate, up-to-date answers with sources.",
    features: [
      "Unlimited AI answers",
      "GPT-4 and Claude Opus models",
      "File upload and analysis",
      "Higher daily query limits",
      "Priority during high traffic",
      "Early access to new features"
    ],
    subscriptions: [
      { id: "perplexity-1-month", period: "1 month", price: 20, popular: false },
      { id: "perplexity-3-months", period: "3 months", price: 57, popular: true, savings: "5%" },
      { id: "perplexity-1-year", period: "1 year", price: 192, popular: false, savings: "20%" }
    ],
    color: "from-red-500 to-pink-600"
  },
  {
    id: "copilot",
    name: "GitHub Copilot",
    company: "GitHub",
    category: "AI Code Generation & Development Tools",
    description: "AI pair programmer that helps you write better code faster with suggestions based on your context and coding style.",
    features: [
      "Real-time code suggestions",
      "Works in multiple IDEs",
      "Supports many programming languages",
      "Contextual code completion",
      "Explains code functionality",
      "Generates unit tests"
    ],
    subscriptions: [
      { id: "copilot-individual", period: "1 month", price: 10, popular: false, tier: "Individual" },
      { id: "copilot-business", period: "1 month", price: 19, popular: true, tier: "Business" },
      { id: "copilot-enterprise", period: "1 month", price: 39, popular: false, tier: "Enterprise" }
    ],
    color: "from-gray-700 to-gray-900"
  }
];

export async function GET() {
  return NextResponse.json(platforms);
}
