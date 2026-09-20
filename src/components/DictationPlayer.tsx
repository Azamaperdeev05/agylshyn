"use client";

import React from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Loader2,
  Volume2,
  Clock,
  Gauge,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  HelpCircle,
  AlertTriangle,
} from "lucide-react";
import { PlaybackSpeed, PauseDuration, ReplayLimit } from "@/types/dictation";

interface DictationPlayerProps {
  currentSentenceNumber: number;
  totalSentences: number;
  isPlaying: boolean;
  isLoading: boolean;
  errorMessage: string | null;
  replaysUsed: number;
  maxReplays: ReplayLimit;
  speed: PlaybackSpeed;
  pauseDuration: PauseDuration;
  autoNext: boolean;
  isPausedCountdown: boolean;
  countdownSeconds: number;
  onPlay: () => void;
  onPause: () => void;
  onReplay: () => void;
  onSpeedChange: (speed: PlaybackSpeed) => void;
  onPauseDurationChange: (duration: PauseDuration) => void;
  onToggleAutoNext: () => void;
  onCancelCountdown?: () => void;
  voiceName: string;
}

const SPEED_OPTIONS: PlaybackSpeed[] = [0.5, 0.75, 1.0, 1.25, 1.5];
const PAUSE_OPTIONS: PauseDuration[] = [0, 1, 2, 3, 4, 5, 7, 10];

