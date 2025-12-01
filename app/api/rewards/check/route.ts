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

    // Add timeout protection
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database connection timeout')), 5000)
    );
    
    // Get user with timeout
    const userFetchPromise = prisma.user.findUnique({
      where: { email: session.user.email },
    });
    
    const userResult = await Promise.race([userFetchPromise, timeoutPromise]) as Awaited<typeof userFetchPromise>;

    if (!userResult) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user rewards
    let rewards = null;
    try {
      const rewardFetchPromise = prisma.userReward.findMany({
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
      
      const userRewards = await Promise.race([rewardFetchPromise, timeoutPromise]) as Awaited<typeof rewardFetchPromise>;
      
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
    
    // Handle timeout and database connection errors
    if (error instanceof Error && (error.message.includes("timeout") || error.message.includes("Can't reach database server"))) {
      return NextResponse.json({ error: "Service temporarily unavailable. Please try again later." }, { status: 503 });
    }
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}