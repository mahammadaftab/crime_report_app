// Check database structure using Prisma
import { PrismaClient } from '@prisma/client';

async function checkDbStructure() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Checking database structure...');
    
    // Check if tables exist by querying them
    const tablesToCheck = ['User', 'Admin', 'Report', 'UserReward', 'RewardHistory'];
    
    for (const table of tablesToCheck) {
      try {
        // Use Prisma's raw query to check if table exists
        const result = await prisma.$queryRawUnsafe<{count: number}[]>(`SELECT COUNT(*) as count FROM "${table}"`);
        console.log(`✅ Table ${table} exists with ${result[0].count} records`);
      } catch (_error) { // Prefix with underscore to indicate intentionally unused
        console.log(`❌ Table ${table} does not exist or is inaccessible`);
      }
    }
    
    // Check Report table structure specifically
    try {
      type ColumnInfo = {
        column_name: string;
        data_type: string;
      };
      
      const columns = await prisma.$queryRaw<ColumnInfo[]>`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'Report'
        ORDER BY ordinal_position
      `;
      console.log('\nReport table structure:');
      columns.forEach((row) => {
        console.log(`  ${row.column_name} (${row.data_type})`);
      });
    } catch (_error) { // Prefix with underscore to indicate intentionally unused
      const errorMessage = _error instanceof Error ? _error.message : 'Unknown error';
      console.log('Error checking Report table structure:', errorMessage);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDbStructure();