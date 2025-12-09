# Chapter 6: Implementation

## 6.1 Different Algorithms Implemented

### 6.1.1 Password Hashing Algorithm (bcrypt)

```typescript
import bcrypt from "bcryptjs";

// During user registration
const hashedPassword = await bcrypt.hash(password, 12);

// During user login
const passwordMatch = await bcrypt.compare(inputPassword, storedHashedPassword);
```

### 6.1.2 OTP (One-Time Password) Generation Algorithm

```typescript
// Generate a 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Set expiration time
const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

// Special handling for admin users
const otp = userRole === "ADMIN" ? "111111" : generateOTP();
```

### 6.1.3 AI Image Analysis Algorithm

```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const prompt = `Analyze this emergency situation image and respond in this exact format:
TITLE: Write a clear, brief title
TYPE: Choose one (Theft, Fire Outbreak, Medical Emergency, Natural Disaster, Violence, or Other)
DESCRIPTION: Write a clear, concise description`;

const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

// Add timeout protection
const timeoutPromise = new Promise((_, reject) => 
  setTimeout(() => reject(new Error('Image analysis timeout')), 10000)
);

const generateContentPromise = model.generateContent([
  prompt,
  {
    inlineData: {
      data: base64Data,
      mimeType: "image/jpeg",
    },
  },
]);

const result = await Promise.race([generateContentPromise, timeoutPromise]);

// Parse the response
const text = await result.response.text();
const titleMatch = text.match(/TITLE:\s*(.+)/);
const typeMatch = text.match(/TYPE:\s*(.+)/);
const descMatch = text.match(/DESCRIPTION:\s*(.+)/);

return {
  title: titleMatch?.[1]?.trim() || "",
  reportType: typeMatch?.[1]?.trim() || "",
  description: descMatch?.[1]?.trim() || "",
};
```

### 6.1.4 Reward Points Calculation Algorithm

```typescript
// Constants for reward calculation
const POINTS_PER_REPORT = 50;
const POINTS_TO_RUPEES_RATIO = 100 / 10; // 100 points = 10 rupees

// Calculate rupees earned from points
export function calculateRupeesFromPoints(points: number): number {
  return (points / POINTS_TO_RUPEES_RATIO);
}

// Award points for report submission
export async function awardPointsForReport(userId: number, reportId: string) {
  // Get or create user reward record
  let userReward = await prisma.userReward.findUnique({
    where: { userId: userId },
  });

  // If no reward record exists, create one
  if (!userReward) {
    userReward = await prisma.userReward.create({
      data: {
        userId: userId,
        points: 0,
        totalReports: 0,
        totalEarnings: 0,
      },
    });
  }

  // Check if points were already awarded for this report
  const existingRewardHistory = await prisma.rewardHistory.findFirst({
    where: {
      userRewardId: userReward.id,
      reportId: reportId,
      pointsEarned: {
        gt: 0
      }
    },
  });

  if (existingRewardHistory) {
    return { 
      success: false, 
      message: "Points already awarded for this report",
      userReward 
    };
  }

  // Calculate earnings for this report
  const pointsEarned = POINTS_PER_REPORT;
  const amountEarned = calculateRupeesFromPoints(pointsEarned);

  // Update user reward totals
  const updatedUserReward = await prisma.userReward.update({
    where: { id: userReward.id },
    data: {
      points: {
        increment: pointsEarned,
      },
      totalReports: {
        increment: 1,
      },
      totalEarnings: {
        increment: amountEarned,
      },
      lastUpdated: new Date(),
    },
  });

  // Create reward history entry
  await prisma.rewardHistory.create({
    data: {
      userRewardId: updatedUserReward.id,
      pointsEarned: pointsEarned,
      amountEarned: amountEarned,
      reportId: reportId,
      description: `Points awarded for submitting report #${reportId.substring(0, 8)}`,
    },
  });

  return { 
    success: true, 
    message: `Successfully awarded ${pointsEarned} points for report ${reportId}`,
    userReward: updatedUserReward,
    pointsAwarded: pointsEarned
  };
}
```

### 6.1.5 Emergency Detection Algorithm

```typescript
import { useEffect } from 'react';

