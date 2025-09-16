-- Final Bulletproof Indian Dummy Data for JeevanID
-- Handles NOT NULL constraints and any table structure

-- 1. First, show your table structure so you know what we're working with
SELECT 'Your current workers_data table structure:' as info;
SELECT column_name, data_type, is_nullable, column_default
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

-- 5. Smart worker insertion that handles NOT NULL constraints
DO $$
DECLARE
    worker_record RECORD;
    insert_columns TEXT := 'health_id';
    placeholder_values TEXT := '';
BEGIN
    RAISE NOTICE 'Starting bulletproof worker data insertion...';
    
    -- Check which columns exist and build appropriate INSERT statement
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'full_name') THEN
        insert_columns := insert_columns || ', full_name';
    ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'name') THEN
        insert_columns := insert_columns || ', name';
    END IF;

    -- Insert each worker individually with proper error handling
    BEGIN
        -- Worker 1: Rajesh Kumar Sharma (Delhi)
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'full_name') THEN
            INSERT INTO workers_data (health_id, full_name) VALUES ('WH-DEL01-2024', 'Rajesh Kumar Sharma') ON CONFLICT (health_id) DO NOTHING;
        ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'name') THEN
            INSERT INTO workers_data (health_id, name) VALUES ('WH-DEL01-2024', 'Rajesh Kumar Sharma') ON CONFLICT (health_id) DO NOTHING;
        ELSE
            INSERT INTO workers_data (health_id) VALUES ('WH-DEL01-2024') ON CONFLICT (health_id) DO NOTHING;
        END IF;
        
        -- Update additional fields if they exist
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'phone') THEN
            UPDATE workers_data SET phone = '+91-9876543210' WHERE health_id = 'WH-DEL01-2024';
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'birth_date') THEN
            UPDATE workers_data SET birth_date = '1985-03-15' WHERE health_id = 'WH-DEL01-2024';
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'gender') THEN
            UPDATE workers_data SET gender = 'Male' WHERE health_id = 'WH-DEL01-2024';
        END IF;
        RAISE NOTICE 'Inserted: Rajesh Kumar Sharma';
    EXCEPTION WHEN others THEN
        RAISE NOTICE 'Failed to insert Rajesh Kumar Sharma: %', SQLERRM;
    END;

    BEGIN
        -- Worker 2: Priya Devi Singh (Mumbai)
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'full_name') THEN
            INSERT INTO workers_data (health_id, full_name) VALUES ('WH-MUM02-2024', 'Priya Devi Singh') ON CONFLICT (health_id) DO NOTHING;
        ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'name') THEN
            INSERT INTO workers_data (health_id, name) VALUES ('WH-MUM02-2024', 'Priya Devi Singh') ON CONFLICT (health_id) DO NOTHING;
        ELSE
            INSERT INTO workers_data (health_id) VALUES ('WH-MUM02-2024') ON CONFLICT (health_id) DO NOTHING;
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
        RAISE NOTICE 'Inserted: Priya Devi Singh';
    EXCEPTION WHEN others THEN
        RAISE NOTICE 'Failed to insert Priya Devi Singh: %', SQLERRM;
    END;

    BEGIN
        -- Worker 3: Suresh Babu Reddy (Bangalore)
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'full_name') THEN
            INSERT INTO workers_data (health_id, full_name) VALUES ('WH-BLR03-2024', 'Suresh Babu Reddy') ON CONFLICT (health_id) DO NOTHING;
        ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'name') THEN
            INSERT INTO workers_data (health_id, name) VALUES ('WH-BLR03-2024', 'Suresh Babu Reddy') ON CONFLICT (health_id) DO NOTHING;
        ELSE
            INSERT INTO workers_data (health_id) VALUES ('WH-BLR03-2024') ON CONFLICT (health_id) DO NOTHING;
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
        RAISE NOTICE 'Inserted: Suresh Babu Reddy';
    EXCEPTION WHEN others THEN
        RAISE NOTICE 'Failed to insert Suresh Babu Reddy: %', SQLERRM;
    END;

    -- Insert remaining workers with similar error handling
    DECLARE
        worker_names TEXT[] := ARRAY['Lakshmi Menon', 'Venkatesh Rao', 'Anjali Ghosh', 'Amit Patil', 'Kavya Patel', 'Rohit Agarwal', 'Neha Gupta', 'Karthik Nair', 'Sunita Devi'];
        worker_ids TEXT[] := ARRAY['WH-CHN04-2024', 'WH-HYD05-2024', 'WH-KOL06-2024', 'WH-PUN07-2024', 'WH-AHM08-2024', 'WH-JAI09-2024', 'WH-LKN10-2024', 'WH-COI11-2024', 'WH-BHU12-2024'];
        i INTEGER;
    BEGIN
        FOR i IN 1..array_length(worker_names, 1) LOOP
            BEGIN
                IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'full_name') THEN
                    EXECUTE format('INSERT INTO workers_data (health_id, full_name) VALUES (%L, %L) ON CONFLICT (health_id) DO NOTHING', worker_ids[i], worker_names[i]);
                ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workers_data' AND column_name = 'name') THEN
                    EXECUTE format('INSERT INTO workers_data (health_id, name) VALUES (%L, %L) ON CONFLICT (health_id) DO NOTHING', worker_ids[i], worker_names[i]);
                ELSE
                    EXECUTE format('INSERT INTO workers_data (health_id) VALUES (%L) ON CONFLICT (health_id) DO NOTHING', worker_ids[i]);
                END IF;
                RAISE NOTICE 'Inserted: % (%)', worker_names[i], worker_ids[i];
            EXCEPTION WHEN others THEN
                RAISE NOTICE 'Failed to insert % (%): %', worker_names[i], worker_ids[i], SQLERRM;
            END;
        END LOOP;
    END;

    RAISE NOTICE 'Indian worker data insertion completed with individual error handling';
