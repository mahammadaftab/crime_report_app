import prisma from "@/lib/prisma";

async function testDbStructure() {
  try {
    console.log("Testing database structure...");
    
    // Test if we can query the User table
    const users = await prisma.user.findMany({ take: 1 });
    console.log("User table accessible:", users.length > 0);
    
    // Test if we can query the Report table
    const reports = await prisma.report.findMany({ take: 1 });
    console.log("Report table accessible:", reports.length > 0);
    
    // Test if we can query the UserReward table
    try {
      const userRewards = await prisma.userReward.findMany({ take: 1 });
      console.log("UserReward table accessible:", userRewards.length > 0);
    } catch (error: unknown) {
      console.log("UserReward table error:", (error as Error).message);
    }
    
    // Test if we can query the RewardHistory table
    try {
      const rewardHistory = await prisma.rewardHistory.findMany({ take: 1 });
      console.log("RewardHistory table accessible:", rewardHistory.length > 0);
    } catch (error: unknown) {
      console.log("RewardHistory table error:", (error as Error).message);
    }
    
    console.log("Database structure test completed!");
  } catch (error: unknown) {
    console.error("Error in database structure test:", error);
  }
}

testDbStructure();