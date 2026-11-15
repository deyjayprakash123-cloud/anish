import { NextRequest, NextResponse } from "next/server";
import { GeminiDualRotator } from "@/lib/gemini-rotator";
import { PLANT_PATHOLOGY_PROMPT, parseDiagnosticMarkdown } from "@/lib/pathology-engine";

export const maxDuration = 60; // 60 seconds max execution time for Vercel Serverless
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let imageBase64 = "";
    let mimeType = "image/jpeg";
    let clientKey1 = req.headers.get("x-gemini-key-1") || undefined;
    let clientKey2 = req.headers.get("x-gemini-key-2") || undefined;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("image") as File | null;
      if (!file) {
        return NextResponse.json(
          { error: "No image file provided in request." },
          { status: 400 }
        );
      }

      mimeType = file.type || "image/jpeg";
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      imageBase64 = buffer.toString("base64");

      const bodyKey1 = formData.get("key1") as string | null;
      const bodyKey2 = formData.get("key2") as string | null;
      if (bodyKey1) clientKey1 = bodyKey1;
      if (bodyKey2) clientKey2 = bodyKey2;
    } else if (contentType.includes("application/json")) {
      const body = await req.json();
      if (!body.image) {
        return NextResponse.json(
          { error: "Missing 'image' parameter in JSON payload." },
          { status: 400 }
        );
      }

      // Handle data URL prefix if present: "data:image/jpeg;base64,..."
      const parts = body.image.split(",");
      if (parts.length === 2) {
        const mimeMatch = parts[0].match(/:(.*?);/);
        if (mimeMatch) mimeType = mimeMatch[1];
        imageBase64 = parts[1];
      } else {
        imageBase64 = body.image;
        if (body.mimeType) mimeType = body.mimeType;
      }

      if (body.key1) clientKey1 = body.key1;
      if (body.key2) clientKey2 = body.key2;
    } else {
      return NextResponse.json(
        { error: "Unsupported Content-Type. Please use multipart/form-data or application/json." },
        { status: 415 }
      );
    }

    if (!imageBase64 || imageBase64.length < 50) {
      return NextResponse.json(
        { error: "Invalid image data payload. Please upload a valid image file." },
        { status: 400 }
      );
    }

    // Initialize dual-key rotator with client overrides or environment variables
    const rotator = new GeminiDualRotator(clientKey1, clientKey2);

    const { text, metadata } = await rotator.analyzeImage(
      imageBase64,
      mimeType,
      PLANT_PATHOLOGY_PROMPT
    );

    const parsedResult = parseDiagnosticMarkdown(text, metadata);

    return NextResponse.json(parsedResult);
  } catch (error: any) {
    console.error("Diagnostic analysis error:", error);
    return NextResponse.json(
      {
        error: error.message || "An unexpected error occurred during leaf analysis.",
        details: error.details || null,
        status: error.status || 500,
      },
      { status: error.status || 500 }
    );
  }
}

// Simple healthcheck & slot status endpoint
export async function GET() {
  const envKey1Set = Boolean(process.env.GEMINI_API_KEY_1 || process.env.GEMINI_API_KEY);
  const envKey2Set = Boolean(process.env.GEMINI_API_KEY_2);

  return NextResponse.json({
    service: "PhytoScan AI - Plant Pathology Engine",
    status: "Operational",
    slots: {
      GEMINI_API_KEY_1: envKey1Set ? "Configured in Environment" : "Not configured",
      GEMINI_API_KEY_2: envKey2Set ? "Configured in Environment" : "Not configured",
    },
    rateLimitingStrategy: "Dual-Key Active Standby & Auto-Failover (HTTP 429 Resilience)",
    preferredModel: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  });
}
