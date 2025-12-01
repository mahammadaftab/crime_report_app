import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { ReportStatus, ReportType } from "@prisma/client";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") as ReportStatus | null;
    const type = searchParams.get("type") as ReportType | null;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100); // Cap at 100

    // Build the where clause based on filters
    const where = {
      ...(status && { status }),
      ...(type && { type }),
    };

    // Add timeout protection
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database connection timeout')), 5000)
    );
    
    // Add pagination and optimize query with shorter timeout
    const fetchPromise = Promise.all([
      prisma.report.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          reportId: true,
          type: true,
          title: true,
          description: true,
          reportType: true,
          location: true,
          image: true,
          reporterName: true,
          reporterPhone: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.report.count({ where })
    ]);
    
    const [reports, total] = await Promise.race([fetchPromise, timeoutPromise]) as Awaited<typeof fetchPromise>;

    return NextResponse.json({
      reports,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: unknown) {
    console.error("Failed to fetch reports:", error);

    // More specific error messages
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const errorCode = (error as { code?: string }).code;
      
      if (errorCode === "P1001") {
        return NextResponse.json(
          { error: "Cannot connect to database. Please try again later." },
          { status: 503 }
        );
      }

      if (errorCode === "P2024") {
        return NextResponse.json(
          { error: "Database connection timeout. Please try again." },
          { status: 504 }
        );
      }
    }

    // Handle timeout errors specifically
    if (error instanceof Error && (error.message.includes("timeout") || error.message.includes("Can't reach database server"))) {
      return NextResponse.json(
        { error: "Request timeout. Database is taking too long to respond. Please try again." },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch reports. Please try again later." },
      { status: 500 }
    );
  }
}