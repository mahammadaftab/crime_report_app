# Email Verification System Documentation

## How Email Verification Works

### For Regular Users (USER role):
1. User signs up with email, name, and password
2. System generates a random 6-digit OTP (One-Time Password)
3. System stores the OTP and expiration time (10 minutes) in the database
4. System sends the OTP to the user's email address
5. User receives the email and enters the OTP on the verification page
6. System validates the OTP and marks the user as verified
7. User can now sign in to their account

### For Admin Users (ADMIN role):
1. Admin signs up with email, name, and password
2. System assigns a default OTP of "111111" for testing purposes
3. System stores the OTP and expiration time (10 minutes) in the database
4. Admin uses "111111" to verify their account (no email sent)
5. System validates the OTP and marks the admin as verified
6. Admin can now sign in to their account

## Key Components

### 1. Email Utility (`lib/email.ts`)
- Handles sending OTP emails using Nodemailer
- Configured to work with Gmail SMTP
- Provides detailed error logging

### 2. Signup API Route (`app/api/auth/signup/route.ts`)
- Creates user accounts
- Generates and stores OTPs
- Sends emails to regular users (skips for admins)

### 3. Resend OTP API Route (`app/api/auth/resend-otp/route.ts`)
- Generates new OTPs for unverified users
- Sends emails to regular users (skips for admins)

### 4. Verification API Route (`app/api/auth/verify/route.ts`)
- Validates OTPs entered by users
- Marks users as verified when OTP is correct

### 5. Frontend Pages
- Signup page: Collects user information
- Verification page: Collects OTP from users
- Login page: Allows verified users to sign in

## Environment Variables Required

```env
# Email Configuration (Gmail Example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
```

## Troubleshooting Email Issues

### Common Issues:
1. **Authentication Failed**: Gmail requires App Passwords when 2FA is enabled
2. **Emails Not Received**: Check spam folder, verify email address
3. **Connection Timeout**: Check firewall settings, network connectivity

### Solutions:
1. Set up Gmail App Password (see EMAIL_SETUP_GUIDE.md)
2. Verify environment variables are correct
3. Test email functionality using the test page at `/test-email`

## Testing the System

### Manual Testing:
1. Visit `/auth/user/signup`
2. Create a new user account
3. Check email for OTP (or use 111111 for admin)
4. Visit `/auth/user/verify`
5. Enter OTP to verify account
6. Visit `/auth/user/login` to sign in

### Automated Testing:
1. Visit `/test-email` to test email functionality
2. Use the API endpoints directly with tools like Postman

## Security Considerations

1. OTPs expire after 10 minutes
2. OTPs are single-use (cleared after successful verification)
3. Passwords are hashed using bcrypt
4. Email addresses are validated before sending
5. Rate limiting should be implemented for production use

## Future Improvements

1. Add rate limiting to prevent abuse
2. Implement email templates for better user experience
3. Add support for multiple email providers
4. Implement SMS verification as an alternative
5. Add analytics for email delivery tracking