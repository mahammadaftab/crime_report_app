const { PrismaClient } = require('@prisma/client');

// Create a new Prisma client instance
const prisma = new PrismaClient();

async function testConnection() {
  try {
    // Test the connection by querying the User table
    const users = await prisma.user.findMany();
    console.log(`Successfully connected to database. Found ${users.length} users.`);
    
    // List all tables by querying each one
    const tables = ['User', 'Admin', 'UserProfile', 'AdminProfile', 'Report', 'UserReward', 'RewardHistory', 'ContactMessage'];
    
    for (const table of tables) {
      try {
        // Use dynamic query
        const result = await prisma[table.toLowerCase()].count();
        console.log(`  ${table}: ${result} records`);
      } catch (error) {
        console.log(`  ${table}: Error querying table - ${error.message}`);
      }
    }
  } catch (error) {
    console.error('Error connecting to database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();