# Supabase Integration Setup for WorkerHelper

## ✅ Completed Setup

1. **Environment Variables**: Already configured in `.env` file
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

2. **Supabase Client**: Configured in `src/utils/supabase.js`

3. **Form Integration**: PersonalInfoForm component is ready to save data

## 🔧 Required Supabase Setup

### Step 1: Run SQL to Set Up Workers Table

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor** (in the left sidebar)
4. Copy and paste the following SQL:

```sql
-- Create the workers table if it doesn't exist
CREATE TABLE IF NOT EXISTS workers (
  id SERIAL PRIMARY KEY,
  health_id VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  date_of_birth DATE NOT NULL,
  age INTEGER,
  gender VARCHAR(50),
  phone_number VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  occupation_type VARCHAR(100) NOT NULL,
  contractor_name VARCHAR(255),
  blood_group VARCHAR(10) NOT NULL,
  allergies TEXT,
  chronic_diseases TEXT,
  vaccination_status VARCHAR(50) NOT NULL,
  qr_code_data TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS for testing (enable it later with proper policies)
ALTER TABLE workers DISABLE ROW LEVEL SECURITY;

-- Grant permissions to anonymous users
GRANT ALL ON workers TO anon;
GRANT USAGE, SELECT ON SEQUENCE workers_id_seq TO anon;
```

5. Click **Run** to execute the SQL

### Step 2: Test the Integration

1. Open the website: http://localhost:4028/
2. Navigate to **Personal Health Record**
3. Fill out the form with test data:
   - Full Name: Test Worker
   - Date of Birth: 01/01/1990
   - Gender: Male
   - Phone: 1234567890
   - Address: Test Address
   - Occupation: Construction Worker
   - Blood Group: O+
   - Chronic Diseases: None
   - Vaccination Status: Fully Vaccinated

4. Click **Create Health Record**
5. Check your Supabase Dashboard > Table Editor > workers table

### Step 3: Enable Row Level Security (Production)

Once testing is complete, enable RLS for security:

```sql
-- Enable RLS
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;

-- Create policy for anonymous inserts
CREATE POLICY "Enable insert for anonymous users"
ON workers
FOR INSERT
TO anon
WITH CHECK (true);

-- Create policy for reading records
CREATE POLICY "Enable read for anonymous users"
ON workers
FOR SELECT
TO anon
USING (true);
```

## 🐛 Troubleshooting

### Error: "Invalid API key"
- Check that your `.env` file has the correct `VITE_SUPABASE_ANON_KEY`
- Restart the development server after updating `.env`

### Error: "Permission denied for table workers"
- Run the SQL commands in Step 1 to disable RLS or create proper policies
- Make sure you granted permissions to `anon` role

### Error: "relation 'workers' does not exist"
- The workers table hasn't been created yet
- Run the CREATE TABLE SQL command from Step 1

### Error: "duplicate key value violates unique constraint"
- A record with the same health_id already exists
- This is rare but can happen - the form will generate a new ID automatically

## 📋 What Gets Saved

When a user submits the form, the following data is saved to Supabase:

- **health_id**: Unique identifier (e.g., "WH-LXK2M3-ABC123")
- **full_name**: Worker's full name
- **date_of_birth**: Date of birth
- **age**: Calculated age
- **gender**: Gender selection
- **phone_number**: Contact number
- **address**: Full address
- **occupation_type**: Type of work
- **contractor_name**: Employer/contractor (optional)
- **blood_group**: Blood type
- **allergies**: Any allergies (optional)
- **chronic_diseases**: List of chronic conditions
- **vaccination_status**: Vaccination status
- **qr_code_data**: Data for QR code generation
- **created_at**: Timestamp of record creation

## 🎉 Success Indicators

You'll know the integration is working when:
1. Console shows "Supabase URL: https://ocwligjyouzbzelwodun.supabase.co"
2. Form submission shows success message with Worker Health ID
3. QR code is displayed on success screen
4. Data appears in Supabase Dashboard > Table Editor > workers

## 📞 Need Help?

If you encounter issues:
1. Check browser console (F12) for detailed error messages
2. Verify Supabase Dashboard shows your project is active
3. Ensure the workers table exists in your Supabase project
4. Check that RLS policies are correctly configured