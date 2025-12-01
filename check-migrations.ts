// Check applied migrations
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
    
    // Check applied migrations
    const res = await client.query('SELECT migration_name, finished_at FROM "_prisma_migrations" ORDER BY finished_at');
    console.log('Applied migrations:');
    res.rows.forEach(row => {
      console.log(`  ${row.migration_name} - ${row.finished_at ? 'Applied' : 'Pending'}`);
    });
    
    // Check if reporterName column exists
    try {
      await client.query('SELECT "reporterName" FROM "public"."Report" LIMIT 1');
      console.log('✅ reporterName column exists');
    } catch {
      console.log('❌ reporterName column does not exist');
    }
    
    await client.end();
  } catch {
    console.log('❌ Database connection failed:');
  }
}).catch(() => {
  console.log('Could not load pg module:');
});