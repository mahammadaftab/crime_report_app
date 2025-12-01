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

    // Get user ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return response({ error: "User not found" }, 404);
    }

    const body = await request.json();
    const { points } = body;

    // Validate points
    if (!points || points <= 0) {
      return response({ error: "Invalid points amount" }, 400);
    }

    // Check if user has enough points
    const userReward = await prisma.userReward.findUnique({
      where: { userId: user.id },
    });

    if (!userReward || userReward.points < points) {
      return response({ error: "Insufficient points" }, 400);
    }

    // Redeem points
    const updatedReward: UserReward = await redeemPoints(user.id, points);

    return response({
      message: `Successfully redeemed ${points} points for ₹${(points / 10).toFixed(2)}`,
      reward: updatedReward,
    });
  } catch (error: unknown) {
    console.error("Redeem points error:", error);
    return response({ error: "Internal server error" }, 500);
  }
}