-- Indian Dummy Data for WorkerHelper Doctor Panel
-- Run this script in your Supabase SQL editor after setting up basic tables

-- 1. First, ensure tables exist with flexible schema
CREATE TABLE IF NOT EXISTS workers_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    health_id TEXT UNIQUE NOT NULL,
    full_name TEXT,
    name TEXT,
    phone TEXT,
    birth_date DATE,
    gender TEXT,
    address TEXT,
    emergency_contact TEXT,
    blood_type TEXT,
    allergies TEXT,
    occupation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

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

-- 2. Create indexes
CREATE INDEX IF NOT EXISTS idx_workers_data_health_id ON workers_data (health_id);
CREATE INDEX IF NOT EXISTS idx_medical_reports_worker_health_id ON medical_reports (worker_health_id);
CREATE INDEX IF NOT EXISTS idx_medical_reports_doctor_clerk_id ON medical_reports (doctor_clerk_id);

-- 3. Create doctor dashboard stats view
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

-- 4. Insert comprehensive Indian worker data
DO $$
BEGIN
    -- Insert workers using dynamic column detection
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'full_name') THEN
        -- Use full_name column
        INSERT INTO workers_data (health_id, full_name, phone, birth_date, gender, address, emergency_contact, blood_type, allergies, occupation) VALUES 
        ('WH-DEL01-2024', 'Rajesh Kumar Sharma', '+91-9876543210', '1985-03-15', 'Male', 'B-45, Lajpat Nagar, New Delhi-110024', '+91-9876543211', 'B+', 'Dust allergy', 'Factory Worker'),
        ('WH-MUM02-2024', 'Priya Devi Singh', '+91-9876543212', '1990-07-22', 'Female', '12/A, Andheri East, Mumbai-400069', '+91-9876543213', 'O+', 'None', 'Office Assistant'),
        ('WH-BLR03-2024', 'Suresh Babu Reddy', '+91-9876543214', '1982-11-08', 'Male', '23, Koramangala, Bangalore-560034', '+91-9876543215', 'A+', 'Penicillin', 'Security Guard'),
        ('WH-CHN04-2024', 'Lakshmi Menon', '+91-9876543216', '1988-05-12', 'Female', '15, T.Nagar, Chennai-600017', '+91-9876543217', 'AB+', 'Shellfish', 'Nurse'),
        ('WH-HYD05-2024', 'Venkatesh Rao', '+91-9876543218', '1992-09-30', 'Male', '101, Banjara Hills, Hyderabad-500034', '+91-9876543219', 'O-', 'Latex', 'Driver'),
        ('WH-KOL06-2024', 'Anjali Ghosh', '+91-9876543220', '1987-01-25', 'Female', '22, Park Street, Kolkata-700016', '+91-9876543221', 'B-', 'None', 'Teacher'),
        ('WH-PUN07-2024', 'Amit Patil', '+91-9876543222', '1984-12-18', 'Male', '45, Shivajinagar, Pune-411005', '+91-9876543223', 'A-', 'Dust mites', 'Engineer'),
        ('WH-AHM08-2024', 'Kavya Patel', '+91-9876543224', '1991-04-07', 'Female', '78, Navrangpura, Ahmedabad-380009', '+91-9876543225', 'B+', 'Peanuts', 'Accountant'),
        ('WH-JAI09-2024', 'Rohit Agarwal', '+91-9876543226', '1986-08-14', 'Male', '12, Pink City, Jaipur-302001', '+91-9876543227', 'O+', 'None', 'Salesperson'),
        ('WH-LKN10-2024', 'Neha Gupta', '+91-9876543228', '1989-10-02', 'Female', '67, Gomti Nagar, Lucknow-226010', '+91-9876543229', 'AB-', 'Milk products', 'Receptionist'),
        ('WH-COI11-2024', 'Karthik Nair', '+91-9876543230', '1983-06-28', 'Male', '34, Panaji, Goa-403001', '+91-9876543231', 'A+', 'None', 'Chef'),
        ('WH-BHU12-2024', 'Sunita Devi', '+91-9876543232', '1990-02-16', 'Female', '56, Fraser Road, Bhubaneswar-751001', '+91-9876543233', 'B+', 'Iodine', 'Cleaner')
        ON CONFLICT (health_id) DO NOTHING;
    ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'name') THEN
        -- Use name column
        INSERT INTO workers_data (health_id, name, phone, birth_date, gender, address, emergency_contact, blood_type, allergies, occupation) VALUES 
        ('WH-DEL01-2024', 'Rajesh Kumar Sharma', '+91-9876543210', '1985-03-15', 'Male', 'B-45, Lajpat Nagar, New Delhi-110024', '+91-9876543211', 'B+', 'Dust allergy', 'Factory Worker'),
        ('WH-MUM02-2024', 'Priya Devi Singh', '+91-9876543212', '1990-07-22', 'Female', '12/A, Andheri East, Mumbai-400069', '+91-9876543213', 'O+', 'None', 'Office Assistant'),
        ('WH-BLR03-2024', 'Suresh Babu Reddy', '+91-9876543214', '1982-11-08', 'Male', '23, Koramangala, Bangalore-560034', '+91-9876543215', 'A+', 'Penicillin', 'Security Guard'),
        ('WH-CHN04-2024', 'Lakshmi Menon', '+91-9876543216', '1988-05-12', 'Female', '15, T.Nagar, Chennai-600017', '+91-9876543217', 'AB+', 'Shellfish', 'Nurse'),
        ('WH-HYD05-2024', 'Venkatesh Rao', '+91-9876543218', '1992-09-30', 'Male', '101, Banjara Hills, Hyderabad-500034', '+91-9876543219', 'O-', 'Latex', 'Driver'),
        ('WH-KOL06-2024', 'Anjali Ghosh', '+91-9876543220', '1987-01-25', 'Female', '22, Park Street, Kolkata-700016', '+91-9876543221', 'B-', 'None', 'Teacher'),
        ('WH-PUN07-2024', 'Amit Patil', '+91-9876543222', '1984-12-18', 'Male', '45, Shivajinagar, Pune-411005', '+91-9876543223', 'A-', 'Dust mites', 'Engineer'),
        ('WH-AHM08-2024', 'Kavya Patel', '+91-9876543224', '1991-04-07', 'Female', '78, Navrangpura, Ahmedabad-380009', '+91-9876543225', 'B+', 'Peanuts', 'Accountant'),
        ('WH-JAI09-2024', 'Rohit Agarwal', '+91-9876543226', '1986-08-14', 'Male', '12, Pink City, Jaipur-302001', '+91-9876543227', 'O+', 'None', 'Salesperson'),
        ('WH-LKN10-2024', 'Neha Gupta', '+91-9876543228', '1989-10-02', 'Female', '67, Gomti Nagar, Lucknow-226010', '+91-9876543229', 'AB-', 'Milk products', 'Receptionist'),
        ('WH-COI11-2024', 'Karthik Nair', '+91-9876543230', '1983-06-28', 'Male', '34, Panaji, Goa-403001', '+91-9876543231', 'A+', 'None', 'Chef'),
        ('WH-BHU12-2024', 'Sunita Devi', '+91-9876543232', '1990-02-16', 'Female', '56, Fraser Road, Bhubaneswar-751001', '+91-9876543233', 'B+', 'Iodine', 'Cleaner')
        ON CONFLICT (health_id) DO NOTHING;
    ELSE
        -- Minimal insert with just health_id
        INSERT INTO workers_data (health_id) VALUES 
        ('WH-DEL01-2024'), ('WH-MUM02-2024'), ('WH-BLR03-2024'), ('WH-CHN04-2024'),
        ('WH-HYD05-2024'), ('WH-KOL06-2024'), ('WH-PUN07-2024'), ('WH-AHM08-2024'),
        ('WH-JAI09-2024'), ('WH-LKN10-2024'), ('WH-COI11-2024'), ('WH-BHU12-2024')
        ON CONFLICT (health_id) DO NOTHING;
    END IF;
    
    RAISE NOTICE 'Indian worker data inserted successfully';
