"use client";

import React, { useState, useEffect } from "react";
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
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import { PlaybackSpeed, PauseDuration, ReplayLimit } from "@/types/dictation";

interface DictationPlayerProps {
  currentSentenceNumber: number;
  totalSentences: number;
  sentenceText: string;
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
  hasPrev: boolean;
  isLast: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReplay: () => void;
  onNextSentence: () => void;
  onPrevSentence: () => void;
  onExitSession: () => void;
  onSpeedChange: (speed: PlaybackSpeed) => void;
  onPauseDurationChange: (duration: PauseDuration) => void;
  onToggleAutoNext: () => void;
  onCancelCountdown?: () => void;
  voiceName: string;
}

const SPEED_PRESETS: number[] = [0.5, 0.75, 1.0];
const PAUSE_OPTIONS: PauseDuration[] = [0, 1, 2, 3, 4, 5, 7, 10];

export function DictationPlayer({
  currentSentenceNumber,
  totalSentences,
  sentenceText,
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
  hasPrev,
  isLast,
  onPlay,
  onPause,
  onReplay,
  onNextSentence,
  onPrevSentence,
  onExitSession,
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

  // Text visibility toggle (hidden by default as requested)
  const [isTextVisible, setIsTextVisible] = useState(false);

  // Reset visibility whenever the sentence changes so it is hidden by default
  useEffect(() => {
    setIsTextVisible(false);
  }, [currentSentenceNumber, sentenceText]);

  // Global keyboard shortcuts for listening experience
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

      if (e.code === "Space") {
        e.preventDefault();
        if (isPlaying) onPause();
        else onPlay();
      } else if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        onReplay();
      } else if (e.key === "ArrowRight" || e.key === "n" || e.key === "N") {
        e.preventDefault();
        onNextSentence();
      } else if ((e.key === "ArrowLeft" || e.key === "p" || e.key === "P") && hasPrev) {
        e.preventDefault();
        onPrevSentence();
      } else if (e.key === "v" || e.key === "V") {
        e.preventDefault();
        setIsTextVisible((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, onPause, onPlay, onReplay, onNextSentence, onPrevSentence, hasPrev]);

  return (
    <div className="rounded-[18px] bg-white dark:bg-[#1d1d1f] p-4 sm:p-8 border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] space-y-6">
      {/* Header & Apple Progress Strip */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[12px] sm:text-[13px] text-[#86868b]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#0066cc] dark:text-[#2997ff] uppercase tracking-[-0.01em]">
              Сөйлем {currentSentenceNumber} / {totalSentences}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5" />
              {voiceName}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-normal">{progressPercent}%</span>
            <button
              type="button"
              onClick={onExitSession}
              className="text-[#86868b] hover:text-[#ff3b30] flex items-center gap-1 transition-colors cursor-pointer text-[12px]"
              title="Шығу"
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Шығу</span>
            </button>
          </div>
        </div>

        {/* Minimal Apple Progress Bar */}
        <div className="w-full h-1 bg-[rgba(0,0,0,0.06)] dark:bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#0066cc] dark:bg-[#2997ff] rounded-full transition-all duration-300"
            style={{ width: `${Math.max(4, progressPercent)}%` }}
          />
        </div>
      </div>

      {/* English Sentence Display Area (Hidden by default, revealable via Eye button) */}
      <div className="relative py-5 sm:py-7 px-4 sm:px-8 bg-[#f5f5f7] dark:bg-[#000000] rounded-[18px] border border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.07)] min-h-[140px] sm:min-h-[170px] flex flex-col justify-between transition-all">
        {/* Top Bar with Eye Toggle Button */}
        <div className="w-full flex items-center justify-between pb-3 mb-2 border-b border-[rgba(0,0,0,0.04)] dark:border-[rgba(255,255,255,0.05)] text-[12px] text-[#86868b]">
          <span className="font-normal text-[11px] sm:text-[12px]">
            {isTextVisible ? "Мәтін көрсетілді" : "Мәтін жасырулы (тыңдалым режимі)"}
          </span>

          <button
            type="button"
            onClick={() => setIsTextVisible((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium transition-all cursor-pointer ${
              isTextVisible
                ? "bg-[rgba(0,0,0,0.06)] dark:bg-[rgba(255,255,255,0.1)] text-[#1d1d1f] dark:text-white hover:bg-[rgba(0,0,0,0.1)]"
                : "bg-[#0066cc]/10 dark:bg-[#2997ff]/15 text-[#0066cc] dark:text-[#2997ff] hover:bg-[#0066cc]/20"
            }`}
            title={isTextVisible ? "Мәтінді жасыру" : "Мәтінді көрсету (V)"}
          >
            {isTextVisible ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>Мәтінді жасыру</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Мәтінді көрсету</span>
              </>
            )}
          </button>
        </div>

        {/* Content: Visible Text vs Hidden Eye-Prompt */}
        <div className="flex-1 flex items-center justify-center py-2">
          {isTextVisible ? (
            <p className="text-[20px] sm:text-[25px] md:text-[28px] font-medium text-[#1d1d1f] dark:text-white leading-[1.45] tracking-[-0.018em] select-text text-center animate-in fade-in duration-200">
              {sentenceText}
            </p>
          ) : (
            <button
              type="button"
              onClick={() => setIsTextVisible(true)}
              className="group py-3 px-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-transform active:scale-[0.99] text-center"
            >
              <div className="w-11 h-11 rounded-full bg-white dark:bg-[#1c1c1e] text-[#0066cc] dark:text-[#2997ff] shadow-xs border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.1)] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Eye className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[14px] sm:text-[15px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7] group-hover:text-[#0066cc] dark:group-hover:text-[#2997ff] transition-colors">
                  Мәтінді көру үшін көз батырмасын басыңыз
                </p>
                <p className="text-[12px] text-[#86868b]">
                  Алдымен аудионы мұқият тыңдап көріңіз
                </p>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Main Playback Center Area */}
      <div className="flex flex-col items-center justify-center py-2 space-y-4">
        {/* Animated Soundwave */}
        <div className="flex items-center justify-center gap-1.5 h-8">
          {isPlaying ? (
            <>
              <span className="w-1 bg-[#0066cc] dark:bg-[#2997ff] rounded-full animate-soundwave-1" />
              <span className="w-1 bg-[#0066cc] dark:bg-[#2997ff] rounded-full animate-soundwave-2" />
              <span className="w-1 bg-[#0066cc] dark:bg-[#2997ff] rounded-full animate-soundwave-3" />
              <span className="w-1 bg-[#0066cc] dark:bg-[#2997ff] rounded-full animate-soundwave-4" />
              <span className="w-1 bg-[#0066cc] dark:bg-[#2997ff] rounded-full animate-soundwave-5" />
            </>
          ) : (
            <div className="flex items-center gap-1 text-[#86868b]">
              <span className="w-1 h-2 bg-[#86868b]/30 rounded-full" />
              <span className="w-1 h-3 bg-[#86868b]/40 rounded-full" />
              <span className="w-1 h-4 bg-[#86868b]/50 rounded-full" />
              <span className="w-1 h-3 bg-[#86868b]/40 rounded-full" />
              <span className="w-1 h-2 bg-[#86868b]/30 rounded-full" />
            </div>
          )}
        </div>

        {/* Apple Play & Replay Buttons */}
        <div className="flex items-center gap-4">
          {/* Main Action Blue Play/Pause Pill Button */}
          <button
            type="button"
            disabled={isLoading}
            onClick={isPlaying ? onPause : onPlay}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-transform duration-150 active:scale-95 cursor-pointer shadow-sm ${
              isLoading
                ? "bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#86868b] cursor-not-allowed"
                : isPlaying
                ? "bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f]"
                : "bg-[#0066cc] hover:bg-[#0071e3] text-white"
            }`}
            title={isPlaying ? "Pause audio" : "Play sentence (Space)"}
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-0.5" />
            )}
          </button>

          {/* Replay: Apple circular control chip */}
          <button
            type="button"
            disabled={isLoading || !canReplay}
            onClick={onReplay}
            className={`w-11 h-11 rounded-full flex flex-col items-center justify-center transition-all duration-150 active:scale-95 cursor-pointer ${
              !canReplay
                ? "bg-[rgba(0,0,0,0.03)] text-[#86868b]/40 cursor-not-allowed"
                : "bg-[#f5f5f7] dark:bg-[#2c2c2e] hover:bg-[#e5e5ea] dark:hover:bg-[#3a3a3c] text-[#1d1d1f] dark:text-[#f5f5f7]"
            }`}
            title={
              canReplay
                ? "Қайталау (R)"
                : "Қайталау лимиті шегіне жетті"
            }
          >
            <RotateCcw className="w-4 h-4" />
            {remainingReplays !== null && (
              <span className="text-[9px] font-semibold text-[#86868b]">
                {remainingReplays}
              </span>
            )}
          </button>
        </div>

        {/* Status text */}
        <div className="h-5 flex items-center justify-center text-center">
          {isLoading ? (
            <span className="text-[13px] text-[#0066cc] dark:text-[#2997ff] flex items-center gap-1.5 font-normal">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Аудио дайындалуда...
            </span>
          ) : isPlaying ? (
            <span className="text-[13px] text-[#1d1d1f] dark:text-[#f5f5f7] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0066cc] dark:bg-[#2997ff] animate-ping" />
              {currentSentenceNumber}-сөйлем ойналуда...
            </span>
          ) : errorMessage ? (
            <span className="text-[13px] text-[#ff3b30] flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {errorMessage}
            </span>
          ) : (
            <span className="text-[12px] sm:text-[13px] text-[#86868b]">
              Тыңдау үшін Play немесе Space басыңыз • Қайталау үшін R
            </span>
          )}
        </div>

        {/* Visual Countdown Timer (When auto-next is active) */}
        {isPausedCountdown && (
          <div className="p-3.5 rounded-[14px] bg-[#f5f5f7] dark:bg-[#000000] border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.08)] text-center animate-in fade-in duration-150 max-w-xs w-full">
            <p className="text-[12px] text-[#86868b]">
              Келесі сөйлемге дейін:
            </p>
            <div className="text-3xl font-semibold text-[#0066cc] dark:text-[#2997ff] my-1">
              {countdownSeconds}
            </div>
            {onCancelCountdown && (
              <button
                type="button"
                onClick={onCancelCountdown}
                className="text-[12px] text-[#0066cc] dark:text-[#2997ff] hover:underline font-normal cursor-pointer"
              >
                Таймерді тоқтатып, қазір өту
              </button>
            )}
          </div>
        )}
      </div>

      {/* Previous / Next Navigation Row */}
      <div className="flex items-center justify-between gap-3 pt-2 border-t border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.06)]">
        <button
          type="button"
          disabled={!hasPrev}
          onClick={onPrevSentence}
          className="apple-btn-secondary flex-1 sm:flex-initial !py-2.5 !px-5 disabled:opacity-30 disabled:cursor-not-allowed justify-center text-[13px]"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Алдыңғы сөйлем</span>
        </button>

        <button
          type="button"
          onClick={onNextSentence}
          className="apple-btn-primary flex-1 sm:flex-initial !py-2.5 !px-7 justify-center text-[14px] shadow-xs"
        >
          <span>{isLast ? "Аяқтау" : "Келесі сөйлем"}</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>

      {/* Control Strip: Speed Slider, Pause Duration & Auto Next */}
      <div className="pt-2 border-t border-[rgba(0,0,0,0.04)] dark:border-[rgba(255,255,255,0.06)] grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-[13px]">
        {/* Speed Slider (0.5x - 1.0x) */}
        <div className="space-y-2 p-3 rounded-[14px] bg-[#f5f5f7] dark:bg-[#000000] border border-[rgba(0,0,0,0.04)] dark:border-[rgba(255,255,255,0.06)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-1.5 font-normal text-[#86868b] text-[12px] sm:text-[13px]">
              <Gauge className="w-3.5 h-3.5 text-[#0066cc] dark:text-[#2997ff]" />
              <span>Жылдамдық</span>
            </label>
            <span className="px-2 py-0.5 rounded-full bg-white dark:bg-[#1c1c1e] text-[#0066cc] dark:text-[#2997ff] font-semibold text-[12px] sm:text-[13px] border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.1)] shadow-2xs">
              {Number(speed).toFixed(2).replace(/\.?0+$/, "")}x
            </span>
          </div>

          <div className="px-0.5 space-y-1.5">
            <input
              type="range"
              min="0.5"
              max="1.0"
              step="0.05"
              value={Math.min(1.0, Math.max(0.5, Number(speed)))}
              onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
              aria-label="Аудио жылдамдығы"
              className="w-full h-2.5 bg-[#e5e5ea] dark:bg-[#2c2c2e] rounded-full appearance-none cursor-pointer accent-[#0066cc] dark:accent-[#2997ff] focus:outline-none"
            />
            <div className="flex items-center justify-between text-[11px] text-[#86868b] font-normal">
              <button
                type="button"
                onClick={() => onSpeedChange(0.5)}
                className="hover:text-[#0066cc] dark:hover:text-[#2997ff] transition-colors cursor-pointer"
              >
                0.5x
              </button>
              <button
                type="button"
                onClick={() => onSpeedChange(0.75)}
                className="hover:text-[#0066cc] dark:hover:text-[#2997ff] transition-colors cursor-pointer"
              >
                0.75x
              </button>
              <button
                type="button"
                onClick={() => onSpeedChange(1.0)}
                className="hover:text-[#0066cc] dark:hover:text-[#2997ff] transition-colors cursor-pointer"
              >
                1.0x
              </button>
            </div>
          </div>
        </div>

        {/* Pause Duration Selector */}
        <div className="space-y-2 p-3 rounded-[14px] bg-[#f5f5f7] dark:bg-[#000000] border border-[rgba(0,0,0,0.04)] dark:border-[rgba(255,255,255,0.06)] flex flex-col justify-between">
          <label className="flex items-center gap-1.5 font-normal text-[#86868b] text-[12px] sm:text-[13px]">
            <Clock className="w-3.5 h-3.5 text-[#0066cc] dark:text-[#2997ff]" />
            <span>Сөйлем арасындағы үзіліс</span>
          </label>
          <select
            value={pauseDuration}
            onChange={(e) =>
              onPauseDurationChange(Number(e.target.value) as PauseDuration)
            }
            className="w-full py-1.5 px-3 rounded-full bg-white dark:bg-[#1c1c1e] border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.08)] text-[#1d1d1f] dark:text-[#f5f5f7] font-normal focus:outline-none focus:ring-2 focus:ring-[#0071e3] cursor-pointer text-[13px]"
          >
            {PAUSE_OPTIONS.map((sec) => (
              <option key={sec} value={sec}>
                {sec === 0 ? "0 сек (Лезде)" : `${sec} секунд`}
              </option>
            ))}
          </select>
        </div>

        {/* Auto Next Toggle */}
        <div className="space-y-2 p-3 rounded-[14px] bg-[#f5f5f7] dark:bg-[#000000] border border-[rgba(0,0,0,0.04)] dark:border-[rgba(255,255,255,0.06)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-normal text-[#86868b] flex items-center gap-1.5 text-[12px] sm:text-[13px]">
              <Sparkles className="w-3.5 h-3.5 text-[#0066cc] dark:text-[#2997ff]" />
              <span>Авто-жалғастыру</span>
            </span>
          </div>

          <button
            type="button"
            onClick={onToggleAutoNext}
            className={`w-full py-1.5 px-4 rounded-full border font-normal flex items-center justify-between transition-all cursor-pointer text-[13px] ${
              autoNext
                ? "bg-[rgba(52,199,89,0.08)] border-[#34c759]/30 text-[#34c759]"
                : "bg-white dark:bg-[#1c1c1e] border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.08)] text-[#86868b]"
            }`}
          >
            <span>{autoNext ? "Автоматты түрде" : "Қолмен басқару"}</span>
            {autoNext ? (
              <ToggleRight className="w-5 h-5 text-[#34c759]" />
            ) : (
              <ToggleLeft className="w-5 h-5 text-[#86868b]" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
