# Chapter 3: System Requirement Specification

## 3.1 Functional Requirements

The functional requirements define the specific behaviors and capabilities of the Accident and Crime Report App. These requirements outline what the system must do to fulfill its intended purpose of providing a secure, anonymous platform for incident reporting.

### 3.1.1 User Registration and Authentication

1. **User Registration**
   - The system shall allow users to register by providing their name, email address, and password.
   - The system shall generate a unique 6-digit OTP (One-Time Password) upon registration.
   - The system shall send the OTP to the user's registered email address.
   - The system shall store the OTP with an expiration time of 10 minutes.
   - The system shall redirect users to the verification page after registration.

2. **Email Verification**
   - The system shall allow users to enter the OTP on the verification page.
   - The system shall validate the OTP and check its expiration.
   - The system shall mark the user's email as verified if the OTP is valid and not expired.
   - The system shall allow verified users to sign in to the application.

3. **OTP Resending**
   - The system shall allow users to request a new OTP if the original expires.
   - The system shall generate a new OTP and update it in the database.
   - The system shall send the new OTP to the user's email address.

4. **User Login/Logout**
   - The system shall authenticate users using their email and password.
   - The system shall check if the user's email is verified before allowing access.
   - The system shall redirect users based on their role (ADMIN or USER).
   - The system shall provide a secure logout mechanism.

### 3.1.2 Incident Reporting

1. **Anonymous Reporting**
   - The system shall allow users to submit incident reports without revealing their identity.
   - The system shall support various incident types including theft, fire outbreaks, medical emergencies, natural disasters, violence, and other criminal activities.
   - The system shall allow users to provide detailed text descriptions of incidents.
   - The system shall allow users to upload photographic evidence of incidents.
   - The system shall allow users to specify precise location information for incidents.

2. **Reporter Details (Optional)**
   - The system shall allow users to optionally provide their name and phone number for follow-up purposes.
   - The system shall maintain the anonymity of the incident report even when reporter details are provided.

3. **Report Classification**
   - The system shall allow users to classify incidents as emergency or non-emergency.
   - The system shall route emergency reports to appropriate response channels.

### 3.1.3 AI-Powered Analysis

1. **Image Analysis**
   - The system shall integrate with Google's Gemini AI for image analysis.
   - The system shall automatically categorize incident images.
   - The system shall extract contextual information from submitted images.
   - The system shall identify emergency situations through AI analysis.

2. **Content Analysis**
   - The system shall analyze report content to extract key information.
   - The system shall categorize reports based on content analysis.

### 3.1.4 Location Services

1. **Map Integration**
   - The system shall integrate with Mapbox for location services.
   - The system shall allow users to specify incident locations through map interaction.
   - The system shall provide precise geographic coordinates for reported incidents.

### 3.1.5 Report Management

1. **Report Tracking**
   - The system shall generate unique tracking IDs for each submitted report.
   - The system shall allow users to track the status of their reports using the tracking ID.
   - The system shall provide real-time status updates for reports.

2. **Admin Dashboard**
   - The system shall provide a dedicated dashboard for administrative personnel.
   - The system shall allow admins to view, manage, and update report statuses.
   - The system shall provide analytics and reporting capabilities for admins.

### 3.1.6 Reward System

1. **Points System**
   - The system shall implement a points-based reward system for active reporters.
   - The system shall award points based on report quality and frequency.
   - The system shall maintain a leaderboard to rank active community members.

2. **Redemption**
   - The system shall allow users to redeem accumulated points for rewards.
   - The system shall track reward redemption history.

### 3.1.7 Emergency Services

1. **Auto-Notification**
   - The system shall automatically notify emergency services for critical incidents.
   - The system shall identify critical incidents through AI analysis or user classification.

## 3.2 Non-Functional Requirements

Non-functional requirements define the quality attributes and constraints of the system that are not directly related to specific behaviors but are essential for the system's success.

### 3.2.1 Performance Requirements

1. **Response Time**
   - The system shall respond to user requests within 2 seconds for 95% of interactions.
   - API endpoints shall respond within 3 seconds for 95% of requests.
   - Database queries shall complete within 1 second for standard operations.

2. **Scalability**
   - The system shall support up to 10,000 concurrent users.
   - The system shall handle up to 1,000 report submissions per hour.
   - The system shall scale horizontally to accommodate increased load.

3. **Availability**
   - The system shall maintain 99.5% uptime.
   - The system shall provide graceful degradation during maintenance periods.

### 3.2.2 Security Requirements

1. **Data Protection**
   - The system shall encrypt sensitive user data at rest and in transit.
   - The system shall implement role-based access control to restrict data access.
   - The system shall sanitize all user inputs to prevent injection attacks.

2. **Privacy**
   - The system shall maintain complete anonymity for incident reporters.
   - The system shall comply with applicable data protection regulations.
   - The system shall provide secure session management.

3. **Authentication**
   - The system shall implement secure password storage using bcrypt hashing.
   - The system shall enforce strong password policies.
   - The system shall implement session timeouts for inactive users.

### 3.2.3 Usability Requirements

1. **User Interface**
   - The system shall provide a responsive design compatible with desktop, tablet, and mobile devices.
   - The system shall maintain consistent navigation and interaction patterns.
   - The system shall provide clear error messages and guidance.

2. **Accessibility**
   - The system shall comply with WCAG 2.1 AA accessibility standards.
   - The system shall support keyboard navigation.
   - The system shall provide alternative text for images.

### 3.2.4 Reliability Requirements

1. **Fault Tolerance**
   - The system shall gracefully handle component failures.
   - The system shall provide informative error messages during failures.
   - The system shall implement automatic recovery mechanisms where possible.

