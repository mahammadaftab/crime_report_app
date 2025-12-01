// Check report count and database connectivity
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables
config({ path: join(__dirname, '.env') });

import('pg').then(async (pg) => {
  const { Client } = pg;
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  
  try {
    await client.connect();
    console.log('✅ Database connection successful');
    
    // Check report count
    const countRes = await client.query('SELECT COUNT(*) as count FROM "public"."Report"');
    console.log(`Total reports in database: ${countRes.rows[0].count}`);
    
    // Check if there are any reports
    if (countRes.rows[0].count > 0) {
      // Get a sample of reports
      const sampleRes = await client.query('SELECT * FROM "public"."Report" LIMIT 5');
      console.log('Sample reports:', sampleRes.rows);
    }
    
    await client.end();
  } catch (error: unknown) {
    console.log('❌ Database connection failed:', (error as Error).message);
  }
}).catch((error: unknown) => {
  console.log('Could not load pg module:', (error as Error).message);
});