END $$;

-- 5. Insert comprehensive medical reports for each worker with multiple reports
-- Note: Replace 'DOCTOR_CLERK_ID_1', 'DOCTOR_CLERK_ID_2', etc. with actual Clerk user IDs

INSERT INTO medical_reports (
    report_id, worker_health_id, doctor_clerk_id, report_title, report_type, 
    report_description, diagnosis, treatment, notes, follow_up_required, 
    follow_up_date, report_date
) VALUES 

-- Reports for Rajesh Kumar Sharma (WH-DEL01-2024)
('RPT-20240115-001', 'WH-DEL01-2024', 'DOCTOR_CLERK_ID_1', 'Annual Health Checkup 2024', 'General Examination', 
'Comprehensive annual physical examination. Patient reports good overall health with occasional back pain due to factory work.', 
'Mild lower back strain, otherwise healthy', 'Prescribed pain relief medication and physiotherapy exercises. Recommended ergonomic improvements at workplace.', 
'Patient is cooperative and follows instructions well. Advised to take regular breaks during work.', true, 
CURRENT_DATE + INTERVAL '6 months', CURRENT_TIMESTAMP - INTERVAL '15 days'),

('RPT-20240301-002', 'WH-DEL01-2024', 'DOCTOR_CLERK_ID_2', 'Workplace Injury Assessment', 'Injury Assessment', 
'Patient sustained minor cut on left hand while operating machinery. Wound assessed and treated immediately.', 
'Minor laceration on left palm, 2cm length', 'Wound cleaned with antiseptic, sutured with 3 stitches, tetanus shot administered. Bandaged properly.', 
'Patient advised to keep wound dry and clean. Return for suture removal in 7 days. Provided sick leave certificate for 3 days.', true, 
CURRENT_DATE + INTERVAL '1 week', CURRENT_TIMESTAMP - INTERVAL '5 days'),

