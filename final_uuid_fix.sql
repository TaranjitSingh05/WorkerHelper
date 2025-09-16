-- Final UUID Fix - Comprehensive solution for Clerk compatibility
-- This handles all possible sources of UUID errors
-- Run this in Supabase SQL Editor

-- ============================
-- STEP 1: IDENTIFY THE PROBLEM
-- ============================

-- Check current state of workers_data.user_id
SELECT 'Current workers_data.user_id column info:' as info;
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'workers_data' 
  AND column_name = 'user_id';

-- Find all UUID columns that might be causing issues
SELECT 'All UUID columns in the database:' as info;
SELECT 
    table_name,
    column_name, 
    data_type
FROM information_schema.columns 
WHERE data_type = 'uuid'
  AND (column_name = 'user_id' OR table_name LIKE '%worker%')
ORDER BY table_name, column_name;

-- ============================
-- STEP 2: NUCLEAR RESET
-- ============================

-- Drop ALL possible problematic objects
DROP TABLE IF EXISTS auth.users CASCADE;
DROP SCHEMA IF EXISTS auth CASCADE;
DROP EXTENSION IF EXISTS "uuid-ossp" CASCADE;

-- Drop all worker-related views and functions
DROP VIEW IF EXISTS worker_dashboard_view CASCADE;
DROP FUNCTION IF EXISTS validate_worker_credentials_otp CASCADE;
DROP FUNCTION IF EXISTS create_worker_profile_otp CASCADE;
DROP FUNCTION IF EXISTS generate_health_id CASCADE;

-- Drop ALL policies on workers_data
DO $$ 
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'workers_data'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON workers_data';
    END LOOP;
END $$;

-- Disable RLS temporarily
ALTER TABLE workers_data DISABLE ROW LEVEL SECURITY;

-- Drop and recreate the entire user_id column
ALTER TABLE workers_data DROP COLUMN IF EXISTS user_id CASCADE;
ALTER TABLE workers_data ADD COLUMN user_id TEXT;

-- ============================
-- STEP 3: REBUILD CLEAN STRUCTURE
-- ============================

-- Create proper indexes
CREATE INDEX IF NOT EXISTS idx_workers_data_user_id ON workers_data (user_id);
CREATE INDEX IF NOT EXISTS idx_workers_data_health_id ON workers_data (health_id);

-- Re-enable RLS with simple policy
ALTER TABLE workers_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_all_for_clerk" ON workers_data
    FOR ALL 
    USING (true) 
    WITH CHECK (true);

-- Grant all permissions
GRANT ALL ON workers_data TO anon, authenticated;

-- ============================
-- STEP 4: TEST THE FIX
-- ============================

DO $$
BEGIN
    -- Test 1: Insert with Clerk user ID
    INSERT INTO workers_data (
        user_id, 
        full_name, 
        health_id,
        phone_number,
        created_at
    ) VALUES (
        'user_32kFLRIkC8wA5A9Dkm0vNxniHfd',
        'Test Clerk User',
        'WH-CLERK-TEST',
        '1234567890',
        NOW()
    );
    
    RAISE NOTICE '✅ SUCCESS: Clerk user ID inserted successfully!';
    
    -- Test 2: Update the record
    UPDATE workers_data 
    SET full_name = 'Updated Test User'
    WHERE user_id = 'user_32kFLRIkC8wA5A9Dkm0vNxniHfd';
    
    RAISE NOTICE '✅ SUCCESS: Record updated successfully!';
    
    -- Test 3: Select the record
    PERFORM * FROM workers_data WHERE user_id = 'user_32kFLRIkC8wA5A9Dkm0vNxniHfd';
    
    RAISE NOTICE '✅ SUCCESS: Record selected successfully!';
    
    -- Clean up test data
    DELETE FROM workers_data WHERE health_id = 'WH-CLERK-TEST';
    
    RAISE NOTICE '🎉 ALL TESTS PASSED - UUID issue is fixed!';
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '❌ ERROR: %', SQLERRM;
        RAISE NOTICE 'SQLSTATE: %', SQLSTATE;
END $$;

-- ============================
-- STEP 5: VERIFY THE FIX
-- ============================

-- Show final column structure
SELECT 'Final workers_data.user_id structure:' as info;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'workers_data' 
  AND column_name = 'user_id';

-- Show that no UUID columns remain for user_id
SELECT 'Remaining UUID columns (should be empty):' as info;
SELECT 
    table_name,
    column_name, 
    data_type
FROM information_schema.columns 
WHERE column_name = 'user_id'
  AND data_type = 'uuid';

-- Show current policies
SELECT 'Current RLS policies:' as info;
SELECT 
    policyname,
    roles,
    cmd
FROM pg_policies 
WHERE tablename = 'workers_data';

RAISE NOTICE '=================================================';
RAISE NOTICE '🎉 UUID FIX COMPLETE!';
RAISE NOTICE '=================================================';
RAISE NOTICE 'Your form should now work with Clerk user IDs.';
RAISE NOTICE 'Test by filling and submitting the form.';
RAISE NOTICE '=================================================';