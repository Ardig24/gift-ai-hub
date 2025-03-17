# IntelliGift

IntelliGift is a platform that allows users to gift AI platform subscriptions to friends, family, or colleagues. The platform supports multiple AI services including ChatGPT, Claude, Midjourney, and more.

## Features

- **Gift Selection**: Browse and select from multiple AI platforms
- **Subscription Options**: Choose from various subscription lengths (1 month, 3 months, 1 year)
- **Gift Packages**: Curated combinations of AI platforms based on recipient preferences
- **Secure Checkout**: Integrated with Stripe for secure payment processing
- **Gift Redemption**: Simple process for recipients to redeem their gifts
- **Admin Panel**: Manage platforms, subscriptions, and orders

## Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS, React Hook Form
- **Backend**: Next.js API routes, Supabase
- **Payment Processing**: Stripe
- **Email Notifications**: SendGrid
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Stripe account

### Installation

1. Clone the repository

```bash
git clone https://github.com/Ardig24/intelligift.git
cd intelligift
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

Create a `.env.local` file with the following variables:

```
# Supabase configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Email configuration
BREVO_API_KEY=your_brevo_api_key

# Base URL for production (used for Stripe redirect URLs)
NEXT_PUBLIC_BASE_URL=https://intelligift.ai
```

> **IMPORTANT**: Never commit your `.env.local` file to version control. It contains sensitive API keys and secrets that should be kept private.

4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database Setup

Run the database setup script to create the necessary tables and roles:

```bash
node scripts/setup-database.js
```

## Deployment

The application can be deployed to Vercel with the following command:

```bash
vercel
```
