import nodemailer from 'nodemailer';

export async function sendOTPEmail(email: string, otp: string): Promise<void> {
  // Create a transporter using SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // Add debugging options
    logger: true,
    debug: process.env.NODE_ENV === "development",
  });

  // Define email options
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your Email - SafeReport",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">Email Verification</h2>
        <p>Hello,</p>
        <p>Thank you for registering with SafeReport. To complete your registration, please use the following verification code:</p>
        <div style="background-color: #f3f4f6; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin: 0; color: #3b82f6; font-size: 24px; letter-spacing: 5px;">${otp}</h3>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this verification, please ignore this email.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          This email was sent automatically. Please do not reply to this email.
        </p>
      </div>
    `,
  };

  // Send the email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 OTP email sent successfully to ${email}`);
    console.log(`📧 Message ID: ${info.messageId}`);
  } catch (error: unknown) {
    console.error("❌ Failed to send OTP email:", error);
    // Re-throw the error so the calling function can handle it appropriately
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to send verification email: ${errorMessage}`);
  }
}