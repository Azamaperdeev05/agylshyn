export type DiffTokenType = "correct" | "wrong" | "missing" | "extra";

export interface DiffToken {
  type: DiffTokenType;
  expected?: string;
  actual?: string;
  cleanExpected?: string;
  cleanActual?: string;
}

export interface Sentence {
  id: number;
  text: string;
  wordCount: number;
  audioUrl?: string;
}

export interface SentenceResult {
  sentenceId: number;
  originalText: string;
  userAnswer: string;
  tokens: DiffToken[];
  accuracy: number; // 0 - 100
  correctWords: number;
  wrongWords: number;
  missingWords: number;
  extraWords: number;
  totalExpectedWords: number;
  replaysUsed: number;
  hintUsed: boolean;
  timeTakenSeconds: number;
}

export interface DictationStats {
  overallAccuracy: number;
  totalSentences: number;
  totalWords: number;
  correctWords: number;
  incorrectWords: number;
  missingWords: number;
  extraWords: number;
  replaysCount: number;
  totalDurationSeconds: number;
  performanceRating: "Easy" | "Moderate" | "Difficult";
  difficultWords: { word: string; count: number }[];
}

export type PlaybackSpeed = 0.5 | 0.75 | 1.0 | 1.25 | 1.5;
export type PauseDuration = 0 | 1 | 2 | 3 | 4 | 5 | 7 | 10;
export type ReplayLimit = "unlimited" | 1 | 2 | 3 | 5;
export type DifficultyPreset = "beginner" | "intermediate" | "advanced" | "custom";
export type ThemeMode = "light" | "dark" | "system";

export interface UserSettings {
  voiceId: string;
  voiceName: string;
  voiceAccent?: string;
  modelId: string;
  speed: PlaybackSpeed;
  pauseDuration: PauseDuration;
  autoNext: boolean;
  maxReplays: ReplayLimit;
  ignoreCapitalization: boolean;
  ignorePunctuation: boolean;
  strictMode: boolean;
  difficultyPreset: DifficultyPreset;
  theme: ThemeMode;
}

export interface VoiceOption {
  voice_id: string;
  name: string;
  category?: string;
  accent?: string;
  gender?: string;
  description?: string;
  preview_url?: string;
}

export interface HistorySession {
  id: string;
  timestamp: number;
  title: string;
  snippet: string;
  sentenceCount: number;
  wordCount: number;
  accuracy: number;
  durationSeconds: number;
  difficultyLevel: string;
  sentenceResults: SentenceResult[];
}

export type DictationState =
  | "setup"
  | "ready"
  | "playing"
  | "paused"
  | "paused_countdown"
  | "typing"
  | "checked"
  | "completed";
