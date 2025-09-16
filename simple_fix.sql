-- Simple and Safe UUID Fix
-- Run each query one by one in Supabase SQL Editor

-- Query 1: Check current column type
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'workers_data' 
  AND column_name = 'user_id';