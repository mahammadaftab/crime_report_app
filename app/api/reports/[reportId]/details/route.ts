import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { awardPointsForReport, revokePointsForReport } from "@/lib/rewards";


export async function GET(
  request: Request,
  { params }: { params: Promise<{ reportId: string }> }
) {
  try {
    const { reportId } = await params;

    // Allow access to any report for all users (anonymous reports are public)
    const report = await prisma.report.findUnique({
      where: {
        reportId,
      },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json(report);
  } catch (error: unknown) {
    console.error("Error fetching report details:", error);
    return NextResponse.json(
      { error: "Failed to fetch report details" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ reportId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admin users can update report status
    if (session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { status } = await request.json();
    const { reportId } = await params;

    // Get the current report to check its previous status and userId
    const currentReport = await prisma.report.findUnique({
      where: { reportId },
    });

    if (!currentReport) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    // Update the report status
    const updatedReport = await prisma.report.update({
      where: { reportId },
      data: { status },
    });

    // Process rewards synchronously to ensure real-time updates
    try {
      console.log(`Processing reward logic for report ${reportId}: ${currentReport.status} -> ${status}`);
      
      // Only award points when status changes to RESOLVED and the report has a user
      if (currentReport.status !== "RESOLVED" && status === "RESOLVED" && currentReport.userId) {
        console.log(`Awarding points for resolved report ${reportId} to user ${currentReport.userId}`);
        // Award points for resolved report
        const rewardResult = await awardPointsForReport(currentReport.userId, currentReport.reportId);
        console.log(`Successfully awarded points for resolved report ${reportId} to user ${currentReport.userId}`, rewardResult);
      } 
      // Revoke points if status changes from RESOLVED to DISMISSED or REJECTED
      else if (currentReport.status === "RESOLVED" && (status === "DISMISSED" || status === "REJECTED") && currentReport.userId) {
        console.log(`Revoking points for ${status.toLowerCase()} report ${reportId} from user ${currentReport.userId}`);
        // Revoke points for dismissed/rejected report that was previously resolved
        const revokeResult = await revokePointsForReport(currentReport.userId, currentReport.reportId);
        console.log(`Successfully revoked points for ${status.toLowerCase()} report ${reportId} from user ${currentReport.userId}`, revokeResult);
      }
      // Handle case where a report goes directly from PENDING/IN_PROGRESS to DISMISSED/REJECTED
      // In this case, no points were awarded yet, so no need to revoke anything
      else {
        console.log(`No reward action needed for report ${reportId}: ${currentReport.status} -> ${status}`);
      }
    } catch (rewardError) {
      console.error(`Error handling reward logic for report ${reportId}:`, rewardError);
      // Even if reward processing fails, we still return success for the report update
      // The admin UI will show the report status update as successful
    }

    return NextResponse.json(updatedReport);
  } catch (error: unknown) {
    console.error("Error updating report:", error);
    return NextResponse.json(
      { error: "Error updating report" },
      { status: 500 }
    );
  }
}