# Deployment Guide

This document provides instructions for deploying the Crime Report App to various platforms, with a focus on Vercel.

## Vercel Deployment

### Prerequisites

1. A Vercel account
2. A GitHub/GitLab/Bitbucket account connected to Vercel
3. Environment variables properly configured

### Environment Variables

Ensure the following environment variables are set in your Vercel project:

```bash
# Database Configuration
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

# Authentication Configuration
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://your-domain.com/api/auth"

# Mapbox Configuration
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN="your-mapbox-access-token"

# AI Configuration
GEMINI_API_KEY="your-gemini-api-key"

# Email Configuration
EMAIL_HOST="your-email-host"
EMAIL_PORT="your-email-port"
EMAIL_USER="your-email-user"
EMAIL_PASS="your-email-password"
EMAIL_FROM="noreply@yourdomain.com"
```

### Deployment Steps

1. **Push to Repository**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your Git repository
   - Configure the project settings:
     - Framework Preset: Next.js
     - Root Directory: Leave as is
     - Build Command: `npm run build`
     - Output Directory: `.next`

3. **Configure Environment Variables**
   - In Vercel project settings, go to "Environment Variables"
   - Add all required environment variables listed above

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete

### Common Issues and Solutions

#### 1. Prisma Client Generation Issues
If you encounter Prisma client generation errors:
- Ensure `DATABASE_URL` is correctly set in Vercel environment variables
- Check that the database is accessible from Vercel's servers
- Verify database credentials are correct

#### 2. Nodemailer Issues
If you see nodemailer-related errors:
- The configuration in `next.config.ts` should handle this automatically
- Ensure `nodemailer` is listed in `serverExternalPackages`

#### 3. Build Timeout Issues
If builds are timing out:
- Check for large dependencies or assets
- Optimize images and other media
- Consider using Vercel's image optimization

#### 4. Database Connection Issues
If the app can't connect to the database:
- Verify the `DATABASE_URL` format
- Ensure the database accepts connections from Vercel IPs
- Check if any firewall rules are blocking connections

### Post-Deployment Checklist

1. **Verify Health Endpoint**
   Visit `https://your-domain.com/api/health` to ensure the API is responding

2. **Test Key Pages**
   - Homepage
   - Report submission form
   - Authentication flows
   - Admin dashboard (if applicable)

3. **Check Environment Variables**
   Ensure all required environment variables are properly set

4. **Database Connection**
   Verify the app can connect to and query the database

5. **Email Functionality**
   Test email sending if applicable

## Other Deployment Platforms

### Docker (Coming Soon)
Instructions for containerized deployment will be added soon.

### Traditional Hosting
For traditional hosting providers:
1. Build the project locally: `npm run build`
2. Upload the `.next` directory and `public` folder
3. Install dependencies: `npm install --production`
4. Start the server: `npm start`

## Troubleshooting

### Build Failures
If builds consistently fail:
1. Check Vercel logs for specific error messages
2. Ensure all dependencies are correctly listed in `package.json`
3. Verify Node.js version compatibility (should be 18.x or higher)

### Runtime Errors
If the app deploys but doesn't work correctly:
1. Check browser console for JavaScript errors
2. Check Vercel function logs for server-side errors
3. Verify all environment variables are correctly set

### Performance Issues
If the app is slow:
1. Check for unoptimized images
2. Verify database query performance
3. Consider implementing caching strategies