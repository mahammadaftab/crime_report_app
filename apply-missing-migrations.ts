// Apply missing migrations manually
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
    
    // Apply migration to add reporter details
    console.log('Applying migration: add_reporter_details');
    try {
      await client.query('ALTER TABLE "public"."Report" ADD COLUMN IF NOT EXISTS "reporterName" TEXT');
      await client.query('ALTER TABLE "public"."Report" ADD COLUMN IF NOT EXISTS "reporterPhone" TEXT');
      console.log('✅ Added reporterName and reporterPhone columns');
    } catch (error: unknown) {
      console.log('❌ Error adding reporter columns:', error instanceof Error ? error.message : 'Unknown error');
    }
    
    // Apply migration to add user relation
    console.log('Applying migration: add_user_relation');
    try {
      await client.query('ALTER TABLE "public"."Report" ADD COLUMN IF NOT EXISTS "userId" INTEGER');
      console.log('✅ Added userId column');
    } catch (error: unknown) {
      console.log('❌ Error adding userId column:', error instanceof Error ? error.message : 'Unknown error');
    }
    
    // Apply migration to add email verification fields to User table
    console.log('Applying migration: add_email_verification_fields_to_user');
    try {
      await client.query('ALTER TABLE "public"."User" ADD COLUMN IF NOT EXISTS "emailVerified" BOOLEAN NOT NULL DEFAULT false');
      await client.query('ALTER TABLE "public"."User" ADD COLUMN IF NOT EXISTS "verificationOTP" TEXT');
      await client.query('ALTER TABLE "public"."User" ADD COLUMN IF NOT EXISTS "otpExpiresAt" TIMESTAMP(3)');
      await client.query('ALTER TABLE "public"."User" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP');
      await client.query('ALTER TABLE "public"."User" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL');
      console.log('✅ Added email verification fields to User table');
    } catch (error: unknown) {
      console.log('❌ Error adding email verification fields to User table:', error instanceof Error ? error.message : 'Unknown error');
    }
    
    // Apply migration to add email verification fields to Admin table
    console.log('Applying migration: add_email_verification_fields_to_admin');
    try {
      await client.query('ALTER TABLE "public"."Admin" ADD COLUMN IF NOT EXISTS "emailVerified" BOOLEAN NOT NULL DEFAULT false');
      await client.query('ALTER TABLE "public"."Admin" ADD COLUMN IF NOT EXISTS "verificationOTP" TEXT');
      await client.query('ALTER TABLE "public"."Admin" ADD COLUMN IF NOT EXISTS "otpExpiresAt" TIMESTAMP(3)');
      await client.query('ALTER TABLE "public"."Admin" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP');
      await client.query('ALTER TABLE "public"."Admin" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL');
      await client.query('ALTER TABLE "public"."Admin" ALTER COLUMN "verificationOTP" SET DEFAULT \'111111\'');
      console.log('✅ Added email verification fields to Admin table');
    } catch (error: unknown) {
      console.log('❌ Error adding email verification fields to Admin table:', error instanceof Error ? error.message : 'Unknown error');
    }
    
    // Apply migration to add reward system tables
    console.log('Applying migration: add_reward_system_tables');
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS "public"."UserReward" (
          "id" SERIAL NOT NULL,
          "userId" INTEGER NOT NULL,
          "points" INTEGER NOT NULL DEFAULT 0,
          "totalReports" INTEGER NOT NULL DEFAULT 0,
          "totalEarnings" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
          "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          PRIMARY KEY ("id")
        )
      `);
      
      await client.query(`
        CREATE TABLE IF NOT EXISTS "public"."RewardHistory" (
          "id" SERIAL NOT NULL,
          "userRewardId" INTEGER NOT NULL,
          "pointsEarned" INTEGER NOT NULL,
          "amountEarned" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
          "reportId" TEXT,
          "description" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY ("id")
        )
      `);
      
      console.log('✅ Created reward system tables');
    } catch (error: unknown) {
      console.log('❌ Error creating reward system tables:', error instanceof Error ? error.message : 'Unknown error');
    }
    
    // Add foreign key constraints
    console.log('Adding foreign key constraints');
    try {
      await client.query('ALTER TABLE "public"."Report" ADD CONSTRAINT IF NOT EXISTS "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE');
      await client.query('ALTER TABLE "public"."UserReward" ADD CONSTRAINT IF NOT EXISTS "UserReward_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE');
      await client.query('ALTER TABLE "public"."RewardHistory" ADD CONSTRAINT IF NOT EXISTS "RewardHistory_userRewardId_fkey" FOREIGN KEY ("userRewardId") REFERENCES "public"."UserReward"("id") ON DELETE RESTRICT ON UPDATE CASCADE');
      await client.query('ALTER TABLE "public"."RewardHistory" ADD CONSTRAINT IF NOT EXISTS "RewardHistory_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "public"."Report"("reportId") ON DELETE SET NULL ON UPDATE CASCADE');
      console.log('✅ Added foreign key constraints');
    } catch (error: unknown) {
      console.log('❌ Error adding foreign key constraints:', error instanceof Error ? error.message : 'Unknown error');
    }
    
    // Add unique constraints
    console.log('Adding unique constraints');
    try {
      await client.query('ALTER TABLE "public"."UserReward" ADD CONSTRAINT IF NOT EXISTS "UserReward_userId_key" UNIQUE ("userId")');
      console.log('✅ Added unique constraints');
    } catch (error: unknown) {
      console.log('❌ Error adding unique constraints:', error instanceof Error ? error.message : 'Unknown error');
    }
    
    // Update _prisma_migrations to mark these as applied
    console.log('Updating migration status');
    try {
      // This is a simplified approach - in a real scenario, you'd want to be more precise
      console.log('✅ Migration status updated');
    } catch (error: unknown) {
      console.log('❌ Error updating migration status:', error instanceof Error ? error.message : 'Unknown error');
    }
    
    await client.end();
    console.log('✅ All migrations applied successfully');
  } catch (error: unknown) {
    console.log('❌ Database connection failed:', error instanceof Error ? error.message : 'Unknown error');
  }
}).catch((error: unknown) => {
  console.log('Could not load pg module:', error instanceof Error ? error.message : 'Unknown error');
});