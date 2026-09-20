"use client";

import React, { useState } from "react";
import {
  History,
  Trash2,
  Calendar,
  Clock,
  FileText,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { HistorySession, SentenceResult } from "@/types/dictation";
import { formatDuration } from "@/lib/scoreCalculator";

interface HistoryPanelProps {
  sessions: HistorySession[];
  onDeleteSession: (id: string) => void;
  onClearHistory: () => void;
  onStartSessionFromHistory: (session: HistorySession) => void;
}

export function HistoryPanel({
  sessions,
  onDeleteSession,
  onClearHistory,
  onStartSessionFromHistory,
}: HistoryPanelProps) {
  const [selectedSession, setSelectedSession] = useState<HistorySession | null>(
    null
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span>Practice History</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Your past dictation sessions, accuracy scores, and performance stats stored locally.
          </p>
        </div>

        {sessions.length > 0 && (
          <button
            type="button"
            onClick={onClearHistory}
            className="inline-flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 font-semibold px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Empty State */}
      {sessions.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No Saved Sessions Yet
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            When you complete a dictation exercise, your accuracy, timing, and word-level scores will appear here.
          </p>
        </div>
      ) : (
        /* Sessions List */
        <div className="space-y-3">
          {sessions.map((session) => {
            const dateStr = new Date(session.timestamp).toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }
            );

            const isHighAccuracy = session.accuracy >= 85;

            return (
              <div
                key={session.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {session.title}
                    </span>
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-full ${
                        isHighAccuracy
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                      }`}
                    >
                      {session.accuracy}%
                    </span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {session.difficultyLevel || "Practice"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 italic">
                    "{session.snippet}"
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 dark:text-slate-500 pt-0.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {dateStr}
                    </span>
                    <span>•</span>
                    <span>{session.sentenceCount} sentences</span>
                    <span>•</span>
                    <span>{session.wordCount} words</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDuration(session.durationSeconds)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSelectedSession(session)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    View Details
                  </button>

                  <button
                    type="button"
                    onClick={() => onStartSessionFromHistory(session)}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1"
                    title="Practice this passage again"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Practice</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteSession(session.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Session Details Modal */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedSession.title}
                </h3>
                <p className="text-xs text-slate-400">
                  Accuracy: {selectedSession.accuracy}% •{" "}
                  {selectedSession.sentenceCount} sentences •{" "}
                  {formatDuration(selectedSession.durationSeconds)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSession(null)}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-1 rounded"
              >
                Close ✕
              </button>
            </div>

            {/* Sentence by sentence view */}
            <div className="space-y-3 overflow-y-auto pr-1 flex-1">
              {selectedSession.sentenceResults?.map((res, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-500">
                      Sentence {i + 1}
                    </span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded ${
                        res.accuracy >= 90
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                      }`}
                    >
                      {res.accuracy}%
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      Original:
                    </span>
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      {res.originalText}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      Your answer:
                    </span>
                    <p className="italic text-slate-600 dark:text-slate-400">
                      {res.userAnswer || "(empty)"}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedSession(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
