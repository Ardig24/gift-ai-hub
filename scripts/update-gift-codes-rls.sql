-- Drop existing RLS policies
DROP POLICY IF EXISTS admin_all_gift_codes ON gift_codes;
DROP POLICY IF EXISTS user_own_gift_codes ON gift_codes;
DROP POLICY IF EXISTS anon_redeem_gift_codes ON gift_codes;

-- Create new RLS policies

-- Policy for admins to see and modify all gift codes
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

-- Allow service role and anonymous users to insert new gift codes
CREATE POLICY service_insert_gift_codes ON gift_codes
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow service role to update gift codes (for redemption)
CREATE POLICY service_update_gift_codes ON gift_codes
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
