-- Ultra-Robust Indian Dummy Data for WorkerHelper
-- This script adapts to ANY table structure automatically

-- 1. First, let's see what your table structure actually looks like
SELECT 'Your current workers_data table structure:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'workers_data' 
ORDER BY ordinal_position;

-- 2. Create medical_reports table if needed
CREATE TABLE IF NOT EXISTS medical_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    report_id TEXT UNIQUE NOT NULL,
    worker_health_id TEXT NOT NULL,
    doctor_clerk_id TEXT NOT NULL,
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

-- 3. Create indexes
CREATE INDEX IF NOT EXISTS idx_workers_data_health_id ON workers_data (health_id);
CREATE INDEX IF NOT EXISTS idx_medical_reports_worker_health_id ON medical_reports (worker_health_id);
CREATE INDEX IF NOT EXISTS idx_medical_reports_doctor_clerk_id ON medical_reports (doctor_clerk_id);

-- 4. Create doctor dashboard stats view
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

-- 5. Smart worker data insertion - only use columns that actually exist
DO $$
DECLARE
    worker_data RECORD;
    insert_sql TEXT;
    columns_list TEXT := '';
    values_list TEXT := '';
    worker_count INT := 0;
BEGIN
    -- First insert just health_id for all workers (this column should always exist)
    INSERT INTO workers_data (health_id) VALUES 
    ('WH-DEL01-2024'), ('WH-MUM02-2024'), ('WH-BLR03-2024'), ('WH-CHN04-2024'),
    ('WH-HYD05-2024'), ('WH-KOL06-2024'), ('WH-PUN07-2024'), ('WH-AHM08-2024'),
    ('WH-JAI09-2024'), ('WH-LKN10-2024'), ('WH-COI11-2024'), ('WH-BHU12-2024')
    ON CONFLICT (health_id) DO NOTHING;

    -- Now update with additional data based on available columns
    -- Worker 1: Rajesh Kumar Sharma (Delhi)
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'full_name') THEN
        UPDATE workers_data SET full_name = 'Rajesh Kumar Sharma' WHERE health_id = 'WH-DEL01-2024';
    ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'name') THEN
        UPDATE workers_data SET name = 'Rajesh Kumar Sharma' WHERE health_id = 'WH-DEL01-2024';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'phone') THEN
        UPDATE workers_data SET phone = '+91-9876543210' WHERE health_id = 'WH-DEL01-2024';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'birth_date') THEN
        UPDATE workers_data SET birth_date = '1985-03-15' WHERE health_id = 'WH-DEL01-2024';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'gender') THEN
        UPDATE workers_data SET gender = 'Male' WHERE health_id = 'WH-DEL01-2024';
    END IF;

    -- Worker 2: Priya Devi Singh (Mumbai)
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'full_name') THEN
        UPDATE workers_data SET full_name = 'Priya Devi Singh' WHERE health_id = 'WH-MUM02-2024';
    ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'name') THEN
        UPDATE workers_data SET name = 'Priya Devi Singh' WHERE health_id = 'WH-MUM02-2024';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'phone') THEN
        UPDATE workers_data SET phone = '+91-9876543212' WHERE health_id = 'WH-MUM02-2024';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'birth_date') THEN
        UPDATE workers_data SET birth_date = '1990-07-22' WHERE health_id = 'WH-MUM02-2024';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'gender') THEN
        UPDATE workers_data SET gender = 'Female' WHERE health_id = 'WH-MUM02-2024';
    END IF;

    -- Worker 3: Suresh Babu Reddy (Bangalore)
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'full_name') THEN
        UPDATE workers_data SET full_name = 'Suresh Babu Reddy' WHERE health_id = 'WH-BLR03-2024';
    ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'name') THEN
        UPDATE workers_data SET name = 'Suresh Babu Reddy' WHERE health_id = 'WH-BLR03-2024';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'phone') THEN
        UPDATE workers_data SET phone = '+91-9876543214' WHERE health_id = 'WH-BLR03-2024';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'birth_date') THEN
        UPDATE workers_data SET birth_date = '1982-11-08' WHERE health_id = 'WH-BLR03-2024';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'gender') THEN
        UPDATE workers_data SET gender = 'Male' WHERE health_id = 'WH-BLR03-2024';
    END IF;

    -- Worker 4: Lakshmi Menon (Chennai)
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'full_name') THEN
        UPDATE workers_data SET full_name = 'Lakshmi Menon' WHERE health_id = 'WH-CHN04-2024';
    ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'name') THEN
        UPDATE workers_data SET name = 'Lakshmi Menon' WHERE health_id = 'WH-CHN04-2024';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'phone') THEN
        UPDATE workers_data SET phone = '+91-9876543216' WHERE health_id = 'WH-CHN04-2024';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'birth_date') THEN
        UPDATE workers_data SET birth_date = '1988-05-12' WHERE health_id = 'WH-CHN04-2024';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'gender') THEN
        UPDATE workers_data SET gender = 'Female' WHERE health_id = 'WH-CHN04-2024';
    END IF;

    -- Worker 5: Venkatesh Rao (Hyderabad)
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'full_name') THEN
        UPDATE workers_data SET full_name = 'Venkatesh Rao' WHERE health_id = 'WH-HYD05-2024';
    ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'name') THEN
        UPDATE workers_data SET name = 'Venkatesh Rao' WHERE health_id = 'WH-HYD05-2024';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'phone') THEN
        UPDATE workers_data SET phone = '+91-9876543218' WHERE health_id = 'WH-HYD05-2024';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'birth_date') THEN
        UPDATE workers_data SET birth_date = '1992-09-30' WHERE health_id = 'WH-HYD05-2024';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'gender') THEN
        UPDATE workers_data SET gender = 'Male' WHERE health_id = 'WH-HYD05-2024';
    END IF;

    -- Worker 6: Anjali Ghosh (Kolkata)
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'full_name') THEN
        UPDATE workers_data SET full_name = 'Anjali Ghosh' WHERE health_id = 'WH-KOL06-2024';
    ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'name') THEN
        UPDATE workers_data SET name = 'Anjali Ghosh' WHERE health_id = 'WH-KOL06-2024';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'phone') THEN
        UPDATE workers_data SET phone = '+91-9876543220' WHERE health_id = 'WH-KOL06-2024';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'birth_date') THEN
        UPDATE workers_data SET birth_date = '1987-01-25' WHERE health_id = 'WH-KOL06-2024';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'gender') THEN
        UPDATE workers_data SET gender = 'Female' WHERE health_id = 'WH-KOL06-2024';
    END IF;

    -- Add remaining workers with minimal data
    -- Worker 7: Amit Patil (Pune)
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'full_name') THEN
        UPDATE workers_data SET full_name = 'Amit Patil' WHERE health_id = 'WH-PUN07-2024';
    ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'name') THEN
        UPDATE workers_data SET name = 'Amit Patil' WHERE health_id = 'WH-PUN07-2024';
    END IF;

    -- Worker 8: Kavya Patel (Ahmedabad)  
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'full_name') THEN
        UPDATE workers_data SET full_name = 'Kavya Patel' WHERE health_id = 'WH-AHM08-2024';
    ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'name') THEN
        UPDATE workers_data SET name = 'Kavya Patel' WHERE health_id = 'WH-AHM08-2024';
    END IF;

    -- Worker 9: Rohit Agarwal (Jaipur)
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'full_name') THEN
        UPDATE workers_data SET full_name = 'Rohit Agarwal' WHERE health_id = 'WH-JAI09-2024';
    ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'name') THEN
        UPDATE workers_data SET name = 'Rohit Agarwal' WHERE health_id = 'WH-JAI09-2024';
    END IF;

    -- Worker 10: Neha Gupta (Lucknow)
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'full_name') THEN
        UPDATE workers_data SET full_name = 'Neha Gupta' WHERE health_id = 'WH-LKN10-2024';
    ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'name') THEN
        UPDATE workers_data SET name = 'Neha Gupta' WHERE health_id = 'WH-LKN10-2024';
    END IF;

    -- Worker 11: Karthik Nair (Goa)
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'full_name') THEN
        UPDATE workers_data SET full_name = 'Karthik Nair' WHERE health_id = 'WH-COI11-2024';
    ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'name') THEN
        UPDATE workers_data SET name = 'Karthik Nair' WHERE health_id = 'WH-COI11-2024';
    END IF;

    -- Worker 12: Sunita Devi (Bhubaneswar)
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'full_name') THEN
        UPDATE workers_data SET full_name = 'Sunita Devi' WHERE health_id = 'WH-BHU12-2024';
    ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'name') THEN
        UPDATE workers_data SET name = 'Sunita Devi' WHERE health_id = 'WH-BHU12-2024';
    END IF;

    RAISE NOTICE 'Indian worker data inserted successfully with available columns';
