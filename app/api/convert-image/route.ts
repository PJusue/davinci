import { NextRequest, NextResponse } from "next/server";
import { getClaudeClient } from "@/lib/claude-api";
import { generateAllFormats } from "@/lib/iac-generators";
import { ConversionRequest, ConversionResponse } from "@/types/infrastructure";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body: ConversionRequest = await request.json();
    const { input, provider, formats } = body;

    if (!input || !provider || !formats || formats.length === 0) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate image data format
    if (!input.startsWith("data:image/")) {
      return NextResponse.json(
        { success: false, error: "Invalid image data format" },
        { status: 400 }
      );
    }

    // Get API key from environment
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Anthropic API key not configured. Please add your API key in settings.",
        },
        { status: 500 }
      );
    }

    // Initialize Claude client
    const claude = getClaudeClient(apiKey);

    // Analyze image input
    const parsed = await claude.analyzeImage(input, provider);

    // Generate IaC code
    const generated = generateAllFormats(parsed, formats);

    const response: ConversionResponse = {
      success: true,
      parsed,
      generated,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Error in convert-image:", error);

    let errorMessage = "Failed to convert architecture diagram";
    if (error.message?.includes("API key")) {
      errorMessage = "Invalid API key. Please check your Anthropic API key.";
    } else if (error.message?.includes("quota") || error.message?.includes("rate limit")) {
      errorMessage = "API rate limit exceeded. Please try again later.";
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
