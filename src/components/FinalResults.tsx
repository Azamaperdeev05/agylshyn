"use client";

import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  Clock,
  RotateCcw,
  Sparkles,
  RefreshCw,
  PlusCircle,
  FileText,
} from "lucide-react";
import { DictationStats, SentenceResult } from "@/types/dictation";
import { formatDuration } from "@/lib/scoreCalculator";

interface FinalResultsProps {
  stats: DictationStats;
  results?: SentenceResult[];
  onPracticeMistakes?: () => void;
  onRestartSameText: () => void;
  onNewDictation: () => void;
}

export function FinalResults({
  stats,
  onRestartSameText,
  onNewDictation,
}: FinalResultsProps) {
  useEffect(() => {
    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Ignore if canvas not supported
    }
  }, []);

  return (
    <div className="max-w-[680px] mx-auto space-y-8 py-4 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="text-center space-y-2.5">
        <div className="w-12 h-12 rounded-full bg-[rgba(52,199,89,0.12)] text-[#34c759] flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <p className="text-[12px] sm:text-[13px] font-semibold text-[#34c759] uppercase tracking-wider">
          Тыңдалым сәтті аяқталды
        </p>
        <h1 className="text-3xl sm:text-5xl font-semibold text-[#1d1d1f] dark:text-white tracking-[-0.025em]">
          Мәтін тыңдалды.
        </h1>
        <p className="text-[14px] sm:text-[17px] text-[#86868b] max-w-md mx-auto leading-[1.47] px-2">
          Барлық сөйлемдер ретімен толық ойнатылды.
        </p>
      </div>

      {/* Main Stats Card */}
      <div className="rounded-[18px] bg-white dark:bg-[#1d1d1f] p-6 sm:p-8 border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] apple-product-shadow space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-[14px] bg-[#f5f5f7] dark:bg-[#000000] p-4 text-center border border-[rgba(0,0,0,0.04)] dark:border-[rgba(255,255,255,0.06)]">
            <span className="text-3xl font-semibold text-[#0066cc] dark:text-[#2997ff] tracking-tight">
              {stats.totalSentences}
            </span>
            <span className="block text-[12px] text-[#86868b] font-normal mt-1">
              Тыңдалған сөйлем
            </span>
          </div>

          <div className="rounded-[14px] bg-[#f5f5f7] dark:bg-[#000000] p-4 text-center border border-[rgba(0,0,0,0.04)] dark:border-[rgba(255,255,255,0.06)]">
            <span className="text-3xl font-semibold text-[#1d1d1f] dark:text-white tracking-tight">
              {formatDuration(stats.totalDurationSeconds)}
            </span>
            <span className="block text-[12px] text-[#86868b] font-normal mt-1 flex items-center justify-center gap-1">
              <Clock className="w-3 h-3" />
              Жалпы уақыт
            </span>
          </div>

          <div className="rounded-[14px] bg-[#f5f5f7] dark:bg-[#000000] p-4 text-center border border-[rgba(0,0,0,0.04)] dark:border-[rgba(255,255,255,0.06)]">
            <span className="text-3xl font-semibold text-[#34c759] tracking-tight">
              {stats.replaysCount}
            </span>
            <span className="block text-[12px] text-[#86868b] font-normal mt-1 flex items-center justify-center gap-1">
              <RotateCcw className="w-3 h-3" />
              Қайталаулар
            </span>
          </div>
        </div>

        <div className="p-4 rounded-[14px] bg-[#f5f5f7] dark:bg-[#000000] border border-[rgba(0,0,0,0.04)] dark:border-[rgba(255,255,255,0.06)] text-center text-[13px] text-[#86868b]">
          <span>Сөйлемдердің табиғи интонациясы мен айтылуын бекіту үшін қалаған сөйлемді қайталай аласыз.</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={onRestartSameText}
          className="apple-btn-secondary w-full sm:w-auto text-[14px] !py-3 sm:!py-2.5 !px-6 justify-center"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1" />
          <span>Басынан қайта тыңдау</span>
        </button>

        <button
          type="button"
          onClick={onNewDictation}
          className="apple-btn-primary w-full sm:w-auto text-[14px] !py-3 sm:!py-2.5 !px-7 font-normal justify-center shadow-xs"
        >
          <PlusCircle className="w-3.5 h-3.5 mr-1" />
          <span>Жаңа мәтін таңдау</span>
        </button>
      </div>
    </div>
  );
}
