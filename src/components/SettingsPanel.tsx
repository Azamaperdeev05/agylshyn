"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Volume2,
  Key,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sliders,
  Check,
  Sparkles,
  Info,
  Play,
  RotateCcw,
  Sun,
  Moon,
  Monitor,
  Zap,
} from "lucide-react";
import {
  UserSettings,
  VoiceOption,
  PlaybackSpeed,
  PauseDuration,
  ReplayLimit,
  DifficultyPreset,
  ThemeMode,
} from "@/types/dictation";

interface SettingsPanelProps {
  settings: UserSettings;
  updateSettings: (newPartial: Partial<UserSettings>) => void;
  applyPreset: (preset: DifficultyPreset) => void;
}

const AVAILABLE_MODELS = [
  {
    id: "eleven_multilingual_v2",
    name: "Eleven Multilingual v2",
    description: "Highest quality natural human voice & rich nuance. Recommended for dictation.",
    recommended: true,
  },
  {
    id: "eleven_turbo_v2_5",
    name: "Eleven Turbo v2.5",
    description: "Ultra-low latency with high realism. Ideal for fast transitions.",
  },
  {
    id: "eleven_flash_v2_5",
    name: "Eleven Flash v2.5",
    description: "Blazing fast inference with natural cadence.",
  },
];

