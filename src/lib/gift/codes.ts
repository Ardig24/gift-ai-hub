import crypto from 'crypto';

/**
 * Generates a secure, random gift code
 * @param length The length of the code (default: 12)
 * @returns A random alphanumeric code
 */
export function generateGiftCode(length: number = 12): string {
  // Generate random bytes
  const randomBytes = crypto.randomBytes(Math.ceil(length * 3 / 4));
  
  // Convert to base64
  const base64 = randomBytes.toString('base64');
  
  // Make URL-safe and remove padding
  const urlSafe = base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  
  // Trim to desired length
  return urlSafe.substring(0, length).toUpperCase();
}

/**
 * Validates a gift code format
 * @param code The code to validate
 * @returns True if the code format is valid
 */
export function isValidGiftCodeFormat(code: string): boolean {
  // Check if code matches the expected pattern
  return /^[A-Z0-9_-]{12}$/.test(code);
}

/**
 * Formats a gift code for display with dashes
 * @param code The raw gift code
 * @returns Formatted gift code (e.g., XXXX-XXXX-XXXX)
 */
export function formatGiftCode(code: string): string {
  if (!code || code.length !== 12) return code;
  
  // Format as XXXX-XXXX-XXXX
  return `${code.substring(0, 4)}-${code.substring(4, 8)}-${code.substring(8, 12)}`;
}
