# GiftAI Hub Setup Guide

This guide provides complete instructions for setting up the GiftAI Hub platform with its admin panel. It combines both manual setup steps and automated scripts to get you up and running quickly.

## Prerequisites

- A Supabase account (free tier works fine for development)
- Node.js and npm installed
- Git (for version control)

## Quick Setup

For those who want to get started quickly, we've provided a setup script that automates most of the database configuration:

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd gift-ai-hub
   ```

2. **Install dependencies**:
   ```bash
   npm install
   npm install dotenv @supabase/supabase-js
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the project root with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://glxfcmxfufighgfqbiwo.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdseGZjbXhmdWZpZ2hnZnFiaXdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5MDAzMDIsImV4cCI6MjA1NzQ3NjMwMn0.neHBNXYXbXlhhClwcQicTa1SEoh_v1rL_DBkWXY29cw
   ```

4. **Run the database setup script**:
   ```bash
   node scripts/setup-database.js
   ```
   This script will:
   - Create all necessary database tables
   - Set up foreign key relationships
   - Create timestamp triggers
   - Add sample AI platforms (ChatGPT, Midjourney, DALL-E)
   - Add subscription tiers for each platform

5. **Start the development server**:
   ```bash
   npm run dev
   ```

6. **Access the admin panel**:
   Open your browser and go to `http://localhost:3000/admin`

## Manual Setup (Alternative)

If you prefer to set up the database manually or need more control over the process, follow these steps:

### Supabase Setup

