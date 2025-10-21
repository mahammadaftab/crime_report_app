import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
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
    const { email } = body;

    // 🔹 1. Input validation
    if (!email) {
      return response({ error: "Email is required." }, 400);
    }

    // 🔹 2. Find user with matching email
    // First check in User table
    let user = await prisma.user.findUnique({
      where: { email },
    });

    let isAdmin = false;
    let userRole = "USER";
    
    // If not found in User table, check in Admin table
    if (!user) {
      user = await prisma.admin.findUnique({
        where: { email },
      });
      isAdmin = true;
      userRole = "ADMIN";
    }

    if (!user) {
      return response({ error: "User not found." }, 404);
    }

    // 🔹 3. Check if user is already verified
    if (user.emailVerified) {
      return response({ message: "Email already verified." }, 200);
    }

    // 🔹 4. Generate new OTP
    // For admin users, use default OTP 111111 for testing
    const otp = userRole === "ADMIN" ? "111111" : generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // 🔹 5. Update user with new OTP
    if (isAdmin) {
      await prisma.admin.update({
        where: { id: user.id },
        data: {
          verificationOTP: otp,
          otpExpiresAt: otpExpiresAt,
        },
      });
    } else {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          verificationOTP: otp,
          otpExpiresAt: otpExpiresAt,
        },
      });
    }

    // 🔹 6. Send OTP email (skip for admin users in development)
    let emailSent = false;
    if (userRole !== "ADMIN") {
      try {
        await sendOTPEmail(email, otp);
        console.log(`📧 Resent OTP email to user: ${email} with OTP: ${otp}`);
        emailSent = true;
      } catch (emailError: any) {
        console.error("❌ Failed to send OTP email:", emailError);
        // Don't fail the request if email sending fails, but log it
      }
    }

    // 🔹 7. Return success response
    return response(
      {
        message: userRole === "ADMIN"
          ? "Admin OTP is 111111. Use this for verification."
          : emailSent 
            ? "New verification code sent to your email."
            : "Verification code generated. Please check your email (you may need to check spam folder).",
      },
      200
    );
  } catch (error: any) {
    console.error("❌ Resend OTP error:", error);
    return response({ error: "Internal server error. Please try again later." }, 500);
  }
}