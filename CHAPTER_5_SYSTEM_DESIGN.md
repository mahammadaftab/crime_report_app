# Chapter 5: System Design

## 5.1 Proposed System Architecture

### 5.1.1 Overview of the System

The Accident and Crime Report App is a sophisticated, secure, and anonymous incident reporting platform designed to empower citizens to contribute to community safety while protecting their privacy. Built with cutting-edge web technologies, this application provides a seamless interface for users to report accidents and criminal activities without revealing their identity.

The system leverages Next.js 15.5.2 with the App Router for a robust frontend experience, combined with PostgreSQL database management through Prisma ORM for reliable data storage. Key features include anonymous reporting capabilities that ensure user privacy, email verification with OTP for account security, and role-based access control separating regular users from administrative personnel.

One of the standout features of this application is its AI-powered analysis using Google's Gemini AI, which can process incident images to extract contextual information and categorize reports automatically. The integration with Mapbox provides precise location tracking, allowing authorities to respond quickly and effectively to reported incidents.

Additional functionalities include a reward system that incentivizes active community participation, real-time report tracking with unique identification codes, and emergency auto-call features for critical situations. The application also incorporates performance optimizations such as code splitting, dynamic imports, and API caching to ensure a smooth user experience comparable to typical React.js applications.

### 5.1.2 System Architecture

The system follows a modern client-server architecture with distinct frontend, backend, and database layers. The architecture is designed for scalability, security, and high availability:

#### High-Level Architecture

```
graph TB
    A[Client Browser] --> B[Next.js Frontend]
    B --> C[Next.js API Routes]
    C --> D[(PostgreSQL Database)]
    C --> E[Gemini AI Service]
    C --> F[Mapbox Service]
    C --> G[Email Service]
    H[Admin Users] --> B
    I[General Users] --> B
```

#### Architecture Components

1. **Client Layer (Frontend)**: 
   - Built with Next.js 15.5.2 using the App Router
   - TypeScript for type safety
   - Tailwind CSS v4 for responsive styling
   - Framer Motion for UI animations
   - React Hooks for state management

2. **Server Layer (Backend)**:
   - Next.js API Routes for RESTful API endpoints
   - Prisma ORM for database interactions
   - NextAuth.js for authentication
   - Google's Gemini AI for image/content analysis
   - Mapbox for location services
   - Nodemailer for email delivery

3. **Data Layer**:
   - PostgreSQL database for persistent storage
   - Separate tables for Users, Admins, Reports, and Rewards
   - Prisma Migrations for schema management

4. **External Services**:
   - Google's Gemini AI for image analysis
   - Mapbox for location services
   - SMTP server for email delivery

### 5.1.3 Data Flow Architecture

The system implements a secure data flow architecture that maintains user anonymity while ensuring data integrity and accessibility for authorized personnel:

```
graph LR
    A[User] --> B[Frontend Interface]
    B --> C[Authentication Layer]
    C --> D[API Routes]
    D --> E[Data Validation]
    E --> F[Database Storage]
    F --> G[Admin Dashboard]
    D --> H[AI Analysis]
    H --> I[Evaluation Results]
    I --> F
    D --> J[Email Service]
    J --> K[Notifications]
    K --> A
```

## 5.2 Description of Modules

### 5.2.1 User Authentication Module

The authentication module handles user registration, login, and session management with a strong emphasis on security and privacy:

#### Features:
- **Email-based Registration**: Users register with their email addresses
- **OTP Verification**: Secure email verification using 6-digit OTP codes
- **Password Security**: Bcrypt hashing for password protection
- **Role-based Access**: Distinction between USER and ADMIN roles
- **Session Management**: JWT-based session handling with NextAuth.js

#### Workflow:
1. User enters email for registration
2. System generates and sends 6-digit OTP via email
3. User verifies OTP within 10-minute window
4. Upon successful verification, user sets password
5. User can now log in with email/password credentials
6. System assigns appropriate role (USER by default, ADMIN manually assigned)

#### Security Measures:
- Passwords hashed with bcrypt (12-round salt)
- OTP expires after 10 minutes
- Email verification required before login
- Session tokens secured with HTTPOnly cookies
- CSRF protection for all authentication flows

### 5.2.2 Anonymous Reporting Module

This core module enables users to submit incident reports while maintaining complete anonymity:

