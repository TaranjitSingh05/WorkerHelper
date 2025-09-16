# Workers Data Table Setup Instructions

## Overview
This document provides step-by-step instructions to set up the new `workers_data` table in Supabase for the JeevanID application.

## Prerequisites
- Access to your Supabase project dashboard
- Project URL: `https://ocwligjyouzbzelwodun.supabase.co`
- Supabase Anon Key configured in `.env` file

## Step 1: Create the workers_data Table

1. Open your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `ocwligjyouzbzelwodun`
3. Navigate to **SQL Editor** from the left sidebar
4. Copy the contents of `workers_data_setup.sql` and paste into the SQL Editor
5. Click **Run** to execute the script

### What the Script Does:
- Creates the `workers_data` table with all required columns
- Sets up proper indexes for performance
- Creates an auto-update trigger for `updated_at` timestamp
- Configures permissions for anonymous users
- Disables Row Level Security for testing

## Step 2: Verify Table Creation

1. Go to **Table Editor** in Supabase Dashboard
2. You should see the `workers_data` table listed
3. Click on the table to view its structure

### Expected Columns:
- `id` (Primary Key, Auto-increment)
- `health_id` (Unique identifier for workers)
- `full_name` (Worker's full name)
- `date_of_birth` (Date of birth)
- `age` (Auto-calculated from DOB)
- `gender` (Male/Female/Other)
- `phone_number` (Contact number)
- `address` (Complete address)
- `occupation_type` (Construction/Fishery/Factory/Other)
- `contractor_name` (Optional employer name)
- `blood_group` (Blood type)
- `allergies` (Optional allergies list)
- `chronic_diseases` (Health conditions)
- `vaccination_status` (Vaccination status)
- `qr_code_data` (Data for QR code)
- `created_at` (Timestamp)
- `updated_at` (Auto-updated timestamp)

## Step 3: Test the Form Integration

1. Start the development server:
   ```bash
   npm start
   ```

2. Navigate to: http://localhost:4028/personal-health-record

3. Fill out the form with test data:
   - **Full Name**: Test Worker
   - **Date of Birth**: 01/01/1990
   - **Gender**: Male
   - **Phone Number**: 1234567890
   - **Address**: Test Address, Test City
   - **Occupation Type**: Construction
   - **Contractor Name**: Test Contractor
   - **Blood Group**: O+
   - **Allergies**: None
   - **Chronic Diseases**: None
   - **Vaccination Status**: Fully Vaccinated

4. Click **Create Health Record**

5. Verify success:
   - Success message should appear
   - Worker Health ID should be displayed
   - QR code should be generated

## Step 4: Verify Data in Supabase

1. Go back to Supabase Dashboard > Table Editor
2. Click on the `workers_data` table
3. You should see the test record with:
   - Auto-generated `health_id` (format: WH-XXXXX-XXXXX)
   - All form data properly saved
   - `created_at` timestamp set to current time

## Troubleshooting

### Error: "Table 'workers_data' does not exist"
- **Solution**: Run the `workers_data_setup.sql` script in Supabase SQL Editor

### Error: "Permission denied"
- **Solution**: Ensure the GRANT statements in the SQL script executed successfully
- **Alternative**: Temporarily disable RLS on the table

### Error: "Invalid API key"
- **Solution**: Check that your `.env` file has the correct `VITE_SUPABASE_ANON_KEY`
- **Restart**: Restart the development server after updating `.env`

### Form submission fails silently
- **Check**: Browser console for error messages (F12)
- **Verify**: Supabase project is active and accessible
- **Confirm**: All required environment variables are set

## Security Notes

### For Development:
- RLS is disabled for easy testing
- Anonymous users have full access to the table

### For Production:
Uncomment and run these additional SQL commands:

```sql
-- Enable Row Level Security
ALTER TABLE workers_data ENABLE ROW LEVEL SECURITY;

-- Create secure policies
CREATE POLICY "Enable insert for anonymous users"
ON workers_data
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Enable read for anonymous users"
ON workers_data
FOR SELECT
TO anon
USING (true);
```

## Success Indicators

✅ **Table Created**: `workers_data` appears in Supabase Table Editor
✅ **Form Submits**: No errors in browser console
✅ **Data Saved**: Records appear in Supabase dashboard
✅ **Health ID Generated**: Unique ID format: `WH-XXXXX-XXXXX`
✅ **QR Code Created**: QR code displayed on success screen

## Support

If you encounter issues:
1. Check the browser console (F12) for detailed error messages
2. Verify your Supabase project is active
3. Ensure all environment variables are correctly set
4. Review the `workers_data_setup.sql` script execution results