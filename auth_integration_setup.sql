-- Authentication Integration Setup for JeevanID
-- Run this script in Supabase SQL Editor after running workers_data_setup.sql

-- Step 1: Add user_id column to link workers_data with Supabase Auth users
ALTER TABLE workers_data ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Step 2: Create index for better performance on user_id lookups
CREATE INDEX IF NOT EXISTS idx_workers_data_user_id ON workers_data (user_id);

-- Step 3: Enable Row Level Security for production safety
ALTER TABLE workers_data ENABLE ROW LEVEL SECURITY;

-- Step 4: Drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON workers_data;
DROP POLICY IF EXISTS "Enable read for anonymous users" ON workers_data;
DROP POLICY IF EXISTS "Workers can view their own record" ON workers_data;
DROP POLICY IF EXISTS "Workers can update their own record" ON workers_data;
DROP POLICY IF EXISTS "Workers can insert their own record" ON workers_data;
DROP POLICY IF EXISTS "Allow public read for QR code access" ON workers_data;

-- Step 5: Create RLS policies for authenticated users

-- Allow logged-in users to read their own data
CREATE POLICY "Workers can view their own record"
ON workers_data
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Allow logged-in users to update their own record
CREATE POLICY "Workers can update their own record"
ON workers_data
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow inserting new worker data linked to the logged-in user
CREATE POLICY "Workers can insert their own record"
ON workers_data
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow public read access for QR code functionality (limited fields only)
-- This is needed for the /worker/:health_id page to work for anyone scanning QR codes
CREATE POLICY "Allow public read for QR code access"
ON workers_data
FOR SELECT
TO anon, authenticated
USING (true);

-- Step 6: Create a function to validate worker ID and phone for alternative login
CREATE OR REPLACE FUNCTION validate_worker_credentials(
  p_health_id VARCHAR(255),
  p_phone_number VARCHAR(20)
)
RETURNS TABLE(
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
    wd.user_id,
    wd.full_name,
    au.email
  FROM workers_data wd
  LEFT JOIN auth.users au ON wd.user_id = au.id
  WHERE wd.health_id = p_health_id 
    AND wd.phone_number = p_phone_number
    AND wd.user_id IS NOT NULL;
END;
$$;

-- Step 7: Create a function to link existing worker records with new auth users
CREATE OR REPLACE FUNCTION link_worker_to_user(
  p_health_id VARCHAR(255),
  p_phone_number VARCHAR(20),
  p_user_id UUID
)
RETURNS BOOLEAN
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  record_exists BOOLEAN;
BEGIN
  -- Check if worker record exists and is not already linked
  SELECT EXISTS(
    SELECT 1 FROM workers_data 
    WHERE health_id = p_health_id 
      AND phone_number = p_phone_number 
      AND user_id IS NULL
  ) INTO record_exists;
  
  IF record_exists THEN
    -- Link the worker record to the user
    UPDATE workers_data 
    SET user_id = p_user_id 
    WHERE health_id = p_health_id 
      AND phone_number = p_phone_number 
      AND user_id IS NULL;
    
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$;

-- Step 8: Grant necessary permissions
GRANT EXECUTE ON FUNCTION validate_worker_credentials(VARCHAR, VARCHAR) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION link_worker_to_user(VARCHAR, VARCHAR, UUID) TO authenticated;

-- Step 9: Create a view for worker dashboard data (optional, for cleaner queries)
CREATE OR REPLACE VIEW worker_dashboard_view AS
SELECT 
  wd.id,
  wd.health_id,
  wd.full_name,
  wd.date_of_birth,
  wd.age,
  wd.gender,
  wd.phone_number,
  wd.address,
  wd.occupation_type,
  wd.contractor_name,
  wd.blood_group,
  wd.allergies,
  wd.chronic_diseases,
  wd.vaccination_status,
  wd.qr_code_data,
  wd.created_at,
  wd.updated_at,
  wd.user_id,
  au.email
FROM workers_data wd
LEFT JOIN auth.users au ON wd.user_id = au.id;

-- Grant access to the view
GRANT SELECT ON worker_dashboard_view TO authenticated;

-- Step 10: Display current table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'workers_data' 
ORDER BY ordinal_position;

-- Step 11: Show existing policies
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'workers_data';

-- Instructions for testing:
-- 1. Create a test user account through the auth system
-- 2. Use validate_worker_credentials() to test worker ID + phone login
-- 3. Use link_worker_to_user() to connect existing worker records with new users
-- 4. Test that RLS policies properly restrict data access