import { awardPointsForReport, revokePointsForReport } from "@/lib/rewards";

async function simpleTest() {
  console.log("Simple reward system test");
  
  // Test the return format of awardPointsForReport
  try {
    // This will fail because we don't have a real user, but we can see the return format
    const result = await awardPointsForReport(999999, "TEST-REPORT-ID");
    console.log("Award result:", result);
  } catch (error: unknown) {
    console.log("Expected error when awarding points to non-existent user:", (error as Error).message);
  }
  
  // Test the return format of revokePointsForReport
  try {
    // This will fail because we don't have a real user, but we can see the return format
    const result = await revokePointsForReport(999999, "TEST-REPORT-ID");
    console.log("Revoke result:", result);
  } catch (error: unknown) {
    console.log("Expected error when revoking points from non-existent user:", (error as Error).message);
  }
  
  console.log("Test completed");
}

simpleTest();