-- Reports for Priya Devi Singh (WH-MUM02-2024)
('RPT-20240120-003', 'WH-MUM02-2024', 'DOCTOR_CLERK_ID_1', 'Routine Health Screening', 'General Examination', 
'Regular health checkup for office worker. Patient reports stress and eye strain from computer work.', 
'Computer Vision Syndrome, mild stress', 'Prescribed eye drops for dry eyes, recommended 20-20-20 rule. Suggested stress management techniques.', 
'Patient is health-conscious. Advised on proper ergonomics and regular eye breaks.', false, 
NULL, CURRENT_TIMESTAMP - INTERVAL '12 days'),

('RPT-20240305-004', 'WH-MUM02-2024', 'DOCTOR_CLERK_ID_3', 'Migraine Consultation', 'Specialist Consultation', 
'Patient visited for recurring headaches affecting work performance. Detailed neurological assessment conducted.', 
'Tension-type headaches, possibly stress-related', 'Prescribed mild pain relievers and relaxation techniques. Recommended lifestyle modifications.', 
'Patient needs to manage work stress better. Suggested regular sleep schedule and hydration.', true, 
CURRENT_DATE + INTERVAL '1 month', CURRENT_TIMESTAMP - INTERVAL '2 days'),

-- Reports for Suresh Babu Reddy (WH-BLR03-2024)
('RPT-20240110-005', 'WH-BLR03-2024', 'DOCTOR_CLERK_ID_2', 'Hypertension Follow-up', 'Follow-up', 
'Regular follow-up for previously diagnosed hypertension. Blood pressure monitoring and medication review.', 
'Hypertension - well controlled', 'Continued current antihypertensive medication. Dietary counseling provided.', 
'Patient compliance is good. Blood pressure readings are within normal range. Continue current regimen.', true, 
CURRENT_DATE + INTERVAL '3 months', CURRENT_TIMESTAMP - INTERVAL '20 days'),

('RPT-20240225-006', 'WH-BLR03-2024', 'DOCTOR_CLERK_ID_1', 'Allergy Reaction Treatment', 'Emergency Visit', 
'Patient presented with allergic reaction to penicillin - rash and mild breathing difficulty. Immediate treatment provided.', 
'Mild allergic reaction to penicillin', 'Administered antihistamines and corticosteroids. Observed for 2 hours. Reaction subsided completely.', 
'Patient advised to carry emergency card mentioning penicillin allergy. Alternative antibiotics noted in records.', false, 
NULL, CURRENT_TIMESTAMP - INTERVAL '8 days'),

-- Reports for Lakshmi Menon (WH-CHN04-2024)
('RPT-20240118-007', 'WH-CHN04-2024', 'DOCTOR_CLERK_ID_3', 'Pre-employment Medical', 'Pre-employment Medical', 
'Comprehensive pre-employment medical examination for nursing position. All systems evaluated.', 
'Medically fit for nursing duties', 'No restrictions. Recommended hepatitis B vaccination as per nursing protocols.', 
'Candidate is in excellent health and suitable for nursing role. Vaccination record updated.', false, 
NULL, CURRENT_TIMESTAMP - INTERVAL '18 days'),

('RPT-20240308-008', 'WH-CHN04-2024', 'DOCTOR_CLERK_ID_2', 'Vaccination Record Update', 'Vaccination Record', 
'Routine vaccination update - administered annual flu vaccine and hepatitis B booster.', 
'Up-to-date with required vaccinations', 'Flu vaccine and hepatitis B booster administered. No adverse reactions observed.', 
'Patient tolerates vaccines well. Next flu shot due in 12 months. Provided vaccination certificate.', false, 
NULL, CURRENT_TIMESTAMP - INTERVAL '1 day'),

