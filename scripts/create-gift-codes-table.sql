-- Create gift_codes table
CREATE TABLE IF NOT EXISTS gift_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(20) NOT NULL UNIQUE,
  order_id UUID REFERENCES orders(id),
  platform_id VARCHAR(50) NOT NULL,
  subscription_id VARCHAR(100) NOT NULL,
  recipient_email VARCHAR(255) NOT NULL,
  recipient_name VARCHAR(255) NOT NULL,
  sender_name VARCHAR(255) NOT NULL,
  message TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'active', -- active, redeemed, expired
  redeemed_at TIMESTAMP,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index on code for faster lookups
CREATE INDEX IF NOT EXISTS idx_gift_codes_code ON gift_codes(code);

-- Create index on recipient_email
CREATE INDEX IF NOT EXISTS idx_gift_codes_recipient_email ON gift_codes(recipient_email);

-- Create RLS policies
ALTER TABLE gift_codes ENABLE ROW LEVEL SECURITY;

-- Policy for admins to see all gift codes
CREATE POLICY admin_all_gift_codes ON gift_codes
  FOR ALL
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Policy for users to see their own gift codes (by recipient email)
CREATE POLICY user_own_gift_codes ON gift_codes
  FOR SELECT
  TO authenticated
  USING (recipient_email = auth.jwt() ->> 'email');

-- Allow anonymous access for redeeming codes
CREATE POLICY anon_redeem_gift_codes ON gift_codes
  FOR SELECT
  TO anon
  USING (status = 'active');