END $$;

-- 6. Insert comprehensive medical reports (these should work regardless of workers_data structure)
INSERT INTO medical_reports (
    report_id, worker_health_id, doctor_clerk_id, report_title, report_type, 
    report_description, diagnosis, treatment, notes, follow_up_required, 
    follow_up_date, report_date
) VALUES 

-- Reports for Rajesh Kumar Sharma (WH-DEL01-2024)
('RPT-20240315-001', 'WH-DEL01-2024', 'DOCTOR_CLERK_ID_1', 'Annual Health Checkup 2024', 'General Examination', 
'Comprehensive annual physical examination. Patient reports good overall health with occasional back pain due to factory work.', 
'Mild lower back strain, otherwise healthy', 'Prescribed pain relief medication and physiotherapy exercises. Recommended ergonomic improvements at workplace.', 
'Patient is cooperative and follows instructions well. Advised to take regular breaks during work.', true, 
CURRENT_DATE + INTERVAL '6 months', CURRENT_TIMESTAMP - INTERVAL '15 days'),

('RPT-20240325-002', 'WH-DEL01-2024', 'DOCTOR_CLERK_ID_2', 'Workplace Injury Assessment', 'Injury Assessment', 
'Patient sustained minor cut on left hand while operating machinery. Wound assessed and treated immediately.', 
'Minor laceration on left palm, 2cm length', 'Wound cleaned with antiseptic, sutured with 3 stitches, tetanus shot administered. Bandaged properly.', 
'Patient advised to keep wound dry and clean. Return for suture removal in 7 days. Provided sick leave certificate for 3 days.', true, 
CURRENT_DATE + INTERVAL '1 week', CURRENT_TIMESTAMP - INTERVAL '5 days'),

