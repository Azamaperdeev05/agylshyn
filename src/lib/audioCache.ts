// Deterministic client-side audio cache for ElevenLabs generated speech

const audioCache = new Map<string, string>(); // key -> objectUrl
const pendingRequests = new Map<string, Promise<string>>(); // deduplicate in-flight requests

/**
 * Creates a deterministic cache key for a sentence and its audio settings
 */
export function getAudioCacheKey(
  text: string,
  voiceId: string,
  modelId: string
): string {
  const normalized = text.trim().toLowerCase();
  return `${voiceId}::${modelId}::${normalized}`;
}

/**
 * Checks if audio for given parameters is already cached
 */
export function hasCachedAudio(
  text: string,
  voiceId: string,
  modelId: string
): boolean {
  const key = getAudioCacheKey(text, voiceId, modelId);
  return audioCache.has(key);
}

/**
 * Retrieves cached audio URL if present
 */
export function getCachedAudio(
  text: string,
  voiceId: string,
  modelId: string
): string | undefined {
  const key = getAudioCacheKey(text, voiceId, modelId);
  return audioCache.get(key);
}

/**
 * Stores audio blob as an object URL in the session cache
 */
export function storeCachedAudio(
  text: string,
  voiceId: string,
  modelId: string,
  blob: Blob
): string {
  const key = getAudioCacheKey(text, voiceId, modelId);
  const objectUrl = URL.createObjectURL(blob);
  audioCache.set(key, objectUrl);
  return objectUrl;
}

/**
 * Fetches audio for a sentence from the server-side /api/tts endpoint
 * Deduplicates in-flight calls and reuses cached audio
 */
export async function fetchSentenceAudio(
  text: string,
  voiceId: string,
  modelId: string
): Promise<string> {
  const key = getAudioCacheKey(text, voiceId, modelId);

  // Return already cached object URL
  if (audioCache.has(key)) {
    return audioCache.get(key)!;
  }

  // Join existing in-flight request if already fetching
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key)!;
  }

  const fetchPromise = (async () => {
    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          voiceId,
          modelId,
        }),
      });

      if (!response.ok) {
        let errorMessage = "Unable to generate audio. Please try again.";
        try {
          const errorData = await response.json();
          if (errorData?.error) {
            errorMessage = errorData.error;
          }
        } catch {
          // If response isn't JSON
        }
        throw new Error(errorMessage);
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      audioCache.set(key, objectUrl);
      return objectUrl;
    } finally {
      pendingRequests.delete(key);
    }
  })();

  pendingRequests.set(key, fetchPromise);
  return fetchPromise;
}

/**
 * Background pre-generation for the next sentence
 */
export function prefetchSentenceAudio(
  text: string,
  voiceId: string,
  modelId: string
): void {
  if (!text) return;
  const key = getAudioCacheKey(text, voiceId, modelId);
  if (audioCache.has(key) || pendingRequests.has(key)) {
    return;
  }
  // Trigger fetch in background without awaiting
  fetchSentenceAudio(text, voiceId, modelId).catch(() => {
    // Silent fail on prefetch - will retry on explicit play if needed
  });
}

/**
 * Clears the memory cache and releases Blob URLs
 */
export function clearAudioCache(): void {
  for (const url of audioCache.values()) {
    try {
      URL.revokeObjectURL(url);
    } catch {
      // Ignore cleanup error
    }
  }
  audioCache.clear();
  pendingRequests.clear();
}
