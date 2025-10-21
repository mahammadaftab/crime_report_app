# Email Verification & Role-Based Access Control Features

## Overview

This document describes the implementation of email verification with OTP (One-Time Password) and role-based access control for the crime report application.

## Features Implemented

### 1. Email Verification Flow

1. **User Registration**
   - User fills out signup form with name, email, and password
   - System generates a 6-digit OTP code
   - System stores OTP with expiration time (10 minutes) in database
   - System sends OTP to user's email (except for admin users in development)
   - User is redirected to verification page

2. **Email Verification**
   - User enters OTP on verification page
   - System validates OTP and checks expiration
   - If valid, user's email is marked as verified
   - User can now sign in to the application

3. **OTP Resending**
   - User can request a new OTP if the original expires
   - System generates new OTP and updates database
   - New OTP is sent to user's email (except for admin users in development)

### 2. Role-Based Access Control

1. **User Roles**
   - **ADMIN**: Can access admin dashboard to manage all reports
   - **USER**: Regular users who can submit anonymous reports

2. **Authentication Flow**
   - User signs in with email and password
   - System checks if email is verified
   - If verified, system checks user role
   - ADMIN users are redirected to admin dashboard
   - Regular users are redirected to the homepage

3. **Route Protection**
   - Middleware ensures only authenticated users can access dashboards
   - Middleware ensures only ADMIN users can access admin dashboard
   - Regular users are redirected to homepage if they try to access admin routes

### 3. New Pages and Routes

1. **Authentication Pages**
   - `/auth/signup` - User registration with automatic redirect to verification
   - `/auth/signin` - Sign in with role-based redirection
   - `/auth/verify` - Email verification with OTP entry

2. **Dashboard Pages**
   - `/dashboard` - Admin dashboard (protected, ADMIN role only)
   - Homepage (`/`) - Public page for all users

3. **API Routes**
   - `POST /api/auth/signup` - User registration with OTP generation
   - `POST /api/auth/verify` - Email verification
   - `POST /api/auth/resend-otp` - OTP resending
   - `POST /api/auth/user-role` - Get user role for redirection

### 4. Database Changes

Added new fields to the User model:
- `emailVerified` (Boolean) - Tracks if user has verified their email
- `verificationOTP` (String) - Stores the current OTP code
- `otpExpiresAt` (DateTime) - Stores the expiration time of the OTP
- `createdAt` (DateTime) - User creation timestamp
- `updatedAt` (DateTime) - User last update timestamp

## Implementation Details

### Email Service

The email service is now implemented with Nodemailer to send real emails. To configure it:

1. Update the `.env` file with your email service credentials:
   ```env
   # Email Configuration (Gmail Example)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=your-email@gmail.com
   ```

2. For Gmail, you'll need to:
   - Enable 2-factor authentication on your Google account
   - Generate an App Password specifically for this application
   - Use the App Password instead of your regular Gmail password

3. For other email providers, update the configuration accordingly:
   - **Outlook/Hotmail**: 
     ```
     EMAIL_HOST=smtp-mail.outlook.com
     EMAIL_PORT=587
     ```
   - **Yahoo**: 
     ```
     EMAIL_HOST=smtp.mail.yahoo.com
     EMAIL_PORT=587
     ```

### Special Configuration for Admin Users

For development and testing purposes, admin users have a special configuration:

1. **Default OTP**: Admin users are automatically assigned OTP `111111`
2. **No Email Sending**: Admin verification emails are not sent to reduce email traffic during testing
3. **Clear Hint**: The verification page shows a clear hint for admin users about the default OTP

This makes it easier to test admin functionality without needing to check email accounts.

### Security Considerations

1. OTP codes are randomly generated and expire after 10 minutes
2. Passwords are hashed using bcrypt with 12 rounds
3. Email verification is required before sign in
4. Role-based access control prevents unauthorized access to admin features
5. Session management uses JWT tokens with NextAuth.js

## Testing the Features

1. **User Registration Flow**
   - Visit `/auth/signup`
   - Fill out the registration form
   - Check your email for the OTP code (regular users only)
   - Visit `/auth/verify?email=your-email`
   - Enter OTP code (use 111111 for admin users)
   - Sign in at `/auth/signin`

2. **Admin Access**
   - Register as a user with ADMIN role
   - Verify email using OTP 111111
   - Sign in and you should be redirected to `/dashboard`

3. **Regular User Access**
   - Register as a regular user
   - Check email for OTP code
   - Verify email and sign in
   - You should be redirected to the homepage (`/`)

## Troubleshooting

### Emails Not Received

1. **Check Spam/Junk Folder**: OTP emails might be filtered as spam
2. **Verify Configuration**: Ensure all email environment variables are correctly set
3. **Check App Password**: For Gmail, ensure you're using an App Password, not your regular password
4. **Firewall/Network Issues**: Some networks block SMTP connections
5. **Server Logs**: Check the console output for any email sending errors

### OTP Expired

1. Use the "Resend OTP" link on the verification page
2. Check for a new email with a fresh OTP code
3. New codes are valid for 10 minutes

## Future Enhancements

1. Add rate limiting for OTP requests
2. Implement account lockout after failed verification attempts
3. Add password reset functionality
4. Implement two-factor authentication (2FA)