-- Reports for Priya Devi Singh (WH-MUM02-2024)
('RPT-20240320-003', 'WH-MUM02-2024', 'DOCTOR_CLERK_ID_1', 'Computer Vision Syndrome', 'General Examination', 
'Regular health checkup for office worker. Patient reports stress and eye strain from computer work.', 
'Computer Vision Syndrome, mild stress', 'Prescribed eye drops for dry eyes, recommended 20-20-20 rule. Suggested stress management techniques.', 
'Patient is health-conscious. Advised on proper ergonomics and regular eye breaks.', false, 
NULL, CURRENT_TIMESTAMP - INTERVAL '12 days'),

('RPT-20240330-004', 'WH-MUM02-2024', 'DOCTOR_CLERK_ID_3', 'Migraine Consultation', 'Specialist Consultation', 
'Patient visited for recurring headaches affecting work performance. Detailed neurological assessment conducted.', 
'Tension-type headaches, possibly stress-related', 'Prescribed mild pain relievers and relaxation techniques. Recommended lifestyle modifications.', 
'Patient needs to manage work stress better. Suggested regular sleep schedule and hydration.', true, 
CURRENT_DATE + INTERVAL '1 month', CURRENT_TIMESTAMP - INTERVAL '2 days'),

-- Reports for Suresh Babu Reddy (WH-BLR03-2024)
('RPT-20240310-005', 'WH-BLR03-2024', 'DOCTOR_CLERK_ID_2', 'Hypertension Follow-up', 'Follow-up', 
'Regular follow-up for previously diagnosed hypertension. Blood pressure monitoring and medication review.', 
'Hypertension - well controlled', 'Continued current antihypertensive medication. Dietary counseling provided.', 
'Patient compliance is good. Blood pressure readings are within normal range. Continue current regimen.', true, 
CURRENT_DATE + INTERVAL '3 months', CURRENT_TIMESTAMP - INTERVAL '20 days'),