-- Reports for Venkatesh Rao (WH-HYD05-2024)
('RPT-20240122-009', 'WH-HYD05-2024', 'DOCTOR_CLERK_ID_1', 'Driver Fitness Certificate', 'Fitness Certificate', 
'Annual fitness assessment for professional driver. Vision, hearing, and cardiovascular health evaluated.', 
'Fit for driving duties', 'All parameters within normal limits. Vision 6/6, hearing normal, cardiovascular system healthy.', 
'Driver meets all medical requirements. Valid for commercial driving license renewal.', true, 
CURRENT_DATE + INTERVAL '12 months', CURRENT_TIMESTAMP - INTERVAL '10 days'),

('RPT-20240228-010', 'WH-HYD05-2024', 'DOCTOR_CLERK_ID_3', 'Back Pain Consultation', 'Specialist Consultation', 
'Patient complains of chronic lower back pain due to long hours of driving. Detailed musculoskeletal examination.', 
'Chronic lower back pain - mechanical', 'Prescribed muscle relaxants and physiotherapy. Recommended lumbar support cushion for driving.', 
'Patient needs ergonomic adjustments in vehicle. Regular stretching exercises advised.', true, 
CURRENT_DATE + INTERVAL '6 weeks', CURRENT_TIMESTAMP - INTERVAL '6 days'),

-- Reports for Anjali Ghosh (WH-KOL06-2024)
('RPT-20240125-011', 'WH-KOL06-2024', 'DOCTOR_CLERK_ID_2', 'Annual Physical Examination', 'General Examination', 
'Routine annual health checkup for school teacher. Overall health assessment and health education provided.', 
'Generally healthy, mild vitamin D deficiency', 'Prescribed vitamin D supplements. Recommended exposure to sunlight and dietary modifications.', 
'Patient is health-aware. Advised on maintaining good health practices for teaching profession.', false, 
NULL, CURRENT_TIMESTAMP - INTERVAL '14 days'),

('RPT-20240302-012', 'WH-KOL06-2024', 'DOCTOR_CLERK_ID_1', 'Respiratory Tract Infection', 'Emergency Visit', 
'Patient presented with cough, fever, and sore throat. Symptoms for 3 days. Clinical examination conducted.', 
'Upper respiratory tract infection', 'Prescribed antibiotics, cough syrup, and fever reducer. Rest advised for 3-5 days.', 
'Patient should isolate until fever-free for 24 hours. Return if symptoms worsen or persist beyond 7 days.', true, 
CURRENT_DATE + INTERVAL '1 week', CURRENT_TIMESTAMP - INTERVAL '4 days')

ON CONFLICT (report_id) DO NOTHING;

-- 6. Add more reports for remaining workers
INSERT INTO medical_reports (
    report_id, worker_health_id, doctor_clerk_id, report_title, report_type, 
    report_description, diagnosis, treatment, notes, follow_up_required, 
    follow_up_date, report_date
) VALUES 

-- Reports for Amit Patil (WH-PUN07-2024)
('RPT-20240112-013', 'WH-PUN07-2024', 'DOCTOR_CLERK_ID_1', 'Occupational Health Check', 'Occupational Health Check', 
'Routine occupational health assessment for engineering worker. Exposure to industrial chemicals evaluated.', 
'No occupational health issues detected', 'Advised on proper use of PPE. Lung function test normal. Continue safety protocols.', 
'Patient follows safety guidelines well. Regular health monitoring recommended due to chemical exposure.', true, 
CURRENT_DATE + INTERVAL '6 months', CURRENT_TIMESTAMP - INTERVAL '22 days'),

-- Reports for Kavya Patel (WH-AHM08-2024)
('RPT-20240130-014', 'WH-AHM08-2024', 'DOCTOR_CLERK_ID_2', 'Diabetes Screening', 'General Examination', 
'Routine diabetes screening due to family history. Blood glucose and HbA1c levels tested.', 
'Pre-diabetes detected', 'Dietary counseling provided. Recommended regular exercise and weight management. Re-test in 3 months.', 
'Patient is motivated to make lifestyle changes. Provided diabetes prevention education materials.', true, 
CURRENT_DATE + INTERVAL '3 months', CURRENT_TIMESTAMP - INTERVAL '7 days'),

-- Reports for Rohit Agarwal (WH-JAI09-2024)
('RPT-20240205-015', 'WH-JAI09-2024', 'DOCTOR_CLERK_ID_3', 'Skin Allergy Treatment', 'Dermatology Consultation', 
'Patient developed skin rash after exposure to cleaning chemicals at workplace. Dermatological examination performed.', 
'Contact dermatitis - chemical exposure', 'Prescribed topical corticosteroids and antihistamines. Advised to avoid trigger chemicals.', 
'Patient needs to use protective gloves when handling chemicals. Workplace safety review recommended.', false, 
NULL, CURRENT_TIMESTAMP - INTERVAL '9 days'),

