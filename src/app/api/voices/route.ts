import { NextResponse } from "next/server";
import { VoiceOption } from "@/types/dictation";

// Curated top-tier ElevenLabs voices with verified active permissions
const CURATED_DEFAULT_VOICES: VoiceOption[] = [
  {
    voice_id: "EXAVITQu4vr4xnSDxMaL",
    name: "Sarah",
    category: "premade",
    accent: "American",
    gender: "Female",
    description: "Natural, expressive, articulate American English voice. Excellent for listening practice.",
  },
  {
    voice_id: "JBFqnCBsd6RMkjVDRZzb",
    name: "George",
    category: "premade",
    accent: "British",
    gender: "Male",
    description: "Warm, sophisticated British accent with natural pauses and rhythmic cadence.",
  },
  {
    voice_id: "TX3LPaxmHKxFdv7VOQHJ",
    name: "Liam",
    category: "premade",
    accent: "American",
    gender: "Male",
    description: "Crisp, friendly American English narration voice with clear enunciation.",
  },
  {
    voice_id: "XB0fDUnXU5powFXDhCwa",
    name: "Charlotte",
    category: "premade",
    accent: "British",
    gender: "Female",
    description: "Refined, gentle British English voice ideal for educational dictation.",
  },
  {
    voice_id: "cgSgspJ2msm6clMCkdW9",
    name: "Jessica",
    category: "premade",
    accent: "American",
    gender: "Female",
    description: "Clear, youthful American English voice with pleasant pronunciation.",
  },
  {
    voice_id: "nPczCjzI2devNBz1zQrb",
    name: "Brian",
    category: "premade",
    accent: "American",
    gender: "Male",
    description: "Deep, resonant, well-paced American English voice.",
  },
  {
    voice_id: "Xb7hH8MSUJpSbSDYk0k2",
    name: "Alice",
    category: "premade",
    accent: "British",
    gender: "Female",
    description: "Gentle and clear British English speaking style.",
  },
  {
    voice_id: "onwK4e9ZLuTAKqWW03F9",
    name: "Daniel",
    category: "premade",
    accent: "British",
    gender: "Male",
    description: "Authoritative, classical British English voice.",
  },
];

export async function GET() {
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      configured: false,
      voices: CURATED_DEFAULT_VOICES,
    });
  }

  try {
    const response = await fetch("https://api.elevenlabs.io/v1/voices", {
      headers: {
        "xi-api-key": apiKey.trim(),
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      // If the API key lacks voices_read permission or returns error, use verified curated voices
      return NextResponse.json({
        configured: true,
        voices: CURATED_DEFAULT_VOICES,
      });
    }

    const data = await response.json();
    const rawVoices = data.voices || [];

    const voices: VoiceOption[] = rawVoices.map((v: {
      voice_id: string;
      name: string;
      category?: string;
      labels?: Record<string, string>;
      preview_url?: string;
      description?: string;
    }) => {
      const labels = v.labels || {};
      return {
        voice_id: v.voice_id,
        name: v.name,
        category: v.category,
        accent: labels.accent || (labels.language === "en" ? "English" : undefined),
        gender: labels.gender,
        description: labels.description || v.description,
        preview_url: v.preview_url,
      };
    });

    return NextResponse.json({
      configured: true,
      voices: voices.length > 0 ? voices : CURATED_DEFAULT_VOICES,
    });
  } catch {
    return NextResponse.json({
      configured: true,
      voices: CURATED_DEFAULT_VOICES,
    });
  }
}
