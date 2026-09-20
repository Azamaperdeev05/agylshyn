"use client";

import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import {
  Trophy,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  BarChart,
  Clock,
  Layers,
  AlertOctagon,
  ArrowRight,
  RefreshCw,
  PlusCircle,
} from "lucide-react";
import { DictationStats, SentenceResult } from "@/types/dictation";
import { formatDuration } from "@/lib/scoreCalculator";

interface FinalResultsProps {
  stats: DictationStats;
  results: SentenceResult[];
  onPracticeMistakes: () => void;
  onRestartSameText: () => void;
  onNewDictation: () => void;
}

export function FinalResults({
  stats,
  results,
  onPracticeMistakes,
  onRestartSameText,
  onNewDictation,
}: FinalResultsProps) {
  // Count sentences with mistakes
  const mistakeSentencesCount = results.filter((r) => r.accuracy < 100).length;

  // Trigger celebration confetti if overall accuracy is high
  useEffect(() => {
    try {
      if (stats.overallAccuracy >= 80) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch {
      // Ignore if canvas not supported
    }
  }, [stats.overallAccuracy]);

  const ratingColor = {
    Easy: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    Moderate: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    Difficult: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  }[stats.performanceRating];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-250">
      {/* Header Banner */}
      <div className="text-center space-y-2 py-4">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-amber-500/25 mb-3">
          <Trophy className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Dictation Complete 🎉
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Excellent listening session! Here is your comprehensive transcription breakdown.
        </p>
      </div>

      {/* Main Score Hero Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-around gap-6 text-center sm:text-left">
        {/* Big Circular Accuracy Gauge */}
        <div className="flex flex-col items-center">
          <div className="relative w-36 h-36 rounded-full border-8 border-slate-100 dark:border-slate-800 flex items-center justify-center">
            <div
              className="absolute inset-0 rounded-full border-8 border-blue-600 dark:border-blue-500 border-t-transparent border-l-transparent transition-all"
              style={{
                transform: `rotate(${Math.min(360, (stats.overallAccuracy / 100) * 360)}deg)`,
              }}
            />
            <div className="text-center">
              <span className="text-4xl font-black text-slate-900 dark:text-white">
                {stats.overallAccuracy}%
              </span>
              <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Accuracy
              </span>
            </div>
          </div>
        </div>

        {/* High-level performance indicators */}
        <div className="space-y-3 max-w-sm">
          <div>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">
              Listening Performance
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`text-sm font-bold px-3 py-1 rounded-full border ${ratingColor}`}
              >
                {stats.performanceRating}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {stats.overallAccuracy >= 90
                  ? "Flawless comprehension"
                  : stats.overallAccuracy >= 75
                  ? "Strong listening ear"
                  : "Great foundation to build on"}
              </span>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Practice Time: <strong>{formatDuration(stats.totalDurationSeconds)}</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              Replays: <strong>{stats.replaysCount}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Numerical Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {stats.totalSentences}
          </span>
          <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Total Sentences
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {stats.correctWords}
          </span>
          <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Correct Words
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-2xl font-black text-rose-600 dark:text-rose-400">
            {stats.incorrectWords}
          </span>
          <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Incorrect Words
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {stats.missingWords}
          </span>
          <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Missing Words
          </span>
        </div>
      </div>

      {/* Most Difficult Words Section (Section 14) */}
      {stats.difficultWords.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <AlertOctagon className="w-4 h-4 text-amber-500" />
            <span>Most Difficult Words in This Passage:</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {stats.difficultWords.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-xs font-bold text-slate-400">
                    {idx + 1}.
                  </span>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {item.word}
                  </span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold shrink-0">
                  {item.count}×
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mistake Practice Mode Callout (Section 15) */}
      {mistakeSentencesCount > 0 ? (
        <div className="p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5 justify-center sm:justify-start">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Targeted Mistake Practice</span>
            </h4>
            <p className="text-xs text-amber-800/80 dark:text-amber-300/80">
              You had mistakes in <strong>{mistakeSentencesCount}</strong> sentence
              {mistakeSentencesCount === 1 ? "" : "s"}. Master them with dedicated focused repetition.
            </p>
          </div>

          <button
            type="button"
            onClick={onPracticeMistakes}
            className="w-full sm:w-auto shrink-0 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Practice Mistakes ({mistakeSentencesCount})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 text-center text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Incredible! 100% precision across all sentences. No mistakes to review!</span>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={onRestartSameText}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Restart Same Text</span>
        </button>

        <button
          type="button"
          onClick={onNewDictation}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Dictation Passage</span>
        </button>
      </div>
    </div>
  );
}
