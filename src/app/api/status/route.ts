import { NextResponse } from "next/server";

export async function GET() {
  const hasKey = Boolean(process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_API_KEY.trim().length > 0);

  return NextResponse.json({
    configured: hasKey,
    hasApiKey: hasKey,
    version: "1.0.0",
    message: hasKey
      ? "ElevenLabs API is configured on server."
      : "ElevenLabs API key is missing. Set ELEVENLABS_API_KEY in .env.",
  });
}
