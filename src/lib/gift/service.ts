import { supabase } from '@/lib/supabase/client';
import { createAdminClient } from '@/lib/supabase/admin-client';
import { generateGiftCode, formatGiftCode } from './codes';

// Types for gift code data
export interface GiftCodeData {
  code: string;
  order_id?: string;
  platform_id: string;
  subscription_id: string;
  recipient_email: string;
  recipient_name: string;
  sender_name: string;
  message?: string;
  status: 'active' | 'redeemed' | 'expired';
  redeemed_at?: string;
  expires_at?: string;
}

/**
 * Creates a new gift code in the database
 */
export async function createGiftCode(data: Omit<GiftCodeData, 'code' | 'status'>): Promise<GiftCodeData> {
  // Generate a unique gift code
  const code = generateGiftCode();
  
  // Calculate expiration date (1 year from now)
  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);
  
  // Prepare the gift code data
  const giftCodeData: GiftCodeData = {
    ...data,
    code,
    status: 'active',
    expires_at: expiresAt.toISOString(),
  };
  
  // Create admin client to bypass RLS
  const supabaseAdmin = createAdminClient();
  
  // Insert into the database using admin client to bypass RLS
  const { data: result, error } = await supabaseAdmin
    .from('gift_codes')
    .insert(giftCodeData)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating gift code:', error);
    throw error;
  }
  
  return result;
}

/**
 * Gets a gift code by its code
 */
export async function getGiftCodeByCode(code: string): Promise<GiftCodeData | null> {
  const { data, error } = await supabase
    .from('gift_codes')
    .select('*')
    .eq('code', code)
    .eq('status', 'active')
    .single();
  
  if (error) {
    console.error(`Error fetching gift code ${code}:`, error);
    return null;
  }
  
  return data;
}

/**
 * Redeems a gift code
 */
export async function redeemGiftCode(code: string): Promise<GiftCodeData | null> {
  // Create admin client to bypass RLS
  const supabaseAdmin = createAdminClient();
  
  const { data, error } = await supabaseAdmin
    .from('gift_codes')
    .update({
      status: 'redeemed',
      redeemed_at: new Date().toISOString(),
    })
    .eq('code', code)
    .eq('status', 'active')
    .select()
    .single();
  
  if (error) {
    console.error(`Error redeeming gift code ${code}:`, error);
    return null;
  }
  
  return data;
}

/**
 * Gets all gift codes for a recipient email
 */
export async function getGiftCodesByEmail(email: string): Promise<GiftCodeData[]> {
  const { data, error } = await supabase
    .from('gift_codes')
    .select('*')
    .eq('recipient_email', email)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error(`Error fetching gift codes for ${email}:`, error);
    return [];
  }
  
  return data;
}

/**
 * Sends a gift email with the gift code
 */
export async function sendGiftEmail(giftCode: GiftCodeData): Promise<boolean> {
  try {
    // Format the gift code for display
    const formattedCode = formatGiftCode(giftCode.code);
    
    // Generate the redemption URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://intelligift.ai';
    const redeemUrl = `${baseUrl}/redeem?code=${giftCode.code}`;
    
    // Send the email
    const response = await fetch(`${baseUrl}/api/email/gift`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipientEmail: giftCode.recipient_email,
        recipientName: giftCode.recipient_name,
        senderName: giftCode.sender_name,
        message: giftCode.message,
        platformName: getPlatformName(giftCode.platform_id),
        subscriptionPeriod: getSubscriptionPeriod(giftCode.subscription_id),
        giftCode: formattedCode,
        redeemUrl,
      }),
    });
    
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Error sending gift email:', error);
    return false;
  }
}

/**
 * Helper function to get platform name from ID
 */
export function getPlatformName(platformId: string): string {
  const platforms: Record<string, string> = {
    'chatgpt': 'ChatGPT Plus',
    'claude': 'Claude Pro',
    'midjourney': 'Midjourney',
    'perplexity': 'Perplexity Pro',
    'github-copilot': 'GitHub Copilot',
  };
  
  return platforms[platformId] || 'AI Platform';
}

/**
 * Helper function to get subscription period from ID
 */
export function getSubscriptionPeriod(subscriptionId: string): string {
  if (subscriptionId.includes('1month')) return '1 Month';
  if (subscriptionId.includes('3months')) return '3 Months';
  if (subscriptionId.includes('1year')) return '1 Year';
  return subscriptionId;
}
