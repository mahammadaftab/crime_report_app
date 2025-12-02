-- CreateEnum
DO $$ BEGIN
    CREATE TYPE "public"."ReportStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'RESOLVED', 'DISMISSED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateEnum
DO $$ BEGIN
    CREATE TYPE "public"."ReportType" AS ENUM ('EMERGENCY', 'NON_EMERGENCY');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateEnum
DO $$ BEGIN
    CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'MODERATOR', 'USER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "public"."Report" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "type" "public"."ReportType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "reportType" TEXT NOT NULL,
    "location" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "image" TEXT,
    "status" "public"."ReportStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "public"."User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
DO $$ BEGIN
    CREATE UNIQUE INDEX IF NOT EXISTS "Report_reportId_key" ON "public"."Report"("reportId");
EXCEPTION
    WHEN duplicate_table THEN null;
END $$;

-- CreateIndex
DO $$ BEGIN
    CREATE INDEX IF NOT EXISTS "Report_reportId_idx" ON "public"."Report"("reportId");
EXCEPTION
    WHEN duplicate_table THEN null;
END $$;

-- CreateIndex
DO $$ BEGIN
    CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "public"."User"("email");
EXCEPTION
    WHEN duplicate_table THEN null;
END $$;