# Crime Report App

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

<div align="center">
  <br />
    <h3 align="center">Anonymous Crime Reporting System</h3>
  <div align="center">
    A secure platform for anonymous incident reporting with real-time tracking and reward system
  </div>
</div>

## 📋 <a name="table">Table of Contents</a>

1. 🤖 [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🤸 [Quick Start](#quick-start)
5. 🛠️ [Environment Setup](#environment)
6. 🚀 [Deployment](#deployment)
7. 🐛 [Troubleshooting](#troubleshooting)
8. 📈 [Performance Optimizations](#performance)

## <a name="introduction">🤖 Introduction</a>

This is a state-of-the-art anonymous crime reporting system built with Next.js 14+, designed to provide a secure platform for reporting incidents while maintaining complete anonymity. The system includes features for both citizens to report crimes anonymously and law enforcement officials to manage and respond to these reports.

## <a name="tech-stack">⚙️ Tech Stack</a>

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (NeonDB)
- **Authentication**: NextAuth.js with email/password authentication
- **AI Integration**: GeminiAI for image and content analysis
- **Mapping**: Mapbox for location services
- **State Management**: React Hooks
- **Forms**: React Hook Form, Zod for validation
- **UI Components**: Lucide React Icons, React Toastify

## <a name="features">🔋 Features</a>

### Core Features
- **Anonymous Reporting**: Users can submit incident reports without revealing their identity
- **Email Verification**: Secure signup process with email verification using OTP
- **Role-based Access Control**: Admin dashboard for managing reports and user roles
- **AI-powered Analysis**: GeminiAI integration for analyzing report content and images
- **Location-based Reporting**: Mapbox integration for precise incident location
- **Report Tracking**: Unique tracking IDs for following up on submitted reports
- **Secure Authentication**: NextAuth.js with email/password authentication
- **Responsive Design**: Mobile-friendly interface for all devices

### Advanced Features
- **Reward System**: Points-based reward system for active reporters
- **Leaderboard**: Community engagement through ranking system
- **Real-time Status Updates**: Track report progress from submission to resolution
- **Image Analysis**: AI-powered image verification and categorization
- **Emergency Auto-call**: Automatic emergency services notification for critical reports
- **Admin Analytics**: Dashboard with statistics and insights

## <a name="quick-start">🤸 Quick Start</a>

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/en) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd crime-report-app

# Install dependencies
npm install

# Set up the database
npx prisma generate
npx prisma migrate dev

# Create admin user (optional)
node create-custom-admin.ts

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## <a name="environment">🛠️ Environment Setup</a>

Create a `.env` file in the root directory with the following variables:

```env
# Mapbox Configuration
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your-mapbox-access-token
NEXT_PUBLIC_MAPBOX_API_KEY=your-mapbox-api-key

# Database Configuration
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

# Authentication Configuration
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000/api/auth"

# AI Configuration
GEMINI_API_KEY=your-gemini-api-key

# Email Configuration
EMAIL_HOST=your-email-host
EMAIL_PORT=your-email-port
EMAIL_USER=your-email-user
EMAIL_PASS=your-email-password
EMAIL_FROM=noreply@yourdomain.com
```

## <a name="deployment">🚀 Deployment</a>

The application can be easily deployed on [Vercel](https://vercel.com):

1. Push your code to a Git repository
2. Connect your repository to Vercel
3. Configure the environment variables
4. Deploy!

Ensure your production database is properly configured and migrated before deployment.

## <a name="troubleshooting">🐛 Troubleshooting</a>

### Database Connection Issues

If you encounter database connection errors:

1. **Check Neon Database Status**: Log in to your Neon account and ensure the database is active
2. **Verify Connection String**: Double-check your `DATABASE_URL` in the `.env` file
3. **Local Development**: Consider using a local PostgreSQL instance for development

### Admin Panel Issues

If the admin panel status updating is not working:

1. **Check User Associations**: Ensure reports are properly associated with users via `userId`
2. **Verify Permissions**: Confirm the logged-in user has ADMIN role
3. **Clear Cache**: Try clearing browser cache and refreshing

### Performance Issues

If pages are loading slowly:

1. **Check Network**: Ensure stable internet connection
2. **Database Optimization**: Review query performance
3. **Caching**: The system implements caching for better performance

## <a name="performance">📈 Performance Optimizations</a>

### Recent Improvements

1. **Optimized Page Loading**:
   - Implemented client-side rendering for faster navigation
   - Added skeleton loading states for better perceived performance
   - Applied code splitting and dynamic imports for heavy components

2. **Database Query Optimization**:
   - Added timeout protection to prevent hanging requests
   - Implemented caching mechanism to reduce database queries
   - Optimized API response times with selective field fetching

3. **Error Handling**:
   - Enhanced error boundaries and fallback UIs
   - Improved timeout handling with graceful degradation
   - Added comprehensive logging for debugging

4. **Security Enhancements**:
   - Strengthened authentication checks
   - Implemented proper role-based access control
   - Added input validation and sanitization

### Monitoring

The system includes performance monitoring to track:
- Page load times
- API response times
- Database query performance

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) first.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.