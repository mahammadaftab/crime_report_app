import prisma from "@/lib/prisma";

async function testRewards() {
  try {
    // Create a test user
    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        name: "Test User",
        password: "hashedpassword",
        role: "USER",
      },
    });
    
    console.log("Created user:", user);
    
    // Create a user reward record
    const userReward = await prisma.userReward.create({
      data: {
        userId: user.id,
        points: 0,
        totalReports: 0,
        totalEarnings: 0.0,
      },
    });
    
    console.log("Created user reward:", userReward);
    
    // Create a test report
    const report = await prisma.report.create({
      data: {
        reportId: "TEST123",
        type: "NON_EMERGENCY",
        title: "Test Report",
        description: "This is a test report",
        reportType: "Theft",
        location: "Test Location",
        status: "PENDING",
      },
    });
    
    console.log("Created report:", report);
    
    // Clean up
    await prisma.report.delete({ where: { id: report.id } });
    await prisma.userReward.delete({ where: { id: userReward.id } });
    await prisma.user.delete({ where: { id: user.id } });
    
    console.log("Test completed successfully!");
  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testRewards();