END $$;

-- 6. Insert comprehensive medical reports
INSERT INTO medical_reports (
    report_id, worker_health_id, doctor_clerk_id, report_title, report_type, 
    report_description, diagnosis, treatment, notes, follow_up_required, 
    follow_up_date, report_date
) VALUES 

-- Reports for Rajesh Kumar Sharma (WH-DEL01-2024)
('RPT-20240415-001', 'WH-DEL01-2024', 'DOCTOR_CLERK_ID_1', 'Annual Health Checkup 2024', 'General Examination', 
'Comprehensive annual physical examination for factory worker. Patient reports good overall health with occasional back pain due to heavy lifting and prolonged standing during work shifts.', 
'Mild lower back strain due to occupational factors, otherwise healthy', 'Prescribed pain relief medication (Ibuprofen 400mg). Physiotherapy exercises recommended. Ergonomic assessment of workplace suggested.', 
'Patient is cooperative and follows medical advice well. Advised to take regular breaks during work and use proper lifting techniques.', true, 
CURRENT_DATE + INTERVAL '6 months', CURRENT_TIMESTAMP - INTERVAL '15 days'),

('RPT-20240425-002', 'WH-DEL01-2024', 'DOCTOR_CLERK_ID_2', 'Workplace Injury Assessment', 'Injury Assessment', 
'Patient sustained minor laceration on left hand while operating machinery. Wound was assessed and treated immediately in factory medical room before referral.', 
'Minor laceration on left palm, 2cm length, superficial', 'Wound cleaned with antiseptic solution, sutured with 3 stitches, tetanus shot administered. Bandaged and instructions provided for wound care.', 
'Patient advised to keep wound dry and clean. Return for suture removal in 7 days. Provided medical certificate for 3 days light duty work.', true, 
CURRENT_DATE + INTERVAL '1 week', CURRENT_TIMESTAMP - INTERVAL '5 days'),

-- Reports for Priya Devi Singh (WH-MUM02-2024)
('RPT-20240420-003', 'WH-MUM02-2024', 'DOCTOR_CLERK_ID_1', 'Computer Vision Syndrome Consultation', 'General Examination', 
'Office worker presenting with eye strain, headaches, and dry eyes after long hours of computer work. Detailed ophthalmic examination performed.', 
'Computer Vision Syndrome with mild asthenopia, work-related stress symptoms', 'Prescribed lubricating eye drops (Refresh Tears). Recommended 20-20-20 rule implementation. Stress management techniques discussed.', 
'Patient is health-conscious and motivated. Advised on proper workstation ergonomics, regular eye breaks, and adequate lighting adjustments.', false, 
NULL, CURRENT_TIMESTAMP - INTERVAL '12 days'),

