import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    // 🔹 1. Input validation
    if (!email || !otp) {
      return response({ error: "Email and OTP are required." }, 400);
    }

    // 🔹 2. Find user with matching email and OTP
    // First check in User table
    let user = await prisma.user.findUnique({
      where: { email },
    });

    let isAdmin = false;
    
    // If not found in User table, check in Admin table
    if (!user) {
      user = await prisma.admin.findUnique({
        where: { email },
      });
      isAdmin = true;
    }

    if (!user) {
      return response({ error: "User not found." }, 404);
    }

    // 🔹 3. Check if user is already verified
    if (user.emailVerified) {
      return response({ message: "Email already verified." }, 200);
    }

    // 🔹 4. Check if OTP matches and hasn't expired
    // For admin users, only accept OTP 111111
    if (isAdmin && otp !== "111111") {
      return response({ error: "Invalid OTP. For admin accounts, please use OTP 111111." }, 400);
    }
    
    // For regular users, check the actual OTP
    if (!isAdmin && user.verificationOTP !== otp) {
      return response({ error: "Invalid OTP." }, 400);
    }

    if (!isAdmin && (!user.otpExpiresAt || user.otpExpiresAt < new Date())) {
      return response({ error: "OTP has expired." }, 400);
    }

    // 🔹 5. Update user as verified and clear OTP fields
    if (isAdmin) {
      await prisma.admin.update({
        where: { id: user.id },
        data: {
          emailVerified: true,
          verificationOTP: null,
          otpExpiresAt: null,
        },
      });
    } else {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: true,
          verificationOTP: null,
          otpExpiresAt: null,
        },
      });
    }

    // 🔹 6. Return success response
    return response(
      {
        message: "Email verified successfully.",
      },
      200
    );
  } catch (error: any) {
    console.error("❌ Verification error:", error);
    return response({ error: "Internal server error. Please try again later." }, 500);
  }
}