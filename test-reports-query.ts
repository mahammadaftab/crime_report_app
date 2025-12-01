// Test Prisma reports query
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables
config({ path: join(__dirname, '.env') });

console.log('Testing Prisma reports query...');

import('./lib/prisma').then(async (prismaModule) => {
  const prisma = prismaModule.default;
  
  try {
    // Test if we can query the reports
    console.log('Attempting to query Report table...');
    const reports = await prisma.report.findMany({ 
      take: 5,
      orderBy: {
        createdAt: 'desc'
      }
    });
    console.log('✅ Prisma reports query successful');
    console.log(`Found ${reports.length} reports`);
    
    if (reports.length > 0) {
      console.log('Sample report:', {
        id: reports[0].id,
        reportId: reports[0].reportId,
        title: reports[0].title,
        status: reports[0].status,
        createdAt: reports[0].createdAt
      });
    }
    
    // Get total count
    const count = await prisma.report.count();
    console.log(`Total reports in database: ${count}`);
  } catch (error: unknown) {
    console.log('❌ Prisma reports query failed:', (error as Error).message);
    console.log('Error code:', (error as { code?: string }).code);
    console.log('Error meta:', (error as { meta?: unknown }).meta);
  } finally {
    await prisma.$disconnect();
  }
}).catch((error: unknown) => {
  console.log('Could not load prisma module:', (error as Error).message);
});