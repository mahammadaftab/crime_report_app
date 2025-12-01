import prisma from "@/lib/prisma";

async function testRewardSystem() {
  try {
    console.log("Testing reward system...");
    
    // Create a test user
    const user = await prisma.user.create({
      data: {
        email: "test-reward@example.com",
        name: "Test Reward User",
        password: "hashedpassword",
        role: "USER",
      },
    });
    
    console.log("Created user:", user);
    
    // Create a test report
    const report = await prisma.report.create({
      data: {
        reportId: "TEST-REWARD-123",
        type: "NON_EMERGENCY",
        title: "Test Report for Rewards",
        description: "This is a test report to verify the reward system",
        reportType: "Theft",
        location: "Test Location",
        status: "PENDING",
        userId: user.id
      },
    });
    
    console.log("Created report:", report);
    
    // Check initial user reward status
    let userReward = await prisma.userReward.findUnique({
      where: { userId: user.id },
    });
    
    console.log("Initial user reward status:", userReward);
    
    // Update report status to RESOLVED (should award points)
    const resolvedReport = await prisma.report.update({
      where: { reportId: "TEST-REWARD-123" },
      data: { status: "RESOLVED" },
    });
    
    console.log("Report marked as RESOLVED:", resolvedReport);
    
    // Check updated user reward status
    userReward = await prisma.userReward.findUnique({
      where: { userId: user.id },
      include: { rewardHistory: true },
    });
    
    console.log("User reward status after resolving:", userReward);
    
    // Update report status to DISMISSED (should revoke points)
    const dismissedReport = await prisma.report.update({
      where: { reportId: "TEST-REWARD-123" },
      data: { status: "DISMISSED" },
    });
    
    console.log("Report marked as DISMISSED:", dismissedReport);
    
    // Check final user reward status
    userReward = await prisma.userReward.findUnique({
      where: { userId: user.id },
      include: { rewardHistory: true },
    });
    
    console.log("Final user reward status:", userReward);
    
    // Clean up test data
    await prisma.report.delete({ where: { reportId: "TEST-REWARD-123" } });
    if (userReward) {
      await prisma.rewardHistory.deleteMany({ where: { userRewardId: userReward.id } });
      await prisma.userReward.delete({ where: { userId: user.id } });
    }
    await prisma.user.delete({ where: { id: user.id } });
    
    console.log("Test completed and cleaned up!");
  } catch (error: unknown) {
    console.error("Error in test:", error);
  }
}

testRewardSystem();