('RPT-20240430-004', 'WH-MUM02-2024', 'DOCTOR_CLERK_ID_3', 'Tension Headache Consultation', 'Specialist Consultation', 
'Patient visited for recurring tension-type headaches affecting work performance. Detailed neurological assessment and history taking conducted.', 
'Tension-type headaches, likely stress-related with occupational triggers', 'Prescribed mild analgesics (Paracetamol 500mg PRN). Relaxation techniques taught. Lifestyle modifications recommended including regular exercise.', 
'Patient needs better work-life balance management. Suggested regular sleep schedule, adequate hydration, and stress reduction techniques.', true, 
CURRENT_DATE + INTERVAL '1 month', CURRENT_TIMESTAMP - INTERVAL '2 days'),

-- Reports for Suresh Babu Reddy (WH-BLR03-2024)
('RPT-20240410-005', 'WH-BLR03-2024', 'DOCTOR_CLERK_ID_2', 'Hypertension Follow-up Visit', 'Follow-up', 
'Regular follow-up appointment for previously diagnosed essential hypertension. Blood pressure monitoring, medication compliance review, and lifestyle counseling.', 
'Essential hypertension - well controlled on current medication regimen', 'Continued Amlodipine 5mg daily and Metoprolol 25mg BD. Dietary counseling provided focusing on low sodium intake and DASH diet principles.', 
'Patient shows good medication compliance. Blood pressure readings consistently within target range (130/80 mmHg). Continue current treatment plan.', true, 
CURRENT_DATE + INTERVAL '3 months', CURRENT_TIMESTAMP - INTERVAL '20 days'),

('RPT-20240428-006', 'WH-BLR03-2024', 'DOCTOR_CLERK_ID_1', 'Drug Allergy Emergency Treatment', 'Emergency Visit', 
'Patient presented with acute allergic reaction to Penicillin - generalized skin rash, urticaria, and mild respiratory distress. Emergency treatment provided.', 
'Mild to moderate allergic reaction to Penicillin (Type I hypersensitivity)', 'Administered IV Hydrocortisone 100mg, Chlorpheniramine 10mg IM. Observed for 2 hours. Symptoms resolved completely with treatment.', 
'Patient advised to carry medical alert card mentioning Penicillin allergy. Alternative antibiotic options documented in medical records for future reference.', false, 
NULL, CURRENT_TIMESTAMP - INTERVAL '8 days'),

-- Single reports for remaining workers
('RPT-20240422-007', 'WH-CHN04-2024', 'DOCTOR_CLERK_ID_3', 'Pre-employment Medical Examination', 'Pre-employment Medical', 
'Comprehensive pre-employment medical examination for nursing position in private hospital. All systems evaluated as per hospital policy requirements.', 
'Medically fit for nursing duties with no restrictions', 'No treatment required. Recommended hepatitis B vaccination as per nursing protocols and hospital infection control guidelines.', 
'Candidate demonstrates excellent health status and is suitable for nursing responsibilities. All vaccination records updated and documented.', false, 
NULL, CURRENT_TIMESTAMP - INTERVAL '18 days'),

('RPT-20240424-008', 'WH-HYD05-2024', 'DOCTOR_CLERK_ID_1', 'Commercial Driver Fitness Certificate', 'Fitness Certificate', 
'Annual medical fitness assessment for commercial vehicle driving license renewal. Vision testing, hearing assessment, cardiovascular evaluation performed.', 
'Medically fit for commercial vehicle driving duties', 'All parameters within normal limits. Visual acuity 6/6 bilateral, hearing normal, cardiovascular system healthy, no contraindications for driving.', 
'Driver meets all medical standards required for commercial driving license. Certificate valid for renewal of heavy vehicle driving permit.', true, 
CURRENT_DATE + INTERVAL '12 months', CURRENT_TIMESTAMP - INTERVAL '10 days'),

