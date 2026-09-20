import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "ElevenLabs API key is not configured on the server. Please add ELEVENLABS_API_KEY to your .env file to generate natural AI speech.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { text, voiceId = "EXAVITQu4vr4xnSDxMaL", modelId = "eleven_multilingual_v2" } = body;

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Text is required to generate speech." },
        { status: 400 }
      );
    }

    // Call ElevenLabs Text-to-Speech API
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey.trim(),
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text: text.trim(),
          model_id: modelId,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8,
            style: 0.0,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const status = response.status;
      if (status === 401 || status === 403) {
        return NextResponse.json(
          {
            error:
              "Invalid ElevenLabs API key or unauthorized access. Please verify your ELEVENLABS_API_KEY.",
          },
          { status }
        );
      }
      if (status === 429) {
        return NextResponse.json(
          {
            error:
              "ElevenLabs rate limit or quota reached. Please wait a moment or check your subscription.",
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          error:
            "Unable to generate audio. Please check your API key or try again.",
        },
        { status: 500 }
      );
    }

    const audioBuffer = await response.arrayBuffer();

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "Unable to generate audio. Please check your network connection and try again.",
      },
      { status: 500 }
    );
  }
}
