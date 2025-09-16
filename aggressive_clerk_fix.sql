-- Aggressive Clerk Compatibility Fix for JeevanID
-- This script forcefully removes all dependencies and fixes the user_id column
-- ⚠️ WARNING: This will drop ALL views and rules related to workers_data
-- Run this script in Supabase SQL Editor

-- Step 1: Find and display all dependencies (for information)
DO $$
DECLARE
    dep_record RECORD;
BEGIN
    RAISE NOTICE 'Finding all dependencies on workers_data table...';
    
    FOR dep_record IN
        SELECT DISTINCT
            n.nspname as schema_name,
            c.relname as table_name,
            r.rulename as rule_name
        FROM pg_rewrite r
        JOIN pg_class c ON c.oid = r.ev_class
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE pg_get_ruledef(r.oid) LIKE '%user_id%'
           OR pg_get_ruledef(r.oid) LIKE '%workers_data%'
    LOOP
        RAISE NOTICE 'Found dependency: %.% (rule: %)', 
            dep_record.schema_name, 
            dep_record.table_name, 
            dep_record.rule_name;
    END LOOP;
END $$;

-- Step 2: Drop ALL possible views with CASCADE (nuclear option)
DROP VIEW IF EXISTS worker_dashboard_view CASCADE;
DROP VIEW IF EXISTS public.worker_dashboard_view CASCADE;
DROP VIEW IF EXISTS worker_profile_view CASCADE;
DROP VIEW IF EXISTS public.worker_profile_view CASCADE;
DROP VIEW IF EXISTS worker_summary_view CASCADE;
DROP VIEW IF EXISTS public.worker_summary_view CASCADE;
DROP VIEW IF EXISTS worker_details_view CASCADE;
DROP VIEW IF EXISTS public.worker_details_view CASCADE;
DROP VIEW IF EXISTS worker_info_view CASCADE;
DROP VIEW IF EXISTS public.worker_info_view CASCADE;

-- Step 3: Drop any materialized views
DROP MATERIALIZED VIEW IF EXISTS worker_dashboard_view CASCADE;
DROP MATERIALIZED VIEW IF EXISTS public.worker_dashboard_view CASCADE;

-- Step 4: Drop all RLS policies
DROP POLICY IF EXISTS "Workers can view their own record" ON workers_data;
DROP POLICY IF EXISTS "Workers can update their own record" ON workers_data;
DROP POLICY IF EXISTS "Workers can insert their own record" ON workers_data;
DROP POLICY IF EXISTS "Allow public read for QR code access" ON workers_data;
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON workers_data;
DROP POLICY IF EXISTS "Enable read for anonymous users" ON workers_data;
DROP POLICY IF EXISTS "Allow all operations for authenticated and anonymous users" ON workers_data;

-- Step 5: Drop foreign key constraints
ALTER TABLE workers_data DROP CONSTRAINT IF EXISTS workers_data_user_id_fkey;
ALTER TABLE workers_data DROP CONSTRAINT IF EXISTS fk_workers_data_user_id;

-- Step 6: Drop any indexes on user_id
DROP INDEX IF EXISTS idx_workers_data_user_id;
DROP INDEX IF EXISTS idx_workers_data_phone_number;

-- Step 7: NUCLEAR OPTION - Temporarily disable RLS to avoid any conflicts
ALTER TABLE workers_data DISABLE ROW LEVEL SECURITY;

-- Step 8: Now attempt the column alteration with CASCADE
BEGIN;
    -- Try to alter the column type
    ALTER TABLE workers_data ALTER COLUMN user_id TYPE TEXT USING 
        CASE 
            WHEN user_id::TEXT = '' THEN NULL
            ELSE user_id::TEXT 
        END;
    
    -- Make it nullable
    ALTER TABLE workers_data ALTER COLUMN user_id DROP NOT NULL;
    
    RAISE NOTICE 'SUCCESS: Column user_id changed to TEXT!';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'ERROR during column alteration: %', SQLERRM;
        ROLLBACK;
        
        -- If it still fails, show what's blocking it
        RAISE NOTICE 'Attempting to find remaining dependencies...';
        
        -- Try to find what's still blocking
        SELECT string_agg(
            format('%I.%I', schemaname, viewname), 
            ', '
        ) as blocking_views
        FROM pg_views 
        WHERE definition LIKE '%workers_data%' 
           OR definition LIKE '%user_id%'
        GROUP BY 1;
END;

-- Step 9: Re-enable RLS and create simple policy
ALTER TABLE workers_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_all_operations" ON workers_data
FOR ALL USING (true) WITH CHECK (true);

-- Step 10: Recreate essential indexes
CREATE UNIQUE INDEX idx_workers_data_user_id ON workers_data (user_id) 
WHERE user_id IS NOT NULL;

CREATE INDEX idx_workers_data_health_id ON workers_data (health_id);
CREATE INDEX idx_workers_data_phone_number ON workers_data (phone_number);

-- Step 11: Grant permissions
GRANT ALL ON workers_data TO anon, authenticated;

-- Step 12: Test with Clerk-style user ID
DO $$
BEGIN
    -- Test insertion
    INSERT INTO workers_data (user_id, full_name, health_id, created_at) 
    VALUES ('user_test_clerk_123', 'Test User', 'WH-TEST-CLERK', NOW())
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Test selection
    PERFORM * FROM workers_data WHERE user_id = 'user_test_clerk_123';
    
    -- Clean up
    DELETE FROM workers_data WHERE user_id = 'user_test_clerk_123';
    
    RAISE NOTICE '🎉 SUCCESS: Clerk user ID format is working!';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '❌ TEST FAILED: %', SQLERRM;
END $$;

-- Step 13: Verify final state
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'workers_data' 
  AND column_name = 'user_id';

-- Step 14: Show final table structure
\d workers_data;