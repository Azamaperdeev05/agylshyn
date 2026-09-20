import type { DictationStats, SentenceResult } from "../types/dictation.ts";

/**
 * Computes overall session statistics from all completed sentence results
 */
export function calculateSessionStats(
  results: SentenceResult[],
  totalDurationSeconds: number
): DictationStats {
  if (!results || results.length === 0) {
    return {
      overallAccuracy: 0,
      totalSentences: 0,
      totalWords: 0,
      correctWords: 0,
      incorrectWords: 0,
      missingWords: 0,
      extraWords: 0,
      replaysCount: 0,
      totalDurationSeconds: 0,
      performanceRating: "Easy",
      difficultWords: [],
    };
  }

  let totalWords = 0;
  let correctWords = 0;
  let incorrectWords = 0;
  let missingWords = 0;
  let extraWords = 0;
  let replaysCount = 0;

  const wordFrequencyMap: Record<string, number> = {};

  for (const res of results) {
    totalWords += res.totalExpectedWords;
    correctWords += res.correctWords;
    incorrectWords += res.wrongWords;
    missingWords += res.missingWords;
    extraWords += res.extraWords;
    replaysCount += res.replaysUsed || 0;

    // Track words that were wrong or missing
    for (const token of res.tokens) {
      if (token.type === "wrong" || token.type === "missing") {
        const rawTarget = token.expected || "";
        const clean = rawTarget
          .toLowerCase()
          .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'’“”]/g, "")
          .trim();
        if (clean.length > 2) {
          wordFrequencyMap[clean] = (wordFrequencyMap[clean] || 0) + 1;
        }
      }
    }
  }

  // Calculate overall accuracy %
  let overallAccuracy = 0;
  if (totalWords > 0) {
    const rawRatio = (correctWords - extraWords * 0.5) / totalWords;
    overallAccuracy = Math.round(Math.max(0, Math.min(1, rawRatio)) * 100);
  }

  // Listening performance rating
  let performanceRating: "Easy" | "Moderate" | "Difficult" = "Moderate";
  if (overallAccuracy >= 90) {
    performanceRating = "Easy";
  } else if (overallAccuracy < 70) {
    performanceRating = "Difficult";
  }

  // Sort most difficult words by frequency
  const difficultWords = Object.entries(wordFrequencyMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word, count]) => ({ word, count }));

  return {
    overallAccuracy,
    totalSentences: results.length,
    totalWords,
    correctWords,
    incorrectWords,
    missingWords,
    extraWords,
    replaysCount,
    totalDurationSeconds,
    performanceRating,
    difficultWords,
  };
}

/**
 * Formats duration in seconds into mm:ss or hh:mm:ss
 */
export function formatDuration(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  if (mins < 60) {
    return `${mins}m ${secs.toString().padStart(2, "0")}s`;
  }
  const hours = Math.floor(mins / 60);
  const remMins = mins % 60;
  return `${hours}h ${remMins.toString().padStart(2, "0")}m ${secs.toString().padStart(2, "0")}s`;
}