#### Features:
- **Incident Details Capture**: Title, description, type, and location
- **Image Upload**: Visual evidence attachment with preview
- **Location Services**: Mapbox integration for precise geolocation
- **AI Analysis**: Automatic categorization using Gemini AI
- **Emergency Classification**: Automatic detection of critical incidents

#### Workflow:
1. User selects incident type (Emergency/Non-Emergency)
2. User uploads image evidence
3. System sends image to Gemini AI for analysis
4. AI returns categorized incident details
5. User confirms or modifies details
6. User provides location information
7. System generates unique report ID
8. Report saved to database with anonymous identifier

#### Data Protection:
- No personally identifiable information stored with reports
- Reports linked to user accounts only for reward tracking
- Military-grade encryption for data transmission
- Secure database storage with access controls

### 5.2.3 AI Analysis Module

The AI analysis module leverages Google's Gemini AI to process incident images and extract contextual information:

#### Features:
- **Image Processing**: Analysis of uploaded incident photos
- **Content Categorization**: Automatic classification of incident types
- **Text Extraction**: Generation of descriptive titles and summaries
- **Emergency Detection**: Identification of critical situations
- **Timeout Protection**: 10-second timeout for API responses

#### Workflow:
1. Image received from frontend as base64 data
2. System prepares prompt for Gemini AI with specific format requirements
3. AI analyzes image content and responds with structured data
4. System parses AI response into report fields
5. Data returned to frontend for user confirmation
6. Timeout protection prevents hanging requests

#### Prompt Engineering:
```
Analyze this emergency situation image and respond in this exact format without any asterisks or bullet points:
TITLE: Write a clear, brief title
TYPE: Choose one (Theft, Fire Outbreak, Medical Emergency, Natural Disaster, Violence, or Other)
DESCRIPTION: Write a clear, concise description
```

### 5.2.4 Report Management Module

This module provides administrators with tools to manage, track, and resolve incident reports:

#### Features:
- **Dashboard Interface**: Overview of all reports with filtering options
- **Status Tracking**: Real-time status updates (Pending, In Progress, Resolved, Dismissed, Rejected)
- **Report Details**: Comprehensive view of incident information
- **Status Updates**: Ability to change report status
- **Statistics Display**: Visual representation of report metrics

#### Workflow:
1. Admin logs into dashboard
2. System displays all reports with status indicators
3. Admin can filter by status or report type
4. Clicking a report shows detailed view
5. Admin can update status which triggers:
   - Reward points for resolved reports
   - Notification to user (if linked)
   - History tracking in database

#### Admin Capabilities:
- View all submitted reports
- Filter reports by status and type
- Update report statuses
- Access report details including images
- Monitor system statistics

### 5.2.5 Reward System Module

The reward system incentivizes community participation through a points-based mechanism:

#### Features:
- **Point Accumulation**: 50 points awarded per verified report
- **Leaderboard**: Ranking of top community contributors
- **Redemption System**: Conversion of points to monetary rewards
- **History Tracking**: Detailed record of reward transactions
- **Real-time Updates**: Instant reflection of point changes

#### Workflow:
1. Report submitted and verified by admin
2. System awards 50 points to user's account
3. Points converted to rupee value (100 points = ₹10)
4. User can view accumulated points in profile
5. User can redeem points through rewards page
6. Leaderboard updates with new point totals

#### Reward Mechanics:
- 50 points per verified report
- Points-to-rupee ratio: 100 points = ₹10
- Redemption requires minimum point threshold
- Revocation of points for dismissed reports
- Transparent transaction history

### 5.2.6 Emergency Detection Module

This module provides automatic emergency detection capabilities using device sensors:

#### Features:
- **Sensor Integration**: Access to device accelerometer, GPS, and other sensors
- **Pattern Recognition**: Detection of crash, fire, and medical emergency patterns
- **Automatic Notification**: Browser notifications for detected emergencies
- **Service Integration**: Direct calling of emergency services
- **User Confirmation**: Safety check before automatic calling

#### Workflow:
1. System continuously monitors device sensors (when permitted)
2. Sensor data analyzed for emergency patterns
3. Positive detection triggers:
   - Browser notification to user
   - Confirmation dialog for emergency call
   - Automatic dialing of appropriate emergency service
