import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const count = await prisma.report.count();
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error fetching report count:", error);
    return NextResponse.json({ count: 0 }, { status: 200 });
  }
}