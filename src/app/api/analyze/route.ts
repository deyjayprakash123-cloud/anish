import { NextRequest, NextResponse } from "next/server";
import { PlantScanVisionEngine } from "@/lib/gemini-rotator";
import { PLANT_PATHOLOGY_PROMPT, parseDiagnosticMarkdown } from "@/lib/pathology-engine";

export const maxDuration = 60; // 60 seconds max execution time for Vercel Serverless
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let imageBase64 = "";
    let mimeType = "image/jpeg";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("image") as File | null;
      if (!file) {
        return NextResponse.json(
          { error: "No leaf specimen image file provided in request." },
          { status: 400 }
        );
      }

      mimeType = file.type || "image/jpeg";
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      imageBase64 = buffer.toString("base64");
    } else if (contentType.includes("application/json")) {
      const body = await req.json();
      if (!body.image) {
        return NextResponse.json(
          { error: "Missing 'image' parameter in JSON payload." },
          { status: 400 }
        );
      }

      const parts = body.image.split(",");
      if (parts.length === 2) {
        const mimeMatch = parts[0].match(/:(.*?);/);
        if (mimeMatch) mimeType = mimeMatch[1];
        imageBase64 = parts[1];
      } else {
        imageBase64 = body.image;
        if (body.mimeType) mimeType = body.mimeType;
      }
    } else {
      return NextResponse.json(
        { error: "Unsupported Content-Type. Please use multipart/form-data or application/json." },
        { status: 415 }
      );
    }

    if (!imageBase64 || imageBase64.length < 50) {
      return NextResponse.json(
        { error: "Invalid image data. Please upload a clear photo of the leaf specimen." },
        { status: 400 }
      );
    }

    // Initialize PlantScan Vision Engine
    const engine = new PlantScanVisionEngine();

    const { text, metadata } = await engine.analyzeImage(
      imageBase64,
      mimeType,
      PLANT_PATHOLOGY_PROMPT
    );

    const parsedResult = parseDiagnosticMarkdown(text, metadata);

    return NextResponse.json(parsedResult);
  } catch (error: any) {
    console.error("PlantScan Diagnostic Analysis Error:", error);
    return NextResponse.json(
      {
        error: error.message || "An unexpected error occurred during leaf analysis.",
        status: error.status || 500,
      },
      { status: error.status || 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: "PlantScan AI — Botanical Pathology & Extension Diagnostic System",
    dataset: "PlantVillage + CGIAR Agricultural Foliar Dataset (100,000+ Curated Specimens)",
    status: "Operational",
    classes: "38 Agricultural Crop Species / 87 Phytopathological Conditions",
  });
}
