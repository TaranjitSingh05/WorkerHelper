-- Medical Reports Table Setup for Doctor Panel
-- This script creates the medical_reports table for storing doctor reports

-- Create the medical_reports table
CREATE TABLE IF NOT EXISTS medical_reports (
  id SERIAL PRIMARY KEY,
  report_id VARCHAR(255) UNIQUE NOT NULL,
  worker_health_id VARCHAR(255) NOT NULL,
  doctor_clerk_id VARCHAR(255) NOT NULL,
  doctor_name VARCHAR(255) NOT NULL,
  doctor_email VARCHAR(255),
  report_title VARCHAR(255) NOT NULL,
  report_content TEXT NOT NULL,
  report_type VARCHAR(100) DEFAULT 'General Examination',
  diagnosis TEXT,
  medications_prescribed TEXT,
  recommendations TEXT,
  follow_up_date DATE,
  report_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_medical_reports_worker_health_id ON medical_reports (worker_health_id);
CREATE INDEX IF NOT EXISTS idx_medical_reports_doctor_clerk_id ON medical_reports (doctor_clerk_id);
CREATE INDEX IF NOT EXISTS idx_medical_reports_report_date ON medical_reports (report_date);
CREATE INDEX IF NOT EXISTS idx_medical_reports_created_at ON medical_reports (created_at);

-- Add a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_medical_reports_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_medical_reports_updated_at ON medical_reports;
CREATE TRIGGER update_medical_reports_updated_at
    BEFORE UPDATE ON medical_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_medical_reports_updated_at();

-- Add foreign key constraint to workers_data table
ALTER TABLE medical_reports 
ADD CONSTRAINT fk_medical_reports_worker 
FOREIGN KEY (worker_health_id) 
REFERENCES workers_data(health_id) 
ON DELETE CASCADE;

-- Create report types enum for better data consistency
CREATE TYPE report_type_enum AS ENUM (
    'General Examination',
    'Emergency Visit',
    'Follow-up',
    'Specialist Consultation',
    'Lab Results',
    'Imaging Report',
    'Vaccination Record',
    'Occupational Health',
    'Pre-employment Medical',
    'Fitness Certificate',
    'Other'
);

-- Update report_type column to use enum
ALTER TABLE medical_reports 
ALTER COLUMN report_type TYPE report_type_enum 
USING report_type::report_type_enum;

-- Disable RLS for now (enable with proper policies later)
ALTER TABLE medical_reports DISABLE ROW LEVEL SECURITY;

-- Grant permissions to anonymous users for frontend operations
GRANT ALL ON medical_reports TO anon;
GRANT USAGE, SELECT ON SEQUENCE medical_reports_id_seq TO anon;

-- Add some sample data for testing (remove in production)
-- INSERT INTO medical_reports (
--   report_id, worker_health_id, doctor_clerk_id, doctor_name, doctor_email,
--   report_title, report_content, report_type, diagnosis, medications_prescribed, recommendations
-- ) VALUES 
-- (
--   'MR-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-001',
--   'WH-SAMPLE-123456', 
--   'user_sample_doctor_123',
--   'Dr. Sample Doctor',
--   'doctor@example.com',
--   'Routine Health Check',
--   'Patient appears healthy with normal vital signs. Blood pressure: 120/80, Heart rate: 72 bpm, Temperature: 98.6°F.',
--   'General Examination',
--   'No acute medical conditions found',
--   'Multivitamin daily, increase water intake',
--   'Continue current lifestyle, annual follow-up recommended'
-- );

-- Display table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'medical_reports' 
ORDER BY ordinal_position;

-- Create a view for doctor dashboard statistics
CREATE OR REPLACE VIEW doctor_dashboard_stats AS
SELECT 
    doctor_clerk_id,
    doctor_name,
    COUNT(*) as total_reports,
    COUNT(DISTINCT worker_health_id) as unique_workers,
    COUNT(CASE WHEN report_date = CURRENT_DATE THEN 1 END) as reports_today,
    COUNT(CASE WHEN report_date >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as reports_this_week,
    MAX(created_at) as last_report_date
FROM medical_reports
GROUP BY doctor_clerk_id, doctor_name;

GRANT SELECT ON doctor_dashboard_stats TO anon;