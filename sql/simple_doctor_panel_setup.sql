-- Simple Doctor Panel Setup - Works with existing table structure
-- Run this script in your Supabase SQL editor

-- 1. Create medical_reports table (this is the main one we need)
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

-- 2. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_medical_reports_worker_health_id ON medical_reports (worker_health_id);
CREATE INDEX IF NOT EXISTS idx_medical_reports_doctor_clerk_id ON medical_reports (doctor_clerk_id);
CREATE INDEX IF NOT EXISTS idx_medical_reports_report_date ON medical_reports (report_date);

-- 3. Create the doctor dashboard statistics view
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

-- 4. Let's check what columns exist in your workers_data table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'workers_data' 
ORDER BY ordinal_position;

-- 5. Insert sample worker data - we'll determine the correct column name dynamically
-- First, let's see if we can insert into whatever name column exists

-- Try to insert using common column name patterns
DO $$
DECLARE
    name_column TEXT;
    insert_query TEXT;
BEGIN
    -- Check which name column exists
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'name') THEN
        name_column := 'name';
    ELSIF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'full_name') THEN
        name_column := 'full_name';
    ELSIF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'worker_name') THEN
        name_column := 'worker_name';
    ELSE
        name_column := NULL;
    END IF;

    -- Insert data based on available columns
    IF name_column IS NOT NULL THEN
        -- Build dynamic insert query
        insert_query := format('
            INSERT INTO workers_data (health_id, %I, phone, birth_date, gender, address, emergency_contact, blood_type, allergies) 
            VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8, $9),
            ($10, $11, $12, $13, $14, $15, $16, $17, $18),
            ($19, $20, $21, $22, $23, $24, $25, $26, $27),
            ($28, $29, $30, $31, $32, $33, $34, $35, $36),
            ($37, $38, $39, $40, $41, $42, $43, $44, $45)
            ON CONFLICT (health_id) DO NOTHING', name_column);
        
        EXECUTE insert_query USING 
            'WH-12345-67890', 'John Smith', '+1-555-0101', '1985-06-15', 'Male', '123 Main St, Anytown, USA', '+1-555-0102', 'O+', 'None',
            'WH-98765-43210', 'Maria Garcia', '+1-555-0103', '1992-03-22', 'Female', '456 Oak Ave, Somewhere, USA', '+1-555-0104', 'A+', 'Penicillin',
            'WH-11111-22222', 'David Johnson', '+1-555-0105', '1988-11-08', 'Male', '789 Pine Rd, Elsewhere, USA', '+1-555-0106', 'B+', 'Shellfish',
            'WH-33333-44444', 'Sarah Wilson', '+1-555-0107', '1995-09-12', 'Female', '321 Elm St, Nowhere, USA', '+1-555-0108', 'AB-', 'None',
            'WH-55555-66666', 'Michael Brown', '+1-555-0109', '1982-01-30', 'Male', '654 Maple Dr, Anywhere, USA', '+1-555-0110', 'O-', 'Latex';
        
        RAISE NOTICE 'Sample workers inserted using column: %', name_column;
    ELSE
        -- Insert without name column
        INSERT INTO workers_data (health_id, phone) VALUES 
        ('WH-12345-67890', '+1-555-0101'),
        ('WH-98765-43210', '+1-555-0103'),
        ('WH-11111-22222', '+1-555-0105'),
        ('WH-33333-44444', '+1-555-0107'),
        ('WH-55555-66666', '+1-555-0109')
        ON CONFLICT (health_id) DO NOTHING;
        
        RAISE NOTICE 'Sample workers inserted without name column';
    END IF;
END $$;

-- 6. Insert sample medical reports (you'll need to replace 'REPLACE_WITH_DOCTOR_CLERK_ID' later)
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
    'REPLACE_WITH_DOCTOR_CLERK_ID',
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
    'REPLACE_WITH_DOCTOR_CLERK_ID',
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
    'REPLACE_WITH_DOCTOR_CLERK_ID',
    'Blood Pressure Follow-up',
    'Follow-up',
    'Follow-up visit for previously elevated blood pressure readings.',
    'Hypertension, controlled',
    'Continue current medication regimen. Lifestyle modifications discussed.',
    'Blood pressure improved with medication. Patient compliant with treatment.',
    false,
    NULL,
    CURRENT_TIMESTAMP - INTERVAL '3 hours'
) ON CONFLICT (report_id) DO NOTHING;

-- 7. Create helper function
CREATE OR REPLACE FUNCTION add_sample_doctor_reports(doctor_clerk_id TEXT)
RETURNS TEXT AS $$
BEGIN
    UPDATE medical_reports 
    SET doctor_clerk_id = add_sample_doctor_reports.doctor_clerk_id 
    WHERE doctor_clerk_id = 'REPLACE_WITH_DOCTOR_CLERK_ID';
    
    RETURN 'Sample reports updated with doctor ID: ' || doctor_clerk_id;
END;
$$ LANGUAGE plpgsql;

-- 8. Show what we've created
SELECT 'Setup completed!' as status;
SELECT 'Workers Data Count: ' || COUNT(*) as status FROM workers_data
UNION ALL
SELECT 'Medical Reports Count: ' || COUNT(*) FROM medical_reports
UNION ALL
SELECT 'Doctor Stats View Exists: ' || CASE WHEN EXISTS (SELECT 1 FROM information_schema.views WHERE table_name = 'doctor_dashboard_stats') THEN 'YES' ELSE 'NO' END;