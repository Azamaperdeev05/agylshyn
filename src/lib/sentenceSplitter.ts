import type { Sentence } from "../types/dictation.ts";

const HONORIFIC_TITLES = [
  "mr.",
  "mrs.",
  "ms.",
  "dr.",
  "prof.",
  "sr.",
  "jr.",
  "st.",
  "gen.",
  "sen.",
  "rep.",
  "gov.",
  "capt.",
  "col.",
  "maj.",
  "lt.",
  "sgt.",
  "rev.",
  "hon.",
];

const CONTINUATION_ABBREVIATIONS = [
  "etc.",
  "e.g.",
  "i.e.",
  "vs.",
  "inc.",
  "ltd.",
  "co.",
  "corp.",
  "dept.",
  "approx.",
  "est.",
  "vol.",
  "no.",
  "a.m.",
  "p.m.",
];

/**
 * Normalizes text: trims extra whitespace, converts line breaks and curly quotes
 */
export function normalizeText(text: string): string {
  if (!text) return "";
  return text
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}

/**
 * Counts syllables in an English word using phonetic heuristics
 */
function countWordSyllables(word: string): number {
  const clean = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!clean) return 1;
  if (clean.length <= 3) return 1;

  // Replace common endings that don't add syllables
  const normalized = clean
    .replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "")
    .replace(/^y/, "");

  const matches = normalized.match(/[aeiouy]{1,2}/g);
  const count = matches ? matches.length : 1;
  return Math.max(1, count);
}

/**
 * Estimates CEFR difficulty (A1, A2, B1, B2, C1, C2) from text metrics
 */
export function estimateCEFRDifficulty(
  wordCount: number,
  sentenceCount: number,
  totalSyllables: number
): { level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2"; label: string; score: number } {
  if (wordCount === 0 || sentenceCount === 0) {
    return { level: "A1", label: "Beginner (A1)", score: 0 };
  }

  const asl = wordCount / sentenceCount; // Average sentence length
  const asw = totalSyllables / wordCount; // Average syllables per word

  // Flesch-Kincaid Grade Level formula
  const fkgl = 0.39 * asl + 11.8 * asw - 15.59;
  const roundedFkgl = Math.max(0, Math.round(fkgl * 10) / 10);

  if (roundedFkgl <= 2.5) {
    return { level: "A1", label: "Beginner (A1)", score: roundedFkgl };
  } else if (roundedFkgl <= 4.5) {
    return { level: "A2", label: "Elementary (A2)", score: roundedFkgl };
  } else if (roundedFkgl <= 7.0) {
    return { level: "B1", label: "Intermediate (B1)", score: roundedFkgl };
  } else if (roundedFkgl <= 10.0) {
    return { level: "B2", label: "Upper Intermediate (B2)", score: roundedFkgl };
  } else if (roundedFkgl <= 13.0) {
    return { level: "C1", label: "Advanced (C1)", score: roundedFkgl };
  } else {
    return { level: "C2", label: "Proficiency (C2)", score: roundedFkgl };
  }
}

/**
 * Checks if a segment should be merged with the subsequent segment
 */
function shouldMergeWithNext(prevSegment: string, nextSegment: string): boolean {
  const trimmedPrev = prevSegment.trim().toLowerCase();
  const trimmedNext = nextSegment.trim();
  if (!trimmedNext) return true;

  // 1. Honorific titles (e.g. "Dr. ", "Mr. ") always merge with following name
  for (const title of HONORIFIC_TITLES) {
    if (trimmedPrev.endsWith(title)) {
      return true;
    }
  }

  // 2. Single initial like "John F."
  if (/(?:^|\s)[a-zA-Z]\.$/.test(trimmedPrev)) {
    return true;
  }

  // 3. Decimal numbers: e.g. ends with "3." and next starts with "14"
  if (/\b\d+\.$/.test(trimmedPrev) && /^\d+/.test(trimmedNext)) {
    return true;
  }

  // 4. Continuation abbreviations like "e.g.", "i.e.", "etc." when followed by lowercase word
  const startsWithLowercase = /^[a-z]/.test(trimmedNext);
  if (startsWithLowercase) {
    for (const abbr of CONTINUATION_ABBREVIATIONS) {
      if (trimmedPrev.endsWith(abbr)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Splits English text into sentences with abbreviation handling and fallbacks
 */
export function splitIntoSentences(rawText: string): Sentence[] {
  const cleaned = normalizeText(rawText);
  if (!cleaned) return [];

  let rawSegments: string[] = [];

  // Attempt using Intl.Segmenter if supported
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    try {
      const segmenter = new Intl.Segmenter("en", { granularity: "sentence" });
      const iterator = segmenter.segment(cleaned);
      for (const seg of iterator) {
        if (seg.segment.trim().length > 0) {
          rawSegments.push(seg.segment.trim());
        }
      }
    } catch {
      rawSegments = [];
    }
  }

  // Fallback regex segmentation if Intl.Segmenter failed or wasn't available
  if (rawSegments.length === 0) {
    const matches = cleaned.match(/[^.!?\n]+(?:[.!?]+(?=(?:["'\s]|$))|\n+|$)/g);
    if (matches) {
      rawSegments = matches.map((s) => s.trim()).filter(Boolean);
    } else {
      rawSegments = [cleaned];
    }
  }

  // Merge segments based on honorifics and abbreviations
  const merged: string[] = [];
  for (let i = 0; i < rawSegments.length; i++) {
    const current = rawSegments[i];
    if (merged.length > 0 && shouldMergeWithNext(merged[merged.length - 1], current)) {
      merged[merged.length - 1] = merged[merged.length - 1] + " " + current;
    } else {
      merged.push(current);
    }
  }

  // Transform into final Sentence objects with accurate word counts
  const sentences: Sentence[] = [];
  let id = 1;

  for (const s of merged) {
    const trimmed = s.replace(/\s+/g, " ").trim();
    if (trimmed.length > 0) {
      const words = trimmed.match(/[\w'-]+/g) || [];
      sentences.push({
        id: id++,
        text: trimmed,
        wordCount: words.length,
      });
    }
  }

  return sentences;
}

/**
 * Calculates aggregate stats for input text
 */
export function analyzeText(rawText: string) {
  const sentences = splitIntoSentences(rawText);
  const words = rawText.match(/[\w'-]+/g) || [];
  const characterCount = rawText.length;
  const wordCount = words.length;

  let totalSyllables = 0;
  for (const w of words) {
    totalSyllables += countWordSyllables(w);
  }

  const difficulty = estimateCEFRDifficulty(
    wordCount,
    sentences.length,
    totalSyllables
  );

  return {
    characterCount,
    wordCount,
    sentenceCount: sentences.length,
    sentences,
    difficulty,
  };
}
