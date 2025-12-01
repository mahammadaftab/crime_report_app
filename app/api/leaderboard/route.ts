import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { TopReporter } from "@/lib/types";


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
    // Get top reporters
    const topReporters = await prisma.userReward.findMany({
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

    const leaderboard: TopReporter[] = topReporters.map((reward) => ({
      userId: reward.userId,
      name: reward.user?.name || 'Anonymous',
      points: reward.points,
      totalReports: reward.totalReports,
      totalEarnings: parseFloat(reward.totalEarnings.toFixed(2)),
    }));

    return response({
      leaderboard,
    });
  } catch (error: unknown) {
    console.error("Leaderboard API error:", error);
    return response({ error: "Internal server error" }, 500);
  }
}