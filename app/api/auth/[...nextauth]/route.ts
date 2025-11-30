import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { User as PrismaUser, Admin as PrismaAdmin } from "@prisma/client";

// Extend the built-in session and JWT types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    }
  }

  interface User {
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    role: string;
  }
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  logger: {
    error(code, metadata) {
      console.error("NextAuth Error:", code, metadata);
    },
    warn(code) {
      console.warn("NextAuth Warning:", code);
    },
    debug(code, metadata) {
      console.debug("NextAuth Debug:", code, metadata);
    },
  },
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_HOST || "smtp.gmail.com",
        port: parseInt(process.env.EMAIL_PORT || "587"),
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      },
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      // Custom email verification
      sendVerificationRequest: async ({ identifier, provider }) => {
        const transporter = provider.server;
        const email = identifier;
        
        // Generate a 6-digit OTP for email verification
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
        
        try {
          // Find user and update with OTP
          let user = await prisma.user.findUnique({
            where: { email },
          });
          
          if (user) {
            await prisma.user.update({
              where: { id: user.id },
              data: {
                verificationOTP: otp,
                otpExpiresAt: otpExpiresAt,
              },
            });
          } else {
            // If user doesn't exist, create a new user with OTP
            user = await prisma.user.create({
              data: {
                email,
                name: email.split("@")[0], // Use email prefix as name
                password: "", // Password will be set during signup
                verificationOTP: otp,
                otpExpiresAt: otpExpiresAt,
              },
            });
          }
          
          // Send email with OTP
          const nodemailer = await import("nodemailer");
          const transport = nodemailer.createTransport(transporter);
          
          const mailOptions = {
            from: provider.from,
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
          
          await transport.sendMail(mailOptions);
          console.log(`📧 OTP email sent successfully to ${email}`);
        } catch (error) {
          console.error("❌ Failed to send OTP email:", error);
          throw new Error("Failed to send verification email");
        }
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter an email and password");
        }

        // Check in User table first
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        // If not found in User table, check in Admin table
        if (!user) {
          const admin = await prisma.admin.findUnique({
            where: {
              email: credentials.email,
            },
          }) as PrismaAdmin | null;
          
          if (!admin) {
            throw new Error("No user found with this email");
          }
          
          // Check if email is verified
          if (!admin.emailVerified) {
            throw new Error("Please verify your email before signing in");
          }
          
          const passwordMatch = await bcrypt.compare(
            credentials.password,
            admin.password
          );
          
          if (!passwordMatch) {
            throw new Error("Incorrect password");
          }
          
          return {
            id: admin.id.toString(),
            email: admin.email || "",
            name: admin.name || "",
            role: admin.role,
          };
        }

        // Check if email is verified for regular user
        if (!user.emailVerified) {
          throw new Error("Please verify your email before signing in");
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!passwordMatch) {
          throw new Error("Incorrect password");
        }

        return {
          id: user.id.toString(),
          email: user.email || "",
          name: user.name || "",
          role: (user as PrismaUser).role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add user information to the token
      if (user) {
        token.id = user.id;
        token.email = user.email || "";
        token.name = user.name || "";
        token.role = user.role || "USER";
      }
      return token;
    },
    async session({ session, token }) {
      // Add token information to the session
      if (session?.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request", // Custom page for verification request
    error: "/auth/error", // Custom error page
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
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

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };