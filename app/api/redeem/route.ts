import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { redeemPoints } from "@/lib/rewards";
import { UserReward } from "@prisma/client";

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
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return response({ error: "Unauthorized" }, 401);
    }

    // Add timeout protection
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database connection timeout')), 5000)
    );
    
    // Get user ID with timeout
    const userFetchPromise = prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });
    
    const user = await Promise.race([userFetchPromise, timeoutPromise]) as Awaited<typeof userFetchPromise>;

    if (!user) {
      return response({ error: "User not found" }, 404);
    }

    const body = await request.json();
    const { points } = body;

    // Validate points
    if (!points || points <= 0) {
      return response({ error: "Invalid points amount" }, 400);
    }

    // Check if user has enough points with timeout
    const rewardFetchPromise = prisma.userReward.findUnique({
      where: { userId: user.id },
    });
    
    const userReward = await Promise.race([rewardFetchPromise, timeoutPromise]) as Awaited<typeof rewardFetchPromise>;

    if (!userReward || userReward.points < points) {
      return response({ error: "Insufficient points" }, 400);
    }

    // Redeem points with timeout
    const redeemPromise = redeemPoints(user.id, points);
    const updatedReward: UserReward = await Promise.race([redeemPromise, timeoutPromise]) as Awaited<typeof redeemPromise>;

    return response({
      message: `Successfully redeemed ${points} points for ₹${(points / 10).toFixed(2)}`,
      reward: updatedReward,
    });
  } catch (error: unknown) {
    console.error("Redeem points error:", error);
    
    // Handle timeout and database connection errors
    if (error instanceof Error && (error.message.includes("timeout") || error.message.includes("Can't reach database server"))) {
      return response({ error: "Service temporarily unavailable. Please try again later." }, 503);
    }
    
    return response({ error: "Internal server error" }, 500);
  }
}