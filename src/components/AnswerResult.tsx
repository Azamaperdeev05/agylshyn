"use client";

import React from "react";
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertCircle,
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
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-7 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-200">
      {/* Accuracy Header & Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm ${
              isPerfect
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                : result.accuracy >= 75
                ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                : "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
            }`}
          >
            {result.accuracy}%
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              {isPerfect ? (
                <>
                  <span>Outstanding! Perfect Match</span>
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                </>
              ) : result.accuracy >= 75 ? (
                <span>Great Effort! Almost There</span>
              ) : (
                <span>Keep Practicing! Mistakes Detected</span>
              )}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {result.correctWords} correct • {result.wrongWords} wrong •{" "}
              {result.missingWords} missing • {result.extraWords} extra
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium text-slate-600 dark:text-slate-400">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            ✓ Correct
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            ✕ Wrong
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            * Missing
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            − Extra
          </span>
        </div>
      </div>

      {/* Comparison Sections */}
      <div className="space-y-4">
        {/* Your Answer */}
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Your Transcription:
          </span>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-base leading-relaxed flex flex-wrap gap-1.5 items-center">
            {result.tokens.length === 0 ? (
              <span className="italic text-slate-400 text-sm">
                (No answer provided)
              </span>
            ) : (
              result.tokens.map((token, idx) => {
                if (token.type === "correct") {
                  return (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 font-medium"
                    >
                      {token.actual || token.expected}
                    </span>
                  );
                } else if (token.type === "wrong") {
                  return (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 font-semibold line-through"
                      title={`Expected: ${token.expected}`}
                    >
                      {token.actual}
                    </span>
                  );
                } else if (token.type === "extra") {
                  return (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-200 font-medium line-through"
                      title="Extra word"
                    >
                      {token.actual}
                    </span>
                  );
                }
                // If missing from user answer, skip in user transcription row
                return null;
              })
            )}
          </div>
        </div>

        {/* Correct Answer */}
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Correct Original Sentence:
          </span>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-base leading-relaxed flex flex-wrap gap-1.5 items-center">
            {result.tokens.map((token, idx) => {
              if (token.type === "correct") {
                return (
                  <span
                    key={idx}
                    className="px-1.5 py-0.5 rounded text-emerald-800 dark:text-emerald-200 font-medium"
                  >
                    {token.expected}
                  </span>
                );
              } else if (token.type === "wrong") {
                return (
                  <span
                    key={idx}
                    className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold underline decoration-emerald-500 underline-offset-4"
                    title={`You typed: ${token.actual}`}
                  >
                    {token.expected}
                  </span>
                );
              } else if (token.type === "missing") {
                return (
                  <span
                    key={idx}
                    className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 font-bold border border-dashed border-amber-400"
                    title="You missed this word"
                  >
                    {token.expected}
                  </span>
                );
              }
              // Extra words belong to actual, not expected
              return null;
            })}
          </div>
        </div>
      </div>

      {/* Word-by-word Breakdown Chips (Section 13) */}
      <div className="space-y-2 pt-2">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Word Breakdown:
        </span>
        <div className="flex flex-wrap gap-2">
          {result.tokens.map((token, idx) => {
            if (token.type === "correct") {
              return (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                >
                  <span>{token.expected}</span>
                  <span className="font-bold">✓</span>
                </span>
              );
            } else if (token.type === "wrong") {
              return (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                >
                  <span className="line-through text-rose-500">{token.actual}</span>
                  <span>→</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {token.expected}
                  </span>
                  <span className="font-bold">✕</span>
                </span>
              );
            } else if (token.type === "missing") {
              return (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                >
                  <span>{token.expected}</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    * (missing)
                  </span>
                </span>
              );
            } else if (token.type === "extra") {
              return (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                >
                  <span className="line-through">{token.actual}</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">
                    − (extra)
                  </span>
                </span>
              );
            }
            return null;
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={onTryAgain}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-slate-500" />
          <span>Try Again</span>
        </button>

        <button
          type="button"
          onClick={onNextSentence}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all cursor-pointer group"
        >
          <span>{isLastSentence ? "Finish & View Results" : "Next Sentence"}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
