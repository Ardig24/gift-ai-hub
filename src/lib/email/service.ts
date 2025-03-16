// We'll use fetch API directly to call Brevo's API
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const BREVO_API_KEY = process.env.BREVO_API_KEY;

if (!BREVO_API_KEY) {
  console.warn('BREVO_API_KEY is not set. Email functionality will not work.');
}

// Types for email parameters
export interface GiftEmailParams {
  recipientEmail: string;
  recipientName: string;
  senderName: string;
  message?: string;
  platformName: string;
  subscriptionPeriod: string;
  giftCode: string;
  redeemUrl: string;
}

/**
 * Sends a gift notification email to the recipient
 */
export async function sendGiftEmail(params: GiftEmailParams): Promise<boolean> {
  try {
    const {
      recipientEmail,
      recipientName,
      senderName,
      message,
      platformName,
      subscriptionPeriod,
      giftCode,
      redeemUrl
    } = params;

    // Format the subscription period for display
    const formattedPeriod = subscriptionPeriod
      .replace('1month', '1 Month')
      .replace('3months', '3 Months')
      .replace('1year', '1 Year');

    // Get the HTML template
    const htmlContent = getGiftEmailTemplate({
      recipientName,
      senderName,
      message,
      platformName,
      subscriptionPeriod: formattedPeriod,
      giftCode,
      redeemUrl
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
      subject: `${senderName} has gifted you ${platformName}!`,
      htmlContent: htmlContent,
      textContent: getPlainTextVersion({
        recipientName,
        senderName,
        message,
        platformName,
        subscriptionPeriod: formattedPeriod,
        giftCode,
        redeemUrl
      })
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
    console.error('Error sending gift email:', error);
    return false;
  }
}

/**
 * Creates a plain text version of the email for clients that don't support HTML
 */
function getPlainTextVersion(params: Omit<GiftEmailParams, 'recipientEmail'>): string {
  const {
    recipientName,
    senderName,
    message,
    platformName,
    subscriptionPeriod,
    giftCode,
    redeemUrl
  } = params;

  return `
Hello ${recipientName},

You've received a gift from ${senderName}!

${senderName} has gifted you ${platformName} (${subscriptionPeriod}) subscription.

${message ? `Personal message: "${message}"` : ''}

To redeem your gift, use this code: ${giftCode}

Visit the link below to redeem your gift:
${redeemUrl}

Thank you for using GiftAI Hub!
  `;
}

/**
 * Returns the HTML template for the gift email
 */
function getGiftEmailTemplate(params: Omit<GiftEmailParams, 'recipientEmail'>): string {
  const {
    recipientName,
    senderName,
    message,
    platformName,
    subscriptionPeriod,
    giftCode,
    redeemUrl
  } = params;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You've Received an AI Gift!</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.5;
      color: #374151;
      background-color: #f9fafb;
      margin: 0;
      padding: 0;
    }
    
    .email-wrapper {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
    }
    
    .email-header {
      text-align: center;
      padding: 20px 0;
    }
    
    .logo {
      max-width: 180px;
      margin-bottom: 20px;
    }
    
    .gift-container {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      border-radius: 16px;
      padding: 30px;
      margin: 20px 0;
      color: white;
      position: relative;
      overflow: hidden;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }
    
    .gift-container::before {
      content: '';
      position: absolute;
      top: -50px;
      right: -50px;
      width: 100px;
      height: 100px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
    }
    
    .gift-container::after {
      content: '';
      position: absolute;
      bottom: -30px;
      left: -30px;
      width: 80px;
      height: 80px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
    }
    
    .gift-title {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 15px;
      color: white;
    }
    
    .gift-details {
      margin-bottom: 20px;
    }
    
    .platform-name {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 5px;
    }
    
    .subscription-period {
      font-size: 16px;
      opacity: 0.9;
    }
    
    .message-container {
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 15px;
      margin: 20px 0;
      font-style: italic;
    }
    
    .gift-code-container {
      background-color: #f3f4f6;
      border-radius: 12px;
      padding: 20px;
      margin: 20px 0;
      text-align: center;
    }
    
    .gift-code-label {
      font-size: 14px;
      color: #6b7280;
      margin-bottom: 10px;
    }
    
    .gift-code {
      font-family: monospace;
      font-size: 24px;
      font-weight: 600;
      color: #4f46e5;
      letter-spacing: 2px;
      padding: 10px;
      background-color: #ffffff;
      border: 1px dashed #d1d5db;
      border-radius: 6px;
      display: inline-block;
    }
    
    .redeem-button {
      display: block;
      background-color: #4f46e5;
      color: white;
      text-decoration: none;
      padding: 16px 24px;
      border-radius: 8px;
      font-weight: 600;
      text-align: center;
      margin: 30px auto;
      max-width: 250px;
      transition: background-color 0.2s;
    }
    
    .redeem-button:hover {
      background-color: #4338ca;
    }
    
    .email-footer {
      text-align: center;
      padding: 20px 0;
      font-size: 12px;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
      margin-top: 30px;
    }
    
    .social-links {
      margin: 15px 0;
    }
    
    .social-link {
      display: inline-block;
      margin: 0 10px;
    }
    
    @media (max-width: 600px) {
      .gift-container {
        padding: 20px;
      }
      
      .gift-title {
        font-size: 20px;
      }
      
      .platform-name {
        font-size: 18px;
      }
      
      .gift-code {
        font-size: 20px;
        letter-spacing: 1px;
      }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-header">
      <img src="https://giftaihub.com/images/logo.png" alt="GiftAI Hub" class="logo">
      <h1>You've Received an AI Gift!</h1>
    </div>
    
    <p>Hello ${recipientName},</p>
    
    <div class="gift-container">
      <div class="gift-title">🎁 ${senderName} has sent you a gift!</div>
      
      <div class="gift-details">
        <div class="platform-name">${platformName}</div>
        <div class="subscription-period">${subscriptionPeriod} Subscription</div>
      </div>
      
      ${message ? `
      <div class="message-container">
        "${message}"
      </div>
      ` : ''}
    </div>
    
    <div class="gift-code-container">
      <div class="gift-code-label">Your Gift Code:</div>
      <div class="gift-code">${giftCode}</div>
    </div>
    
    <p>Use this code to activate your ${platformName} subscription. This code is unique to you and can only be used once.</p>
    
    <a href="${redeemUrl}" class="redeem-button">Redeem Your Gift</a>
    
    <p>If you have any questions about your gift, please contact our support team at support@giftaihub.com.</p>
    
    <div class="email-footer">
      <p>© ${new Date().getFullYear()} GiftAI Hub. All rights reserved.</p>
      <div class="social-links">
        <a href="https://twitter.com/giftaihub" class="social-link">Twitter</a>
        <a href="https://instagram.com/giftaihub" class="social-link">Instagram</a>
        <a href="https://linkedin.com/company/giftaihub" class="social-link">LinkedIn</a>
      </div>
      <p>GiftAI Hub, Inc. • 123 AI Street, San Francisco, CA 94103</p>
    </div>
  </div>
</body>
</html>
  `;
}