('RPT-20240426-009', 'WH-KOL06-2024', 'DOCTOR_CLERK_ID_2', 'Upper Respiratory Tract Infection', 'Emergency Visit', 
'School teacher presented with acute onset cough, fever (102°F), and sore throat. Symptoms present for 3 days with progressive worsening.', 
'Acute upper respiratory tract infection, likely viral etiology', 'Prescribed Azithromycin 500mg daily x5 days, Paracetamol 650mg TDS, cough syrup with codeine. Rest advised for 5 days with medical leave.', 
'Patient advised home isolation until fever-free for 24 hours. Return if symptoms worsen or persist beyond 7 days. Adequate fluid intake recommended.', true, 
CURRENT_DATE + INTERVAL '1 week', CURRENT_TIMESTAMP - INTERVAL '4 days'),

('RPT-20240418-010', 'WH-PUN07-2024', 'DOCTOR_CLERK_ID_1', 'Occupational Health Assessment', 'Occupational Health Check', 
'Routine annual occupational health assessment for engineering worker with potential exposure to industrial chemicals and noise pollution.', 
'No occupational health issues detected, baseline parameters normal', 'No treatment required. Advised on continued proper use of personal protective equipment. Annual audiometry and lung function tests recommended.', 
'Worker demonstrates good adherence to safety protocols. Regular health monitoring recommended due to chemical and noise exposure in workplace environment.', true, 
CURRENT_DATE + INTERVAL '6 months', CURRENT_TIMESTAMP - INTERVAL '22 days'),

('RPT-20240429-011', 'WH-AHM08-2024', 'DOCTOR_CLERK_ID_2', 'Diabetes Risk Screening', 'General Examination', 
'Routine diabetes screening for accountant with positive family history. Fasting blood glucose, HbA1c, and oral glucose tolerance test performed.', 
'Impaired glucose tolerance detected - pre-diabetic state', 'Intensive dietary counseling provided. Regular exercise program recommended. Weight management plan initiated. Re-evaluation in 3 months with repeat tests.', 
'Patient is highly motivated to make lifestyle changes. Provided comprehensive diabetes prevention education materials and dietary guidelines.', true, 
CURRENT_DATE + INTERVAL '3 months', CURRENT_TIMESTAMP - INTERVAL '7 days'),

('RPT-20240421-012', 'WH-JAI09-2024', 'DOCTOR_CLERK_ID_3', 'Occupational Contact Dermatitis', 'Dermatology Consultation', 
'Salesperson developed extensive skin rash on hands and forearms after exposure to cleaning chemicals used for sanitizing products in retail environment.', 
'Allergic contact dermatitis secondary to chemical exposure (likely quaternary ammonium compounds)', 'Prescribed topical corticosteroids (Betamethasone cream) and oral antihistamines (Cetirizine 10mg daily). Advised complete avoidance of trigger chemicals.', 
'Patient requires use of protective gloves when handling cleaning products. Workplace safety review and chemical substitution recommended.', false, 
NULL, CURRENT_TIMESTAMP - INTERVAL '9 days'),

('RPT-20240427-013', 'WH-LKN10-2024', 'DOCTOR_CLERK_ID_1', 'Antenatal Care - First Trimester', 'General Examination', 
'Routine first trimester antenatal visit at 12 weeks gestation. Comprehensive maternal health assessment, fetal viability check, and health education provided.', 
'Intrauterine pregnancy - 12 weeks gestation, normal progression', 'Prescribed folic acid 5mg daily and iron supplements. Comprehensive nutrition counseling provided. Regular antenatal follow-up schedule established.', 
'First-time pregnancy - patient requires extensive education on prenatal care, warning signs, and lifestyle modifications during pregnancy.', true, 
CURRENT_DATE + INTERVAL '4 weeks', CURRENT_TIMESTAMP - INTERVAL '11 days'),

('RPT-20240423-014', 'WH-COI11-2024', 'DOCTOR_CLERK_ID_2', 'Food Handler Health Certification', 'General Examination', 
'Annual health check required for food handler license renewal in hotel industry. Comprehensive infectious disease screening and general health assessment performed.', 
'Medically cleared for food handling duties', 'All screening tests negative for infectious diseases (Hepatitis A, B, typhoid, tuberculosis). Valid for food handler certificate renewal.', 
'Chef maintains excellent personal hygiene standards. Provided updated education on food safety practices and hand hygiene protocols.', true, 
CURRENT_DATE + INTERVAL '12 months', CURRENT_TIMESTAMP - INTERVAL '13 days'),

