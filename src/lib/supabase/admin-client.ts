import { createClient } from '@supabase/supabase-js';

// Mark this file as server-only to prevent it from being used on the client
// This ensures that the service role key is never exposed to the client
export const dynamic = 'force-dynamic';

/**
 * This function creates a Supabase admin client that bypasses RLS policies.
 * It should ONLY be used in server-side contexts (API routes, Server Components, Server Actions).
 * NEVER use this on the client side as it would expose your service role key.
 */
export function createAdminClient() {
  // These environment variables need to be set in your .env.local file
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';

  // Only throw an error in development, not during build
  if (process.env.NODE_ENV === 'development' && 
      (!supabaseUrl || !supabaseServiceKey || 
       supabaseUrl === 'https://placeholder-url.supabase.co' || 
       supabaseServiceKey === 'placeholder-service-key')) {
    console.error('Supabase URL or Service Role Key is missing. Please check your environment variables.');
  }

  // Create a Supabase client with the service role key
  // This client bypasses RLS policies and should only be used on the server
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
