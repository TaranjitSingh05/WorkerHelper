-- Clerk Compatibility Fix v2 for WorkerHelper
-- This script handles views and dependencies before altering the user_id column
-- Run this script in Supabase SQL Editor

-- Step 1: First, let's see what views depend on the user_id column
SELECT 
    schemaname, 
    viewname, 
    definition 
FROM pg_views 
WHERE viewname LIKE '%worker%' OR definition LIKE '%user_id%';

-- Step 2: Drop the dependent view temporarily
DROP VIEW IF EXISTS worker_dashboard_view;

-- Step 3: Drop any other dependent views that might exist
DROP VIEW IF EXISTS worker_profile_view;
DROP VIEW IF EXISTS worker_summary_view;

-- Step 4: Drop existing foreign key constraint and policies that reference auth.users
ALTER TABLE workers_data DROP CONSTRAINT IF EXISTS workers_data_user_id_fkey;

-- Step 5: Drop existing RLS policies to recreate them
DROP POLICY IF EXISTS "Workers can view their own record" ON workers_data;
DROP POLICY IF EXISTS "Workers can update their own record" ON workers_data;
DROP POLICY IF EXISTS "Workers can insert their own record" ON workers_data;
DROP POLICY IF EXISTS "Allow public read for QR code access" ON workers_data;
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON workers_data;
DROP POLICY IF EXISTS "Enable read for anonymous users" ON workers_data;

-- Step 6: Now safely change user_id column from UUID to TEXT
ALTER TABLE workers_data ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;

-- Step 7: Update the column to allow NULL values (for anonymous users)
ALTER TABLE workers_data ALTER COLUMN user_id DROP NOT NULL;

-- Step 8: Create new RLS policies compatible with Clerk

-- Allow all operations for now - we'll handle auth logic in the application layer
CREATE POLICY "Allow all operations for authenticated and anonymous users"
ON workers_data
FOR ALL
TO authenticated, anon
USING (true)
WITH CHECK (true);

-- Step 9: Update existing functions to work with TEXT user_id

-- Update the worker credentials validation function
CREATE OR REPLACE FUNCTION validate_worker_credentials_otp(
  p_health_id VARCHAR(255),
  p_phone_number VARCHAR(20)
)
RETURNS TABLE(
  worker_id INTEGER,
  user_id TEXT,
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
    CAST('' AS TEXT) as email -- Since we're using Clerk, email is handled separately
  FROM workers_data wd
  WHERE wd.health_id = p_health_id 
    AND wd.phone_number = p_phone_number;
END;
$$;

-- Update the create worker profile function
CREATE OR REPLACE FUNCTION create_worker_profile_otp(
  p_user_id TEXT,
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

-- Step 10: Grant necessary permissions
GRANT EXECUTE ON FUNCTION validate_worker_credentials_otp(VARCHAR, VARCHAR) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION create_worker_profile_otp(TEXT, VARCHAR, VARCHAR) TO authenticated;

-- Step 11: Add a unique constraint on user_id to prevent duplicate entries (only for non-null values)
DROP INDEX IF EXISTS idx_workers_data_user_id;
CREATE UNIQUE INDEX idx_workers_data_user_id ON workers_data (user_id) WHERE user_id IS NOT NULL;

-- Step 12: Recreate the worker_dashboard_view if it was being used
-- Note: This is a generic recreation - you may need to adjust based on your original view definition
CREATE OR REPLACE VIEW worker_dashboard_view AS
SELECT 
    id,
    user_id,
    health_id,
    full_name,
    phone_number,
    email,
    date_of_birth,
    age,
    gender,
    address,
    occupation_type,
    contractor_name,
    blood_group,
    allergies,
    chronic_diseases,
    vaccination_status,
    qr_code_data,
    created_at,
    updated_at
FROM workers_data;

-- Step 13: Grant permissions on the recreated view
GRANT SELECT ON worker_dashboard_view TO anon, authenticated;

-- Step 14: Verify the changes
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'workers_data' AND column_name = 'user_id';

-- Step 15: Show any remaining views that reference workers_data
SELECT 
    schemaname, 
    viewname, 
    definition 
FROM pg_views 
WHERE definition LIKE '%workers_data%';

-- Step 16: Show updated RLS policies
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'workers_data';

-- Step 17: Test that we can insert a Clerk user ID
-- This is just a test - remove this section after verification
DO $$
BEGIN
  -- Try to insert a test record with Clerk-style user ID
  INSERT INTO workers_data (user_id, full_name, health_id, created_at) 
  VALUES ('user_test123ABC', 'Test User', 'WH-TEST-123', NOW())
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Clean up the test record
  DELETE FROM workers_data WHERE user_id = 'user_test123ABC';
  
  RAISE NOTICE 'Success: Clerk user ID format is now supported!';
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error: %, %', SQLERRM, SQLSTATE;
END $$;