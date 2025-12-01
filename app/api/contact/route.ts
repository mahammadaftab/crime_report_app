import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(255),
  message: z.string().min(10).max(5000),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const data = ContactSchema.parse(json);

    // Try to capture client IP (works on most hosts / proxies)
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      req.headers.get("x-real-ip") ??
      null;

    // Add a timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database connection timeout')), 5000)
    );
    
    // Try to save the contact message with timeout
    const savePromise = prisma.contactMessage.create({
      data: { ...data, ip },
    });
    
    const saved = await Promise.race([savePromise, timeoutPromise]) as Awaited<typeof savePromise>;

    return NextResponse.json(
      { success: true, id: saved.id, message: "Message received." },
      { status: 201 }
    );
  } catch (err: unknown) {
    if (typeof err === 'object' && err !== null && (err as { name?: string })?.name === "ZodError") {
      return NextResponse.json({ success: false, errors: (err as { issues?: unknown[] }).issues }, { status: 400 });
    }
    
    // Check if it's a database connection error
    if (err instanceof Error && (err.message.includes('Can\'t reach database server') || err.message.includes('timeout'))) {
      console.error("Database connection error:", err.message);
      return NextResponse.json(
        { success: false, error: "Service temporarily unavailable. Please try again later." }, 
        { status: 503 }
      );
    }
    
    console.error("Contact POST error:", err);
    return NextResponse.json({ success: false, error: "Server error." }, { status: 500 });
  }
}