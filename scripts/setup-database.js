/**
 * Database Setup Script for GiftAI Hub Admin Panel
 * 
 * This script adds sample data to the Supabase database for the GiftAI Hub admin panel.
 * Note: This script assumes the tables have already been created in Supabase.
 * 
 * Usage:
 * 1. Create a .env.local file with your Supabase credentials
 * 2. Run this script with: node scripts/setup-database.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Validate environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('Error: Missing Supabase credentials in .env.local file');
  console.error('Please create a .env.local file with the following variables:');
  console.error('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url');
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key');
  process.exit(1);
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// SQL statements for creating tables
const createPlatformsTable = `
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
`;

const createSubscriptionsTable = `
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
`;

const createUserRolesTable = `
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);
`;

const createOrdersTable = `
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
  delivery_date TIMESTAMP WITH TIME ZONE NOT NULL,
  redemption_code TEXT NOT NULL,
  redeemed BOOLEAN DEFAULT false NOT NULL,
  redeemed_at TIMESTAMP WITH TIME ZONE,
  total_amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);
`;

const createTimestampTriggers = `
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
`;

// Sample data for platforms
const samplePlatforms = [
  {
    name: 'ChatGPT',
    company: 'OpenAI',
    category: 'Chat',
    description: 'ChatGPT is an AI-powered chatbot developed by OpenAI, based on the GPT language models.',
    features: ['Text generation', 'Conversation', 'Content creation', 'Problem solving'],
    color: '#7c3aed'
  },
  {
    name: 'Midjourney',
    company: 'Midjourney, Inc.',
    category: 'Image',
    description: 'Midjourney is an AI image generation tool that creates images based on text prompts provided by users.',
    features: ['Image generation', 'Creative design', 'Art creation', 'Visual concepts'],
    color: '#1a56db'
  },
  {
    name: 'DALL-E',
    company: 'OpenAI',
    category: 'Image',
    description: 'DALL-E is an AI system that can create realistic images and art from a description in natural language.',
    features: ['Image generation', 'Artistic styles', 'Realistic rendering', 'Creative concepts'],
    color: '#10b981'
  }
];

// Sample subscription tiers
const subscriptionTiers = ['monthly', 'quarterly', 'annual'];
const subscriptionPrices = {
  'monthly': 9.99,
  'quarterly': 24.99,
  'annual': 89.99
};

// Add sample data to the database
async function setupDatabase() {
  console.log('Adding sample data to the database...');
  
  try {
    // Insert sample platforms
    console.log('Inserting sample platforms...');
    for (const platform of samplePlatforms) {
      // Check if platform already exists
      const { data: existingPlatforms, error: checkError } = await supabase
        .from('platforms')
        .select('id')
        .eq('name', platform.name);
      
      if (checkError) throw checkError;
      
      // Skip if platform already exists
      if (existingPlatforms && existingPlatforms.length > 0) {
        console.log(`Platform already exists: ${platform.name}`);
        continue;
      }
      
      // Insert new platform
      const { data: platformData, error: platformInsertError } = await supabase
        .from('platforms')
        .insert([{
          name: platform.name,
          company: platform.company,
          category: platform.category,
          description: platform.description,
          features: platform.features,
          color: platform.color
        }])
        .select();
      
      if (platformInsertError) throw platformInsertError;
      
      console.log(`✅ Platform created: ${platform.name}`);
      
      // Insert subscriptions for this platform
      if (platformData && platformData.length > 0) {
        const platformId = platformData[0].id;
        
        for (const period of subscriptionTiers) {
          const { error: subscriptionError } = await supabase
            .from('subscriptions')
            .insert([{
              platform_id: platformId,
              period: period,
              price: subscriptionPrices[period],
              tier: 'standard',
              popular: period === 'quarterly'
            }]);
          
          if (subscriptionError) throw subscriptionError;
        }
        
        console.log(`✅ Subscriptions created for: ${platform.name}`);
      }
    }
    
    console.log('\n🎉 Sample data setup complete! You can now use the admin panel.');
    console.log('To create an admin user, sign up through the authentication system and then run:');
    console.log('INSERT INTO user_roles (user_id, role) VALUES (\'YOUR_USER_ID\', \'admin\');');
    
  } catch (error) {
    console.error('❌ Error setting up sample data:', error);
  }
}

// Run the setup
setupDatabase();
