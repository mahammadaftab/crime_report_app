// Check if all required tables exist
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
    
    // Check if all required tables exist
    const requiredTables = ['User', 'Admin', 'UserProfile', 'AdminProfile', 'Report', 'UserReward', 'RewardHistory'];
    
    for (const table of requiredTables) {
      try {
        await client.query(`SELECT 1 FROM "public"."${table}" LIMIT 1`);
        console.log(`✅ Table ${table} exists`);
      } catch {
        console.log(`❌ Table ${table} does not exist`);
      }
    }
    
    // Check User table columns
    try {
      const columnsRes = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'User'
        ORDER BY ordinal_position
      `);
      console.log('User table columns:');
      columnsRes.rows.forEach(row => {
        console.log(`  ${row.column_name} (${row.data_type})`);
      });
    } catch (error: unknown) {
      console.log('Error checking User table structure:', error instanceof Error ? error.message : 'Unknown error');
    }
    
    // Check Admin table columns
    try {
      const columnsRes = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'Admin'
        ORDER BY ordinal_position
      `);
      console.log('Admin table columns:');
      columnsRes.rows.forEach(row => {
        console.log(`  ${row.column_name} (${row.data_type})`);
      });
    } catch (error: unknown) {
      console.log('Error checking Admin table structure:', error instanceof Error ? error.message : 'Unknown error');
    }
    
    await client.end();
  } catch (error: unknown) {
    console.log('❌ Database connection failed:', error instanceof Error ? error.message : 'Unknown error');
  }
}).catch((error: unknown) => {
  console.log('Could not load pg module:', error instanceof Error ? error.message : 'Unknown error');
});