2. **Data Integrity**
   - The system shall maintain data consistency across all operations.
   - The system shall implement backup and recovery procedures.
   - The system shall log all critical operations for audit purposes.

### 3.2.5 Maintainability Requirements

1. **Code Quality**
   - The system shall follow established coding standards and best practices.
   - The system shall include comprehensive error handling and logging.
   - The system shall be modular to facilitate future enhancements.

2. **Documentation**
   - The system shall include inline code documentation.
   - The system shall provide API documentation for developers.
   - The system shall maintain user documentation for end-users.

## 3.3 Software Requirements

The software requirements specify the technology stack and development tools needed to build and deploy the Accident and Crime Report App.

### 3.3.1 Development Environment

1. **Programming Languages**
   - TypeScript (v5.x) for type-safe development
   - JavaScript (ES6+) for client-side scripting

2. **Frameworks and Libraries**
   - Next.js 15.5.2 for full-stack React development
   - React 19.1.0 for UI components
   - React DOM 19.1.0 for DOM rendering
   - Tailwind CSS v4 for styling
   - Framer Motion v12.23.12 for animations
   - Zod v4.1.5 for schema validation

3. **Database Technologies**
   - PostgreSQL for relational database management
   - Prisma ORM v6.15.0 for database operations
   - Prisma Client v6.15.0 for type-safe database access

4. **Authentication**
   - NextAuth.js v4.24.11 for authentication management
   - Bcrypt.js v3.0.2 for password hashing

5. **AI Integration**
   - Google Generative AI v0.24.1 for image and content analysis

6. **Mapping Services**
   - Mapbox Search JS React v1.3.0 for location services

7. **Email Services**
   - Nodemailer v6.10.1 for email delivery

8. **UI Components**
   - Lucide React v0.542.0 for icons
   - React Toastify v11.0.5 for notifications
   - Class Variance Authority v0.7.1 for component styling
   - Clsx v2.1.1 for conditional class handling
   - Tailwind Merge v3.3.1 for class merging

### 3.3.2 Development Tools

1. **Package Management**
   - npm (Node Package Manager) for dependency management

2. **Build Tools**
   - Turbopack for fast builds and development server
   - ESLint v9 for code quality checking
   - TypeScript Compiler for type checking

3. **Testing**
   - Jest for unit testing
   - Cypress for end-to-end testing

4. **Version Control**
   - Git for source code management

### 3.3.3 Deployment Environment

1. **Hosting Platform**
   - Vercel for deployment and hosting

2. **Database Hosting**
   - NeonDB for PostgreSQL database hosting

3. **Environment Variables**
   - NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN for Mapbox integration
   - DATABASE_URL for database connection
   - NEXTAUTH_SECRET for authentication security
   - GEMINI_API_KEY for AI services
   - EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS for email configuration

## 3.4 Hardware Requirements

The hardware requirements specify the minimum and recommended hardware specifications for running the Accident and Crime Report App.

### 3.4.1 Server-Side Requirements

1. **Development Server**
   - CPU: Minimum 2 GHz dual-core processor (Recommended: 3 GHz quad-core processor)
   - RAM: Minimum 8 GB (Recommended: 16 GB)
   - Storage: Minimum 50 GB SSD (Recommended: 100 GB SSD)
   - Network: Minimum 10 Mbps bandwidth (Recommended: 100 Mbps)

2. **Production Server**
   - CPU: Minimum 2.5 GHz quad-core processor (Recommended: 3.5 GHz octa-core processor)
   - RAM: Minimum 16 GB (Recommended: 32 GB)
   - Storage: Minimum 100 GB SSD (Recommended: 500 GB SSD)
   - Network: Minimum 100 Mbps bandwidth (Recommended: 1 Gbps)
   - Redundancy: Load balancer configuration for high availability

3. **Database Server**
   - CPU: Minimum 2 GHz dual-core processor (Recommended: 3 GHz quad-core processor)
   - RAM: Minimum 8 GB (Recommended: 16 GB)
   - Storage: Minimum 100 GB SSD with regular backups (Recommended: 500 GB SSD with RAID configuration)
   - Network: Minimum 100 Mbps bandwidth

### 3.4.2 Client-Side Requirements

1. **Desktop/Laptop**
   - Operating System: Windows 10/11, macOS 10.15+, or Linux (Ubuntu 20.04+/Fedora 35+)
   - Browser: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
   - CPU: Minimum 1.6 GHz dual-core processor
   - RAM: Minimum 4 GB (Recommended: 8 GB)
   - Storage: Minimum 100 MB available space
   - Network: Minimum 5 Mbps bandwidth for optimal performance

2. **Mobile Devices**
   - Operating System: iOS 14+ or Android 8.0+
   - Browser: Safari (iOS) or Chrome (Android)
   - Screen Resolution: Minimum 320x480 pixels
   - RAM: Minimum 2 GB
   - Network: Minimum 3G connectivity (Recommended: 4G/LTE or Wi-Fi)

3. **Network Infrastructure**
   - For optimal performance, users should have stable internet connectivity
   - For real-time features, latency should be under 100ms
   - For image uploads, sufficient bandwidth to support file transfers

### 3.4.3 Additional Hardware Considerations

1. **Backup Systems**
   - Regular automated backups of database and application data
   - Off-site storage for disaster recovery
   - Backup retention period of at least 30 days

2. **Monitoring Equipment**
   - Server monitoring tools for performance tracking
   - Network monitoring equipment for bandwidth utilization
   - Security monitoring systems for intrusion detection

3. **Development Workstations**
   - High-resolution displays for development work
   - Ergonomic keyboards and mice for extended development sessions
   - Uninterruptible Power Supply (UPS) for power protection