4. User can cancel automatic call if false positive

#### Detection Types:
- Car accidents (based on accelerometer data)
- Fires (based on temperature and smoke detection)
- Medical emergencies (based on health sensor data)

### 5.2.7 Location Services Module

The location services module integrates with Mapbox to provide precise incident geolocation:

#### Features:
- **Interactive Maps**: Mapbox-powered map interface
- **Location Search**: Address lookup and autocomplete
- **Coordinate Capture**: Precise latitude/longitude recording
- **Reverse Geocoding**: Address determination from coordinates
- **Map Visualization**: Incident location display

#### Workflow:
1. User accesses location input interface
2. System loads Mapbox map component
3. User searches for location or clicks on map
4. Coordinates captured and stored with report
5. Reverse geocoding converts coordinates to readable address
6. Location displayed in admin dashboard

### 5.2.8 Notification System Module

The notification system manages all user communications and alerts:

#### Features:
- **Email Delivery**: SMTP-based email notifications
- **OTP Generation**: Secure one-time passwords for verification
- **Status Updates**: Report status change notifications
- **Reward Alerts**: Point accumulation and redemption notices
- **Emergency Notifications**: Critical incident alerts

#### Workflow:
1. Triggering event occurs (report submission, status change, etc.)
2. System generates appropriate notification content
3. Email prepared with personalized details
4. Nodemailer sends email through configured SMTP server
5. User receives notification in inbox

## 5.3 System Workflow

### 5.3.1 User Registration and Authentication Workflow

This workflow illustrates the complete user registration and authentication process, from initial sign-up through email verification to final login. The system ensures secure account creation through OTP verification and proper credential validation before granting access.

```
graph TD
    A[User Visits App] --> B[Click Sign Up]
    B --> C[Enter Email Address]
    C --> D[System Sends OTP]
    D --> E[User Receives Email]
    E --> F[Enter OTP Code]
    F --> G{OTP Valid?}
    G -->|Yes| H[Set Password]
    H --> I[Account Created]
    G -->|No| J[Error Message]
    J --> F
    I --> K[Redirect to Login]
    K --> L[Enter Credentials]
    L --> M{Valid Login?}
    M -->|Yes| N[Access Dashboard]
    M -->|No| O[Login Error]
```

The authentication workflow ensures that only verified users can access the system while maintaining security through multi-step verification and proper error handling for invalid attempts.

### 5.3.2 User Report Submission Workflow

This workflow demonstrates the process of submitting an incident report, from initial form access through AI analysis to final database storage. Users can provide detailed incident information with visual evidence that gets automatically categorized by the AI system.

```
graph TD
    A[User Accesses Submit Report Page] --> B[Select Incident Type]
    B --> C[Upload Image Evidence]
    C --> D[AI Analysis of Image]
    D --> E[Receive AI-Generated Details]
    E --> F[Confirm/Edit Report Details]
    F --> G[Provide Location Information]
    G --> H[System Generates Unique Report ID]
    H --> I[Save Report to Database]
    I --> J[Display Success Confirmation]
    J --> K[Send Email Notification]
```

The report submission workflow streamlines the incident documentation process while leveraging AI technology to extract meaningful information from visual evidence and ensure proper data storage.

### 5.3.3 Admin Report Management Workflow

This workflow shows how administrative personnel manage and process incident reports through the dashboard interface. Administrators can review reports, update statuses, and trigger automated processes such as reward distribution and user notifications.

```
graph TD
    A[Admin Logs into Dashboard] --> B[View All Reports]
    B --> C[Filter by Status/Type]
    C --> D[Select Report to Review]
    D --> E[View Report Details]
    E --> F[Update Report Status]
    F --> G[Save Status Change]
    G --> H[Trigger Reward Processing]
    H --> I[Send User Notification]
```

The admin management workflow provides a comprehensive system for overseeing incident reports while ensuring timely processing and appropriate communication with users who submitted the reports.

### 5.3.4 Reward System Workflow

This workflow details the process of awarding and managing reward points for user contributions to incident reporting. Points are automatically distributed for verified reports and can be tracked through the user's profile and leaderboard rankings.