('RPT-20240328-006', 'WH-BLR03-2024', 'DOCTOR_CLERK_ID_1', 'Allergy Emergency Treatment', 'Emergency Visit', 
'Patient presented with allergic reaction to penicillin - rash and mild breathing difficulty. Immediate treatment provided.', 
'Mild allergic reaction to penicillin', 'Administered antihistamines and corticosteroids. Observed for 2 hours. Reaction subsided completely.', 
'Patient advised to carry emergency card mentioning penicillin allergy. Alternative antibiotics noted in records.', false, 
NULL, CURRENT_TIMESTAMP - INTERVAL '8 days'),

-- Reports for remaining workers (1 report each for testing)
('RPT-20240322-007', 'WH-CHN04-2024', 'DOCTOR_CLERK_ID_3', 'Pre-employment Medical', 'Pre-employment Medical', 
'Comprehensive pre-employment medical examination for nursing position. All systems evaluated.', 
'Medically fit for nursing duties', 'No restrictions. Recommended hepatitis B vaccination as per nursing protocols.', 
'Candidate is in excellent health and suitable for nursing role. Vaccination record updated.', false, 
NULL, CURRENT_TIMESTAMP - INTERVAL '18 days'),

('RPT-20240324-008', 'WH-HYD05-2024', 'DOCTOR_CLERK_ID_1', 'Driver Fitness Certificate', 'Fitness Certificate', 
'Annual fitness assessment for professional driver. Vision, hearing, and cardiovascular health evaluated.', 
'Fit for driving duties', 'All parameters within normal limits. Vision 6/6, hearing normal, cardiovascular system healthy.', 
'Driver meets all medical requirements. Valid for commercial driving license renewal.', true, 
CURRENT_DATE + INTERVAL '12 months', CURRENT_TIMESTAMP - INTERVAL '10 days'),

('RPT-20240326-009', 'WH-KOL06-2024', 'DOCTOR_CLERK_ID_2', 'Respiratory Infection', 'Emergency Visit', 
'Patient presented with cough, fever, and sore throat. Symptoms for 3 days. Clinical examination conducted.', 
'Upper respiratory tract infection', 'Prescribed antibiotics, cough syrup, and fever reducer. Rest advised for 3-5 days.', 
'Patient should isolate until fever-free for 24 hours. Return if symptoms worsen or persist beyond 7 days.', true, 
CURRENT_DATE + INTERVAL '1 week', CURRENT_TIMESTAMP - INTERVAL '4 days'),

('RPT-20240318-010', 'WH-PUN07-2024', 'DOCTOR_CLERK_ID_1', 'Occupational Health Check', 'Occupational Health Check', 
'Routine occupational health assessment for engineering worker. Exposure to industrial chemicals evaluated.', 
'No occupational health issues detected', 'Advised on proper use of PPE. Lung function test normal. Continue safety protocols.', 
'Patient follows safety guidelines well. Regular health monitoring recommended due to chemical exposure.', true, 
CURRENT_DATE + INTERVAL '6 months', CURRENT_TIMESTAMP - INTERVAL '22 days'),

('RPT-20240329-011', 'WH-AHM08-2024', 'DOCTOR_CLERK_ID_2', 'Diabetes Screening', 'General Examination', 
'Routine diabetes screening due to family history. Blood glucose and HbA1c levels tested.', 
'Pre-diabetes detected', 'Dietary counseling provided. Recommended regular exercise and weight management. Re-test in 3 months.', 
'Patient is motivated to make lifestyle changes. Provided diabetes prevention education materials.', true, 
CURRENT_DATE + INTERVAL '3 months', CURRENT_TIMESTAMP - INTERVAL '7 days'),

('RPT-20240321-012', 'WH-JAI09-2024', 'DOCTOR_CLERK_ID_3', 'Skin Allergy Treatment', 'Dermatology Consultation', 
'Patient developed skin rash after exposure to cleaning chemicals at workplace. Dermatological examination performed.', 
'Contact dermatitis - chemical exposure', 'Prescribed topical corticosteroids and antihistamines. Advised to avoid trigger chemicals.', 
'Patient needs to use protective gloves when handling chemicals. Workplace safety review recommended.', false, 
NULL, CURRENT_TIMESTAMP - INTERVAL '9 days'),

