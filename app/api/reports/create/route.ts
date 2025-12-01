import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ReportType } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    // Get session to associate report with user
    const session = await getServerSession(authOptions);
    
    const {
      reportId,
      type,
      specificType,
      title,
      description,
      location,
      image,
      status,
      reporterName,
      reporterPhone,
    } = await request.json();

    // Create the report
    const report = await prisma.report.create({
      data: {
        reportId,
        type: type as ReportType,
        title,
        description,
        reportType: specificType,
        location,
        image: image || null,
        status: status || "PENDING",
        reporterName: reporterName || null,
        reporterPhone: reporterPhone || null,
        // Associate with user if available
        ...(session?.user?.email && {
          user: {
            connect: {
              email: session.user.email,
            },
          },
        }),
      },
    });

    return NextResponse.json({
      success: true,
      reportId: report.reportId,
      message: "Report submitted successfully",
    });
  } catch (error) {
    console.error("Error creating report:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit report",
      },
      { status: 500 }
    );
  }
}