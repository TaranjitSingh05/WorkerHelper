-- Complete Doctor Panel Database Setup
-- Run this script in your Supabase SQL editor

-- 1. First, let's check the existing workers_data table structure
-- If the table exists, we'll add missing columns instead of creating new

-- Check what columns exist in workers_data table
DO $$
BEGIN
    -- Check if workers_data table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'workers_data') THEN
        
        -- Add missing columns if they don't exist
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'full_name') THEN
            ALTER TABLE workers_data ADD COLUMN full_name TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'name') THEN
            ALTER TABLE workers_data ADD COLUMN name TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'birth_date') THEN
            ALTER TABLE workers_data ADD COLUMN birth_date DATE;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'gender') THEN
            ALTER TABLE workers_data ADD COLUMN gender TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'address') THEN
            ALTER TABLE workers_data ADD COLUMN address TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'emergency_contact') THEN
            ALTER TABLE workers_data ADD COLUMN emergency_contact TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'blood_type') THEN
            ALTER TABLE workers_data ADD COLUMN blood_type TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'allergies') THEN
            ALTER TABLE workers_data ADD COLUMN allergies TEXT;
        END IF;
        
    ELSE
        -- Create the table if it doesn't exist
        CREATE TABLE workers_data (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            health_id TEXT UNIQUE NOT NULL,
            full_name TEXT,
            name TEXT,
            phone TEXT NOT NULL,
            birth_date DATE,
            gender TEXT,
            address TEXT,
            emergency_contact TEXT,
            blood_type TEXT,
            allergies TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    END IF;
END $$;

-- 2. Create medical_reports table if it doesn't exist
CREATE TABLE IF NOT EXISTS medical_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    report_id TEXT UNIQUE NOT NULL,
    worker_health_id TEXT NOT NULL,
    doctor_clerk_id TEXT NOT NULL, -- Clerk user ID of the doctor
    report_title TEXT NOT NULL,
    report_type TEXT NOT NULL,
    report_description TEXT NOT NULL,
    diagnosis TEXT,
    treatment TEXT,
    notes TEXT,
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_date TIMESTAMP WITH TIME ZONE,
    report_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_workers_data_health_id ON workers_data (health_id);
CREATE INDEX IF NOT EXISTS idx_medical_reports_worker_health_id ON medical_reports (worker_health_id);
CREATE INDEX IF NOT EXISTS idx_medical_reports_doctor_clerk_id ON medical_reports (doctor_clerk_id);
CREATE INDEX IF NOT EXISTS idx_medical_reports_report_date ON medical_reports (report_date);

-- 4. Create the doctor dashboard statistics view
CREATE OR REPLACE VIEW doctor_dashboard_stats AS
SELECT 
    doctor_clerk_id,
    COUNT(*) as total_reports,
    COUNT(DISTINCT worker_health_id) as unique_workers,
    COUNT(CASE WHEN DATE(report_date) = CURRENT_DATE THEN 1 END) as reports_today,
    COUNT(CASE WHEN report_date >= DATE_TRUNC('week', CURRENT_DATE) THEN 1 END) as reports_this_week,
    MAX(report_date) as last_report_date,
    MIN(report_date) as first_report_date,
    COUNT(CASE WHEN follow_up_required = true THEN 1 END) as pending_followups
FROM medical_reports
GROUP BY doctor_clerk_id;

-- 5. Insert sample worker data for testing
-- Handle both 'name' and 'full_name' columns depending on table structure
DO $$
BEGIN
    -- Check if 'name' column exists, if not use 'full_name'
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'name') THEN
        -- Insert using 'name' column
        INSERT INTO workers_data (health_id, name, phone, birth_date, gender, address, emergency_contact, blood_type, allergies) VALUES 
        ('WH-12345-67890', 'John Smith', '+1-555-0101', '1985-06-15', 'Male', '123 Main St, Anytown, USA', '+1-555-0102', 'O+', 'None'),
        ('WH-98765-43210', 'Maria Garcia', '+1-555-0103', '1992-03-22', 'Female', '456 Oak Ave, Somewhere, USA', '+1-555-0104', 'A+', 'Penicillin'),
        ('WH-11111-22222', 'David Johnson', '+1-555-0105', '1988-11-08', 'Male', '789 Pine Rd, Elsewhere, USA', '+1-555-0106', 'B+', 'Shellfish'),
        ('WH-33333-44444', 'Sarah Wilson', '+1-555-0107', '1995-09-12', 'Female', '321 Elm St, Nowhere, USA', '+1-555-0108', 'AB-', 'None'),
        ('WH-55555-66666', 'Michael Brown', '+1-555-0109', '1982-01-30', 'Male', '654 Maple Dr, Anywhere, USA', '+1-555-0110', 'O-', 'Latex')
        ON CONFLICT (health_id) DO NOTHING;
    ELSIF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'full_name') THEN
        -- Insert using 'full_name' column
        INSERT INTO workers_data (health_id, full_name, phone, birth_date, gender, address, emergency_contact, blood_type, allergies) VALUES 
        ('WH-12345-67890', 'John Smith', '+1-555-0101', '1985-06-15', 'Male', '123 Main St, Anytown, USA', '+1-555-0102', 'O+', 'None'),
        ('WH-98765-43210', 'Maria Garcia', '+1-555-0103', '1992-03-22', 'Female', '456 Oak Ave, Somewhere, USA', '+1-555-0104', 'A+', 'Penicillin'),
        ('WH-11111-22222', 'David Johnson', '+1-555-0105', '1988-11-08', 'Male', '789 Pine Rd, Elsewhere, USA', '+1-555-0106', 'B+', 'Shellfish'),
        ('WH-33333-44444', 'Sarah Wilson', '+1-555-0107', '1995-09-12', 'Female', '321 Elm St, Nowhere, USA', '+1-555-0108', 'AB-', 'None'),
        ('WH-55555-66666', 'Michael Brown', '+1-555-0109', '1982-01-30', 'Male', '654 Maple Dr, Anywhere, USA', '+1-555-0110', 'O-', 'Latex')
        ON CONFLICT (health_id) DO NOTHING;
    ELSE
        -- Fallback: Insert without name column
        INSERT INTO workers_data (health_id, phone, birth_date, gender, address, emergency_contact, blood_type, allergies) VALUES 
        ('WH-12345-67890', '+1-555-0101', '1985-06-15', 'Male', '123 Main St, Anytown, USA', '+1-555-0102', 'O+', 'None'),
        ('WH-98765-43210', '+1-555-0103', '1992-03-22', 'Female', '456 Oak Ave, Somewhere, USA', '+1-555-0104', 'A+', 'Penicillin'),
        ('WH-11111-22222', '+1-555-0105', '1988-11-08', 'Male', '789 Pine Rd, Elsewhere, USA', '+1-555-0106', 'B+', 'Shellfish'),
        ('WH-33333-44444', '+1-555-0107', '1995-09-12', 'Female', '321 Elm St, Nowhere, USA', '+1-555-0108', 'AB-', 'None'),
        ('WH-55555-66666', '+1-555-0109', '1982-01-30', 'Male', '654 Maple Dr, Anywhere, USA', '+1-555-0110', 'O-', 'Latex')
        ON CONFLICT (health_id) DO NOTHING;
    END IF;
