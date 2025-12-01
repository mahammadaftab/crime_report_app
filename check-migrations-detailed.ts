// Check applied migrations in detail
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
    
    // Check if _prisma_migrations table exists
    try {
      await client.query('SELECT * FROM "_prisma_migrations" LIMIT 1');
      console.log('✅ _prisma_migrations table exists');
      
      // Check applied migrations
      const migrationsRes = await client.query('SELECT migration_name, finished_at FROM "_prisma_migrations" ORDER BY finished_at');
      console.log('Applied migrations:');
      migrationsRes.rows.forEach(row => {
        const status = row.finished_at ? 'Applied' : 'Pending';
        console.log(`  ${row.migration_name} - ${status}`);
      });
    } catch {
      console.log('❌ _prisma_migrations table does not exist or is inaccessible');
    }
    
    // Check if reporterName column exists
    try {
      await client.query('SELECT "reporterName" FROM "public"."Report" LIMIT 1');
      console.log('✅ reporterName column exists');
    } catch {
      console.log('❌ reporterName column does not exist');
    }
    
    // Check Report table structure
    try {
      const columnsRes = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'Report'
        ORDER BY ordinal_position
      `);
      console.log('Report table columns:');
      columnsRes.rows.forEach(row => {
        console.log(`  ${row.column_name} (${row.data_type})`);
      });
    } catch {
      console.log('Error checking Report table structure:');
    }
    
    await client.end();
  } catch {
    console.log('❌ Database connection failed:');
  }
}).catch(() => {
  console.log('Could not load pg module:');
});