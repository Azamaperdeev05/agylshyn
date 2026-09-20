"use client";

import { useState, useEffect, useCallback } from "react";
import {
  UserSettings,
  PlaybackSpeed,
  PauseDuration,
  ReplayLimit,
  DifficultyPreset,
  ThemeMode,
} from "@/types/dictation";

const SETTINGS_STORAGE_KEY = "dictation_trainer_settings_v1";

const DEFAULT_SETTINGS: UserSettings = {
  voiceId: "EXAVITQu4vr4xnSDxMaL",
  voiceName: "Sarah",
  voiceAccent: "American",
  modelId: "eleven_multilingual_v2",
  speed: 1.0,
  pauseDuration: 3,
  autoNext: true,
  maxReplays: "unlimited",
  ignoreCapitalization: true,
  ignorePunctuation: true,
  strictMode: false,
  difficultyPreset: "intermediate",
  theme: "system",
};

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // Ignore parse errors and keep defaults
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync to localStorage
  const updateSettings = useCallback((newPartial: Partial<UserSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...newPartial };
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore write error
      }
      return next;
    });
  }, []);

  // Apply theme class to document element
  useEffect(() => {
    if (!isLoaded) return;
    const root = document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      if (settings.theme === "dark") {
        root.classList.add("dark");
      } else if (settings.theme === "light") {
        root.classList.remove("dark");
      } else {
        // System mode
        if (mediaQuery.matches) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      }
    };

    applyTheme();

    const listener = () => {
      if (settings.theme === "system") {
        applyTheme();
      }
    };
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, [settings.theme, isLoaded]);

  // Apply a difficulty preset
  const applyPreset = useCallback(
    (preset: DifficultyPreset) => {
      if (preset === "beginner") {
        updateSettings({
          difficultyPreset: "beginner",
          speed: 0.75,
          pauseDuration: 5,
          maxReplays: "unlimited",
        });
      } else if (preset === "intermediate") {
        updateSettings({
          difficultyPreset: "intermediate",
          speed: 1.0,
          pauseDuration: 3,
          maxReplays: 3,
        });
      } else if (preset === "advanced") {
        updateSettings({
          difficultyPreset: "advanced",
          speed: 1.25,
          pauseDuration: 2,
          maxReplays: 1,
        });
      }
    },
    [updateSettings]
  );

  return {
    settings,
    isLoaded,
    updateSettings,
    applyPreset,
    setVoice: (voiceId: string, voiceName: string, voiceAccent?: string) =>
      updateSettings({ voiceId, voiceName, voiceAccent }),
    setModel: (modelId: string) => updateSettings({ modelId }),
    setSpeed: (speed: PlaybackSpeed) => updateSettings({ speed, difficultyPreset: "custom" }),
    setPauseDuration: (pauseDuration: PauseDuration) =>
      updateSettings({ pauseDuration, difficultyPreset: "custom" }),
    setAutoNext: (autoNext: boolean) => updateSettings({ autoNext }),
    setMaxReplays: (maxReplays: ReplayLimit) =>
      updateSettings({ maxReplays, difficultyPreset: "custom" }),
    setIgnoreCapitalization: (val: boolean) =>
      updateSettings({ ignoreCapitalization: val }),
    setIgnorePunctuation: (val: boolean) =>
      updateSettings({ ignorePunctuation: val }),
    setStrictMode: (strictMode: boolean) => updateSettings({ strictMode }),
    setTheme: (theme: ThemeMode) => updateSettings({ theme }),
  };
}
