// We'll use fetch API directly to call Brevo's API
import { getRedemptionEmailTemplate, getRedemptionEmailTextTemplate } from './redemption-template';

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const BREVO_API_KEY = process.env.BREVO_API_KEY;

if (!BREVO_API_KEY) {
  console.warn('BREVO_API_KEY is not set. Email functionality will not work.');
}

/**
 * Sends a redemption confirmation email to the recipient
 */
export async function sendRedemptionEmail({
  recipientEmail,
  recipientName,
  platformName,
  subscriptionPeriod,
  activationCode = 'GIFT-DEMO-12345', // This would be a real code in production
  activationUrl = 'https://chat.openai.com/redeem', // This would be the actual redemption URL
}: {
  recipientEmail: string;
  recipientName: string;
  platformName: string;
  subscriptionPeriod: string;
  activationCode?: string;
  activationUrl?: string;
}): Promise<boolean> {
  try {
    // Get the HTML template
    const htmlContent = getRedemptionEmailTemplate({
      recipientName,
      platformName,
      subscriptionPeriod,
      activationCode,
      activationUrl
    });

    // Get the plain text template
    const textContent = getRedemptionEmailTextTemplate({
      recipientName,
      platformName,
      subscriptionPeriod,
      activationCode,
      activationUrl
    });

    // Prepare the email payload for Brevo API
    const emailPayload = {
      sender: {
        name: 'GiftAI Hub',
        email: process.env.BREVO_FROM_EMAIL || 'gifts@giftaihub.com'
      },
      to: [
        {
          email: recipientEmail,
          name: recipientName
        }
      ],
      subject: `Your ${platformName} Gift Has Been Activated!`,
      htmlContent: htmlContent,
      textContent: textContent
    };
    
    // Send the email using fetch API
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY || ''
      },
      body: JSON.stringify(emailPayload)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Brevo API error: ${JSON.stringify(errorData)}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error sending redemption email:', error);
    return false;
  }
}
