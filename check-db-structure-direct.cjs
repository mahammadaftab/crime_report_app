const { Client } = require('pg');
require('dotenv').config();

async function checkDatabaseStructure() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Check what tables exist
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log('\nTables in database:');
    result.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });

    // Check table counts
    console.log('\nTable record counts:');
    const tablesToCheck = ['User', 'Admin', 'UserProfile', 'AdminProfile', 'Report', 'UserReward', 'RewardHistory', 'ContactMessage'];
    
    for (const table of tablesToCheck) {
      try {
        const countResult = await client.query(`SELECT COUNT(*) as count FROM "${table}"`);
        console.log(`  ${table}: ${countResult.rows[0].count} records`);
      } catch (error) {
        console.log(`  ${table}: Error querying table - ${error.message}`);
      }
    }

  } catch (error) {
    console.error('Error connecting to database:', error);
  } finally {
    await client.end();
  }
}

checkDatabaseStructure();