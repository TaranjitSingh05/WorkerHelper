# OTP-Based Authentication System Setup Guide

## Overview
Complete OTP-based authentication system replacing email confirmation links with 6-digit verification codes for both signup and signin processes.

## Features Implemented

### ✅ Signup Flow
1. **User Registration**: Email, password, full name, and phone number
2. **Account Creation**: Creates Supabase Auth user with metadata
3. **OTP Generation**: Automatically sends 6-digit code to email
4. **Verification Screen**: Modern UI with 6 input boxes
5. **Profile Creation**: Links user to workers_data table on verification

### ✅ Signin Flow
**Method 1: Email + OTP**
- User enters email address
- System sends OTP to email
- User verifies with 6-digit code

**Method 2: Worker ID + Phone**
- User enters Worker Health ID and phone number
- System validates credentials in workers_data table
- Sends OTP to the email associated with that worker
- User verifies with 6-digit code

### ✅ OTP Verification
- **6-digit input boxes** with auto-focus and keyboard navigation
- **Auto-submission** when all 6 digits are entered
- **Paste support** for codes copied from email
- **5-minute expiration** with countdown timer
- **Resend functionality** after expiration
- **Error handling** for invalid/expired codes

## Prerequisites

1. **Supabase Project**: Active Supabase project with Auth enabled
2. **Database Setup**: Run `workers_data_setup.sql` and `auth_integration_setup.sql`
3. **Environment Variables**: Properly configured in `.env` file

## Step 1: Database Setup

### Run the OTP Authentication SQL
1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `otp_auth_setup.sql`
4. Click **Run** to execute

### What the script does:
- ✅ Ensures `user_id` and `phone_number` columns exist
- ✅ Creates indexes for performance
- ✅ Sets up RLS policies for security
- ✅ Creates OTP-specific database functions
- ✅ Adds auto-generation of health IDs

## Step 2: Configure Supabase Auth for OTP

### Enable OTP in Supabase
1. Go to **Authentication > Settings** in your Supabase Dashboard
2. Under **Auth Providers**, ensure **Email** is enabled
3. Configure **Email Templates** (optional but recommended):
   - Go to **Authentication > Templates**
   - Customize the **Magic Link** template (used for OTP emails)

### Email Template Example:
```html
<h2>Your JeevanID Verification Code</h2>
<p>Your verification code is:</p>
<h1 style="font-size: 32px; color: #2563eb; letter-spacing: 4px;">{{ .Token }}</h1>
<p>This code expires in 5 minutes.</p>
<p>If you didn't request this code, please ignore this email.</p>
```

### Auth Settings:
- **Site URL**: `http://localhost:4028` (development)
- **Additional Redirect URLs**: Add production URLs when ready
- **JWT Expiry**: 3600 seconds (default)
- **Refresh Token Rotation**: Enabled (recommended)

## Step 3: Test the OTP Authentication Flow

### Test Scenario 1: New User Signup
```bash
# Test Flow:
1. Navigate to http://localhost:4028/auth
2. Click "Sign Up" tab
3. Fill in form:
   - Full Name: Test User
   - Email: test@example.com  
   - Password: testpass123
   - Confirm Password: testpass123
   - Phone Number: 1234567890
4. Click "Create Account & Send Code"
5. Check email for 6-digit code
6. Enter code in OTP screen
7. Should redirect to dashboard
```

### Test Scenario 2: Email + OTP Signin
```bash
# Test Flow:
1. Navigate to http://localhost:4028/auth
2. Select "Email & Password" option
3. Enter email: test@example.com
4. Click "Send Code"
5. Check email for 6-digit code
6. Enter code in OTP screen
7. Should redirect to dashboard
```

### Test Scenario 3: Worker ID + Phone Signin
```bash
# Prerequisites: User must have completed health record
# Test Flow:
1. Navigate to http://localhost:4028/auth
2. Select "Worker ID & Phone" option
3. Enter Worker ID: WH-ABC123-XYZ789
4. Enter Phone: 1234567890
5. Click "Continue"
6. System validates and sends OTP to linked email
7. Enter 6-digit code from email
8. Should redirect to dashboard
```

## Step 4: OTP Verification Features

### User Interface Features:
- **6 Individual Input Boxes**: Clean, modern design
- **Auto-Focus Navigation**: Automatic focus movement between inputs
- **Keyboard Navigation**: Arrow keys and backspace support
- **Paste Support**: Can paste 6-digit code directly
- **Auto-Submission**: Submits automatically when all 6 digits entered
- **Visual Feedback**: Highlighting and color changes

### Technical Features:
- **5-minute expiration** with live countdown timer
- **Resend functionality** after expiration
- **Input validation** (digits only)
- **Error handling** with user-friendly messages
- **Loading states** during verification
- **Back navigation** to return to auth forms

### Error Messages:
- ✅ "Invalid verification code. Please try again."
- ✅ "Verification code has expired. Please request a new one."
- ✅ "Please enter all 6 digits"
- ✅ "Failed to resend code. Please try again."

