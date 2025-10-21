# Email Setup Guide for Gmail

## Issue
The application is unable to send emails because Gmail is rejecting the authentication. This is a common security feature of Gmail.

## Solution: Set up Gmail App Password

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings: https://myaccount.google.com/
2. Click on "Security" in the left sidebar
3. Under "Signing in to Google", click on "2-Step Verification"
4. Follow the prompts to set up 2-factor authentication

### Step 2: Generate an App Password
1. Stay in the "Security" section of your Google Account
2. Scroll down to "2-Step Verification" and click on it
3. Scroll down to "App passwords" (you may need to enter your password again)
4. Select "Mail" as the app and "Other (Custom name)" as the device
5. Give it a name like "Crime Report App"
6. Click "Generate"
7. Copy the 16-character password that is generated

### Step 3: Update Your Environment Variables
1. Open your `.env` file in the project root
2. Replace the `EMAIL_PASS` value with the App Password you just generated
3. The App Password should be entered exactly as shown (with spaces if present)

Example:
```env
# Email Configuration (Gmail Example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=mdaftabetitz360@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx  # Your 16-character App Password
EMAIL_FROM=aftabmd74336@gmail.com
```

### Step 4: Restart Your Development Server
1. Stop your current development server (Ctrl+C)
2. Run `npm run dev` again

## Alternative: Use a Different Email Provider

If you continue to have issues with Gmail, you can use a different email provider like SendGrid, Mailgun, or Outlook.

### Example with Outlook:
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
EMAIL_FROM=your-email@outlook.com
```

## Testing Email Functionality

After updating your configuration:
1. Visit http://localhost:3001/test-email
2. Enter your email address
3. Click "Send Test Email"
4. Check your inbox (and spam folder) for the test email

## Troubleshooting

If you're still not receiving emails:
1. Check your spam/junk folder
2. Verify that your App Password is correct
3. Ensure that your Gmail account allows less secure apps (if using regular password)
4. Check the server console for detailed error messages