1. **Create a new Supabase project**:
   - Go to [https://supabase.com](https://supabase.com) and sign in
   - Click "New Project" and follow the setup wizard
   - Choose a name for your project (e.g., "giftai-hub")
   - Set a secure database password (save this somewhere safe)
   - Choose a region closest to your users
   - Click "Create new project"

2. **Set up database tables**:
   - After your project is created, go to the SQL Editor in the Supabase dashboard
   - Copy and paste the SQL commands from the README-ADMIN.md file or from below:

```sql
-- Create platforms table
CREATE TABLE public.platforms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  company TEXT,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  features JSONB NOT NULL,
  color TEXT NOT NULL DEFAULT '#7c3aed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform_id UUID NOT NULL REFERENCES public.platforms(id) ON DELETE CASCADE,
  period TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  tier TEXT,
  credits TEXT,
  popular BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create user_roles table for admin access
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  platform_id UUID NOT NULL REFERENCES public.platforms(id),
  subscription_id UUID NOT NULL REFERENCES public.subscriptions(id),
  recipient_email TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  message TEXT,
  delivery_date TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  redemption_code TEXT NOT NULL,
  redeemed BOOLEAN DEFAULT false NOT NULL,
  redeemed_at TIMESTAMP WITH TIME ZONE,
  total_amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_platforms_updated_at
BEFORE UPDATE ON public.platforms
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_subscriptions_updated_at
BEFORE UPDATE ON public.subscriptions
FOR EACH ROW EXECUTE FUNCTION update_modified_column();
```

3. **Add sample data** (optional):
   You can add sample platforms and subscriptions using the following SQL:

```sql
-- Insert sample platforms
INSERT INTO public.platforms (name, company, category, description, features, color)
VALUES 
('ChatGPT', 'OpenAI', 'Chat', 'ChatGPT is an AI-powered chatbot developed by OpenAI, based on the GPT language models.', '["Text generation", "Conversation", "Content creation", "Problem solving"]', '#7c3aed'),
('Midjourney', 'Midjourney, Inc.', 'Image', 'Midjourney is an AI image generation tool that creates images based on text prompts provided by users.', '["Image generation", "Creative design", "Art creation", "Visual concepts"]', '#1a56db'),
('DALL-E', 'OpenAI', 'Image', 'DALL-E is an AI system that can create realistic images and art from a description in natural language.', '["Image generation", "Artistic styles", "Realistic rendering", "Creative concepts"]', '#10b981');

-- Get platform IDs
DO $$
DECLARE
    chatgpt_id UUID;
    midjourney_id UUID;
    dalle_id UUID;
BEGIN
    SELECT id INTO chatgpt_id FROM public.platforms WHERE name = 'ChatGPT' LIMIT 1;
    SELECT id INTO midjourney_id FROM public.platforms WHERE name = 'Midjourney' LIMIT 1;
    SELECT id INTO dalle_id FROM public.platforms WHERE name = 'DALL-E' LIMIT 1;
    
    -- Insert subscriptions for ChatGPT
    INSERT INTO public.subscriptions (platform_id, period, price, tier, popular)
    VALUES 
    (chatgpt_id, 'monthly', 9.99, 'standard', false),
    (chatgpt_id, 'quarterly', 24.99, 'standard', true),
    (chatgpt_id, 'annual', 89.99, 'standard', false);
    
    -- Insert subscriptions for Midjourney
    INSERT INTO public.subscriptions (platform_id, period, price, tier, popular)
    VALUES 
    (midjourney_id, 'monthly', 9.99, 'standard', false),
    (midjourney_id, 'quarterly', 24.99, 'standard', true),
    (midjourney_id, 'annual', 89.99, 'standard', false);
    
    -- Insert subscriptions for DALL-E
    INSERT INTO public.subscriptions (platform_id, period, price, tier, popular)
    VALUES 
    (dalle_id, 'monthly', 9.99, 'standard', false),
    (dalle_id, 'quarterly', 24.99, 'standard', true),
    (dalle_id, 'annual', 89.99, 'standard', false);
END $$;
```

## Setting Up Admin Access

Regardless of whether you used the automated script or manual setup, you'll need to create an admin user:

1. **Create a user account**:
   - Access your application at `http://localhost:3000/admin`
   - Click "Sign Up" to create a new account
   - Complete the registration process

2. **Make yourself an admin**:
   - Go to the Supabase dashboard > SQL Editor
   - Run the following SQL, replacing `YOUR_USER_ID` with your actual user ID:
   ```sql
   INSERT INTO public.user_roles (user_id, role)
   VALUES ('YOUR_USER_ID', 'admin');
   ```
   - To find your user ID, go to Authentication > Users in the Supabase dashboard

3. **Set up Row Level Security (RLS)**:
   - Go to the Authentication > Policies section in the Supabase dashboard
   - For each table, create policies that:
     - Allow anyone to read platforms and subscriptions
     - Only allow authenticated admins to insert, update, or delete records

## Using the Admin Panel

The admin panel allows you to:

1. **Manage Platforms**:
   - Add new AI platforms with details, features, and branding
   - Edit existing platforms
   - View all platforms in a sortable, searchable table

2. **Manage Subscriptions**:
   - Create subscription options for each platform
   - Set pricing, subscription periods, and tiers
   - Mark popular subscriptions for highlighting on the frontend

3. **Track Orders** (future functionality):
   - View all gift orders
   - Track redemption status
   - Manage customer information

## Troubleshooting

- **Authentication Issues**: Make sure your user has the 'admin' role in the user_roles table
- **Database Errors**: Check the browser console for detailed error messages
- **Missing Data**: Verify that your tables are created correctly and contain data
- **Script Errors**: If the setup script fails, try the manual setup process instead

## Next Steps

After setting up the basic admin panel, consider implementing:

1. Image upload for platform logos
2. Analytics dashboard for sales and user engagement
3. Email notification system for orders
4. User management for multiple admin accounts

## Tech Stack

The GiftAI Hub platform is built using:

1. **Frontend**:
   - Next.js (React framework)
   - TypeScript for type safety
   - Tailwind CSS for styling
   - React Hook Form for form handling

2. **Backend**:
   - Next.js API routes for serverless functions
   - Supabase for database and authentication
   - Stripe for payment processing (future implementation)
   - SendGrid for email notifications (future implementation)

3. **Deployment**:
   - Vercel for hosting the Next.js application
   - Supabase for database hosting
