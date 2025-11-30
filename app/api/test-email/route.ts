import { NextResponse } from "next/server";
import { sendOTPEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Generate a test OTP
    const testOTP = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Send the email
    await sendOTPEmail(email, testOTP);
    
    return NextResponse.json({
      success: true,
      message: `Test email sent successfully to ${email} with OTP: ${testOTP}`
    });
  } catch (error: unknown) {
    console.error("Email test error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { 
        success: false, 
        error: `Failed to send email: ${errorMessage}` 
      },
      { status: 500 }
    );
  }
}