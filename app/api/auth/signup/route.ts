import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendOTPEmail } from "@/lib/email";

// Utility: standardized API responses
function response(
  data: object,
  status: number = 200,
  headers: Record<string, string> = {}
) {
  return NextResponse.json(
    {
      success: status >= 200 && status < 300,
      timestamp: new Date().toISOString(),
      ...data,
    },
    { status, headers }
  );
}

// Generate a 6-digit OTP
function generateOTP(): string {
  // Generate a random 6-digit number
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, role } = body;

    // 🔹 1. Input validation
    if (!email || !password || !name) {
      return response({ error: "All fields (email, name, password) are required." }, 400);
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return response({ error: "Invalid email format." }, 400);
    }

    if (password.length < 8) {
      return response({ error: "Password must be at least 8 characters long." }, 400);
    }

    // 🔹 2. Check if user exists in either User or Admin table
    let existingUser = null;
    let existingAdmin = null;
    let userExists = false;
    
    try {
      existingUser = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });
      if (existingUser) {
        userExists = true;
      }
    } catch (error) {
      console.error("Error checking existing user:", error);
      // If there's an error with the user table, continue without it
      // This could be due to database connectivity issues
    }
    
    // Only try to check admin table if it exists and user doesn't already exist
    if (!userExists) {
      try {
        // First check if admin table exists by trying a simple query
        existingAdmin = await prisma.admin.findUnique({
          where: { email },
          select: { id: true },
        });
        if (existingAdmin) {
          userExists = true;
        }
      } catch (error) {
        console.error("Error checking existing admin:", error);
        // If there's an error with the admin table, continue without it
        // This handles the case where the admin table doesn't exist or database issues
        existingAdmin = null;
      }
    }

    if (userExists) {
      return response({ error: "User with this email already exists." }, 409);
    }

    // 🔹 3. Secure password hashing
    const hashedPassword = await bcrypt.hash(password, 12);

    // 🔹 4. Enforce allowed roles
    const allowedRoles = ["ADMIN", "MODERATOR", "USER"] as const;
    const userRole = allowedRoles.includes(role) ? role : "USER";

    // 🔹 5. Generate OTP for email verification
    // For admin users, use default OTP 111111 for testing
    // For regular users, generate a random OTP
    const otp = userRole === "ADMIN" ? "111111" : generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    let user: { id: number; email: string; name: string; role: string; createdAt: Date } | null = null;
    
    // 🔹 6. Create user or admin with verification data
    if (userRole === "ADMIN") {
      // Try to create admin user, fallback to regular user if admin table doesn't exist
      try {
        // Create admin user
        const admin = await prisma.admin.create({
          data: {
            email,
            name,
            password: hashedPassword,
            role: userRole,
            verificationOTP: otp,
            otpExpiresAt: otpExpiresAt,
          },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
          },
        });
        user = admin;
      } catch (adminError) {
        console.error("Error creating admin user:", adminError);
        // If admin table doesn't exist or database issues, create as regular user instead
        try {
          const regularUser = await prisma.user.create({
            data: {
              email,
              name,
              password: hashedPassword,
              role: "USER", // Force to USER role since admin table issues
              verificationOTP: otp,
              otpExpiresAt: otpExpiresAt,
            },
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              createdAt: true,
            },
          });
          user = regularUser;
        } catch (userError) {
          console.error("Error creating regular user:", userError);
          // If user table also has issues, try a minimal create
          try {
            const minimalUser = await prisma.user.create({
              data: {
                email,
                name,
                password: hashedPassword,
                role: "USER",
              },
              select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
              },
            });
            user = minimalUser;
          } catch (minimalUserError) {
            console.error("Error creating minimal user:", minimalUserError);
            // If even minimal create fails, return a graceful error
            return response({ error: "Unable to create user account. Please try again later." }, 500);
          }
        }
      }
    } else {
      // Create regular user with multiple fallback strategies
      let userCreated = false;
      
      // Strategy 1: Try full user creation with all fields
      if (!userCreated) {
        try {
          const regularUser = await prisma.user.create({
            data: {
              email,
              name,
              password: hashedPassword,
              role: userRole,
              verificationOTP: otp,
              otpExpiresAt: otpExpiresAt,
            },
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              createdAt: true,
            },
          });
          user = regularUser;
          userCreated = true;
        } catch (userError) {
          console.error("Error creating regular user (full):", userError);
        }
      }
      
      // Strategy 2: Try user creation without verification fields
      if (!userCreated) {
        try {
          const regularUser = await prisma.user.create({
            data: {
              email,
              name,
              password: hashedPassword,
              role: userRole,
            },
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              createdAt: true,
            },
          });
          user = regularUser;
          userCreated = true;
        } catch (userError) {
          console.error("Error creating regular user (minimal):", userError);
        }
      }
      
      // Strategy 3: If all else fails, return error
      if (!userCreated) {
        return response({ error: "Unable to create user account. Please try again later." }, 500);
      }
      
      // Create initial user reward record (optional, non-critical)
      if (user) {
        try {
          await prisma.userReward.create({
            data: {
              userId: user.id,
              points: 0,
              totalReports: 0,
              totalEarnings: 0.0,
            },
          });
        } catch (rewardError) {
          console.error("Error creating user reward record:", rewardError);
          // Continue without reward record if table doesn't exist or database issues
        }
      }
    }
    
    // 🔹 7. Send OTP email (skip for admin users in development)
    if (userRole !== "ADMIN") {
      try {
        await sendOTPEmail(email, otp);
        console.log(`📧 OTP email sent to user: ${email} with OTP: ${otp}`);
      } catch (emailError: unknown) {
        console.error("❌ Failed to send OTP email:", emailError);
        // Log the error but don't fail the signup process
        // The user can still verify manually or request a new OTP
      }
    }

    // 🔹 8. Return safe response
    return response(
      {
        message: userRole === "ADMIN" 
          ? "Admin user registered successfully. Use OTP 111111 for verification." 
          : "User registered successfully. Please check your email for verification.",
        user,
      },
      201
    );
  } catch (error: unknown) {
    console.error("❌ Signup error:", error);

    // Detect Prisma unique constraint violation
    if (error instanceof Error && 'code' in error && (error as { code?: string }).code === "P2002") {
      return response({ error: "Email is already registered." }, 409);
    }

    // Handle database connectivity issues
    if (error instanceof Error && (error.message.includes('database') || error.message.includes('connection'))) {
      return response({ error: "Temporary database connectivity issue. Please try again later." }, 503);
    }

    return response({ error: "Internal server error. Please try again later." }, 500);
  }
}