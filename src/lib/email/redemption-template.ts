/**
 * Returns the HTML template for the redemption confirmation email
 */
export function getRedemptionEmailTemplate({
  recipientName,
  platformName,
  subscriptionPeriod,
  activationCode = 'GIFT-DEMO-12345', // This would be a real code in production
  activationUrl = 'https://chat.openai.com/redeem', // This would be the actual redemption URL
}: {
  recipientName: string;
  platformName: string;
  subscriptionPeriod: string;
  activationCode?: string;
  activationUrl?: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Gift Has Been Redeemed!</title>
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
    
    .success-container {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      border-radius: 16px;
      padding: 30px;
      margin: 20px 0;
      color: white;
      position: relative;
      overflow: hidden;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }
    
    .success-title {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 16px;
      text-align: center;
    }
    
    .activation-code {
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      padding: 16px;
      margin: 20px 0;
      text-align: center;
      font-family: monospace;
      font-size: 20px;
      letter-spacing: 2px;
      font-weight: 600;
    }
    
    .button {
      display: inline-block;
      background-color: white;
      color: #059669;
      font-weight: 600;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 8px;
      margin-top: 20px;
      text-align: center;
    }
    
    .email-content {
      padding: 20px 0;
    }
    
    .email-footer {
      text-align: center;
      padding: 20px 0;
      color: #6b7280;
      font-size: 14px;
      border-top: 1px solid #e5e7eb;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-header">
      <img src="https://intelligift.ai/logo.png" alt="IntelliGift Logo" class="logo">
      <h1>Your Gift Has Been Redeemed!</h1>
    </div>
    
    <div class="success-container">
      <div class="success-title">Congratulations, ${recipientName}!</div>
      <p>Your ${platformName} subscription (${subscriptionPeriod}) has been successfully activated.</p>
      
      <p>Use the activation code below to access your subscription:</p>
      <div class="activation-code">${activationCode}</div>
      
      <p>Visit the ${platformName} website and enter this code during signup or in your account settings.</p>
      
      <a href="${activationUrl}" class="button">Activate Your Subscription</a>
    </div>
    
    <div class="email-content">
      <h2>How to Access Your Subscription</h2>
      <ol>
        <li>Visit <a href="${activationUrl}">${platformName}</a></li>
        <li>Create an account if you don't already have one</li>
        <li>Go to account settings or subscription management</li>
        <li>Enter the activation code provided above</li>
        <li>Enjoy your premium access!</li>
      </ol>
      
      <p>If you have any questions or need assistance, please contact our support team at support@intelligift.ai.</p>
    </div>
    
    <div class="email-footer">
      <p>&copy; ${new Date().getFullYear()} IntelliGift. All rights reserved.</p>
      <p>This email was sent to you because you redeemed a gift on IntelliGift.</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Returns the plain text version of the redemption confirmation email
 */
export function getRedemptionEmailTextTemplate({
  recipientName,
  platformName,
  subscriptionPeriod,
  activationCode = 'GIFT-DEMO-12345',
  activationUrl = 'https://chat.openai.com/redeem',
}: {
  recipientName: string;
  platformName: string;
  subscriptionPeriod: string;
  activationCode?: string;
  activationUrl?: string;
}): string {
  return `
Congratulations, ${recipientName}!

Your ${platformName} subscription (${subscriptionPeriod}) has been successfully activated.

Use the activation code below to access your subscription:

${activationCode}

Visit the ${platformName} website (${activationUrl}) and enter this code during signup or in your account settings.

How to Access Your Subscription:
1. Visit ${platformName} (${activationUrl})
2. Create an account if you don't already have one
3. Go to account settings or subscription management
4. Enter the activation code provided above
5. Enjoy your premium access!

If you have any questions or need assistance, please contact our support team at support@intelligift.ai.

© ${new Date().getFullYear()} IntelliGift. All rights reserved.
This email was sent to you because you redeemed a gift on IntelliGift.
  `;
}