-- Reports for Neha Gupta (WH-LKN10-2024)
('RPT-20240208-016', 'WH-LKN10-2024', 'DOCTOR_CLERK_ID_1', 'Maternity Health Check', 'General Examination', 
'Routine prenatal health check - 12 weeks pregnancy. Comprehensive maternal health assessment.', 
'Normal pregnancy progression', 'Prescribed prenatal vitamins. Advised on nutrition and lifestyle during pregnancy.', 
'First pregnancy - patient needs education on prenatal care. Regular follow-ups scheduled.', true, 
CURRENT_DATE + INTERVAL '4 weeks', CURRENT_TIMESTAMP - INTERVAL '11 days'),

-- Reports for Karthik Nair (WH-COI11-2024)
('RPT-20240215-017', 'WH-COI11-2024', 'DOCTOR_CLERK_ID_2', 'Food Handler Health Check', 'General Examination', 
'Annual health check required for food handler license renewal. Infectious disease screening performed.', 
'Cleared for food handling duties', 'All tests negative for infectious diseases. Valid for food handler certificate renewal.', 
'Patient maintains good personal hygiene. Advised on continued food safety practices.', true, 
CURRENT_DATE + INTERVAL '12 months', CURRENT_TIMESTAMP - INTERVAL '13 days'),

-- Reports for Sunita Devi (WH-BHU12-2024)
('RPT-20240220-018', 'WH-BHU12-2024', 'DOCTOR_CLERK_ID_3', 'Joint Pain Assessment', 'Specialist Consultation', 
'Patient complains of knee and joint pain affecting daily activities. Rheumatological evaluation performed.', 'Osteoarthritis - early stage', 
'Prescribed anti-inflammatory medication and joint supplements. Recommended low-impact exercises.', 
'Patient needs physiotherapy and weight management. Joint pain manageable with current treatment.', true, 
CURRENT_DATE + INTERVAL '6 weeks', CURRENT_TIMESTAMP - INTERVAL '3 days')

ON CONFLICT (report_id) DO NOTHING;

-- 7. Create helper function to update doctor IDs
CREATE OR REPLACE FUNCTION update_reports_with_doctor_id(doctor_clerk_id TEXT, placeholder TEXT)
RETURNS TEXT AS $$
BEGIN
    UPDATE medical_reports 
    SET doctor_clerk_id = update_reports_with_doctor_id.doctor_clerk_id 
    WHERE doctor_clerk_id = placeholder;
    
    RETURN 'Updated reports for doctor ID: ' || doctor_clerk_id;
END;
$$ LANGUAGE plpgsql;

-- 8. Instructions for linking to actual doctors
SELECT 'Indian dummy data setup completed!' as status;
SELECT 'Workers created: ' || COUNT(*) as worker_count FROM workers_data WHERE health_id LIKE 'WH-%2024';
SELECT 'Medical reports created: ' || COUNT(*) as report_count FROM medical_reports WHERE report_id LIKE 'RPT-2024%';

-- 9. Display sample data
SELECT 'Sample Workers:' as info;
SELECT health_id, 
       COALESCE(full_name, name, 'Name not available') as worker_name,
       phone, gender, occupation 
FROM workers_data 
WHERE health_id LIKE 'WH-%2024' 
LIMIT 5;

SELECT 'Sample Medical Reports:' as info;
SELECT report_id, worker_health_id, report_title, report_type, 
       TO_CHAR(report_date, 'DD Mon YYYY') as report_date
FROM medical_reports 
WHERE report_id LIKE 'RPT-2024%' 
ORDER BY report_date DESC 
LIMIT 8;

-- Instructions to link with your actual doctor accounts:
/*
TO LINK WITH YOUR ACTUAL DOCTOR ACCOUNTS:

1. Get your doctor Clerk user IDs from Clerk dashboard
2. Run these commands replacing 'your_actual_clerk_id' with real IDs:

SELECT update_reports_with_doctor_id('your_doctor_1_clerk_id', 'DOCTOR_CLERK_ID_1');
SELECT update_reports_with_doctor_id('your_doctor_2_clerk_id', 'DOCTOR_CLERK_ID_2');
SELECT update_reports_with_doctor_id('your_doctor_3_clerk_id', 'DOCTOR_CLERK_ID_3');

Or update manually:
UPDATE medical_reports SET doctor_clerk_id = 'your_actual_clerk_id' WHERE doctor_clerk_id = 'DOCTOR_CLERK_ID_1';
*/