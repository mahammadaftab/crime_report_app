-- CreateEnum
DO $$ BEGIN
    CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'RESOLVED', 'DISMISSED', 'REJECTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateEnum
DO $$ BEGIN
    CREATE TYPE "ReportType" AS ENUM ('EMERGENCY', 'NON_EMERGENCY');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateEnum
DO $$ BEGIN
    CREATE TYPE "Role" AS ENUM ('ADMIN', 'MODERATOR', 'USER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateEnum
DO $$ BEGIN
    CREATE TYPE "ContactStatus" AS ENUM ('RECEIVED', 'READ', 'RESPONDED', 'CLOSED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationOTP" TEXT,
    "otpExpiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Admin" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationOTP" TEXT DEFAULT '111111',
    "otpExpiresAt" TIMESTAMP(3),
    "department" TEXT,
    "permissions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "UserProfile" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "AdminProfile" (
    "id" SERIAL NOT NULL,
    "adminId" INTEGER NOT NULL,
    "phone" TEXT,
    "department" TEXT,
    "position" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Report" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "type" "ReportType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "reportType" TEXT NOT NULL,
    "location" TEXT,
    "image" TEXT,
    "reporterName" TEXT,
    "reporterPhone" TEXT,
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
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
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "RewardHistory" (
    "id" SERIAL NOT NULL,
    "userRewardId" INTEGER NOT NULL,
    "pointsEarned" INTEGER NOT NULL,
    "amountEarned" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "reportId" TEXT,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RewardHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "ContactMessage" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "status" "ContactStatus" NOT NULL DEFAULT 'RECEIVED',
    "ip" VARCHAR(45),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
DO $$ BEGIN
    CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
EXCEPTION
    WHEN duplicate_table THEN null;
END $$;

-- CreateIndex
DO $$ BEGIN
    CREATE UNIQUE INDEX IF NOT EXISTS "Admin_email_key" ON "Admin"("email");
EXCEPTION
    WHEN duplicate_table THEN null;
END $$;

-- CreateIndex
DO $$ BEGIN
    CREATE UNIQUE INDEX IF NOT EXISTS "UserProfile_userId_key" ON "UserProfile"("userId");
EXCEPTION
    WHEN duplicate_table THEN null;
END $$;

-- CreateIndex
DO $$ BEGIN
    CREATE UNIQUE INDEX IF NOT EXISTS "AdminProfile_adminId_key" ON "AdminProfile"("adminId");
EXCEPTION
    WHEN duplicate_table THEN null;
END $$;

-- CreateIndex
DO $$ BEGIN
    CREATE UNIQUE INDEX IF NOT EXISTS "Report_reportId_key" ON "Report"("reportId");
EXCEPTION
    WHEN duplicate_table THEN null;
END $$;

-- CreateIndex
DO $$ BEGIN
    CREATE UNIQUE INDEX IF NOT EXISTS "UserReward_userId_key" ON "UserReward"("userId");
EXCEPTION
    WHEN duplicate_table THEN null;
END $$;

-- CreateIndex
DO $$ BEGIN
    CREATE INDEX IF NOT EXISTS "Report_reportId_idx" ON "Report"("reportId");
EXCEPTION
    WHEN duplicate_table THEN null;
END $$;

-- AddForeignKey
DO $$ BEGIN
    ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- AddForeignKey
DO $$ BEGIN
    ALTER TABLE "AdminProfile" ADD CONSTRAINT "AdminProfile_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- AddForeignKey
DO $$ BEGIN
    ALTER TABLE "Report" ADD CONSTRAINT "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- AddForeignKey
DO $$ BEGIN
    ALTER TABLE "UserReward" ADD CONSTRAINT "UserReward_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- AddForeignKey
DO $$ BEGIN
    ALTER TABLE "RewardHistory" ADD CONSTRAINT "RewardHistory_userRewardId_fkey" FOREIGN KEY ("userRewardId") REFERENCES "UserReward"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- AddForeignKey
DO $$ BEGIN
    ALTER TABLE "RewardHistory" ADD CONSTRAINT "RewardHistory_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("reportId") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;