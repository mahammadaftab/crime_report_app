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
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser || existingAdmin) {
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

    let user;
    
    // 🔹 6. Create user or admin with verification data
    if (userRole === "ADMIN") {
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
    } else {
      // Create regular user
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
    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code?: string }).code === "P2002") {
      return response({ error: "Email is already registered." }, 409);
    }

    return response({ error: "Internal server error. Please try again later." }, 500);
  }
}