```
graph TD
    A[Report Submitted] --> B[Admin Review]
    B --> C{Report Verified?}
    C -->|Yes| D[Award 50 Points]
    C -->|No| E[No Points Awarded]
    D --> F[Update User Points Total]
    F --> G[Record Transaction History]
    G --> H[Update Leaderboard]
    H --> I[Notify User of Points]
```

The reward system workflow creates a positive feedback loop that encourages community participation while maintaining transparency through detailed transaction tracking and public leaderboard displays.

### 5.3.5 Emergency Detection and Response Workflow

This workflow illustrates the automatic emergency detection system that monitors device sensors and responds to potential emergency situations. The system provides immediate notifications and can automatically contact emergency services with user confirmation.

```
graph TD
    A[Device Sensors Active] --> B[Continuous Monitoring]
    B --> C[Anomaly Detected]
    C --> D[Pattern Analysis]
    D --> E{Emergency Confirmed?}
    E -->|Yes| F[Browser Notification]
    F --> G[User Confirmation Dialog]
    G --> H{User Confirms?}
    H -->|Yes| I[Dial Emergency Service]
    H -->|No| J[Cancel Call]
    E -->|No| K[Continue Monitoring]
```

The emergency detection workflow provides critical life-saving functionality while incorporating user confirmation to prevent false alarms and ensure appropriate emergency response activation.

### 5.3.6 AI Image Analysis Workflow

This workflow shows the process of analyzing incident images using Google's Gemini AI to extract contextual information and categorize reports. The system converts images to appropriate formats and structures AI responses for user confirmation.

```
graph TD
    A[User Uploads Image] --> B[Convert to Base64]
    B --> C[Prepare AI Prompt]
    C --> D[Send to Gemini AI]
    D --> E[AI Processes Image]
    E --> F[Generate Structured Response]
    F --> G[Parse AI Output]
    G --> H[Return Data to Frontend]
    H --> I[User Reviews Details]
    I --> J[Confirm or Edit]
```

The AI analysis workflow automates the extraction of valuable information from incident images while allowing users to verify and adjust AI-generated content for accuracy.

### 5.3.7 Report Tracking Workflow

This workflow demonstrates how users can track the status of their submitted reports through the unique identification system. Users can access real-time updates on their report's progress and view detailed status histories.

```
graph TD
    A[User Submits Report] --> B[Receive Report ID]
    B --> C[Access Track Report Page]
    C --> D[Enter Report ID]
    D --> E[Query Database]
    E --> F[Retrieve Report Status]
    F --> G[Display Status Details]
    G --> H[Show Timeline]
    H --> I[Periodic Updates]
    I --> F
```

The report tracking workflow provides transparency and peace of mind to users by offering continuous visibility into the processing status of their incident reports.

### 5.3.8 Points Redemption Workflow

This workflow outlines the process by which users can convert their accumulated reward points into monetary value. The system validates point balances and processes redemptions while maintaining accurate transaction records.

```
graph TD
    A[User Accesses Rewards Page] --> B[View Available Points]
    B --> C[Select Redemption Option]
    C --> D[Enter Points to Redeem]
    D --> E[Validate Points Balance]
    E --> F{Sufficient Points?}
    F -->|Yes| G[Calculate Cash Value]
    G --> H[Process Redemption]
    H --> I[Update Points Balance]
    I --> J[Record Transaction]
    J --> K[Notify User]
    F -->|No| L[Insufficient Points Error]
```

The points redemption workflow enables users to realize tangible value from their community contributions while ensuring proper balance validation and transaction tracking.

## 5.4 Advantages of the Proposed System

### 5.4.1 Enhanced Privacy Protection

The system's primary advantage is its robust privacy protection mechanisms:

1. **Complete Anonymity**: Reports can be submitted without revealing personal identity
2. **Data Separation**: User profiles and reports are linked only for reward purposes
3. **Encryption**: All data transmission secured with military-grade encryption
4. **Minimal Data Collection**: Only essential information collected during reporting

### 5.4.2 Improved User Experience

The modern interface and streamlined processes provide significant UX improvements:

1. **Intuitive Interface**: Clean, responsive design that works on all devices
2. **AI Assistance**: Automated report categorization reduces user effort
3. **Real-time Feedback**: Instant status updates and notifications
4. **Performance Optimization**: Fast loading through code splitting and caching

### 5.4.3 Community Engagement

The reward system creates positive feedback loops for community participation:

