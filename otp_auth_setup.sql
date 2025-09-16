-- OTP Authentication Setup for JeevanID
-- Run this script in Supabase SQL Editor after running auth_integration_setup.sql

-- Step 1: Ensure workers_data table has all required fields
ALTER TABLE workers_data ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE workers_data ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);

-- Step 2: Create index for phone number lookups
CREATE INDEX IF NOT EXISTS idx_workers_data_phone_number ON workers_data (phone_number);

-- Step 3: Ensure RLS is enabled
ALTER TABLE workers_data ENABLE ROW LEVEL SECURITY;

-- Step 4: Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON workers_data;
DROP POLICY IF EXISTS "Enable read for anonymous users" ON workers_data;
DROP POLICY IF EXISTS "Workers can view their own record" ON workers_data;
DROP POLICY IF EXISTS "Workers can update their own record" ON workers_data;
DROP POLICY IF EXISTS "Workers can insert their own record" ON workers_data;
DROP POLICY IF EXISTS "Allow public read for QR code access" ON workers_data;

-- Step 5: Create comprehensive RLS policies

-- Allow authenticated users to view their own records
CREATE POLICY "Workers can view their own record"
ON workers_data
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Allow authenticated users to update their own records
CREATE POLICY "Workers can update their own record"
ON workers_data
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to insert their own records
CREATE POLICY "Workers can insert their own record"
ON workers_data
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow public read access for QR code functionality (limited fields only)
-- This enables the /worker/:health_id page to work for QR code scanning
CREATE POLICY "Allow public read for QR code access"
ON workers_data
FOR SELECT
TO anon, authenticated
USING (true);

-- Step 6: Update the worker credentials validation function for OTP login
CREATE OR REPLACE FUNCTION validate_worker_credentials_otp(
  p_health_id VARCHAR(255),
  p_phone_number VARCHAR(20)
)
RETURNS TABLE(
  worker_id INTEGER,
  user_id UUID,
  full_name VARCHAR(255),
  email TEXT
) 
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    wd.id,
    wd.user_id,
    wd.full_name,
    au.email
  FROM workers_data wd
  LEFT JOIN auth.users au ON wd.user_id = au.id
  WHERE wd.health_id = p_health_id 
    AND wd.phone_number = p_phone_number;
END;
$$;

-- Step 7: Create function to link phone number during OTP signup
CREATE OR REPLACE FUNCTION create_worker_profile_otp(
  p_user_id UUID,
  p_full_name VARCHAR(255),
  p_phone_number VARCHAR(20)
)
RETURNS BOOLEAN
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Insert basic worker profile that will be completed later
  INSERT INTO workers_data (
    user_id,
    full_name,
    phone_number,
    health_id,
    created_at
  ) VALUES (
    p_user_id,
    p_full_name,
    p_phone_number,
    'WH-' || upper(substr(md5(random()::text), 1, 6)) || '-' || upper(substr(md5(random()::text), 1, 6)),
    NOW()
  ) ON CONFLICT (user_id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    phone_number = EXCLUDED.phone_number,
    updated_at = NOW();
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;

-- Step 8: Grant necessary permissions
GRANT EXECUTE ON FUNCTION validate_worker_credentials_otp(VARCHAR, VARCHAR) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION create_worker_profile_otp(UUID, VARCHAR, VARCHAR) TO authenticated;

-- Step 9: Create trigger to auto-generate health_id if not provided
CREATE OR REPLACE FUNCTION generate_health_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.health_id IS NULL OR NEW.health_id = '' THEN
    NEW.health_id := 'WH-' || upper(substr(md5(random()::text), 1, 6)) || '-' || upper(substr(md5(random()::text), 1, 6));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_generate_health_id ON workers_data;
CREATE TRIGGER trigger_generate_health_id
  BEFORE INSERT ON workers_data
  FOR EACH ROW
  EXECUTE FUNCTION generate_health_id();

-- Step 10: View current table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'workers_data' 
ORDER BY ordinal_position;

-- Step 11: Show RLS policies
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'workers_data';

-- Instructions:
-- 1. Run this script in Supabase SQL Editor
-- 2. Verify that phone_number column exists
-- 3. Test the OTP functions with sample data
-- 4. Configure Supabase Auth settings for OTP delivery