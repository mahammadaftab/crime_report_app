// Test script to check environment variables
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables
config({ path: join(__dirname, '.env') });

console.log('Environment Variables:');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Loaded' : 'Not found');
console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? 'Loaded' : 'Not found');

if (process.env.DATABASE_URL) {
  console.log('Database URL exists');
  // Test database connection
  import('pg').then(async (pg) => {
    const { Client } = pg;
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
    });
    
    try {
      await client.connect();
      console.log('✅ Database connection successful');
      await client.end();
    } catch (error: unknown) {
      console.log('❌ Database connection failed:', (error as Error).message);
    }
  }).catch((error: unknown) => {
    console.log('Could not load pg module:', (error as Error).message);
  });
} else {
  console.log('❌ DATABASE_URL not found in environment variables');
}