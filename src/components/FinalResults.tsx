"use client";

import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import {
  Trophy,
  CheckCircle2,
  Clock,
  RotateCcw,
  Sparkles,
  ArrowRight,
  RefreshCw,
  PlusCircle,
  AlertCircle,
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
  const mistakeSentencesCount = results.filter((r) => r.accuracy < 100).length;

  useEffect(() => {
    try {
      if (stats.overallAccuracy >= 80) {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
        });
      }
    } catch {
      // Ignore if canvas not supported
    }
  }, [stats.overallAccuracy]);

  return (
    <div className="max-w-[760px] mx-auto space-y-8 py-4 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="text-center space-y-2">
        <p className="text-[12px] sm:text-[13px] font-semibold text-[#86868b] uppercase tracking-wider">
          Жаттығу аяқталды
        </p>
        <h1 className="text-3xl sm:text-5xl font-semibold text-[#1d1d1f] dark:text-white tracking-[-0.025em]">
          Нәтижелер.
        </h1>
        <p className="text-[14px] sm:text-[17px] text-[#86868b] max-w-md mx-auto leading-[1.47] px-2">
          Диктант бойынша толық есеп пен қателерді талдау көрсеткіші.
        </p>
      </div>

      {/* Main Score Card (Apple Store Utility Card with soft elevation) */}
      <div className="rounded-[18px] bg-white dark:bg-[#1d1d1f] p-5 sm:p-8 border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] apple-product-shadow flex flex-col sm:flex-row items-center justify-around gap-6 sm:gap-8 text-center sm:text-left">
        {/* Big Circular Accuracy Ring */}
        <div className="flex flex-col items-center">
          <div className="relative w-36 h-36 rounded-full border-4 border-[#f5f5f7] dark:border-[#2c2c2e] flex items-center justify-center">
            <div
              className="absolute inset-0 rounded-full border-4 border-[#0066cc] dark:border-[#2997ff] border-t-transparent border-l-transparent transition-all"
              style={{
                transform: `rotate(${Math.min(360, (stats.overallAccuracy / 100) * 360)}deg)`,
              }}
            />
            <div className="text-center">
              <span className="text-4xl sm:text-5xl font-semibold text-[#1d1d1f] dark:text-white tracking-[-0.025em]">
                {stats.overallAccuracy}%
              </span>
              <span className="block text-[11px] font-normal text-[#86868b] uppercase tracking-wider mt-0.5">
                Дәлдік
              </span>
            </div>
          </div>
        </div>

        {/* High-level performance indicators */}
        <div className="space-y-3 max-w-sm">
          <div>
            <span className="text-[12px] text-[#86868b] uppercase tracking-wider font-semibold">
              Жалпы бағалау
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[13px] font-semibold px-3 py-1 rounded-full bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white">
                {stats.performanceRating}
              </span>
              <span className="text-[13px] text-[#86868b]">
                {stats.overallAccuracy >= 90
                  ? "Тамаша түсіну және жазу"
                  : stats.overallAccuracy >= 75
                  ? "Жақсы деңгей, қате аз"
                  : "Жаттығуды жалғастыру қажет"}
              </span>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-4 text-[13px] text-[#86868b]">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Уақыт: <strong>{formatDuration(stats.totalDurationSeconds)}</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" />
              Қайталаулар: <strong>{stats.replaysCount}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Numerical Stats 4-Column Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="rounded-[14px] bg-white dark:bg-[#1d1d1f] p-3.5 sm:p-5 border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.08)] text-center">
          <span className="text-2xl sm:text-3xl font-semibold text-[#1d1d1f] dark:text-white tracking-[-0.02em]">
            {stats.totalSentences}
          </span>
          <span className="block text-[11px] sm:text-[12px] text-[#86868b] font-normal mt-1">
            Сөйлем саны
          </span>
        </div>

        <div className="rounded-[14px] bg-white dark:bg-[#1d1d1f] p-3.5 sm:p-5 border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.08)] text-center">
          <span className="text-2xl sm:text-3xl font-semibold text-[#34c759] tracking-[-0.02em]">
            {stats.correctWords}
          </span>
          <span className="block text-[11px] sm:text-[12px] text-[#86868b] font-normal mt-1">
            Дұрыс сөздер
          </span>
        </div>

        <div className="rounded-[14px] bg-white dark:bg-[#1d1d1f] p-3.5 sm:p-5 border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.08)] text-center">
          <span className="text-2xl sm:text-3xl font-semibold text-[#ff3b30] tracking-[-0.02em]">
            {stats.incorrectWords}
          </span>
          <span className="block text-[11px] sm:text-[12px] text-[#86868b] font-normal mt-1">
            Қате сөздер
          </span>
        </div>

        <div className="rounded-[14px] bg-white dark:bg-[#1d1d1f] p-3.5 sm:p-5 border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.08)] text-center">
          <span className="text-2xl sm:text-3xl font-semibold text-[#ff9500] tracking-[-0.02em]">
            {stats.missingWords}
          </span>
          <span className="block text-[11px] sm:text-[12px] text-[#86868b] font-normal mt-1">
            Түсіп қалған
          </span>
        </div>
      </div>

      {/* Most Difficult Words */}
      {stats.difficultWords.length > 0 && (
        <div className="rounded-[18px] bg-white dark:bg-[#1d1d1f] p-5 sm:p-7 border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] space-y-3">
          <span className="text-[13px] sm:text-[14px] font-semibold text-[#1d1d1f] dark:text-white tracking-[-0.01em]">
            Ең көп қате кеткен сөздер:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-2.5">
            {stats.difficultWords.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-[12px] bg-[#f5f5f7] dark:bg-[#000000] border border-[rgba(0,0,0,0.04)] dark:border-[rgba(255,255,255,0.06)] flex items-center justify-between"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[11px] text-[#86868b]">
                    {idx + 1}.
                  </span>
                  <span className="text-[13px] font-medium text-[#1d1d1f] dark:text-white truncate">
                    {item.word}
                  </span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[rgba(255,59,48,0.1)] text-[#ff3b30] font-semibold shrink-0">
                  {item.count}×
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Targeted Mistake Practice Callout Card */}
      {mistakeSentencesCount > 0 ? (
        <div className="p-5 sm:p-6 rounded-[18px] bg-white dark:bg-[#1d1d1f] border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-5">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-[16px] sm:text-[17px] font-semibold text-[#1d1d1f] dark:text-white tracking-[-0.015em] flex items-center gap-2 justify-center sm:justify-start">
              <Sparkles className="w-4 h-4 text-[#0066cc] dark:text-[#2997ff]" />
              <span>Қате кеткен сөйлемдермен жұмыс</span>
            </h4>
            <p className="text-[13px] sm:text-[14px] text-[#86868b] leading-[1.47]">
              Сізде <strong>{mistakeSentencesCount}</strong> сөйлемде қате болды. Тек осы сөйлемдерді қайталап тыңдап, 100%-ға жеткізіңіз.
            </p>
          </div>

          <button
            type="button"
            onClick={onPracticeMistakes}
            className="apple-btn-primary w-full sm:w-auto shrink-0 text-[13px] !py-2.5 !px-5 justify-center"
          >
            <span>Қателерді пысықтау ({mistakeSentencesCount})</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>
      ) : (
        <div className="p-4 rounded-[14px] bg-[#f5f5f7] dark:bg-[#1d1d1f] border border-[rgba(0,0,0,0.06)] text-center text-[14px] font-medium text-[#34c759] flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Тамаша! Барлық сөйлемдер мінсіз орындалды. Қате жоқ!</span>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 pt-2 sm:pt-3">
        <button
          type="button"
          onClick={onRestartSameText}
          className="apple-btn-secondary w-full sm:w-auto text-[14px] !py-2.5 !px-6 justify-center"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Осы мәтінді қайта бастау</span>
        </button>

        <button
          type="button"
          onClick={onNewDictation}
          className="apple-btn-primary w-full sm:w-auto text-[14px] !py-2.5 !px-7 font-normal justify-center"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Жаңа диктант мәтіні</span>
        </button>
      </div>
    </div>
  );
}
