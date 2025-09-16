-- Alternative approach to link medical reports to your doctor account
-- Run this in a fresh Supabase SQL editor session

-- First, let's see what reports exist
SELECT 'Current placeholder reports:' as info;
SELECT doctor_clerk_id, COUNT(*) as report_count 
FROM medical_reports 
GROUP BY doctor_clerk_id;

-- Update reports using DO block to avoid function issues
DO $$ 
DECLARE
    updated_count INTEGER;
BEGIN
    -- Update DOCTOR_CLERK_ID_1 reports
    UPDATE medical_reports 
    SET doctor_clerk_id = 'user_32kFLRIkC8wA5A9Dkm0vNxniHfd'
    WHERE doctor_clerk_id = 'DOCTOR_CLERK_ID_1';
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RAISE NOTICE 'Updated % reports for DOCTOR_CLERK_ID_1', updated_count;
    
    -- Update DOCTOR_CLERK_ID_2 reports
    UPDATE medical_reports 
    SET doctor_clerk_id = 'user_32kFLRIkC8wA5A9Dkm0vNxniHfd'
    WHERE doctor_clerk_id = 'DOCTOR_CLERK_ID_2';
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RAISE NOTICE 'Updated % reports for DOCTOR_CLERK_ID_2', updated_count;
    
    -- Update DOCTOR_CLERK_ID_3 reports
    UPDATE medical_reports 
    SET doctor_clerk_id = 'user_32kFLRIkC8wA5A9Dkm0vNxniHfd'
    WHERE doctor_clerk_id = 'DOCTOR_CLERK_ID_3';
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RAISE NOTICE 'Updated % reports for DOCTOR_CLERK_ID_3', updated_count;
    
END $$;

-- Verify the updates worked
SELECT 'After linking - your reports:' as info;
SELECT doctor_clerk_id, COUNT(*) as report_count 
FROM medical_reports 
WHERE doctor_clerk_id = 'user_32kFLRIkC8wA5A9Dkm0vNxniHfd'
GROUP BY doctor_clerk_id;

-- Show sample of your linked reports
SELECT 'Sample of your linked reports:' as info;
SELECT report_id, worker_health_id, report_title, report_type, report_date
FROM medical_reports 
WHERE doctor_clerk_id = 'user_32kFLRIkC8wA5A9Dkm0vNxniHfd'
ORDER BY report_date DESC
LIMIT 5;