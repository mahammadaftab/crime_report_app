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
    const { email } = body;

    // 🔹 1. Input validation
    if (!email) {
      return response({ error: "Email is required." }, 400);
    }

    // 🔹 2. Find user with matching email
    // First check in User table
    let user = await prisma.user.findUnique({
      where: { email },
      select: { role: true },
    });

    // If not found in User table, check in Admin table
    if (!user) {
      user = await prisma.admin.findUnique({
        where: { email },
        select: { role: true },
      });
    }

    if (!user) {
      return response({ error: "User not found." }, 404);
    }

    // 🔹 3. Return user role
    return response(
      {
        role: user.role,
      },
      200
    );
  } catch (error: any) {
    console.error("❌ User role error:", error);
    return response({ error: "Internal server error. Please try again later." }, 500);
  }
}