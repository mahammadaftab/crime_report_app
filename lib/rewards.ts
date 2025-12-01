import prisma from "@/lib/prisma";
import { RewardResult, TopReporter } from "./types";

// Constants for reward calculation
const POINTS_PER_REPORT = 50;
const POINTS_TO_RUPEES_RATIO = 100 / 10; // 100 points = 10 rupees

/**
 * Calculate rupees earned from points
 * @param points Number of points
 * @returns Rupees earned
 */
export function calculateRupeesFromPoints(points: number): number {
  return (points / POINTS_TO_RUPEES_RATIO);
}

/**
 * Award points to a user for submitting a report
 * @param userId User ID
 * @param reportId Report ID
 * @returns Updated user reward data
 */
export async function awardPointsForReport(userId: number, reportId: string): Promise<RewardResult> {
  try {
    // Get or create user reward record
    let userReward = await prisma.userReward.findUnique({
      where: { userId: userId },
    });

    // If no reward record exists, create one
    if (!userReward) {
      userReward = await prisma.userReward.create({
        data: {
          userId: userId,
          points: 0,
          totalReports: 0,
          totalEarnings: 0,
        },
      });
    }

    // Check if points were already awarded for this report
    const existingRewardHistory = await prisma.rewardHistory.findFirst({
      where: {
        userRewardId: userReward.id,
        reportId: reportId,
        pointsEarned: {
          gt: 0 // Only check for positive points (awarded, not revoked)
        }
      },
    });

    if (existingRewardHistory) {
      // Points were already awarded for this report, don't award again
      console.log(`Points already awarded for report ${reportId}`);
      return { 
        success: false, 
        message: "Points already awarded for this report",
        userReward 
      };
    }

    // Calculate earnings for this report
    const pointsEarned = POINTS_PER_REPORT;
    const amountEarned = calculateRupeesFromPoints(pointsEarned);

    // Update user reward totals
    const updatedUserReward = await prisma.userReward.update({
      where: { id: userReward.id },
      data: {
        points: {
          increment: pointsEarned,
        },
        totalReports: {
          increment: 1,
        },
        totalEarnings: {
          increment: amountEarned,
        },
        lastUpdated: new Date(),
      },
    });

    // Create reward history entry
    await prisma.rewardHistory.create({
      data: {
        userRewardId: updatedUserReward.id,
        pointsEarned: pointsEarned,
        amountEarned: amountEarned,
        reportId: reportId,
        description: `Points awarded for submitting report #${reportId.substring(0, 8)}`,
      },
    });

    return { 
      success: true, 
      message: `Successfully awarded ${pointsEarned} points for report ${reportId}`,
      userReward: updatedUserReward,
      pointsAwarded: pointsEarned
    };
  } catch (error: unknown) {
    console.error("Error awarding points:", error);
    // Log additional information for debugging
    console.error("Database error details:", {
      userId,
      reportId,
      errorMessage: (error as Error).message,
      errorStack: (error as Error).stack
    });
    throw new Error(`Failed to award points for report ${reportId}: ${(error as Error).message}`);
  }
}

/**
 * Revoke points from a user when a report is dismissed
 * @param userId User ID
 * @param reportId Report ID
 * @returns Updated user reward data
 */
