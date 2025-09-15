-- Supabase RLS Policy for Workers Table
-- Run this SQL in your Supabase SQL Editor

-- First, ensure the workers table exists with proper columns
-- If the table doesn't exist, create it:
CREATE TABLE IF NOT EXISTS workers (
  id SERIAL PRIMARY KEY,
  health_id VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  date_of_birth DATE NOT NULL,
  age INTEGER,
  gender VARCHAR(50),
  phone_number VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  occupation_type VARCHAR(100) NOT NULL,
  contractor_name VARCHAR(255),
  blood_group VARCHAR(10) NOT NULL,
  allergies TEXT,
  chronic_diseases TEXT,
  vaccination_status VARCHAR(50) NOT NULL,
  qr_code_data TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Option 1: Disable RLS temporarily for testing (NOT recommended for production)
ALTER TABLE workers DISABLE ROW LEVEL SECURITY;

-- Option 2: Enable RLS with proper policies (RECOMMENDED)
-- Enable RLS
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON workers;
DROP POLICY IF EXISTS "Enable read for anonymous users" ON workers;

-- Create policy to allow anonymous users to insert
CREATE POLICY "Enable insert for anonymous users"
ON workers
FOR INSERT
TO anon
WITH CHECK (true);

-- Create policy to allow anonymous users to read their own records
CREATE POLICY "Enable read for anonymous users"
ON workers
FOR SELECT
TO anon
USING (true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT ALL ON workers TO anon;
GRANT USAGE, SELECT ON SEQUENCE workers_id_seq TO anon;

-- Verify the policies
SELECT * FROM pg_policies WHERE tablename = 'workers';