// Script to manually apply database migrations
import { config } from 'dotenv';
import { join } from 'path';
import { readFileSync } from 'fs';

// Load environment variables
config({ path: join(__dirname, '.env') });

// Read the migration SQL file
const migrationSql = readFileSync(
  join(__dirname, 'prisma', 'migrations', '20251021070018_add_email_verification_fields', 'migration.sql'),
  'utf-8'
);

console.log('Migration SQL to apply:');
console.log(migrationSql);

// Apply the migration using pg
import('pg').then(async (pg) => {
  const { Client } = pg;
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  
  try {
    await client.connect();
    console.log('✅ Connected to database');
    
    // Extract and execute the ALTER TABLE statement for User table
    const alterTableStatement = `
      ALTER TABLE "public"."User" 
      ADD COLUMN IF NOT EXISTS "emailVerified" BOOLEAN NOT NULL DEFAULT false,
      ADD COLUMN IF NOT EXISTS "verificationOTP" TEXT,
      ADD COLUMN IF NOT EXISTS "otpExpiresAt" TIMESTAMP(3),
      ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL;
    `;
    
    console.log('Executing ALTER TABLE statement...');
    await client.query(alterTableStatement);
    console.log('✅ Migration applied successfully');
    
    // Test if we can now query the User table
    console.log('Testing User table query...');
    const result = await client.query('SELECT COUNT(*) FROM "public"."User"');
    console.log('✅ User table query successful, found', result.rows[0].count, 'users');
    
  } catch (error: unknown) {
    console.log('❌ Migration failed:', error instanceof Error ? error.message : 'Unknown error');
  } finally {
    await client.end();
  }
}).catch((error: unknown) => {
  console.log('Could not load pg module:', error instanceof Error ? error.message : 'Unknown error');
});