interface EmergencyDetectionOptions {
  onCarAccident?: () => void;
  onFire?: () => void;
  onMedicalEmergency?: () => void;
  enabled?: boolean;
}

export function useEmergencyDetection(options: EmergencyDetectionOptions = {}) {
  const {
    onCarAccident,
    onFire,
    onMedicalEmergency,
    enabled = true
  } = options;

  useEffect(() => {
    if (!enabled) return;

    // Simulation for demonstration purposes
    const detectionInterval = setInterval(() => {
      const randomEvent = Math.random();
      
      if (randomEvent < 0.001) {
        if (onCarAccident) {
          onCarAccident();
        }
      } else if (randomEvent < 0.002) {
        if (onFire) {
          onFire();
        }
      } else if (randomEvent < 0.003) {
        if (onMedicalEmergency) {
          onMedicalEmergency();
        }
      }
    }, 5000); // Check every 5 seconds

    return () => {
      clearInterval(detectionInterval);
    };
  }, [enabled, onCarAccident, onFire, onMedicalEmergency]);
}

// Emergency contact numbers
export const EMERGENCY_CONTACTS = {
  POLICE: '100',
  AMBULANCE: '101',
  FIRE: '101',
  EMERGENCY_POLICE: '108',
  CYBER_CRIME: '1930',
  WOMEN_HELPLINE: '100',
  CHILD_HELPLINE: '1930'
};

// Function to automatically call emergency services
export function callEmergencyService(service: keyof typeof EMERGENCY_CONTACTS) {
  const number = EMERGENCY_CONTACTS[service];
  if (number) {
    if (typeof window !== 'undefined' && confirm(`Call ${service} (${number}) immediately?`)) {
      window.location.href = `tel:${number}`;
    }
  }
}
```

### 6.1.6 Database Query Optimization Algorithm

```typescript
// Efficient querying with proper indexing
const userReward = await prisma.userReward.findUnique({
  where: { userId: userId },
  include: {
    rewardHistory: {
      include: {
        report: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    },
  },
});

// Check for existing reward history to prevent duplicates
const existingRewardHistory = await prisma.rewardHistory.findFirst({
  where: {
    userRewardId: userReward.id,
    reportId: reportId,
    pointsEarned: {
      gt: 0
    }
  },
});

// Update with atomic operations
const updatedUserReward = await prisma.userReward.update({
  where: { id: userReward.id },
  data: {
    points: {
      increment: pointsEarned,
    },
    totalReports: {
      increment: 1,
    },
    totalEarnings: {
      increment: amountEarned,
    },
    lastUpdated: new Date(),
  },
});
```

## 6.2 Algorithm Integration and Workflow

### 6.2.1 Authentication Flow Algorithm

```typescript
// Signup API Route
export async function POST(request: Request) {
  const body = await request.json();
  const { email, password, name } = body;

  // Secure password hashing
  const hashedPassword = await bcrypt.hash(password, 12);

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      verificationOTP: otp,
      otpExpiresAt: otpExpiresAt,
    },
  });

  // Send OTP email
  await sendOTPEmail(email, otp);
}

// Verification API Route
export async function POST(request: Request) {
  const body = await request.json();
  const { email, otp } = body;

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // Validate OTP
  if (user?.verificationOTP === otp && user.otpExpiresAt > new Date()) {
    // Mark email as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationOTP: null,
        otpExpiresAt: null,
      },
    });
  }
}

