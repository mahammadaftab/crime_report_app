import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
  try {
    const { image } = await request.json();
    const base64Data = image.split(",")[1];

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    const prompt = `Analyze this emergency situation image and respond in this exact format without any asterisks or bullet points:
TITLE: Write a clear, brief title
TYPE: Choose one (Theft, Fire Outbreak, Medical Emergency, Natural Disaster, Violence, or Other)
DESCRIPTION: Write a clear, concise description`;

    // Add timeout protection for external API call
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Image analysis timeout')), 10000)
    );
    
    const generateContentPromise = model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg",
        },
      },
    ]);
    
    const result = await Promise.race([generateContentPromise, timeoutPromise]) as Awaited<typeof generateContentPromise>;

    const textPromise = result.response.text(); // Ensure text() is awaited
    const text = await Promise.race([textPromise, timeoutPromise]) as Awaited<typeof textPromise>;

    // Parse the response more precisely
    const titleMatch = text.match(/TITLE:\s*(.+)/);
    const typeMatch = text.match(/TYPE:\s*(.+)/);
    const descMatch = text.match(/DESCRIPTION:\s*(.+)/);

    return NextResponse.json({
      title: titleMatch?.[1]?.trim() || "",
      reportType: typeMatch?.[1]?.trim() || "",
      description: descMatch?.[1]?.trim() || "",
    });
  } catch (error) {
    console.error("Image analysis error:", error);
    
    // Handle timeout errors specifically
    if (error instanceof Error && error.message.includes("timeout")) {
      return NextResponse.json(
        { error: "Image analysis timeout. Please try again with a smaller image." },
        { status: 504 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to analyze image" },
      { status: 500 }
    );
  }
}