const { Client } = require('pg');
require('dotenv').config();

async function createMissingTables() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Check if tables exist and create them if they don't
    const tablesToCheck = ['Admin', 'UserProfile', 'AdminProfile', 'UserReward', 'RewardHistory'];
    
    for (const table of tablesToCheck) {
      try {
        await client.query(`SELECT 1 FROM "${table}" LIMIT 1`);
        console.log(`✅ Table ${table} already exists`);
      } catch (error) {
        console.log(`❌ Table ${table} does not exist`);
      }
    }

    // Create Admin table with all columns
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS "Admin" (
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
        )
      `);
      console.log('✅ Admin table created or already exists');
    } catch (error) {
      console.error('Error creating Admin table:', error);
    }

    // Create UserProfile table with all columns
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS "UserProfile" (
          "id" SERIAL NOT NULL,
          "userId" INTEGER NOT NULL,
          "phone" TEXT,
          "address" TEXT,
          "dateOfBirth" TIMESTAMP(3),
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
        )
      `);
      console.log('✅ UserProfile table created or already exists');
    } catch (error) {
      console.error('Error creating UserProfile table:', error);
    }

    // Create AdminProfile table with all columns
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS "AdminProfile" (
          "id" SERIAL NOT NULL,
          "adminId" INTEGER NOT NULL,
          "phone" TEXT,
          "department" TEXT,
          "position" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "AdminProfile_pkey" PRIMARY KEY ("id")
        )
      `);
      console.log('✅ AdminProfile table created or already exists');
    } catch (error) {
      console.error('Error creating AdminProfile table:', error);
    }

    // Create UserReward table with all columns
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS "UserReward" (
          "id" SERIAL NOT NULL,
          "userId" INTEGER NOT NULL,
          "points" INTEGER NOT NULL DEFAULT 0,
          "totalReports" INTEGER NOT NULL DEFAULT 0,
          "totalEarnings" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
          "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "UserReward_pkey" PRIMARY KEY ("id")
        )
      `);
      console.log('✅ UserReward table created or already exists');
    } catch (error) {
      console.error('Error creating UserReward table:', error);
    }

    // Create RewardHistory table with all columns
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS "RewardHistory" (
          "id" SERIAL NOT NULL,
          "userRewardId" INTEGER NOT NULL,
          "pointsEarned" INTEGER NOT NULL,
          "amountEarned" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
          "reportId" TEXT,
          "description" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "RewardHistory_pkey" PRIMARY KEY ("id")
        )
      `);
      console.log('✅ RewardHistory table created or already exists');
    } catch (error) {
      console.error('Error creating RewardHistory table:', error);
    }

    // Add missing columns to User table
    try {
      await client.query(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "role" TEXT NOT NULL DEFAULT 'USER'`);
      console.log('✅ User.role column added');
    } catch (error) {
      console.log('ℹ️  User.role column may already exist');
    }

    try {
      await client.query(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "emailVerified" BOOLEAN NOT NULL DEFAULT false`);
      console.log('✅ User.emailVerified column added');
    } catch (error) {
      console.log('ℹ️  User.emailVerified column may already exist');
    }

    try {
      await client.query(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "verificationOTP" TEXT`);
      console.log('✅ User.verificationOTP column added');
    } catch (error) {
      console.log('ℹ️  User.verificationOTP column may already exist');
    }

    try {
      await client.query(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "otpExpiresAt" TIMESTAMP(3)`);
      console.log('✅ User.otpExpiresAt column added');
    } catch (error) {
      console.log('ℹ️  User.otpExpiresAt column may already exist');
    }

    try {
      await client.query(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP`);
      console.log('✅ User.createdAt column added');
    } catch (error) {
      console.log('ℹ️  User.createdAt column may already exist');
    }

    try {
      await client.query(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP`);
      console.log('✅ User.updatedAt column added');
    } catch (error) {
      console.log('ℹ️  User.updatedAt column may already exist');
    }

    // Add missing columns to Report table
    try {
      await client.query(`ALTER TABLE "Report" ADD COLUMN IF NOT EXISTS "reporterName" TEXT`);
      console.log('✅ Report.reporterName column added');
    } catch (error) {
      console.log('ℹ️  Report.reporterName column may already exist');
    }

    try {
      await client.query(`ALTER TABLE "Report" ADD COLUMN IF NOT EXISTS "reporterPhone" TEXT`);
      console.log('✅ Report.reporterPhone column added');
    } catch (error) {
      console.log('ℹ️  Report.reporterPhone column may already exist');
    }

    try {
      await client.query(`ALTER TABLE "Report" ADD COLUMN IF NOT EXISTS "userId" INTEGER`);
      console.log('✅ Report.userId column added');
    } catch (error) {
      console.log('ℹ️  Report.userId column may already exist');
    }

    // Add foreign key constraints
    try {
      await client.query(`
        ALTER TABLE "UserProfile" ADD CONSTRAINT IF NOT EXISTS "UserProfile_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      `);
      console.log('✅ UserProfile foreign key constraint added');
    } catch (error) {
      console.log('ℹ️  UserProfile foreign key constraint may already exist');
    }

    try {
      await client.query(`
        ALTER TABLE "AdminProfile" ADD CONSTRAINT IF NOT EXISTS "AdminProfile_adminId_fkey" 
        FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      `);
      console.log('✅ AdminProfile foreign key constraint added');
    } catch (error) {
      console.log('ℹ️  AdminProfile foreign key constraint may already exist');
    }

    try {
      await client.query(`
        ALTER TABLE "Report" ADD CONSTRAINT IF NOT EXISTS "Report_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
      `);
      console.log('✅ Report foreign key constraint added');
    } catch (error) {
      console.log('ℹ️  Report foreign key constraint may already exist');
    }

    try {
      await client.query(`
        ALTER TABLE "UserReward" ADD CONSTRAINT IF NOT EXISTS "UserReward_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      `);
      console.log('✅ UserReward foreign key constraint added');
    } catch (error) {
      console.log('ℹ️  UserReward foreign key constraint may already exist');
    }

    try {
      await client.query(`
        ALTER TABLE "RewardHistory" ADD CONSTRAINT IF NOT EXISTS "RewardHistory_userRewardId_fkey" 
        FOREIGN KEY ("userRewardId") REFERENCES "UserReward"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      `);
      console.log('✅ RewardHistory foreign key constraint added');
    } catch (error) {
      console.log('ℹ️  RewardHistory foreign key constraint may already exist');
    }

    try {
      await client.query(`
        ALTER TABLE "RewardHistory" ADD CONSTRAINT IF NOT EXISTS "RewardHistory_reportId_fkey" 
        FOREIGN KEY ("reportId") REFERENCES "Report"("reportId") ON DELETE SET NULL ON UPDATE CASCADE
      `);
      console.log('✅ RewardHistory report foreign key constraint added');
    } catch (error) {
      console.log('ℹ️  RewardHistory report foreign key constraint may already exist');
    }

    // Add indexes
    try {
      await client.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS "UserProfile_userId_key" ON "UserProfile"("userId")
      `);
      console.log('✅ UserProfile unique index added');
    } catch (error) {
      console.log('ℹ️  UserProfile unique index may already exist');
    }

    try {
      await client.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS "AdminProfile_adminId_key" ON "AdminProfile"("adminId")
      `);
      console.log('✅ AdminProfile unique index added');
    } catch (error) {
      console.log('ℹ️  AdminProfile unique index may already exist');
    }

    try {
      await client.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS "UserReward_userId_key" ON "UserReward"("userId")
      `);
      console.log('✅ UserReward unique index added');
    } catch (error) {
      console.log('ℹ️  UserReward unique index may already exist');
    }

    try {
      await client.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")
      `);
      console.log('✅ User email unique index added');
    } catch (error) {
      console.log('ℹ️  User email unique index may already exist');
    }

    try {
      await client.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS "Admin_email_key" ON "Admin"("email")
      `);
      console.log('✅ Admin email unique index added');
    } catch (error) {
      console.log('ℹ️  Admin email unique index may already exist');
    }

    console.log('🎉 All missing tables and constraints have been created!');
  } catch (error) {
    console.error('❌ Error connecting to database:', error);
  } finally {
    await client.end();
  }
}

createMissingTables();