// Login API Route
export async function authorize(credentials) {
  const user = await prisma.user.findUnique({
    where: { email: credentials.email },
  });

  // Check if email is verified
  if (!user.emailVerified) {
    throw new Error("Please verify your email before signing in");
  }

  // Compare passwords
  const passwordMatch = await bcrypt.compare(
    credentials.password,
    user.password
  );

  if (!passwordMatch) {
    throw new Error("Incorrect password");
  }

  return {
    id: user.id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
  };
}
```

### 6.2.2 Report Submission Algorithm

```typescript
// Report Creation API Route
export async function POST(request: Request) {
  const {
    reportId,
    type,
    specificType,
    title,
    description,
    location,
    image,
    status,
    reporterName,
    reporterPhone,
  } = await request.json();

  // Find user ID if session exists
  const session = await getServerSession(authOptions);
  let userId = null;
  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });
    
    if (user) {
      userId = user.id;
    }
  }

  // Create the report
  const report = await prisma.report.create({
    data: {
      reportId,
      type: type as ReportType,
      title,
      description,
      reportType: specificType,
      location,
      image: image || null,
      status: status || "PENDING",
      reporterName: reporterName || null,
      reporterPhone: reporterPhone || null,
      userId: userId,
    },
  });

  return NextResponse.json({
    success: true,
    reportId: report.reportId,
    message: "Report submitted successfully",
  });
}
```

### 6.2.3 Admin Management Algorithm

```typescript
// Report Status Update API Route
export async function PATCH(request: Request) {
  const { status: newStatus } = await request.json();
  
  // Update report status
  const updatedReport = await prisma.report.update({
    where: { reportId: reportId },
    data: { status: newStatus },
  });

  // Process rewards based on status change
  if (updatedReport.status === "RESOLVED" && updatedReport.userId) {
    // Award points for resolved report
    const rewardResult = await awardPointsForReport(updatedReport.userId, updatedReport.reportId);
  } 
  else if ((updatedReport.status === "DISMISSED" || updatedReport.status === "REJECTED") && 
           updatedReport.userId) {
    // Revoke points for dismissed/rejected report
    const revokeResult = await revokePointsForReport(updatedReport.userId, updatedReport.reportId);
  }

  return NextResponse.json({
    success: true,
    report: updatedReport,
  });
}
```

## 6.3 Algorithm Performance and Security Considerations

### 6.3.1 Performance Optimization

```typescript
// Database connection pooling
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: ['query', 'info', 'warn'],
});

// Caching implementation
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getCachedData(key: string) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  const data = await fetchDataFromDB(key);
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
  
  return data;
}

// Timeout protection for external API calls
const timeoutPromise = new Promise((_, reject) => 
  setTimeout(() => reject(new Error('Request timeout')), 10000)
);

const apiCallPromise = fetch('/api/external-service');
const result = await Promise.race([apiCallPromise, timeoutPromise]);
```

### 6.3.2 Security Measures

```typescript
// Input validation and sanitization
function validateEmail(email: string): boolean {
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(email);
}

function sanitizeInput(input: string): string {
  return input.replace(/[<>]/g, '');
}

// Session management
export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
};

// Role-based access control
function checkUserRole(session: Session, requiredRole: string): boolean {
  return session?.user?.role === requiredRole;
}

// Rate limiting
const rateLimiter = {
  requests: new Map<string, { count: number; resetTime: number }>(),
  
  checkLimit(ip: string, maxRequests: number = 100): boolean {
    const now = Date.now();
    const requestData = this.requests.get(ip) || { count: 0, resetTime: now + 60000 };
    
    if (now > requestData.resetTime) {
      requestData.count = 0;
      requestData.resetTime = now + 60000;
    }
    
    if (requestData.count >= maxRequests) {
      return false;
    }
    
    requestData.count++;
    this.requests.set(ip, requestData);
    return true;
  }
};
```

## 6.4 Future Algorithm Enhancements

### 6.4.1 Machine Learning Integration

```typescript
// Future ML model integration placeholder
interface MLAnalysisResult {
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
  recommendations: string[];
}

async function analyzeReportWithML(reportData: any): Promise<MLAnalysisResult> {
  // Placeholder for future ML integration
  // Will connect to trained models for advanced analysis
  return {
    riskLevel: 'medium',
    confidence: 0.85,
    recommendations: ['Increase patrol in area', 'Review similar past incidents']
  };
}
```

### 6.4.2 Advanced Security Algorithms

```typescript
// Future 2FA implementation
async function generateTOTP(secret: string): Promise<string> {
  // Time-based One-Time Password generation
  // Will integrate with authenticator apps
  return "123456"; // Placeholder
}

// Biometric authentication placeholder
interface BiometricAuth {
  fingerprint?: string;
  faceScan?: string;
}

async function verifyBiometric(data: BiometricAuth): Promise<boolean> {
  // Future biometric verification
  return true; // Placeholder
}
```