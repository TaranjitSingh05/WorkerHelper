-- Clerk Compatibility Fix for WorkerHelper
-- This script updates the database schema to work with Clerk user IDs
-- Run this script in Supabase SQL Editor

-- Step 1: Drop existing foreign key constraint and policies that reference auth.users
ALTER TABLE workers_data DROP CONSTRAINT IF EXISTS workers_data_user_id_fkey;

-- Step 2: Drop existing RLS policies to recreate them
DROP POLICY IF EXISTS "Workers can view their own record" ON workers_data;
DROP POLICY IF EXISTS "Workers can update their own record" ON workers_data;
DROP POLICY IF EXISTS "Workers can insert their own record" ON workers_data;
DROP POLICY IF EXISTS "Allow public read for QR code access" ON workers_data;

-- Step 3: Change user_id column from UUID to TEXT to accommodate Clerk user IDs
ALTER TABLE workers_data ALTER COLUMN user_id TYPE TEXT;

-- Step 4: Update the column to allow NULL values (for anonymous users)
ALTER TABLE workers_data ALTER COLUMN user_id DROP NOT NULL;

-- Step 5: Create new RLS policies compatible with Clerk

-- Allow authenticated users to view their own records (using Clerk user ID)
CREATE POLICY "Workers can view their own record"
ON workers_data
FOR SELECT
TO authenticated, anon
USING (true); -- We'll handle auth logic in the application layer

-- Allow authenticated users to update their own records
CREATE POLICY "Workers can update their own record"
ON workers_data
FOR UPDATE
TO authenticated, anon
USING (true)
WITH CHECK (true); -- We'll handle auth logic in the application layer

-- Allow authenticated users to insert new records
CREATE POLICY "Workers can insert their own record"
ON workers_data
FOR INSERT
TO authenticated, anon
WITH CHECK (true); -- We'll handle auth logic in the application layer

-- Allow public read access for QR code functionality
CREATE POLICY "Allow public read for QR code access"
ON workers_data
FOR SELECT
TO anon, authenticated
USING (true);

-- Step 6: Update existing functions to work with TEXT user_id

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

-- Step 7: Grant necessary permissions
GRANT EXECUTE ON FUNCTION validate_worker_credentials_otp(VARCHAR, VARCHAR) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION create_worker_profile_otp(TEXT, VARCHAR, VARCHAR) TO authenticated;

-- Step 8: Add a unique constraint on user_id to prevent duplicate entries
CREATE UNIQUE INDEX IF NOT EXISTS idx_workers_data_user_id ON workers_data (user_id) WHERE user_id IS NOT NULL;

-- Step 9: Verify the changes
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'workers_data' AND column_name = 'user_id';

-- Step 10: Show updated RLS policies
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'workers_data';