export function SettingsPanel({
  settings,
  updateSettings,
  applyPreset,
}: SettingsPanelProps) {
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [loadingVoices, setLoadingVoices] = useState(true);
  const [apiStatus, setApiStatus] = useState<{ configured: boolean; message: string }>({
    configured: false,
    message: "Checking server configuration...",
  });
  const [activeVoiceAccentFilter, setActiveVoiceAccentFilter] = useState<
    "all" | "American" | "British"
  >("all");
  const [previewingAudio, setPreviewingAudio] = useState<string | null>(null);

  // Fetch voices & status
  useEffect(() => {
    // Check API status
    fetch("/api/status")
      .then((res) => res.json())
      .then((data) => {
        setApiStatus({
          configured: Boolean(data.configured),
          message: data.message,
        });
      })
      .catch(() => {
        setApiStatus({
          configured: false,
          message: "Unable to reach server API.",
        });
      });

    // Fetch voice list
    fetch("/api/voices")
      .then((res) => res.json())
      .then((data) => {
        if (data.voices && Array.isArray(data.voices)) {
          setVoices(data.voices);
        }
      })
      .catch(() => {
        // Fallback handled by API
      })
      .finally(() => {
        setLoadingVoices(false);
      });
  }, []);

  // Filter voices by accent
  const filteredVoices = voices.filter((v) => {
    if (activeVoiceAccentFilter === "all") return true;
    if (activeVoiceAccentFilter === "American") {
      return (
        v.accent?.toLowerCase().includes("american") ||
        (!v.accent && v.description?.toLowerCase().includes("american"))
      );
    }
    if (activeVoiceAccentFilter === "British") {
      return (
        v.accent?.toLowerCase().includes("british") ||
        (!v.accent && v.description?.toLowerCase().includes("british"))
      );
    }
    return true;
  });

  const handlePlayVoicePreview = (url?: string) => {
    if (!url) return;
    if (previewingAudio === url) {
      setPreviewingAudio(null);
      return;
    }
    const audio = new Audio(url);
    setPreviewingAudio(url);
    audio.play().catch(() => {});
    audio.onended = () => setPreviewingAudio(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <span>Application Settings</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Configure ElevenLabs AI voices, playback parameters, answer strictness, and appearance.
        </p>
      </div>

      {/* 1. ElevenLabs API Status & Security Setup Card (Section 23 & 43) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                apiStatus.configured
                  ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
                  : "bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400"
              }`}
            >
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                ElevenLabs API Integration
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Server-side security configuration
              </p>
            </div>
          </div>

          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${
              apiStatus.configured
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
            }`}
          >
            {apiStatus.configured ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Configured on Server</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Key Missing in .env</span>
              </>
            )}
          </span>
        </div>

        {/* Informational Box */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            <span>Zero Client-Side Exposure Protocol</span>
          </div>
          <p>
            Per strict security requirements, your ElevenLabs API key is{" "}
            <strong>never</strong> saved in client localStorage or sent to the browser. It
            is securely read by server API routes via the{" "}
            <code className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-slate-800 dark:text-slate-200">
              ELEVENLABS_API_KEY
            </code>{" "}
            environment variable.
          </p>
          {!apiStatus.configured && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1">
              <span className="font-semibold text-amber-800 dark:text-amber-300">
                How to configure your API key:
              </span>
              <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-400 pl-1">
                <li>Create an account and get an API key at elevenlabs.io</li>
                <li>
                  In project root, create a file named{" "}
                  <code className="font-mono text-blue-600 dark:text-blue-400">
                    .env
                  </code>
                </li>
                <li>
                  Add:{" "}
                  <code className="font-mono text-blue-600 dark:text-blue-400">
                    ELEVENLABS_API_KEY=your_key_here
                  </code>
                </li>
                <li>Restart Next.js dev server</li>
              </ol>
            </div>
          )}
        </div>
      </div>

      {/* 2. Voice Selection (Section 4 & 35) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              ElevenLabs Voice
            </h3>
          </div>

          {/* Accent filters: All / American / British */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs">
            {(["all", "American", "British"] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveVoiceAccentFilter(filter)}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  activeVoiceAccentFilter === filter
                    ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-bold shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {filter === "all" ? "All Accents" : `${filter} English`}
              </button>
            ))}
          </div>
        </div>

        {/* Voice Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
          {filteredVoices.map((v) => {
            const isSelected = settings.voiceId === v.voice_id;
            return (
              <div
                key={v.voice_id}
                onClick={() =>
                  updateSettings({
                    voiceId: v.voice_id,
                    voiceName: v.name,
                    voiceAccent: v.accent,
                  })
                }
                className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left flex flex-col justify-between ${
                  isSelected
                    ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 ring-2 ring-blue-500/20"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/40 dark:bg-slate-950/40"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {v.name}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-600 text-white">
                        Active
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {v.accent && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {v.accent}
                      </span>
                    )}
                    {v.gender && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {v.gender}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {v.description || "Natural high-clarity voice."}
                </p>

                {v.preview_url && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-800 flex justify-end">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayVoicePreview(v.preview_url);
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>
                        {previewingAudio === v.preview_url
                          ? "Playing Preview..."
                          : "Preview Voice"}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Model Selector (Section 4) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-indigo-500" />
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              ElevenLabs AI Model
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select synthesis model architecture
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {AVAILABLE_MODELS.map((model) => {
            const isSelected = settings.modelId === model.id;
            return (
              <button
                key={model.id}
                type="button"
                onClick={() => updateSettings({ modelId: model.id })}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 ring-2 ring-blue-500/20"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/40 dark:bg-slate-950/40"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {model.name}
                  </span>
                  {model.recommended && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      Best
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {model.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Difficulty Presets (Section 34) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Difficulty Presets
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Quickly adjust speed, pause duration, and replay allowances
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Beginner */}
          <button
            type="button"
            onClick={() => applyPreset("beginner")}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              settings.difficultyPreset === "beginner"
                ? "border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20"
                : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                Beginner
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                Comfortable
              </span>
            </div>
            <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1 mt-2">
              <li>• Speed: 0.75x</li>
              <li>• Pause: 5 seconds</li>
              <li>• Replays: Unlimited</li>
            </ul>
          </button>

          {/* Intermediate */}
          <button
            type="button"
            onClick={() => applyPreset("intermediate")}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              settings.difficultyPreset === "intermediate"
                ? "border-blue-500 bg-blue-50/40 dark:bg-blue-950/30 ring-2 ring-blue-500/20"
                : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                Intermediate
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                Standard
              </span>
            </div>
            <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1 mt-2">
              <li>• Speed: 1.0x</li>
              <li>• Pause: 3 seconds</li>
              <li>• Replays: 3 max</li>
            </ul>
          </button>

          {/* Advanced */}
          <button
            type="button"
            onClick={() => applyPreset("advanced")}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              settings.difficultyPreset === "advanced"
                ? "border-purple-500 bg-purple-50/40 dark:bg-purple-950/30 ring-2 ring-purple-500/20"
                : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                Advanced
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                Fast & Strict
              </span>
            </div>
            <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1 mt-2">
              <li>• Speed: 1.25x</li>
              <li>• Pause: 2 seconds</li>
              <li>• Replays: 1 max</li>
            </ul>
          </button>
        </div>
      </div>

      {/* 5. Answer Checking & Strictness Options (Section 10, 38, 39) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white">
          Answer Comparison Rules
        </h3>

        <div className="space-y-3">
          {/* Ignore Capitalization */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div>
              <span className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                Ignore Capitalization
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                "Yesterday" and "yesterday" are marked as identical. (Recommended)
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.ignoreCapitalization}
              onChange={(e) =>
                updateSettings({ ignoreCapitalization: e.target.checked })
              }
              className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
          </div>

          {/* Ignore Punctuation */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div>
              <span className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                Ignore Punctuation
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Commas, periods, and quotation marks do not trigger errors.
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.ignorePunctuation}
              onChange={(e) =>
                updateSettings({ ignorePunctuation: e.target.checked })
              }
              className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
          </div>

          {/* Strict Mode */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div>
              <span className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                Strict Mode
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Demands 100% exact punctuation and capitalization matching.
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.strictMode}
              onChange={(e) =>
                updateSettings({ strictMode: e.target.checked })
              }
              className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 6. Appearance / Theme (Section 25) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white">
          Appearance Theme
        </h3>

        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => updateSettings({ theme: "light" })}
            className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
              settings.theme === "light"
                ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500/20"
                : "border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300"
            }`}
          >
            <Sun className="w-5 h-5" />
            <span className="text-xs font-semibold">Light Mode</span>
          </button>

          <button
            type="button"
            onClick={() => updateSettings({ theme: "dark" })}
            className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
              settings.theme === "dark"
                ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500/20"
                : "border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300"
            }`}
          >
            <Moon className="w-5 h-5" />
            <span className="text-xs font-semibold">Dark Mode</span>
          </button>

          <button
            type="button"
            onClick={() => updateSettings({ theme: "system" })}
            className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
              settings.theme === "system"
                ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500/20"
                : "border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300"
            }`}
          >
            <Monitor className="w-5 h-5" />
            <span className="text-xs font-semibold">System Default</span>
          </button>
        </div>
      </div>
    </div>
  );
}