1. **Gamification**: Points and leaderboard encourage active participation
2. **Monetary Incentives**: Points convertible to real cash rewards
3. **Recognition**: Public acknowledgment of top contributors
4. **Social Impact**: Tangible contribution to community safety

### 5.4.4 Efficient Law Enforcement Integration

The system enhances law enforcement capabilities through:

1. **Structured Data**: Organized report format with categorized information
2. **Visual Evidence**: Image attachments provide crucial context
3. **Precise Location**: GPS coordinates enable rapid response
4. **Priority Routing**: Emergency reports flagged for immediate attention

### 5.4.5 Technical Advantages

The modern technology stack provides numerous technical benefits:

1. **Scalability**: Cloud-native architecture handles growing user base
2. **Reliability**: Robust error handling and timeout protections
3. **Maintainability**: Modular code structure simplifies updates
4. **Security**: Industry-standard authentication and authorization

## 5.5 Technology Stack

### 5.5.1 Frontend Technologies

1. **Next.js 15.5.2**: 
   - React-based framework with App Router
   - Server-side rendering for improved SEO
   - Built-in API routes for backend integration
   - TypeScript support for type safety

2. **Tailwind CSS v4**:
   - Utility-first CSS framework
   - Responsive design capabilities
   - Custom theming support
   - JIT compilation for optimal performance

3. **Framer Motion**:
   - Production-ready animation library
   - Declarative API for complex interactions
   - Performance optimizations for smooth animations

4. **React Hook Form**:
   - Performant, flexible forms with easy validation
   - Reduced bundle size compared to alternatives
   - Built-in accessibility features

### 5.5.2 Backend Technologies

1. **Next.js API Routes**:
   - Serverless functions for RESTful endpoints
   - Automatic scaling with traffic
   - Built-in middleware support
   - Integrated with frontend for seamless development

2. **Prisma ORM**:
   - Type-safe database client
   - Declarative schema definition
   - Automated migrations
   - Query optimization and caching

3. **NextAuth.js**:
   - Complete authentication solution
   - OAuth and credential provider support
   - JWT-based session management
   - Built-in CSRF protection

### 5.5.3 Database Technology

1. **PostgreSQL**:
   - Relational database with ACID compliance
   - Advanced indexing for query performance
   - JSON support for flexible data structures
   - Robust security features

2. **Prisma Migrations**:
   - Version-controlled database schema changes
   - Automated migration generation
   - Rollback capabilities for failed deployments

### 5.5.4 External Services

1. **Google's Gemini AI**:
   - State-of-the-art multimodal AI model
   - Image and text analysis capabilities
   - Structured response formats
   - Reliable API with rate limiting

2. **Mapbox**:
   - Interactive maps with custom styling
   - Geocoding and reverse geocoding
   - Location search and autocomplete
   - Mobile-optimized map rendering

3. **SMTP Email Services**:
   - Reliable email delivery
   - Template-based messaging
   - Delivery tracking and analytics
   - Spam protection and reputation management

### 5.5.5 Development and Deployment Tools

1. **Node.js**:
   - JavaScript runtime for server-side execution
   - npm ecosystem for dependency management
   - Cross-platform compatibility

2. **TypeScript**:
   - Static typing for JavaScript
   - Compile-time error detection
   - Enhanced IDE support and autocompletion

3. **Vercel**:
   - Zero-configuration deployments
   - Global CDN for content delivery
   - Automatic SSL certificates
   - Serverless function scaling

## 5.6 Security Considerations

### 5.6.1 Data Protection

1. **Encryption at Rest**: Database encryption for sensitive information
2. **Encryption in Transit**: HTTPS/TLS for all communications
3. **Access Controls**: Role-based permissions for data access
4. **Audit Logging**: Comprehensive logging of system activities

### 5.6.2 Authentication Security

1. **Password Hashing**: bcrypt with 12-round salt for password storage
2. **Session Management**: JWT tokens with secure cookie settings
3. **Rate Limiting**: API throttling to prevent abuse
4. **Input Validation**: Sanitization of all user inputs

### 5.6.3 Privacy Safeguards

1. **Data Minimization**: Collection of only necessary information
2. **Anonymization**: Separation of user identity from report content
3. **Consent Management**: Clear opt-in for data collection
4. **Right to Erasure**: User-initiated data deletion capabilities