// Test script to check Prisma connection
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables
config({ path: join(__dirname, '.env') });

console.log('Testing Prisma connection...');

import('./lib/prisma').then(async (prismaModule) => {
  const prisma = prismaModule.default;
  
  try {
    // Test if we can query the database
    console.log('Attempting to query User table...');
    const users = await prisma.user.findMany({ take: 1 });
    console.log('✅ Prisma connection successful, found', users.length, 'users');
  } catch (error: unknown) {
    console.log('❌ Prisma connection failed:', (error as Error).message);
    console.log('Error code:', (error as { code?: string }).code);
    console.log('Error meta:', (error as { meta?: unknown }).meta);
  } finally {
    await prisma.$disconnect();
  }
}).catch((error: unknown) => {
  console.log('Could not load prisma module:', (error as Error).message);
});