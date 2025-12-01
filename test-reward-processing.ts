// Test reward processing
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables
config({ path: join(__dirname, '.env') });

console.log('Testing reward processing...');

import('./lib/rewards').then(async (rewardsModule) => {
  const { awardPointsForReport, getUserRewards } = rewardsModule;
  
  try {
    // Test with a sample user ID and report ID
    const userId = 1; // Replace with an actual user ID
    const reportId = "test-report-001"; // Replace with an actual report ID
    
    console.log(`Testing reward processing for user ${userId} and report ${reportId}`);
    
    // Test awarding points
    console.log('Awarding points...');
    const result = await awardPointsForReport(userId, reportId);
    console.log('Award points result:', result);
    
    // Check user rewards
    console.log('Fetching user rewards...');
    const userRewards = await getUserRewards(userId);
    console.log('User rewards:', userRewards);
    
    console.log('✅ Reward processing test completed successfully');
  } catch (error: unknown) {
    console.log('❌ Reward processing test failed:', (error as Error).message);
    console.log('Error stack:', (error as Error).stack);
  }
}).catch((error: unknown) => {
  console.log('Could not load rewards module:', (error as Error).message);
});