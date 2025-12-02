import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { ReportStatus, ReportType } from "@prisma/client";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import cache from "@/lib/cache";

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

    // Create cache key based on filters
    const cacheKey = `reports_${JSON.stringify({ where, page, limit })}`;
    
    // Check cache first for non-admin users (admins might want fresh data)
    if (session.user?.role !== "ADMIN") {
      const cachedData = cache.get(cacheKey);
      if (cachedData) {
        console.log("Returning cached reports data");
        return NextResponse.json(cachedData);
      }
    }

    // Fetch reports without any timeout
    const [reports, total] = await Promise.all([
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

    const responseData = {
      reports,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
    
    // Cache the result for 1 minute for non-admin users
    if (session.user?.role !== "ADMIN") {
      cache.set(cacheKey, responseData);
    }
    
    return NextResponse.json(responseData);
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
        { 
          error: "Request timeout. Database is taking too long to respond. Please try again.",
          reports: [], // Return empty array so UI doesn't break
          pagination: {
            page: 1,
            limit: 50,
            total: 0,
            pages: 0
          }
        },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { 
        error: "Failed to fetch reports. Please try again later.",
        reports: [],
        pagination: {
          page: 1,
          limit: 50,
          total: 0,
          pages: 0
        }
      },
      { status: 500 }
    );
  }
}