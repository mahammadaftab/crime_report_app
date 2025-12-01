import { PrismaClient } from "@prisma/client";
import { awardPointsForReport, revokePointsForReport } from "@/lib/rewards";

const prisma = new PrismaClient();

async function testRealTimeRewards() {
  try {
    console.log("Testing real-time reward system...");
    
    // Create a test user
    const testUser = await prisma.user.create({
      data: {
        email: "test-reward-user@example.com",
        name: "Test Reward User",
        password: "hashedpassword123", // In real app, this would be hashed
        role: "USER",
      },
    });
    
    console.log("Created test user:", testUser.id);
    
    // Create a test report
    const testReport = await prisma.report.create({
      data: {
        reportId: "TEST-REALTIME-REWARD-123",
        type: "NON_EMERGENCY",
        title: "Test Report for Real-time Rewards",
        description: "This is a test report to verify real-time reward processing",
        reportType: "Theft",
        location: "Test Location",
        status: "PENDING",
        userId: testUser.id,
      },
    });
    
    console.log("Created test report:", testReport.reportId);
    
    // Test awarding points when report is resolved
    console.log("\n--- Testing reward awarding ---");
    const awardResult = await awardPointsForReport(testUser.id, testReport.reportId);
    console.log("Award result:", awardResult);
    
    // Verify user rewards
    const userRewardAfterAward = await prisma.userReward.findUnique({
      where: { userId: testUser.id },
      include: { rewardHistory: true },
    });
    
    console.log("User reward after awarding:", userRewardAfterAward);
    
    // Test revoking points when report is dismissed
    console.log("\n--- Testing reward revocation ---");
    const revokeResult = await revokePointsForReport(testUser.id, testReport.reportId);
    console.log("Revoke result:", revokeResult);
    
    // Verify user rewards after revocation
    const userRewardAfterRevoke = await prisma.userReward.findUnique({
      where: { userId: testUser.id },
      include: { rewardHistory: true },
    });
    
    console.log("User reward after revocation:", userRewardAfterRevoke);
    
    // Clean up test data
    await prisma.report.delete({ where: { reportId: testReport.reportId } });
    
    if (userRewardAfterRevoke) {
      await prisma.rewardHistory.deleteMany({ 
        where: { userRewardId: userRewardAfterRevoke.id } 
      });
      await prisma.userReward.delete({ where: { userId: testUser.id } });
    }
    
    await prisma.user.delete({ where: { id: testUser.id } });
    
    console.log("\n✅ Real-time reward system test completed successfully!");
  } catch (error) {
    console.error("❌ Error in real-time reward system test:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testRealTimeRewards();