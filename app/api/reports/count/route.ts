import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const count = await prisma.report.count();
    
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error fetching report count:", error);
    
    if (error instanceof Error && (error.message.includes("timeout") || error.message.includes("Can't reach database server"))) {
      return NextResponse.json(
        { 
          error: "Request timeout. Database is taking too long to respond. Please try again.",
          count: 0
        },
        { status: 504 }
      );
    }
    
    return NextResponse.json({ count: 0 }, { status: 200 });
  }
}