('RPT-20240431-015', 'WH-BHU12-2024', 'DOCTOR_CLERK_ID_3', 'Musculoskeletal Pain Assessment', 'Specialist Consultation', 
'Cleaning worker complains of chronic knee and joint pain affecting daily activities and work performance. Comprehensive rheumatological evaluation performed.', 
'Early-stage osteoarthritis of bilateral knees, occupational overuse syndrome', 'Prescribed NSAIDs (Diclofenac 50mg BD), glucosamine supplements. Low-impact exercise program recommended. Physiotherapy referral provided.', 
'Patient requires workplace ergonomic assessment and job rotation if possible. Weight management and joint protection techniques taught.', true, 
CURRENT_DATE + INTERVAL '6 weeks', CURRENT_TIMESTAMP - INTERVAL '3 days')

ON CONFLICT (report_id) DO NOTHING;

-- 7. Helper function to link reports to actual doctors
CREATE OR REPLACE FUNCTION update_reports_with_doctor_id(new_doctor_id TEXT, placeholder_id TEXT)
RETURNS TEXT AS $$
BEGIN
    UPDATE medical_reports 
    SET doctor_clerk_id = new_doctor_id 
    WHERE doctor_clerk_id = placeholder_id;
    
    RETURN 'Updated reports for doctor ID: ' || new_doctor_id || ' (replaced ' || placeholder_id || ')';
END;
$$ LANGUAGE plpgsql;

-- 8. Show final results
SELECT 'Final bulletproof Indian dummy data setup completed!' as status;
SELECT 'Workers created: ' || COUNT(*) as worker_count FROM workers_data WHERE health_id LIKE 'WH-%2024';
SELECT 'Medical reports created: ' || COUNT(*) as report_count FROM medical_reports WHERE report_id LIKE 'RPT-2024%';

-- Show what data we successfully created
SELECT 'Sample Workers with Available Data:' as info;
SELECT health_id, 
       COALESCE(full_name, 'Name not available') as worker_name
FROM workers_data 
WHERE health_id LIKE 'WH-%2024' 
ORDER BY health_id
LIMIT 8;

SELECT 'Sample Medical Reports:' as info;
SELECT report_id, worker_health_id, report_title, report_type
FROM medical_reports 
WHERE report_id LIKE 'RPT-2024%' 
ORDER BY report_date DESC 
LIMIT 6;

/*
=================================================================
🔑 HOW TO GET YOUR CLERK USER ID:

METHOD 1 - FROM CLERK DASHBOARD:
1. Go to https://dashboard.clerk.com
2. Select your JeevanID application
3. Click on "Users" in the sidebar
4. Find your doctor user and click on them
5. Copy the "User ID" (looks like: user_2a3b4c5dE6f7G8h9I0j1K2l3M4)

METHOD 2 - FROM YOUR APP'S BROWSER CONSOLE:
1. Sign in to your app as a doctor
2. Open browser developer tools (F12)
3. Go to Console tab
4. Type: console.log(user.id)
5. Copy the ID that appears

METHOD 3 - FROM REACT COMPONENT:
In any React component with useUser():
console.log('Current user ID:', user.id);

THEN RUN THIS TO LINK YOUR REPORTS:
=================================================================
*/

-- REPLACE 'your_actual_clerk_user_id_here' WITH YOUR REAL CLERK ID:
-- SELECT update_reports_with_doctor_id('your_actual_clerk_user_id_here', 'DOCTOR_CLERK_ID_1');

-- Test these worker IDs after linking to your account:
-- WH-DEL01-2024 (Rajesh Kumar Sharma - 2 detailed reports)
-- WH-MUM02-2024 (Priya Devi Singh - 2 detailed reports)
-- WH-BLR03-2024 (Suresh Babu Reddy - 2 detailed reports)
-- WH-CHN04-2024 to WH-BHU12-2024 (1 detailed report each)