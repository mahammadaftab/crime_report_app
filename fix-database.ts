// Script to fix database issues
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixDatabase() {
  try {
    console.log('Checking database structure...');
    
    // Check if the emailVerified column exists
    try {
      await prisma.user.findMany({ take: 1 });
      console.log('User table is accessible');
    } catch (error: unknown) {
      console.log('Error accessing User table:', (error as Error).message);
      
      // If the error is about missing column, we need to add it
      if ((error as Error).message.includes('emailVerified')) {
        console.log('The emailVerified column is missing. You need to apply migrations.');
      }
    }
    
    // Check if UserReward table exists
    try {
      await prisma.userReward.findMany({ take: 1 });
      console.log('UserReward table is accessible');
    } catch (error: unknown) {
      console.log('UserReward table error:', (error as Error).message);
    }
    
    console.log('Database check completed');
  } catch (error) {
    console.error('Error in database fix script:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixDatabase();