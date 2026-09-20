"use client";

import { useState, useEffect, useCallback } from "react";
import { HistorySession, SentenceResult } from "@/types/dictation";

const HISTORY_STORAGE_KEY = "dictation_trainer_history_v1";

export function useHistory() {
  const [sessions, setSessions] = useState<HistorySession[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (stored) {
        setSessions(JSON.parse(stored));
      }
    } catch {
      // Ignore parse errors
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveSession = useCallback(
    (
      title: string,
      snippet: string,
      sentenceResults: SentenceResult[],
      accuracy: number,
      durationSeconds: number,
      difficultyLevel: string
    ) => {
      const totalWords = sentenceResults.reduce(
        (acc, curr) => acc + curr.totalExpectedWords,
        0
      );

      const newSession: HistorySession = {
        id: "sess_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
        timestamp: Date.now(),
        title: title || "Dictation Practice",
        snippet: snippet ? snippet.slice(0, 80) + "..." : "English Practice",
        sentenceCount: sentenceResults.length,
        wordCount: totalWords,
        accuracy,
        durationSeconds,
        difficultyLevel,
        sentenceResults,
      };

      setSessions((prev) => {
        const next = [newSession, ...prev].slice(0, 50); // keep up to 50 recent sessions
        try {
          localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(next));
        } catch {
          // Ignore
        }
        return next;
      });

      return newSession;
    },
    []
  );

  const deleteSession = useCallback((id: string) => {
    setSessions((prev) => {
      const next = prev.filter((s) => s.id !== id);
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setSessions([]);
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch {
      // Ignore
    }
  }, []);

  return {
    sessions,
    isLoaded,
    saveSession,
    deleteSession,
    clearHistory,
  };
}
