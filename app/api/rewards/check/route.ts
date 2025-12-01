import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user
    const userResult = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!userResult) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user rewards
    let rewards = null;
    try {
      const userRewards = await prisma.userReward.findMany({
        where: { userId: userResult.id },
        include: {
          rewardHistory: {
            include: {
              report: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
            take: 10, // Limit to last 10 rewards
          },
        },
      });
      
      // Handle case where user has no reward record yet
      if (userRewards.length > 0) {
        rewards = userRewards[0];
      }
    } catch (rewardError: unknown) {
      console.error("Error fetching user rewards:", rewardError);
    }

    return NextResponse.json({
      rewards,
    });
  } catch (error: unknown) {
    console.error("Rewards check error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}