# Indian Dummy Data Setup Guide

This guide helps you set up comprehensive Indian dummy data for the WorkerHelper doctor panel with realistic names, addresses, and medical reports.

## 🇮🇳 What's Included

### **12 Indian Workers** with complete profiles:
- **Rajesh Kumar Sharma** (Delhi) - Factory Worker with back pain issues
- **Priya Devi Singh** (Mumbai) - Office Assistant with computer vision syndrome
- **Suresh Babu Reddy** (Bangalore) - Security Guard with hypertension
- **Lakshmi Menon** (Chennai) - Nurse with pre-employment medicals
- **Venkatesh Rao** (Hyderabad) - Driver with fitness certificates
- **Anjali Ghosh** (Kolkata) - Teacher with respiratory infections
- **Amit Patil** (Pune) - Engineer with occupational health checks
- **Kavya Patel** (Ahmedabad) - Accountant with diabetes screening
- **Rohit Agarwal** (Jaipur) - Salesperson with skin allergies
- **Neha Gupta** (Lucknow) - Receptionist with maternity care
- **Karthik Nair** (Goa) - Chef with food handler certificates
- **Sunita Devi** (Bhubaneswar) - Cleaner with joint pain

### **18+ Medical Reports** including:
- Annual health checkups
- Workplace injury assessments
- Emergency visits
- Specialist consultations
- Follow-up appointments
- Occupational health checks
- Pre-employment medicals
- Vaccination records

## 🚀 Setup Instructions

### Step 1: Run the SQL Script

1. **Go to Supabase Dashboard** → SQL Editor
2. **Copy the entire content** from `sql/indian_dummy_data.sql`
3. **Paste and run** the script
4. **Wait for completion** - you should see success messages

### Step 2: Link to Your Doctor Accounts

1. **Get Doctor Clerk IDs** from your Clerk Dashboard:
   - Go to Users section
   - Find users with doctor role
   - Copy their Clerk user IDs (like `user_2a3b4c5d...`)

2. **Link the reports** by running these commands (replace with actual IDs):

```sql
-- Replace with your actual doctor Clerk user IDs
SELECT update_reports_with_doctor_id('user_2a3b4c5d123', 'DOCTOR_CLERK_ID_1');
SELECT update_reports_with_doctor_id('user_2e4f6g7h456', 'DOCTOR_CLERK_ID_2');
SELECT update_reports_with_doctor_id('user_2i5j8k9l789', 'DOCTOR_CLERK_ID_3');
```

### Step 3: Verify the Setup

Run these queries to check everything worked:

```sql
-- Check workers were created
SELECT COUNT(*) as total_workers FROM workers_data WHERE health_id LIKE 'WH-%2024';

-- Check reports were created
SELECT COUNT(*) as total_reports FROM medical_reports WHERE report_id LIKE 'RPT-2024%';

-- View sample data
SELECT health_id, 
       COALESCE(full_name, name) as worker_name, 
       occupation, gender 
FROM workers_data 
WHERE health_id LIKE 'WH-%2024' 
LIMIT 5;
```

## 🧪 Test Workers You Can Search For

After setup, you can search for these workers in the doctor dashboard:

### **Ready to Search:**
- `WH-DEL01-2024` - Rajesh Kumar Sharma (2 reports)
- `WH-MUM02-2024` - Priya Devi Singh (2 reports)  
- `WH-BLR03-2024` - Suresh Babu Reddy (2 reports)
- `WH-CHN04-2024` - Lakshmi Menon (2 reports)
- `WH-HYD05-2024` - Venkatesh Rao (2 reports)
- `WH-KOL06-2024` - Anjali Ghosh (2 reports)
- `WH-PUN07-2024` - Amit Patil (1 report)
- `WH-AHM08-2024` - Kavya Patel (1 report)
- `WH-JAI09-2024` - Rohit Agarwal (1 report)
- `WH-LKN10-2024` - Neha Gupta (1 report)
- `WH-COI11-2024` - Karthik Nair (1 report)
- `WH-BHU12-2024` - Sunita Devi (1 report)

## 📊 What You'll See

### **Worker Profiles Include:**
- Complete Indian names and addresses
- Indian phone numbers (+91 format)
- Realistic occupations and health data
- Blood types, allergies, emergency contacts
- Age, gender, and other demographics

### **Medical Reports Include:**
- Professional medical terminology
- Realistic diagnoses and treatments
- Follow-up requirements and scheduling
- Different report types (checkups, emergencies, consultations)
- Proper medical documentation

### **Dashboard Statistics Will Show:**
- Total reports per doctor
- Number of unique workers treated
- Recent reports and activity
- Follow-up requirements

## 🔧 Customization Options

### Add More Workers:
```sql
INSERT INTO workers_data (health_id, full_name, phone, birth_date, gender, address, occupation) 
VALUES ('WH-NEW01-2024', 'Your Name Here', '+91-9876543999', '1990-01-01', 'Male', 'Your Address', 'Your Occupation');
```

### Add More Reports:
```sql
INSERT INTO medical_reports (
    report_id, worker_health_id, doctor_clerk_id, report_title, report_type,
    report_description, diagnosis, treatment, notes
) VALUES (
    'RPT-20240315-999', 'WH-NEW01-2024', 'your_clerk_id', 
    'Custom Report Title', 'General Examination',
    'Your custom report description', 'Your diagnosis', 'Your treatment', 'Your notes'
);
```

## ✅ Success Checklist

After running the setup script, you should have:

- [ ] 12 Indian workers with realistic profiles
- [ ] 18+ medical reports with authentic medical content
- [ ] Workers from major Indian cities (Delhi, Mumbai, Bangalore, etc.)
- [ ] Various occupations and medical conditions
- [ ] Multiple reports per worker showing medical history
- [ ] Follow-up appointments and scheduling
- [ ] Proper Indian names, addresses, and phone numbers

## 🎯 Testing Your Doctor Panel

1. **Sign in** as a doctor user
2. **Go to** `/doctor/dashboard`
3. **Search for** any worker ID (e.g., `WH-DEL01-2024`)
4. **View** complete worker profile with medical history
5. **Create** new medical reports
6. **Check** dashboard statistics update
7. **Test** follow-up scheduling and tracking

## 🔄 Reset Data (if needed)

To clear all dummy data and start fresh:

```sql
-- Remove dummy data
DELETE FROM medical_reports WHERE report_id LIKE 'RPT-2024%';
DELETE FROM workers_data WHERE health_id LIKE 'WH-%2024';
```

This gives you a complete, realistic testing environment with authentic Indian data! 🇮🇳