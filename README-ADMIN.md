# GiftAI Hub Admin Panel Setup

This document provides instructions for setting up the admin panel for GiftAI Hub, which uses Supabase as its backend.

## Prerequisites

- A Supabase account (free tier works fine for development)
- Node.js and npm installed

## Supabase Setup

1. **Create a new Supabase project**:
   - Go to [https://supabase.com](https://supabase.com) and sign in
   - Click "New Project" and follow the setup wizard
   - Choose a name for your project (e.g., "giftai-hub")
   - Set a secure database password (save this somewhere safe)
   - Choose a region closest to your users
   - Click "Create new project"

2. **Set up database tables**:
   - After your project is created, go to the SQL Editor in the Supabase dashboard
   - Create the following tables by running these SQL commands:

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
  delivery_date TIMESTAMP WITH TIME ZONE NOT NULL,
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

3. **Set up Row Level Security (RLS)**:
   - Go to the Authentication > Policies section in the Supabase dashboard
   - For each table, create policies that:
     - Allow anyone to read platforms and subscriptions
     - Only allow authenticated admins to insert, update, or delete records

4. **Create an admin user**:
   - Go to the Authentication > Users section
   - Click "Invite user" and enter your email
   - After confirming the email, use SQL to make this user an admin:

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('YOUR_USER_ID', 'admin');
```

## Environment Setup

1. **Get your Supabase credentials**:
   - Go to Project Settings > API in the Supabase dashboard
   - Copy the "URL" and "anon/public" key

2. **Create a .env.local file**:
   - In the root of your project, create a file named `.env.local`
   - Add the following content:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Running the Admin Panel

1. **Install dependencies**:
   ```
   npm install
   ```

2. **Start the development server**:
   ```
   npm run dev
   ```

3. **Access the admin panel**:
   - Open your browser and go to `http://localhost:3000/admin`
   - Log in with the admin user you created

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

## Connecting the Frontend

The frontend of GiftAI Hub is already set up to use the data from Supabase. Once you've added platforms and subscriptions through the admin panel, they will automatically appear on the website.

## Troubleshooting

- **Authentication Issues**: Make sure your user has the 'admin' role in the user_roles table
- **Database Errors**: Check the browser console for detailed error messages
- **Missing Data**: Verify that your tables are created correctly and contain data

## Next Steps

After setting up the basic admin panel, consider implementing:

1. Image upload for platform logos
2. Analytics dashboard for sales and user engagement
3. Email notification system for orders
4. User management for multiple admin accounts