export async function revokePointsForReport(userId: number, reportId: string): Promise<RewardResult> {
  try {
    // Get user reward record
    const userReward = await prisma.userReward.findUnique({
      where: { userId: userId },
    });

    if (!userReward) {
      throw new Error("User reward record not found");
    }

    // Check if points were awarded for this report
    const existingRewardHistory = await prisma.rewardHistory.findFirst({
      where: {
        userRewardId: userReward.id,
        reportId: reportId,
        pointsEarned: {
          gt: 0 // Only check for positive points (awarded, not already revoked)
        }
      },
    });

    if (!existingRewardHistory) {
      // No points were awarded for this report, nothing to revoke
      console.log(`No points to revoke for report ${reportId}`);
      return { 
        success: false, 
        message: "No points to revoke for this report",
        userReward 
      };
    }

    // Calculate points to revoke
    const pointsToRevoke = POINTS_PER_REPORT;
    const amountToRevoke = calculateRupeesFromPoints(pointsToRevoke);

    // Update user reward totals
    const updatedUserReward = await prisma.userReward.update({
      where: { id: userReward.id },
      data: {
        points: {
          decrement: pointsToRevoke,
        },
        totalReports: {
          decrement: 1,
        },
        totalEarnings: {
          decrement: amountToRevoke,
        },
        lastUpdated: new Date(),
      },
    });

    // Create reward history entry for revocation
    await prisma.rewardHistory.create({
      data: {
        userRewardId: updatedUserReward.id,
        pointsEarned: -pointsToRevoke,
        amountEarned: -amountToRevoke,
        reportId: reportId,
        description: `Points revoked for dismissed report #${reportId.substring(0, 8)}`,
      },
    });

    return { 
      success: true, 
      message: `Successfully revoked ${pointsToRevoke} points for report ${reportId}`,
      userReward: updatedUserReward,
      pointsRevoked: pointsToRevoke
    };
  } catch (error: unknown) {
    console.error("Error revoking points:", error);
    // Log additional information for debugging
    console.error("Database error details:", {
      userId,
      reportId,
      errorMessage: (error as Error).message,
      errorStack: (error as Error).stack
    });
    throw new Error(`Failed to revoke points for report ${reportId}: ${(error as Error).message}`);
  }
}

/**
 * Get user's current reward status
 * @param userId User ID
 * @returns User reward data with history
 */
export async function getUserRewards(userId: number) {
  try {
    const userReward = await prisma.userReward.findUnique({
      where: { userId: userId },
      include: {
        rewardHistory: {
          include: {
            report: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10, // Last 10 rewards
        },
      },
    });

    return userReward;
  } catch (error: unknown) {
    console.error("Error fetching user rewards:", error);
    throw new Error(`Failed to fetch user rewards: ${(error as Error).message}`);
  }
}

/**
 * Get leaderboard of top reporters
 * @param limit Number of top reporters to fetch
 * @returns Array of top reporters
 */
export async function getTopReporters(limit: number = 10): Promise<TopReporter[]> {
  try {
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
      take: limit,
    });

    return topReporters.map((reward) => ({
      userId: reward.userId,
      name: reward.user?.name || 'Anonymous',
      points: reward.points,
      totalReports: reward.totalReports,
      totalEarnings: reward.totalEarnings,
    }));
  } catch (error: unknown) {
    console.error("Error fetching top reporters:", error);
    throw new Error(`Failed to fetch top reporters: ${(error as Error).message}`);
  }
}

/**
 * Redeem points for cash
 * @param userId User ID
 * @param pointsToRedeem Number of points to redeem
 * @returns Updated user reward data
 */
export async function redeemPoints(userId: number, pointsToRedeem: number): Promise<import('@prisma/client').UserReward> {
  try {
    // Get user reward record
    const userReward = await prisma.userReward.findUnique({
      where: { userId: userId },
    });

    if (!userReward) {
      throw new Error("User reward record not found");
    }

    // Check if user has enough points
    if (userReward.points < pointsToRedeem) {
      throw new Error("Insufficient points");
    }

    // Calculate cash value
    const cashValue = calculateRupeesFromPoints(pointsToRedeem);

    // Update user reward totals
    const updatedUserReward = await prisma.userReward.update({
      where: { id: userReward.id },
      data: {
        points: {
          decrement: pointsToRedeem,
        },
        totalEarnings: {
          increment: cashValue,
        },
        lastUpdated: new Date(),
      },
    });

    // Create reward history entry for redemption
    await prisma.rewardHistory.create({
      data: {
        userRewardId: updatedUserReward.id,
        pointsEarned: -pointsToRedeem,
        amountEarned: cashValue,
        description: `Redeemed ${pointsToRedeem} points for ₹${cashValue.toFixed(2)}`,
      },
    });

    return updatedUserReward;
  } catch (error: unknown) {
    console.error("Error redeeming points:", error);
    throw new Error(`Failed to redeem points: ${(error as Error).message}`);
  }
}