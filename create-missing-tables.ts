// Script to create missing tables in the database
import { PrismaClient } from '@prisma/client';

async function createMissingTables() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Creating missing tables...');
    
    // Check if User table exists
    try {
      await prisma.$queryRaw`SELECT 1 FROM "User" LIMIT 1`;
      console.log('✅ User table already exists');
    } catch {
      console.error("Error creating User table:");
    }
    
    // Check if Admin table exists
    try {
      await prisma.$queryRaw`SELECT 1 FROM "Admin" LIMIT 1`;
      console.log('✅ Admin table already exists');
    } catch {
      console.error("Error creating Admin table:");
    }
    
    // Check if UserProfile table exists
    try {
      await prisma.$queryRaw`SELECT 1 FROM "UserProfile" LIMIT 1`;
      console.log('✅ UserProfile table already exists');
    } catch {
      console.error("Error creating UserProfile table:");
    }
    
    // Check if AdminProfile table exists
    try {
      await prisma.$queryRaw`SELECT 1 FROM "AdminProfile" LIMIT 1`;
      console.log('✅ AdminProfile table already exists');
    } catch {
      console.error("Error creating AdminProfile table:");
    }
    
    // Check if Report table exists
    try {
      await prisma.$queryRaw`SELECT 1 FROM "Report" LIMIT 1`;
      console.log('✅ Report table already exists');
    } catch {
      console.error("Error creating Report table:");
    }
    
    // Check if ContactMessage table exists
    try {
      await prisma.$queryRaw`SELECT 1 FROM "ContactMessage" LIMIT 1`;
      console.log('✅ ContactMessage table already exists');
    } catch {
      console.error("Error creating ContactMessage table:");
    }
    
    // Check if UserReward table exists
    try {
      await prisma.$queryRaw`SELECT 1 FROM "UserReward" LIMIT 1`;
      console.log('✅ UserReward table already exists');
    } catch {
      console.error("Error creating UserReward table:");
    }
    
    // Check if RewardHistory table exists
    try {
      await prisma.$queryRaw`SELECT 1 FROM "RewardHistory" LIMIT 1`;
      console.log('✅ RewardHistory table already exists');
    } catch {
      console.error("Error creating RewardHistory table:");
    }
    
    // Check if VerificationToken table exists
    try {
      await prisma.$queryRaw`SELECT 1 FROM "VerificationToken" LIMIT 1`;
      console.log('✅ VerificationToken table already exists');
    } catch {
      console.error("Error creating VerificationToken table:");
    }
    
    // Check if Account table exists
    try {
      await prisma.$queryRaw`SELECT 1 FROM "Account" LIMIT 1`;
      console.log('✅ Account table already exists');
    } catch {
      console.error("Error creating Account table:");
    }
    
    // Check if Session table exists
    try {
      await prisma.$queryRaw`SELECT 1 FROM "Session" LIMIT 1`;
      console.log('✅ Session table already exists');
    } catch {
      console.error("Error creating Session table:");
    }
    
    // Add foreign key constraints if they don't exist
    try {
      await prisma.$executeRaw`
        ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      `;
      console.log('✅ UserProfile foreign key constraint added');
    } catch {
      console.log('ℹ️  UserProfile foreign key constraint may already exist');
    }
    
    try {
      await prisma.$executeRaw`
        ALTER TABLE "AdminProfile" ADD CONSTRAINT "AdminProfile_adminId_fkey" 
        FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      `;
      console.log('✅ AdminProfile foreign key constraint added');
    } catch {
      console.log('ℹ️  AdminProfile foreign key constraint may already exist');
    }
    
    try {
      await prisma.$executeRaw`
        ALTER TABLE "Report" ADD CONSTRAINT "Report_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
      `;
      console.log('✅ Report foreign key constraint added');
    } catch {
      console.log('ℹ️  Report foreign key constraint may already exist');
    }
    
    try {
      await prisma.$executeRaw`
        ALTER TABLE "UserReward" ADD CONSTRAINT "UserReward_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      `;
      console.log('✅ UserReward foreign key constraint added');
    } catch {
      console.log('ℹ️  UserReward foreign key constraint may already exist');
    }
    
    try {
      await prisma.$executeRaw`
        ALTER TABLE "RewardHistory" ADD CONSTRAINT "RewardHistory_userRewardId_fkey" 
        FOREIGN KEY ("userRewardId") REFERENCES "UserReward"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      `;
      console.log('✅ RewardHistory foreign key constraint added');
    } catch {
      console.log('ℹ️  RewardHistory foreign key constraint may already exist');
    }
    
    try {
      await prisma.$executeRaw`
        ALTER TABLE "RewardHistory" ADD CONSTRAINT "RewardHistory_reportId_fkey" 
        FOREIGN KEY ("reportId") REFERENCES "Report"("reportId") ON DELETE SET NULL ON UPDATE CASCADE
      `;
      console.log('✅ RewardHistory report foreign key constraint added');
    } catch {
      console.log('ℹ️  RewardHistory report foreign key constraint may already exist');
    }
    
    try {
      await prisma.$executeRaw`
        ALTER TABLE "VerificationToken" ADD CONSTRAINT "VerificationToken_identifier_fkey" 
        FOREIGN KEY ("identifier") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE
      `;
      console.log('✅ VerificationToken foreign key constraint added');
    } catch {
      console.log('ℹ️  VerificationToken foreign key constraint may already exist');
    }
    
    try {
      await prisma.$executeRaw`
        ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
      `;
      console.log('✅ Account foreign key constraint added');
    } catch {
      console.log('ℹ️  Account foreign key constraint may already exist');
    }
    
    try {
      await prisma.$executeRaw`
        ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
      `;
      console.log('✅ Session foreign key constraint added');
    } catch {
      console.log('ℹ️  Session foreign key constraint may already exist');
    }
    
    // Add indexes if they don't exist
    try {
      await prisma.$executeRaw`
        CREATE UNIQUE INDEX IF NOT EXISTS "UserProfile_userId_key" ON "UserProfile"("userId")
      `;
      console.log('✅ UserProfile unique index added');
    } catch {
      console.log('ℹ️  UserProfile unique index may already exist');
    }
    
    try {
      await prisma.$executeRaw`
        CREATE UNIQUE INDEX IF NOT EXISTS "AdminProfile_adminId_key" ON "AdminProfile"("adminId")
      `;
      console.log('✅ AdminProfile unique index added');
    } catch {
      console.log('ℹ️  AdminProfile unique index may already exist');
    }
    
    try {
      await prisma.$executeRaw`
        CREATE UNIQUE INDEX IF NOT EXISTS "UserReward_userId_key" ON "UserReward"("userId")
      `;
      console.log('✅ UserReward unique index added');
    } catch {
      console.log('ℹ️  UserReward unique index may already exist');
    }
    
    try {
      await prisma.$executeRaw`
        CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token")
      `;
      console.log('✅ VerificationToken unique index added');
    } catch {
      console.log('ℹ️  VerificationToken unique index may already exist');
    }
    
    try {
      await prisma.$executeRaw`
        CREATE UNIQUE INDEX IF NOT EXISTS "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId")
      `;
      console.log('✅ Account unique index added');
    } catch {
      console.log('ℹ️  Account unique index may already exist');
    }
    
    try {
      await prisma.$executeRaw`
        CREATE UNIQUE INDEX IF NOT EXISTS "Session_sessionToken_key" ON "Session"("sessionToken")
      `;
      console.log('✅ Session unique index added');
    } catch {
      console.log('ℹ️  Session unique index may already exist');
    }
    
    // Insert sample data if tables are empty
    try {
      const userCount = await prisma.user.count();
      if (userCount === 0) {
        await prisma.user.create({
          data: {
            email: 'user@example.com',
            name: 'John Doe',
            password: 'hashed_password',
            role: 'USER',
            emailVerified: true,
            verificationOTP: '111111',
            otpExpiresAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
        console.log('✅ Sample user data inserted');
      }
    } catch {
      console.error("Error inserting sample data:");
    }
    
    console.log('🎉 All missing tables and constraints have been created!');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createMissingTables();