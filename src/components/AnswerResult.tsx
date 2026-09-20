"use client";

import React from "react";
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { SentenceResult } from "@/types/dictation";

interface AnswerResultProps {
  result: SentenceResult;
  isLastSentence: boolean;
  onTryAgain: () => void;
  onNextSentence: () => void;
}

export function AnswerResult({
  result,
  isLastSentence,
  onTryAgain,
  onNextSentence,
}: AnswerResultProps) {
  const isPerfect = result.accuracy === 100;

  return (
    <div className="rounded-[18px] bg-white dark:bg-[#1d1d1f] p-4 sm:p-8 border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] space-y-5 sm:space-y-6 animate-in fade-in duration-200">
      {/* Accuracy Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-[17px] ${
              isPerfect
                ? "bg-[rgba(52,199,89,0.12)] text-[#34c759]"
                : result.accuracy >= 75
                ? "bg-[rgba(0,102,204,0.1)] text-[#0066cc] dark:text-[#2997ff]"
                : "bg-[rgba(255,59,48,0.1)] text-[#ff3b30]"
            }`}
          >
            {result.accuracy}%
          </div>
          <div>
            <h3 className="text-[17px] font-semibold text-[#1d1d1f] dark:text-white tracking-[-0.015em] flex items-center gap-2">
              {isPerfect ? (
                <>
                  <span>Керемет! 100% дәлдік</span>
                  <Sparkles className="w-4 h-4 text-[#34c759]" />
                </>
              ) : result.accuracy >= 75 ? (
                <span>Жақсы нәтиже! Аздаған қате бар</span>
              ) : (
                <span>Қателер табылды. Қайта тыңдап көріңіз</span>
              )}
            </h3>
            <p className="text-[13px] text-[#86868b]">
              {result.correctWords} дұрыс • {result.wrongWords} қате •{" "}
              {result.missingWords} түсіп қалған • {result.extraWords} артық сөз
            </p>
          </div>
        </div>

        {/* Apple Legend Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-normal">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[rgba(52,199,89,0.08)] text-[#34c759]">
            ✓ Дұрыс
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[rgba(255,59,48,0.08)] text-[#ff3b30]">
            ✕ Қате
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[rgba(255,149,0,0.08)] text-[#ff9500]">
            * Түсіп қалған
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[rgba(175,82,222,0.08)] text-[#af52de]">
            − Артық сөз
          </span>
        </div>
      </div>

      {/* Comparison Sections */}
      <div className="space-y-4">
        {/* Your Answer */}
        <div className="space-y-1.5">
          <span className="text-[12px] font-semibold text-[#86868b] uppercase tracking-[-0.01em]">
            Сіздің жазғаныңыз:
          </span>
          <div className="p-4 rounded-[14px] bg-[#f5f5f7] dark:bg-[#000000] border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.08)] text-[17px] leading-[1.47] flex flex-wrap gap-1.5 items-center">
            {result.tokens.length === 0 ? (
              <span className="italic text-[#86868b] text-[14px]">
                (Жауап жазылмады)
              </span>
            ) : (
              result.tokens.map((token, idx) => {
                if (token.type === "correct") {
                  return (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 rounded-md bg-[rgba(52,199,89,0.12)] text-[#288a44] dark:text-[#34c759] font-medium"
                    >
                      {token.actual || token.expected}
                    </span>
                  );
                } else if (token.type === "wrong") {
                  return (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 rounded-md bg-[rgba(255,59,48,0.12)] text-[#ff3b30] font-medium line-through"
                      title={`Күтілгені: ${token.expected}`}
                    >
                      {token.actual}
                    </span>
                  );
                } else if (token.type === "extra") {
                  return (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 rounded-md bg-[rgba(175,82,222,0.12)] text-[#af52de] font-normal line-through"
                      title="Артық сөз"
                    >
                      {token.actual}
                    </span>
                  );
                }
                return null;
              })
            )}
          </div>
        </div>

        {/* Correct Answer */}
        <div className="space-y-1.5">
          <span className="text-[12px] font-semibold text-[#86868b] uppercase tracking-[-0.01em]">
            Түпнұсқа сөйлем:
          </span>
          <div className="p-4 rounded-[14px] bg-[#f5f5f7] dark:bg-[#000000] border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.08)] text-[17px] leading-[1.47] flex flex-wrap gap-1.5 items-center">
            {result.tokens.map((token, idx) => {
              if (token.type === "correct") {
                return (
                  <span key={idx} className="text-[#1d1d1f] dark:text-[#f5f5f7]">
                    {token.expected}
                  </span>
                );
              } else if (token.type === "wrong") {
                return (
                  <span
                    key={idx}
                    className="px-1.5 py-0.5 rounded-md bg-[rgba(52,199,89,0.1)] text-[#34c759] font-semibold underline decoration-[#34c759] underline-offset-4"
                    title={`Сіз жаздыңыз: ${token.actual}`}
                  >
                    {token.expected}
                  </span>
                );
              } else if (token.type === "missing") {
                return (
                  <span
                    key={idx}
                    className="px-1.5 py-0.5 rounded-md bg-[rgba(255,149,0,0.12)] text-[#ff9500] font-semibold"
                    title="Түсіп қалған сөз"
                  >
                    {token.expected}
                  </span>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>

      {/* Word-by-word Breakdown Chips */}
      <div className="space-y-2 pt-1">
        <span className="text-[12px] font-semibold text-[#86868b]">
          Сөздер бойынша талдау:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {result.tokens.map((token, idx) => {
            if (token.type === "correct") {
              return (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-normal bg-[#f5f5f7] dark:bg-[#000000] text-[#1d1d1f] dark:text-[#f5f5f7] border border-[rgba(0,0,0,0.04)] dark:border-[rgba(255,255,255,0.08)]"
                >
                  <span>{token.expected}</span>
                  <span className="text-[#34c759]">✓</span>
                </span>
              );
            } else if (token.type === "wrong") {
              return (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-normal bg-[#f5f5f7] dark:bg-[#000000] border border-[rgba(255,59,48,0.2)] text-[#ff3b30]"
                >
                  <span className="line-through">{token.actual}</span>
                  <span>→</span>
                  <span className="font-semibold text-[#34c759]">{token.expected}</span>
                </span>
              );
            } else if (token.type === "missing") {
              return (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-normal bg-[#f5f5f7] dark:bg-[#000000] border border-[rgba(255,149,0,0.2)] text-[#ff9500]"
                >
                  <span>{token.expected}</span>
                  <span>* (түсіп қалды)</span>
                </span>
              );
            } else if (token.type === "extra") {
              return (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-normal bg-[#f5f5f7] dark:bg-[#000000] border border-[rgba(175,82,222,0.2)] text-[#af52de]"
                >
                  <span className="line-through">{token.actual}</span>
                  <span>− (артық)</span>
                </span>
              );
            }
            return null;
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 pt-3 sm:pt-4 border-t border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.06)]">
        <button
          type="button"
          onClick={onTryAgain}
          className="apple-btn-secondary w-full sm:w-auto text-[13px] !py-2.5 !px-5 justify-center"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Қайта жазып көру</span>
        </button>

        <button
          type="button"
          onClick={onNextSentence}
          className="apple-btn-primary w-full sm:w-auto text-[14px] !py-3 sm:!py-2.5 !px-7 font-normal justify-center shadow-xs"
        >
          <span>{isLastSentence ? "Нәтижені көру" : "Келесі сөйлем"}</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
}
