-- Minimal Doctor Panel Setup - Inspects existing table first
-- Run this script in your Supabase SQL editor

-- 1. First, let's see what your workers_data table actually looks like
SELECT 'Current workers_data table structure:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'workers_data' 
ORDER BY ordinal_position;

-- 2. Create medical_reports table (this is the main one we need)
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

-- 5. Smart worker data insertion - only use columns that exist
DO $$
DECLARE
    has_health_id BOOLEAN := FALSE;
    has_name BOOLEAN := FALSE;
    has_full_name BOOLEAN := FALSE;
    has_phone BOOLEAN := FALSE;
    has_birth_date BOOLEAN := FALSE;
    has_gender BOOLEAN := FALSE;
    has_address BOOLEAN := FALSE;
    has_emergency_contact BOOLEAN := FALSE;
    has_blood_type BOOLEAN := FALSE;
    has_allergies BOOLEAN := FALSE;
    
    column_list TEXT := '';
    value_list TEXT := '';
    insert_sql TEXT := '';
BEGIN
    -- Check which columns exist
    SELECT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'health_id') INTO has_health_id;
    SELECT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'name') INTO has_name;
    SELECT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'full_name') INTO has_full_name;
    SELECT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'phone') INTO has_phone;
    SELECT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'birth_date') INTO has_birth_date;
    SELECT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'gender') INTO has_gender;
    SELECT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'address') INTO has_address;
    SELECT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'emergency_contact') INTO has_emergency_contact;
    SELECT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'blood_type') INTO has_blood_type;
    SELECT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'allergies') INTO has_allergies;
    
    -- Build column list
    column_list := 'health_id';
    
    IF has_name THEN
        column_list := column_list || ', name';
    ELSIF has_full_name THEN
        column_list := column_list || ', full_name';
    END IF;
    
    IF has_phone THEN
        column_list := column_list || ', phone';
    END IF;
    
    IF has_birth_date THEN
        column_list := column_list || ', birth_date';
    END IF;
    
    IF has_gender THEN
        column_list := column_list || ', gender';
    END IF;
    
    IF has_address THEN
        column_list := column_list || ', address';
    END IF;
    
    IF has_emergency_contact THEN
        column_list := column_list || ', emergency_contact';
    END IF;
    
    IF has_blood_type THEN
        column_list := column_list || ', blood_type';
    END IF;
    
    IF has_allergies THEN
        column_list := column_list || ', allergies';
    END IF;
    
    -- Build value list for each row
    FOR i IN 1..5 LOOP
        CASE i
            WHEN 1 THEN
                value_list := '''WH-12345-67890''';
                IF has_name OR has_full_name THEN
                    value_list := value_list || ', ''John Smith''';
                END IF;
                IF has_phone THEN
                    value_list := value_list || ', ''+1-555-0101''';
                END IF;
                IF has_birth_date THEN
                    value_list := value_list || ', ''1985-06-15''';
                END IF;
                IF has_gender THEN
                    value_list := value_list || ', ''Male''';
                END IF;
                IF has_address THEN
                    value_list := value_list || ', ''123 Main St, Anytown, USA''';
                END IF;
                IF has_emergency_contact THEN
                    value_list := value_list || ', ''+1-555-0102''';
                END IF;
                IF has_blood_type THEN
                    value_list := value_list || ', ''O+''';
                END IF;
                IF has_allergies THEN
                    value_list := value_list || ', ''None''';
                END IF;
                
            WHEN 2 THEN
                value_list := '''WH-98765-43210''';
                IF has_name OR has_full_name THEN
                    value_list := value_list || ', ''Maria Garcia''';
                END IF;
                IF has_phone THEN
                    value_list := value_list || ', ''+1-555-0103''';
                END IF;
                IF has_birth_date THEN
                    value_list := value_list || ', ''1992-03-22''';
                END IF;
                IF has_gender THEN
                    value_list := value_list || ', ''Female''';
                END IF;
                IF has_address THEN
                    value_list := value_list || ', ''456 Oak Ave, Somewhere, USA''';
                END IF;
                IF has_emergency_contact THEN
                    value_list := value_list || ', ''+1-555-0104''';
                END IF;
                IF has_blood_type THEN
                    value_list := value_list || ', ''A+''';
                END IF;
                IF has_allergies THEN
                    value_list := value_list || ', ''Penicillin''';
                END IF;
                
            WHEN 3 THEN
                value_list := '''WH-11111-22222''';
                IF has_name OR has_full_name THEN
                    value_list := value_list || ', ''David Johnson''';
                END IF;
                IF has_phone THEN
                    value_list := value_list || ', ''+1-555-0105''';
                END IF;
                IF has_birth_date THEN
                    value_list := value_list || ', ''1988-11-08''';
                END IF;
                IF has_gender THEN
                    value_list := value_list || ', ''Male''';
                END IF;
                IF has_address THEN
                    value_list := value_list || ', ''789 Pine Rd, Elsewhere, USA''';
                END IF;
                IF has_emergency_contact THEN
                    value_list := value_list || ', ''+1-555-0106''';
                END IF;
                IF has_blood_type THEN
                    value_list := value_list || ', ''B+''';
                END IF;
                IF has_allergies THEN
                    value_list := value_list || ', ''Shellfish''';
                END IF;
                
            WHEN 4 THEN
                value_list := '''WH-33333-44444''';
                IF has_name OR has_full_name THEN
                    value_list := value_list || ', ''Sarah Wilson''';
                END IF;
                IF has_phone THEN
                    value_list := value_list || ', ''+1-555-0107''';
                END IF;
                IF has_birth_date THEN
                    value_list := value_list || ', ''1995-09-12''';
                END IF;
                IF has_gender THEN
                    value_list := value_list || ', ''Female''';
                END IF;
                IF has_address THEN
                    value_list := value_list || ', ''321 Elm St, Nowhere, USA''';
                END IF;
                IF has_emergency_contact THEN
                    value_list := value_list || ', ''+1-555-0108''';
                END IF;
                IF has_blood_type THEN
                    value_list := value_list || ', ''AB-''';
                END IF;
                IF has_allergies THEN
                    value_list := value_list || ', ''None''';
                END IF;
                
            WHEN 5 THEN
                value_list := '''WH-55555-66666''';
                IF has_name OR has_full_name THEN
                    value_list := value_list || ', ''Michael Brown''';
                END IF;
                IF has_phone THEN
                    value_list := value_list || ', ''+1-555-0109''';
                END IF;
                IF has_birth_date THEN
                    value_list := value_list || ', ''1982-01-30''';
                END IF;
                IF has_gender THEN
                    value_list := value_list || ', ''Male''';
                END IF;
                IF has_address THEN
                    value_list := value_list || ', ''654 Maple Dr, Anywhere, USA''';
                END IF;
                IF has_emergency_contact THEN
                    value_list := value_list || ', ''+1-555-0110''';
                END IF;
                IF has_blood_type THEN
                    value_list := value_list || ', ''O-''';
                END IF;
                IF has_allergies THEN
                    value_list := value_list || ', ''Latex''';
                END IF;
        END CASE;
        
        -- Execute individual insert for each worker
        insert_sql := format('INSERT INTO workers_data (%s) VALUES (%s) ON CONFLICT (health_id) DO NOTHING', 
                           column_list, value_list);
        
        BEGIN
            EXECUTE insert_sql;
        EXCEPTION 
            WHEN others THEN
                RAISE NOTICE 'Failed to insert worker %: %', i, SQLERRM;
        END;
    END LOOP;
    
    RAISE NOTICE 'Worker data insertion completed using columns: %', column_list;
END $$;

-- 6. Insert sample medical reports
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

-- 8. Show results
SELECT 'Setup completed!' as status;
SELECT 'Workers Data Count: ' || COUNT(*) as status FROM workers_data
UNION ALL
SELECT 'Medical Reports Count: ' || COUNT(*) FROM medical_reports
UNION ALL
SELECT 'Doctor Stats View Exists: ' || CASE WHEN EXISTS (SELECT 1 FROM information_schema.views WHERE table_name = 'doctor_dashboard_stats') THEN 'YES' ELSE 'NO' END;

-- Show what we have in the tables
SELECT 'Sample of workers_data table:' as info;
SELECT * FROM workers_data LIMIT 3;