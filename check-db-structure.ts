// Check database structure and reports table
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
    
    // Check table structure
    const columnsRes = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'Report'
      ORDER BY ordinal_position
    `);
    console.log('Report table structure:');
    columnsRes.rows.forEach(row => {
      console.log(`  ${row.column_name} (${row.data_type}) ${row.is_nullable === 'YES' ? 'NULLABLE' : 'NOT NULL'}`);
    });
    
    // Check indexes
    const indexesRes = await client.query(`
      SELECT indexname, indexdef
      FROM pg_indexes 
      WHERE tablename = 'Report'
    `);
    console.log('\nReport table indexes:');
    if (indexesRes.rows.length === 0) {
      console.log('  No indexes found');
    } else {
      indexesRes.rows.forEach(row => {
        console.log(`  ${row.indexname}: ${row.indexdef}`);
      });
    }
    
    // Check report count with EXPLAIN
    const explainRes = await client.query('EXPLAIN SELECT COUNT(*) FROM "public"."Report"');
    console.log('\nQuery plan for COUNT(*):');
    explainRes.rows.forEach(row => {
      console.log(`  ${row['?column?']}`);
    });
    
    await client.end();
  } catch (error: unknown) {
    console.log('❌ Database connection failed:', error instanceof Error ? error.message : 'Unknown error');
  }
}).catch((error: unknown) => {
  console.log('Could not load pg module:', error instanceof Error ? error.message : 'Unknown error');
});