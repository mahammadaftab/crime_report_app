import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { TopReporter } from "@/lib/types";
import cache from "@/lib/cache";

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

export async function GET() {
  try {
    // Check cache first
    const cacheKey = "leaderboard";
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log("Returning cached leaderboard data");
      return response({ leaderboard: cachedData });
    }

    // Add a timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database connection timeout')), 5000)
    );
    
    // Try to fetch leaderboard with timeout
    const fetchPromise = prisma.userReward.findMany({
      where: {
        points: {
          gt: 0,
        },
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        points: 'desc',
      },
      take: 50, // Top 50 reporters
    });
    
    const topReporters = await Promise.race([fetchPromise, timeoutPromise]) as Awaited<typeof fetchPromise>;

    const leaderboard: TopReporter[] = topReporters.map((reward) => ({
      userId: reward.userId,
      name: reward.user?.name || 'Anonymous',
      points: reward.points,
      totalReports: reward.totalReports,
      totalEarnings: reward.totalEarnings,
    }));

    // Cache the result for 5 minutes
    cache.set(cacheKey, leaderboard);

    return response({ leaderboard });
  } catch (error: unknown) {
    console.error("Failed to fetch leaderboard:", error);
    
    // Check if it's a database connection error
    if (error instanceof Error && (error.message.includes('Can\'t reach database server') || error.message.includes('timeout'))) {
      return response(
        { error: "Database connection unavailable. Please try again later." },
        503
      );
    }
    
    return response(
      { error: "Failed to load leaderboard. Please try again later." },
      500
    );
  }
}