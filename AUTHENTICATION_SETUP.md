# JeevanID Authentication System Setup Guide

## Overview
Complete authentication system with Supabase Auth integration, supporting both email/password and Worker ID/phone number authentication methods.

## Prerequisites
1. Run `workers_data_setup.sql` first to create the basic workers_data table
2. Have Supabase project configured with environment variables

## Step 1: Database Setup

### Run the Authentication Integration SQL
1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `auth_integration_setup.sql`
4. Click **Run** to execute

### What this script does:
- ✅ Adds `user_id` column to link workers_data with Supabase Auth users
- ✅ Creates performance indexes
- ✅ Enables Row Level Security (RLS)
- ✅ Sets up RLS policies for authenticated users
- ✅ Creates helper functions for Worker ID/phone validation
- ✅ Creates a view for dashboard data

## Step 2: Configure Supabase Auth Settings

### Email Templates (Optional but Recommended)
1. Go to **Authentication > Templates** in Supabase Dashboard
2. Customize the email templates:
   - **Confirm signup**: Welcome email with verification link
   - **Reset password**: Password reset instructions

### Auth Providers
- **Email/Password**: Already enabled by default
- **Additional providers**: Can be enabled if needed (Google, Facebook, etc.)

### Security Settings
1. Go to **Authentication > Settings**
2. Configure:
   - **Site URL**: `http://localhost:4028` (development) or your domain
   - **Additional Redirect URLs**: Add any other URLs you need

## Step 3: Test the Authentication System

### 1. Sign Up Flow
```
User Journey:
1. Click "Sign In / Sign Up" in header
2. Go to "Sign Up" tab
3. Fill in: Full Name, Email, Password, Confirm Password
4. Optionally add Worker ID and Phone for linking existing record
5. Submit form
6. Check email for verification link
7. Click verification link
8. Return to app and sign in
```

### 2. Sign In Flow - Email/Password
```
User Journey:
1. Click "Sign In / Sign Up" in header
2. Select "Email & Password" option
3. Enter email and password
4. Click "Sign In"
5. Redirected to dashboard
```

### 3. Sign In Flow - Worker ID/Phone (Limited)
```
User Journey:
1. Click "Sign In / Sign Up" in header  
2. Select "Worker ID & Phone" option
3. Enter Worker Health ID and phone number
4. System validates credentials but shows email for password login
5. User must use email/password method
```

### 4. Dashboard Access
```
After successful login:
1. User sees personalized header with name/Worker ID
2. Dashboard button appears in navigation
3. Click Dashboard to view comprehensive worker info
4. All personal data is displayed with QR code
5. Quick action buttons for updating info, finding centers, etc.
```

## Step 4: Authentication Features

### Sign Up Features:
- ✅ Email/password account creation
- ✅ Email verification requirement
- ✅ Optional linking with existing Worker ID/phone
- ✅ Full name collection in user metadata
- ✅ Validation and error handling

### Sign In Features:
- ✅ Email/password authentication
- ✅ Worker ID/phone validation (redirects to email login)
- ✅ Session persistence
- ✅ Automatic redirect after login

### Dashboard Features:
- ✅ Complete worker information display
- ✅ QR code with download/share functionality
- ✅ Personal, work, and health information sections
- ✅ Quick action buttons
- ✅ Security information panel
- ✅ Responsive iPhone-style design

### Security Features:
- ✅ Row Level Security (RLS) on workers_data table
- ✅ Users can only access their own records
- ✅ QR codes remain publicly accessible for scanning
- ✅ Secure password requirements
- ✅ Email verification required

## Step 5: User Flows

### New User (No Health Record):
```
1. Sign Up → Email Verification → Sign In → Dashboard
2. Dashboard shows "No Health Record Found"
3. Options to "Create Health Record" or "Link Existing Record"
4. After creating record, full dashboard displays
```

### New User (Has Health Record):
```
1. Sign Up with Worker ID/Phone → Email Verification → Sign In
2. Dashboard shows option to link existing record
3. After linking, full dashboard displays with all data
```

### Existing User:
```
1. Sign In → Dashboard with full worker data
2. Can update information, view QR code, access quick actions
3. Information pre-fills when updating health record
```

### Anonymous User (QR Code Scan):
```
1. QR code scanned → Worker details page
2. Shows limited public information only
3. Option to create account or sign in
```

## Step 6: Testing Scenarios

### Test Account Creation:
```bash
# Test data for signup
Email: test@example.com
Password: testpass123
Full Name: Test Worker
```

### Test Worker Record:
```bash
# Create via /personal-health-record
Full Name: Test Worker
Phone: 1234567890
Worker ID: WH-ABC123-XYZ789 (auto-generated)
```

### Test Linking:
```bash
# After signup, link account with:
Worker ID: WH-ABC123-XYZ789
Phone: 1234567890
```

## Step 7: Troubleshooting

### Common Issues:

#### "Email not confirmed"
- **Problem**: User tries to sign in before confirming email
- **Solution**: Check email inbox and click verification link

#### "Invalid Worker ID or Phone Number" 
- **Problem**: Worker credentials don't match database
- **Solution**: Verify record exists and credentials are correct

#### "Table 'workers_data' does not exist"
- **Problem**: Database setup incomplete
- **Solution**: Run `workers_data_setup.sql` then `auth_integration_setup.sql`

#### "Permission denied"
- **Problem**: RLS policies not working correctly
- **Solution**: Check policy creation in SQL execution results

#### User can't see their data
- **Problem**: `user_id` not properly linked
- **Solution**: Use link account function or check database linking

### Debug Commands:

```sql
-- Check if user exists in auth.users
SELECT id, email, created_at FROM auth.users WHERE email = 'test@example.com';

-- Check worker record linking
SELECT health_id, full_name, user_id FROM workers_data WHERE health_id = 'WH-ABC123-XYZ789';

-- Test validation function
SELECT * FROM validate_worker_credentials('WH-ABC123-XYZ789', '1234567890');

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'workers_data';
```

## Step 8: Production Considerations

### Security:
- ✅ RLS policies properly configured
- ✅ Email verification enforced
- ✅ Strong password requirements
- ✅ Secure session management

### Performance:
- ✅ Database indexes for user lookups
- ✅ Efficient queries for dashboard data
- ✅ Minimal auth state management

### Scalability:
- ✅ Supabase Auth handles user management
- ✅ Database constraints prevent data integrity issues
- ✅ Proper foreign key relationships

## Features Summary

### ✅ Implemented Features:
1. **Complete Authentication System**
   - Email/password signup with verification
   - Worker ID/phone validation
   - Session management and persistence

2. **Comprehensive Dashboard**
   - Personal information display
   - Work and health information
   - Interactive QR code with download/share
   - Quick action buttons

3. **Navigation Integration**
   - Authentication buttons in header
   - User info display when logged in
   - Context-aware navigation

4. **Database Security**
   - Row Level Security implementation
   - User-specific data access
   - Public QR code accessibility

5. **Mobile-Optimized Design**
   - Responsive layouts
   - Touch-friendly interface
   - iPhone-style modern design

### 🔄 User Experience Flow:
```
Anonymous → Sign Up → Email Verify → Sign In → Dashboard
    ↓
QR Scan → Limited Info → Option to Sign Up/In
    ↓
Authenticated → Full Dashboard → Update Info → Logout
```

The authentication system is now complete and ready for production use!