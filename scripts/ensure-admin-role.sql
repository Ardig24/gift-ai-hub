-- This script ensures a user has admin role in the user_roles table
-- Replace 'YOUR_USER_ID' with your actual Supabase user ID

-- First, check if the user already has an admin role
DO $$
DECLARE
  user_id_var UUID := 'YOUR_USER_ID'::UUID; -- Replace with your actual user ID
  role_exists BOOLEAN;
BEGIN
  -- Check if the user already has an admin role
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = user_id_var AND role = 'admin'
  ) INTO role_exists;
  
  -- If the role doesn't exist, insert it
  IF NOT role_exists THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (user_id_var, 'admin');
    RAISE NOTICE 'Admin role added for user %', user_id_var;
  ELSE
    RAISE NOTICE 'User % already has admin role', user_id_var;
  END IF;
END $$;
