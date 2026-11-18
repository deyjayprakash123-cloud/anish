import { NextRequest, NextResponse } from "next/server";
import { PlantScanVisionEngine } from "@/lib/gemini-rotator";
import { PLANT_PATHOLOGY_PROMPT } from "@/lib/pathology-engine";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

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

      if (!mimeType || mimeType.includes("svg")) {
        mimeType = "image/jpeg";
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

    const hasKey = Boolean(
      process.env.GROQ_API_KEY ||
      process.env.GROQ_API_KEY_1 ||
      process.env.GROQ_API_KEY_2 ||
      process.env.GEMINI_API_KEY_1 ||
      process.env.GEMINI_API_KEY ||
      process.env.GEMINI_API_KEY_2
    );

    if (!hasKey) {
      return NextResponse.json(
        {
          error:
            "No API key detected in Vercel environment. Please go to Vercel Project Settings → Environment Variables and add GROQ_API_KEY (from https://console.groq.com/keys) or GEMINI_API_KEY_1.",
        },
        { status: 500 }
      );
    }

    // Initialize PlantScan Vision Engine
    const engine = new PlantScanVisionEngine();

    // Stream analysis directly to bypass any Vercel execution timeouts
    const { stream } = await engine.streamAnalysis(
      imageBase64,
      mimeType,
      PLANT_PATHOLOGY_PROMPT
    );

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Accel-Buffering": "no",
      },
    });
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
    mode: "Real-Time Streaming Inference",
  });
}
