# Doctor Panel Troubleshooting Guide

## 🚨 "Something went wrong" Error Fix

If you're seeing "Something went wrong" when searching for workers in the doctor dashboard, it's likely because the required database tables haven't been created yet.

### 🔧 Quick Fix Steps

#### Step 1: Set Up Database Tables

1. **Go to your Supabase Dashboard**
   - Visit [https://supabase.com](https://supabase.com)
   - Sign in and select your JeevanID project

2. **Open SQL Editor**
   - In the left sidebar, click on "SQL Editor"
   - Click "New query"

3. **Run the Setup Script**
   - Copy the entire contents of `sql/complete_doctor_panel_setup.sql`
   - Paste it into the SQL editor
   - Click "Run" to execute

#### Step 2: Set Up Doctor User

1. **Go to Clerk Dashboard**
   - Visit [https://dashboard.clerk.com](https://dashboard.clerk.com)
   - Select your JeevanID application
   - Go to "Users" section

2. **Find/Create Doctor User**
   - Find an existing user or create a new one
   - Click on the user to open their profile
   - Copy their User ID (it looks like `user_2a3b4c5d...`)

3. **Add Doctor Role**
   - In the user profile, scroll to "Public metadata"
   - Click "Edit" and add:
   ```json
   {
     "role": "doctor"
   }
   ```
   - Click "Save"

#### Step 3: Link Sample Data to Doctor

1. **Back in Supabase SQL Editor**
   - Run this query (replace `YOUR_CLERK_USER_ID` with the actual ID):
   ```sql
   SELECT add_sample_doctor_reports('YOUR_CLERK_USER_ID');
   ```

2. **Verify the Setup**
   ```sql
   SELECT * FROM workers_data LIMIT 5;
   SELECT * FROM medical_reports LIMIT 3;
   SELECT * FROM doctor_dashboard_stats;
   ```

### 🧪 Test the Doctor Panel

1. **Sign in as the doctor user**
2. **Visit the doctor dashboard** (`/doctor/dashboard`)
3. **Try searching for a worker** using these test IDs:
   - `WH-12345-67890` (John Smith)
   - `WH-98765-43210` (Maria Garcia)
   - `WH-11111-22222` (David Johnson)

## 🔍 Common Error Messages and Solutions

### "Database table not found"
- **Cause**: The `workers_data` or `medical_reports` tables don't exist
- **Solution**: Run the complete setup SQL script above

### "No worker found with Health ID"
- **Cause**: The worker doesn't exist in the database
- **Solution**: Use one of the test worker IDs listed above, or add your own workers

### "doctor_dashboard_stats view not found"
- **Cause**: The database view hasn't been created
- **Solution**: Run the setup SQL script which creates this view

### Page keeps loading or crashes
- **Cause**: Missing Supabase connection or incorrect environment variables
- **Solution**: Check your `.env` file has correct Supabase credentials

## 🛠️ Manual Database Setup

If the automated script doesn't work, create tables manually:

### 1. Workers Data Table
```sql
CREATE TABLE workers_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    health_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
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
```

### 2. Medical Reports Table
```sql
CREATE TABLE medical_reports (
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
```

### 3. Add Test Worker
```sql
INSERT INTO workers_data (health_id, name, phone, birth_date, gender) 
VALUES ('WH-12345-67890', 'John Smith', '+1-555-0101', '1985-06-15', 'Male');
```

## 📊 Verification Queries

Run these to check if everything is working:

```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_name IN ('workers_data', 'medical_reports');

-- Check worker count
SELECT COUNT(*) as worker_count FROM workers_data;

-- Check if doctor dashboard view works
SELECT * FROM doctor_dashboard_stats LIMIT 1;

-- Check user roles (replace with your Clerk user ID)
SELECT * FROM medical_reports WHERE doctor_clerk_id = 'your_clerk_user_id';
```

## 🆘 Still Having Issues?

1. **Check Browser Console**
   - Press F12 to open developer tools
   - Look for error messages in the Console tab
   - Note any specific error codes or messages

2. **Check Network Tab**
   - In developer tools, go to Network tab
   - Try the search again
   - Look for failed API requests (red entries)

3. **Verify Environment Variables**
   - Check `.env` file has correct Supabase URL and anon key
   - Restart the development server after changing `.env`

4. **Database Permissions**
   - Ensure your Supabase project has proper authentication setup
   - Check if RLS (Row Level Security) is properly configured

## 🎯 Success Checklist

- [ ] Database tables created (`workers_data`, `medical_reports`)
- [ ] Sample data inserted
- [ ] Doctor user has `role: "doctor"` in Clerk metadata
- [ ] Sample reports linked to doctor's Clerk user ID
- [ ] Doctor dashboard loads without errors
- [ ] Can search for test workers (WH-12345-67890, etc.)
- [ ] Can view worker profiles and create reports

Once all steps are complete, the doctor panel should work perfectly!