## Step 5: Security Features

### OTP Security:
- **Single-use codes**: Each OTP can only be used once
- **Time-limited**: Codes expire after 5 minutes
- **Secure generation**: Uses Supabase's secure OTP system
- **Rate limiting**: Built-in Supabase rate limiting

### Database Security:
- **Row Level Security (RLS)**: Users can only access their own data
- **Encrypted storage**: All data encrypted at rest
- **Foreign key constraints**: Proper data relationships
- **Indexed queries**: Optimized database performance

### Authentication Security:
- **JWT tokens**: Secure session management
- **Refresh tokens**: Automatic token renewal
- **HTTPS required**: Secure data transmission (production)
- **CSRF protection**: Built-in Supabase protection

## Step 6: User Experience Flow

### Complete User Journey:
```
Anonymous User → Sign Up Form → OTP Verification → Dashboard
       ↓
   Sign In Options:
   1. Email → OTP → Dashboard
   2. Worker ID + Phone → OTP → Dashboard
       ↓
   Authenticated User → Full Dashboard Access
```

### Dashboard Integration:
- **Seamless transition** from OTP verification to dashboard
- **Session persistence** - users stay logged in
- **Auto-redirect** to intended page after login
- **Error recovery** with clear next steps

## Step 7: Development vs Production

### Development Configuration:
```javascript
// In development, Supabase sends emails via their SMTP
// OTP codes appear in email within 30 seconds
// No additional configuration needed
```

### Production Configuration:
```javascript
// For production, configure custom SMTP:
// 1. Go to Supabase Dashboard > Settings > Auth
// 2. Configure SMTP settings with your email provider
// 3. Customize email templates for branding
// 4. Set proper redirect URLs
// 5. Enable rate limiting and security policies
```

### Environment Variables:
```bash
# Required in .env file:
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional for custom SMTP (production):
SUPABASE_SMTP_HOST=smtp.your-provider.com
SUPABASE_SMTP_PORT=587
SUPABASE_SMTP_USER=your-email@domain.com
SUPABASE_SMTP_PASS=your-password
```

## Step 8: Troubleshooting

### Common Issues:

#### "No OTP received"
- **Check spam/junk folder**
- **Verify email address is correct**
- **Wait 2-3 minutes for delivery**
- **Try resend function**
- **Check Supabase Auth logs**

#### "Invalid verification code"
- **Ensure all 6 digits are entered**
- **Check code hasn't expired (5 minutes)**
- **Try copying code directly from email**
- **Request new code if expired**

#### "User not found" (Worker ID login)
- **Verify Worker ID format**: WH-XXXXX-XXXXX
- **Check phone number matches record**
- **Ensure worker record is linked to auth user**
- **Verify database RLS policies**

#### "Table does not exist" errors
- **Run `otp_auth_setup.sql` script**
- **Check SQL execution results**
- **Verify database permissions**
- **Confirm Supabase project is active**

### Debug Queries:
```sql
-- Check user creation
SELECT id, email, created_at, email_confirmed_at FROM auth.users WHERE email = 'test@example.com';

-- Check worker data linking
SELECT health_id, full_name, phone_number, user_id FROM workers_data WHERE phone_number = '1234567890';

-- Test OTP function
SELECT * FROM validate_worker_credentials_otp('WH-ABC123-XYZ789', '1234567890');

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'workers_data';
```

## Step 9: Features Summary

### ✅ Implemented Features:
1. **Complete OTP Authentication System**
   - Email-based OTP for signup and signin
   - Worker ID + Phone validation with OTP
   - 6-digit code verification with modern UI

2. **Advanced OTP Verification**
   - Auto-focus input navigation
   - Paste support for convenience
   - Real-time countdown timer
   - Resend functionality
   - Comprehensive error handling

3. **Secure Database Integration**
   - User-specific data access with RLS
   - Proper foreign key relationships
   - Optimized queries with indexes
   - Auto-generation of worker profiles

4. **Seamless User Experience**
   - Smooth flow from OTP to dashboard
   - Session persistence
   - Mobile-responsive design
   - Clear error messages and guidance

### 🔄 User Flows:
```
Signup: Form → OTP → Dashboard
Email Login: Email → OTP → Dashboard  
Worker Login: ID + Phone → OTP → Dashboard
```

## Step 10: Next Steps

### For Production:
1. **Configure custom SMTP** for branded emails
2. **Customize email templates** with company branding
3. **Set up monitoring** for OTP delivery rates
4. **Configure rate limiting** for security
5. **Set proper redirect URLs** for production domain

### For Enhancement:
1. **SMS OTP option** (requires Twilio integration)
2. **Backup codes** for account recovery
3. **2FA settings** in user dashboard
4. **OTP delivery preferences** (email vs SMS)

The OTP authentication system is now fully implemented and ready for use! 🚀