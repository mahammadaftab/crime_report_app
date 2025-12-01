import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testDatabaseConnection() {
  try {
    console.log("Testing database connection...");
    
    // Try a simple query to test the connection
    const result = await prisma.$queryRaw`SELECT 1 as connected`;
    console.log("Database connection successful:", result);
    
    // Try to fetch a user count as another test
    const userCount = await prisma.user.count();
    console.log("Number of users in database:", userCount);
    
    console.log("✅ Database connection test completed successfully!");
  } catch (error: unknown) {
    console.error("❌ Database connection failed:");
    console.error("Error message:", (error as Error).message);
    console.error("Error code:", (error as { code?: string }).code);
    
    // Check if it's a connection issue
    if ((error as Error).message.includes("connect") || (error as Error).message.includes("database server")) {
      console.log("\n🔧 Troubleshooting steps:");
      console.log("1. Check your internet connection");
      console.log("2. Verify the DATABASE_URL in your .env file is correct");
      console.log("3. Ensure your database server is running");
      console.log("4. Check if there are any firewall restrictions");
      console.log("5. Try restarting your development server");
    }
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseConnection();