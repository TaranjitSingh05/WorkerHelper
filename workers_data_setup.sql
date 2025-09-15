-- Create the workers_data table for WorkerHelper application
-- This script should be run in Supabase SQL Editor

-- Drop existing table if it exists (uncomment if needed)
-- DROP TABLE IF EXISTS workers_data;

-- Create the workers_data table with all required fields
CREATE TABLE IF NOT EXISTS workers_data (
  id SERIAL PRIMARY KEY,
  health_id VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  date_of_birth DATE NOT NULL,
  age INTEGER,
  gender VARCHAR(50) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  occupation_type VARCHAR(100) NOT NULL,
  contractor_name VARCHAR(255),
  blood_group VARCHAR(10) NOT NULL,
  allergies TEXT,
  chronic_diseases TEXT NOT NULL,
  vaccination_status VARCHAR(50) NOT NULL,
  qr_code_data TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_workers_data_health_id ON workers_data (health_id);
CREATE INDEX IF NOT EXISTS idx_workers_data_phone ON workers_data (phone_number);
CREATE INDEX IF NOT EXISTS idx_workers_data_created_at ON workers_data (created_at);

-- Add a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_workers_data_updated_at ON workers_data;
CREATE TRIGGER update_workers_data_updated_at
    BEFORE UPDATE ON workers_data
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Disable RLS for testing (enable it later with proper policies)
ALTER TABLE workers_data DISABLE ROW LEVEL SECURITY;

-- Grant permissions to anonymous users for frontend operations
GRANT ALL ON workers_data TO anon;
GRANT USAGE, SELECT ON SEQUENCE workers_data_id_seq TO anon;

-- Optional: Enable RLS with basic policies (uncomment when ready for production)
-- ALTER TABLE workers_data ENABLE ROW LEVEL SECURITY;

-- Create policy for anonymous inserts
-- CREATE POLICY "Enable insert for anonymous users"
-- ON workers_data
-- FOR INSERT
-- TO anon
-- WITH CHECK (true);

-- Create policy for reading records
-- CREATE POLICY "Enable read for anonymous users"
-- ON workers_data
-- FOR SELECT
-- TO anon
-- USING (true);

-- Display table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'workers_data' 
ORDER BY ordinal_position;