export function DictationPlayer({
  currentSentenceNumber,
  totalSentences,
  isPlaying,
  isLoading,
  errorMessage,
  replaysUsed,
  maxReplays,
  speed,
  pauseDuration,
  autoNext,
  isPausedCountdown,
  countdownSeconds,
  onPlay,
  onPause,
  onReplay,
  onSpeedChange,
  onPauseDurationChange,
  onToggleAutoNext,
  onCancelCountdown,
  voiceName,
}: DictationPlayerProps) {
  // Calculate replay limits
  const canReplay =
    maxReplays === "unlimited" || replaysUsed < (maxReplays as number);
  const remainingReplays =
    maxReplays === "unlimited"
      ? null
      : Math.max(0, (maxReplays as number) - replaysUsed);

  // Progress %
  const progressPercent = Math.round(
    ((currentSentenceNumber - 1) / Math.max(1, totalSentences)) * 100
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-7 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
      {/* Header & Progress Indicator */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Dictation In Progress
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">•</span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5 text-slate-400" />
              {voiceName}
            </span>
          </div>

          <div className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
            Sentence {currentSentenceNumber} of {totalSentences}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${Math.max(5, progressPercent)}%` }}
          />
        </div>
      </div>

      {/* Main Playback Center Stage */}
      <div className="flex flex-col items-center justify-center py-4 space-y-4">
        {/* Animated Waveform Visualization */}
        <div className="flex items-center justify-center gap-1.5 h-10">
          {isPlaying ? (
            <>
              <span className="w-1.5 bg-blue-500 dark:bg-blue-400 rounded-full animate-soundwave-1" />
              <span className="w-1.5 bg-indigo-500 dark:bg-indigo-400 rounded-full animate-soundwave-2" />
              <span className="w-1.5 bg-blue-600 dark:bg-blue-500 rounded-full animate-soundwave-3" />
              <span className="w-1.5 bg-indigo-600 dark:bg-indigo-500 rounded-full animate-soundwave-4" />
              <span className="w-1.5 bg-blue-500 dark:bg-blue-400 rounded-full animate-soundwave-5" />
            </>
          ) : (
            <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
              <span className="w-1.5 h-2 bg-slate-300 dark:bg-slate-700 rounded-full" />
              <span className="w-1.5 h-3 bg-slate-300 dark:bg-slate-700 rounded-full" />
              <span className="w-1.5 h-4 bg-slate-300 dark:bg-slate-700 rounded-full" />
              <span className="w-1.5 h-3 bg-slate-300 dark:bg-slate-700 rounded-full" />
              <span className="w-1.5 h-2 bg-slate-300 dark:bg-slate-700 rounded-full" />
            </div>
          )}
        </div>

        {/* Large Tactile Play & Replay Buttons */}
        <div className="flex items-center gap-4">
          {/* Main Play / Pause Button */}
          <button
            type="button"
            disabled={isLoading}
            onClick={isPlaying ? onPause : onPlay}
            className={`w-18 h-18 rounded-2xl flex items-center justify-center shadow-lg transition-all transform active:scale-95 cursor-pointer ${
              isLoading
                ? "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                : isPlaying
                ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30 hover:shadow-blue-500/40"
            }`}
            title={isPlaying ? "Pause audio" : "Play sentence"}
          >
            {isLoading ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-8 h-8 fill-white" />
            ) : (
              <Play className="w-8 h-8 fill-white ml-1" />
            )}
          </button>

          {/* Replay Button */}
          <button
            type="button"
            disabled={isLoading || !canReplay}
            onClick={onReplay}
            className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center border transition-all cursor-pointer ${
              !canReplay
                ? "bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed"
                : "bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-xs hover:scale-105 active:scale-95"
            }`}
            title={
              canReplay
                ? "Replay current sentence (Press R)"
                : "Maximum replays reached"
            }
          >
            <RotateCcw className="w-5 h-5" />
            {remainingReplays !== null && (
              <span className="text-[10px] font-bold mt-0.5 text-slate-500 dark:text-slate-400">
                {remainingReplays} left
              </span>
            )}
          </button>
        </div>

        {/* Loading / Status Label */}
        <div className="h-6 flex items-center justify-center text-center">
          {isLoading ? (
            <span className="inline-flex items-center gap-2 text-xs font-medium text-blue-600 dark:text-blue-400 animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Generating natural ElevenLabs speech...
            </span>
          ) : isPlaying ? (
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              Listening to sentence {currentSentenceNumber}...
            </span>
          ) : errorMessage ? (
            <span className="text-xs font-medium text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              {errorMessage}
            </span>
          ) : (
            <span className="text-xs text-slate-400 dark:text-slate-500">
              Press Play or Space to listen • Press R to replay
            </span>
          )}
        </div>

        {/* Visual Countdown Timer (Pause system from Section 6) */}
        {isPausedCountdown && (
          <div className="w-full max-w-sm p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 text-center animate-in fade-in zoom-in-95 duration-150">
            <p className="text-xs font-medium text-blue-700 dark:text-blue-300">
              Audio finished. Next sentence in:
            </p>
            <div className="text-3xl font-black text-blue-600 dark:text-blue-400 my-1 animate-pulse">
              {countdownSeconds}
            </div>
            {onCancelCountdown && (
              <button
                type="button"
                onClick={onCancelCountdown}
                className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-semibold"
              >
                Cancel timer & write now
              </button>
            )}
          </div>
        )}
      </div>

      {/* Control Strip: Speed, Pause Duration & Auto Next */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        {/* Speed Selector */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
            <Gauge className="w-3.5 h-3.5 text-blue-500" />
            <span>Playback Speed</span>
          </label>
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            {SPEED_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onSpeedChange(opt)}
                className={`flex-1 py-1 rounded font-medium text-center transition-all ${
                  speed === opt
                    ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-bold shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {opt}x
              </button>
            ))}
          </div>
        </div>

        {/* Pause Duration Selector */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Pause after sentence</span>
          </label>
          <select
            value={pauseDuration}
            onChange={(e) =>
              onPauseDurationChange(Number(e.target.value) as PauseDuration)
            }
            className="w-full py-1.5 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {PAUSE_OPTIONS.map((sec) => (
              <option key={sec} value={sec}>
                {sec === 0 ? "0 sec (Instant)" : `${sec} seconds`}
              </option>
            ))}
          </select>
        </div>

        {/* Auto Next Toggle */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>Auto Next</span>
            </span>
            <span className="text-[10px] text-slate-400">
              {autoNext ? "Automatic" : "Manual"}
            </span>
          </div>

          <button
            type="button"
            onClick={onToggleAutoNext}
            className={`w-full py-1.5 px-3 rounded-lg border font-medium flex items-center justify-between transition-colors ${
              autoNext
                ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
                : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
            }`}
          >
            <span>{autoNext ? "Auto Advance ON" : "Wait for Learner (OFF)"}</span>
            {autoNext ? (
              <ToggleRight className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <ToggleLeft className="w-5 h-5 text-slate-400" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
