// Detailed database connection test
import { PrismaClient } from '@prisma/client';

// Define types for Prisma errors
interface PrismaError extends Error {
  code?: string;
  meta?: Record<string, unknown>;
}

async function testConnection() {
  console.log('Testing database connection with detailed output...');
  
  // Test with a new PrismaClient instance
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error']
  });
  
  try {
    console.log('Attempting to connect to database...');
    
    // Test a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Database connection successful!');
    console.log('Query result:', result);
    
    // Test counting reports
    console.log('Testing report count query...');
    const count = await prisma.report.count();
    console.log('✅ Report count query successful!');
    console.log('Report count:', count);
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      // For Prisma-specific errors
      const prismaError = error as PrismaError;
      if (prismaError.code) {
        console.error('Error code:', prismaError.code);
      }
      if (prismaError.meta) {
        console.error('Error meta:', prismaError.meta);
      }
    }
    
    // Try to parse the connection URL
    const dbUrl = process.env.DATABASE_URL;
    console.log('Database URL:', dbUrl);
    
    if (dbUrl) {
      try {
        const url = new URL(dbUrl);
        console.log('Host:', url.hostname);
        console.log('Port:', url.port || 'default');
        console.log('Database:', url.pathname.substring(1));
      } catch (urlError) {
        console.error('Error parsing URL:', urlError);
      }
    }
  } finally {
    await prisma.$disconnect();
    console.log('Disconnected from database');
  }
}

testConnection();