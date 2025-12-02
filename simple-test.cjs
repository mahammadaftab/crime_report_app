const { PrismaClient } = require('@prisma/client');

// Create a new Prisma client instance
const prisma = new PrismaClient();

async function testConnection() {
  try {
    // Test the connection by querying the User table
    const count = await prisma.user.count();
    console.log(`Successfully connected to database. Found ${count} users.`);
  } catch (error) {
    console.error('Error connecting to database:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();