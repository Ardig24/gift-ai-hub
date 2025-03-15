-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create platforms table
CREATE TABLE IF NOT EXISTS public.platforms (
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
CREATE TABLE IF NOT EXISTS public.subscriptions (
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
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
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

DROP TRIGGER IF EXISTS update_platforms_updated_at ON public.platforms;
CREATE TRIGGER update_platforms_updated_at
BEFORE UPDATE ON public.platforms
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
BEFORE UPDATE ON public.subscriptions
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Set up Row Level Security (RLS)
-- Enable RLS on tables
ALTER TABLE public.platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Add temporary policies for initial data loading
CREATE POLICY "Temporary allow all operations on platforms" 
  ON public.platforms FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Temporary allow all operations on subscriptions" 
  ON public.subscriptions FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Temporary allow all operations on user_roles" 
  ON public.user_roles FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Temporary allow all operations on orders" 
  ON public.orders FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create policies for platforms
CREATE POLICY "Allow public read access to platforms" 
  ON public.platforms FOR SELECT 
  USING (true);

CREATE POLICY "Allow admin insert access to platforms" 
  ON public.platforms FOR INSERT 
  TO authenticated 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Allow admin update access to platforms" 
  ON public.platforms FOR UPDATE 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Allow admin delete access to platforms" 
  ON public.platforms FOR DELETE 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

-- Create policies for subscriptions
CREATE POLICY "Allow public read access to subscriptions" 
  ON public.subscriptions FOR SELECT 
  USING (true);

CREATE POLICY "Allow admin insert access to subscriptions" 
  ON public.subscriptions FOR INSERT 
  TO authenticated 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Allow admin update access to subscriptions" 
  ON public.subscriptions FOR UPDATE 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Allow admin delete access to subscriptions" 
  ON public.subscriptions FOR DELETE 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

-- Create policies for user_roles
CREATE POLICY "Allow admin read access to user_roles" 
  ON public.user_roles FOR SELECT 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Allow admin insert access to user_roles" 
  ON public.user_roles FOR INSERT 
  TO authenticated 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Allow admin update access to user_roles" 
  ON public.user_roles FOR UPDATE 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Allow admin delete access to user_roles" 
  ON public.user_roles FOR DELETE 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

-- Create policies for orders
CREATE POLICY "Allow admin read access to orders" 
  ON public.orders FOR SELECT 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Allow admin insert access to orders" 
  ON public.orders FOR INSERT 
  TO authenticated 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Allow admin update access to orders" 
  ON public.orders FOR UPDATE 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Allow admin delete access to orders" 
  ON public.orders FOR DELETE 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ));