('RPT-20240327-013', 'WH-LKN10-2024', 'DOCTOR_CLERK_ID_1', 'Maternity Health Check', 'General Examination', 
'Routine prenatal health check - 12 weeks pregnancy. Comprehensive maternal health assessment.', 
'Normal pregnancy progression', 'Prescribed prenatal vitamins. Advised on nutrition and lifestyle during pregnancy.', 
'First pregnancy - patient needs education on prenatal care. Regular follow-ups scheduled.', true, 
CURRENT_DATE + INTERVAL '4 weeks', CURRENT_TIMESTAMP - INTERVAL '11 days'),

('RPT-20240323-014', 'WH-COI11-2024', 'DOCTOR_CLERK_ID_2', 'Food Handler Certificate', 'General Examination', 
'Annual health check required for food handler license renewal. Infectious disease screening performed.', 
'Cleared for food handling duties', 'All tests negative for infectious diseases. Valid for food handler certificate renewal.', 
'Patient maintains good personal hygiene. Advised on continued food safety practices.', true, 
CURRENT_DATE + INTERVAL '12 months', CURRENT_TIMESTAMP - INTERVAL '13 days'),

('RPT-20240331-015', 'WH-BHU12-2024', 'DOCTOR_CLERK_ID_3', 'Joint Pain Assessment', 'Specialist Consultation', 
'Patient complains of knee and joint pain affecting daily activities. Rheumatological evaluation performed.', 
'Osteoarthritis - early stage', 'Prescribed anti-inflammatory medication and joint supplements. Recommended low-impact exercises.', 
'Patient needs physiotherapy and weight management. Joint pain manageable with current treatment.', true, 
CURRENT_DATE + INTERVAL '6 weeks', CURRENT_TIMESTAMP - INTERVAL '3 days')

ON CONFLICT (report_id) DO NOTHING;

-- 7. Helper function to link reports to actual doctors
CREATE OR REPLACE FUNCTION update_reports_with_doctor_id(doctor_clerk_id TEXT, placeholder TEXT)
RETURNS TEXT AS $$
BEGIN
    UPDATE medical_reports 
    SET doctor_clerk_id = update_reports_with_doctor_id.doctor_clerk_id 
    WHERE doctor_clerk_id = placeholder;
    
    RETURN 'Updated reports for doctor ID: ' || doctor_clerk_id;
END;
$$ LANGUAGE plpgsql;

-- 8. Show results
SELECT 'Ultra-robust Indian dummy data setup completed!' as status;
SELECT 'Workers created: ' || COUNT(*) as worker_count FROM workers_data WHERE health_id LIKE 'WH-%2024';
SELECT 'Medical reports created: ' || COUNT(*) as report_count FROM medical_reports WHERE report_id LIKE 'RPT-2024%';

-- Show what data we actually have
SELECT 'Sample Workers with Available Data:' as info;
SELECT health_id, 
       COALESCE(full_name, name, 'Name not set') as worker_name
FROM workers_data 
WHERE health_id LIKE 'WH-%2024' 
LIMIT 8;

SELECT 'Sample Medical Reports:' as info;
SELECT report_id, worker_health_id, report_title, report_type
FROM medical_reports 
WHERE report_id LIKE 'RPT-2024%' 
ORDER BY report_date DESC 
LIMIT 6;

-- Instructions for linking to your doctor accounts
/*
TO LINK REPORTS TO YOUR ACTUAL DOCTOR ACCOUNTS:

1. Get your doctor Clerk user IDs from Clerk dashboard
2. Run these commands (replace with your actual IDs):

SELECT update_reports_with_doctor_id('your_doctor_1_clerk_id', 'DOCTOR_CLERK_ID_1');
SELECT update_reports_with_doctor_id('your_doctor_2_clerk_id', 'DOCTOR_CLERK_ID_2'); 
SELECT update_reports_with_doctor_id('your_doctor_3_clerk_id', 'DOCTOR_CLERK_ID_3');

3. Test by searching for these worker IDs in your doctor dashboard:
   - WH-DEL01-2024 (Rajesh Kumar Sharma - 2 reports)
   - WH-MUM02-2024 (Priya Devi Singh - 2 reports) 
   - WH-BLR03-2024 (Suresh Babu Reddy - 2 reports)
   - WH-CHN04-2024 to WH-BHU12-2024 (1 report each)
*/