END $$;

-- 6. Insert sample medical reports (replace 'YOUR_DOCTOR_CLERK_ID' with actual doctor Clerk ID)
-- Note: You'll need to replace this with the actual Clerk user ID of a doctor user
-- You can find this in Clerk dashboard under the user's profile

INSERT INTO medical_reports (
    report_id, 
    worker_health_id, 
    doctor_clerk_id, 
    report_title, 
    report_type, 
    report_description, 
    diagnosis, 
    treatment, 
    notes,
    follow_up_required,
    follow_up_date,
    report_date
) VALUES 
(
    'RPT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-001',
    'WH-12345-67890',
    'REPLACE_WITH_DOCTOR_CLERK_ID', -- Replace this with actual doctor Clerk ID
    'Annual Health Checkup',
    'General Examination',
    'Routine annual physical examination. Patient reports feeling well with no specific complaints.',
    'Generally healthy with no acute concerns',
    'Continue current lifestyle. Regular exercise recommended.',
    'Patient maintains good overall health. Blood pressure slightly elevated.',
    true,
    CURRENT_DATE + INTERVAL '6 months',
    CURRENT_TIMESTAMP - INTERVAL '2 days'
),
(
    'RPT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-002',
    'WH-98765-43210',
    'REPLACE_WITH_DOCTOR_CLERK_ID', -- Replace this with actual doctor Clerk ID
    'Workplace Injury Assessment',
    'Injury Assessment',
    'Patient sustained minor cut on left hand while operating machinery. Wound cleaned and assessed.',
    'Minor laceration, left hand',
    'Wound cleaned, antibiotic ointment applied, bandaged. Tetanus shot administered.',
    'Patient advised to keep wound clean and dry. Return if signs of infection.',
    true,
    CURRENT_DATE + INTERVAL '1 week',
    CURRENT_TIMESTAMP - INTERVAL '1 day'
),
(
    'RPT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-003',
    'WH-11111-22222',
    'REPLACE_WITH_DOCTOR_CLERK_ID', -- Replace this with actual doctor Clerk ID
    'Blood Pressure Follow-up',
    'Follow-up',
    'Follow-up visit for previously elevated blood pressure readings.',
    'Hypertension, controlled',
    'Continue current medication regimen. Lifestyle modifications discussed.',
    'Blood pressure improved with medication. Patient compliant with treatment.',
    false,
    NULL,
    CURRENT_TIMESTAMP - INTERVAL '3 hours'
);

-- 7. Create a function to easily add test doctor (optional)
CREATE OR REPLACE FUNCTION add_sample_doctor_reports(doctor_clerk_id TEXT)
RETURNS TEXT AS $$
BEGIN
    -- Update existing sample reports with the provided doctor ID
    UPDATE medical_reports 
    SET doctor_clerk_id = add_sample_doctor_reports.doctor_clerk_id 
    WHERE doctor_clerk_id = 'REPLACE_WITH_DOCTOR_CLERK_ID';
    
    RETURN 'Sample reports updated with doctor ID: ' || doctor_clerk_id;
END;
$$ LANGUAGE plpgsql;

-- 8. Grant necessary permissions (adjust as needed for your setup)
-- ALTER TABLE workers_data ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE medical_reports ENABLE ROW LEVEL SECURITY;

-- Example usage after setup:
-- SELECT add_sample_doctor_reports('your_actual_clerk_user_id_here');

-- Verify the setup:
SELECT 'Workers Data Count: ' || COUNT(*) as status FROM workers_data
UNION ALL
SELECT 'Medical Reports Count: ' || COUNT(*) FROM medical_reports
UNION ALL
SELECT 'Doctor Stats View Exists: ' || CASE WHEN EXISTS (SELECT 1 FROM information_schema.views WHERE table_name = 'doctor_dashboard_stats') THEN 'YES' ELSE 'NO' END;

-- Test queries to verify everything works:
-- SELECT * FROM workers_data LIMIT 5;
-- SELECT * FROM medical_reports LIMIT 5;
-- SELECT * FROM doctor_dashboard_stats;