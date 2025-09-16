-- Debug UUID Issue - Find all potential sources of the UUID error
-- Run this in Supabase SQL Editor to identify the problem

-- Step 1: Check if workers_data.user_id is actually TEXT now
SELECT 
    table_name,
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'workers_data' 
  AND column_name = 'user_id';

-- Step 2: Find ALL tables with user_id columns that might be UUID
SELECT 
    table_schema,
    table_name,
    column_name, 
    data_type
FROM information_schema.columns 
WHERE column_name = 'user_id'
  AND data_type = 'uuid'
ORDER BY table_name;

-- Step 3: Find any functions that might expect UUID
SELECT 
    routine_name,
    routine_definition
FROM information_schema.routines 
WHERE routine_definition ILIKE '%user_id%uuid%'
   OR routine_definition ILIKE '%uuid%user_id%';

-- Step 4: Check for any remaining foreign key constraints
SELECT
    tc.table_name, 
    tc.constraint_name, 
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND (kcu.column_name = 'user_id' OR ccu.column_name = 'user_id');

-- Step 5: Test inserting a Clerk user ID to see exact error
DO $$
BEGIN
    -- Try to insert with Clerk-style user ID
    INSERT INTO workers_data (
        user_id, 
        full_name, 
        health_id, 
        phone_number,
        created_at
    ) VALUES (
        'user_32kFLRIkC8wA5A9Dkm0vNxniHfd',
        'Test User', 
        'WH-TEST-DEBUG',
        '1234567890',
        NOW()
    );
    
    RAISE NOTICE 'SUCCESS: Insert worked!';
    
    -- Clean up
    DELETE FROM workers_data WHERE health_id = 'WH-TEST-DEBUG';
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'ERROR: %', SQLERRM;
        RAISE NOTICE 'SQLSTATE: %', SQLSTATE;
END $$;

-- Step 6: Check if there are any triggers on workers_data
SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'workers_data';

-- Step 7: Check current RLS policies
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