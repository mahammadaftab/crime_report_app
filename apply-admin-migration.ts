// Script to manually apply Admin table migration
import { config } from 'dotenv';
import { join } from 'path';
import { readFileSync } from 'fs';

// Load environment variables
config({ path: join(__dirname, '.env') });

// Read the migration SQL file
const migrationSql = readFileSync(
  join(__dirname, 'prisma', 'migrations', '20251021080000_separate_user_admin_tables', 'migration.sql'),
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
    
    // Execute the CREATE TABLE statements
    const createTablesStatements = [
      `
        CREATE TABLE IF NOT EXISTS "public"."Admin" (
          "id" SERIAL NOT NULL,
          "email" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "password" TEXT NOT NULL,
          "role" TEXT NOT NULL DEFAULT 'ADMIN',
          "emailVerified" BOOLEAN NOT NULL DEFAULT false,
          "verificationOTP" TEXT DEFAULT '111111',
          "otpExpiresAt" TIMESTAMP(3),
          "department" TEXT,
          "permissions" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
        );
      `,
      `
        CREATE TABLE IF NOT EXISTS "public"."AdminProfile" (
          "id" SERIAL NOT NULL,
          "adminId" INTEGER NOT NULL,
          "phone" TEXT,
          "department" TEXT,
          "position" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "AdminProfile_pkey" PRIMARY KEY ("id")
        );
      `,
      `
        CREATE TABLE IF NOT EXISTS "public"."UserProfile" (
          "id" SERIAL NOT NULL,
          "userId" INTEGER NOT NULL,
          "phone" TEXT,
          "address" TEXT,
          "dateOfBirth" TIMESTAMP(3),
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
        );
      `
    ];
    
    const indexStatements = [
      `CREATE UNIQUE INDEX IF NOT EXISTS "Admin_email_key" ON "public"."Admin"("email");`,
      `CREATE UNIQUE INDEX IF NOT EXISTS "AdminProfile_adminId_key" ON "public"."AdminProfile"("adminId");`,
      `CREATE UNIQUE INDEX IF NOT EXISTS "UserProfile_userId_key" ON "public"."UserProfile"("userId");`
    ];
    
    const foreignKeyStatements = [
      `ALTER TABLE "public"."UserProfile" DROP CONSTRAINT IF EXISTS "UserProfile_userId_fkey", ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;`,
      `ALTER TABLE "public"."AdminProfile" DROP CONSTRAINT IF EXISTS "AdminProfile_adminId_fkey", ADD CONSTRAINT "AdminProfile_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "public"."Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;`
    ];
    
    console.log('Executing CREATE TABLE statements...');
    for (const statement of createTablesStatements) {
      await client.query(statement);
    }
    console.log('✅ CREATE TABLE statements executed successfully');
    
    console.log('Executing CREATE INDEX statements...');
    for (const statement of indexStatements) {
      await client.query(statement);
    }
    console.log('✅ CREATE INDEX statements executed successfully');
    
    console.log('Executing FOREIGN KEY statements...');
    for (const statement of foreignKeyStatements) {
      await client.query(statement);
    }
    console.log('✅ FOREIGN KEY statements executed successfully');
    
    // Test if we can now query the Admin table
    console.log('Testing Admin table query...');
    const result = await client.query('SELECT COUNT(*) FROM "public"."Admin"');
    console.log('✅ Admin table query successful, found', result.rows[0].count, 'admins');
    
  } catch (error: unknown) {
    console.log('❌ Migration failed:', error instanceof Error ? error.message : 'Unknown error');
  } finally {
    await client.end();
  }
}).catch((error: unknown) => {
  console.log('Could not load pg module:', error instanceof Error ? error.message : 'Unknown error');
});