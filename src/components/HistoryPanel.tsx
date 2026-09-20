"use client";

import React, { useState } from "react";
import {
  History,
  Trash2,
  Calendar,
  Clock,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { HistorySession } from "@/types/dictation";
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
    <div className="max-w-[840px] mx-auto space-y-6 py-4 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#1d1d1f] dark:text-white tracking-[-0.02em]">
            Жаттығулар тарихы
          </h2>
          <p className="text-[14px] text-[#86868b] mt-0.5">
            Өткен диктант сессиялары, дәлдік көрсеткіштері және нәтижелері.
          </p>
        </div>

        {sessions.length > 0 && (
          <button
            type="button"
            onClick={onClearHistory}
            className="text-[13px] text-[#ff3b30] hover:underline px-3 py-1.5 transition-colors cursor-pointer"
          >
            Тарихты тазалау
          </button>
        )}
      </div>

      {/* Empty State */}
      {sessions.length === 0 ? (
        <div className="rounded-[18px] bg-white dark:bg-[#1d1d1f] p-12 border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] text-center space-y-2">
          <h3 className="text-[17px] font-semibold text-[#1d1d1f] dark:text-white tracking-[-0.01em]">
            Әзірге сақталған жаттығу жоқ
          </h3>
          <p className="text-[14px] text-[#86868b] max-w-sm mx-auto leading-[1.47]">
            Диктантты орындап аяқтаған соң, нәтижелеріңіз автоматты түрде осында сақталады.
          </p>
        </div>
      ) : (
        /* Sessions List (Apple Store utility cards) */
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
                className="rounded-[18px] bg-white dark:bg-[#1d1d1f] p-4 sm:p-6 border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 transition-all"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-semibold text-[16px] sm:text-[17px] text-[#1d1d1f] dark:text-white tracking-[-0.015em] truncate">
                      {session.title}
                    </span>
                    <span
                      className={`text-[11px] sm:text-[12px] font-semibold px-2 py-0.5 rounded-full ${
                        isHighAccuracy
                          ? "bg-[rgba(52,199,89,0.12)] text-[#34c759]"
                          : "bg-[rgba(0,102,204,0.1)] text-[#0066cc] dark:text-[#2997ff]"
                      }`}
                    >
                      {session.accuracy}%
                    </span>
                  </div>

                  <p className="text-[13px] sm:text-[14px] text-[#86868b] line-clamp-1 italic">
                    "{session.snippet}"
                  </p>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-[12px] text-[#86868b] pt-0.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {dateStr}
                    </span>
                    <span>•</span>
                    <span>{session.sentenceCount} сөйлем</span>
                    <span>•</span>
                    <span>{session.wordCount} сөз</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDuration(session.durationSeconds)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.06)]">
                  <button
                    type="button"
                    onClick={() => setSelectedSession(session)}
                    className="apple-btn-secondary text-[12px] !py-1.5 !px-3.5"
                  >
                    Толығырақ
                  </button>

                  <button
                    type="button"
                    onClick={() => onStartSessionFromHistory(session)}
                    className="apple-btn-primary text-[12px] !py-1.5 !px-3.5"
                    title="Осы мәтінді қайта жаттығу"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Жаттығу</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteSession(session.id)}
                    className="p-2 rounded-full text-[#86868b] hover:text-[#ff3b30] transition-colors cursor-pointer"
                    title="Өшіру"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Session Details Modal (Apple Sheet) */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#1d1d1f] rounded-[20px] sm:rounded-[24px] max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.08)]">
              <div>
                <h3 className="text-[20px] font-semibold text-[#1d1d1f] dark:text-white tracking-[-0.015em]">
                  {selectedSession.title}
                </h3>
                <p className="text-[13px] text-[#86868b]">
                  Дәлдік: {selectedSession.accuracy}% • {selectedSession.sentenceCount} сөйлем • {formatDuration(selectedSession.durationSeconds)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSession(null)}
                className="text-[13px] text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white px-2 py-1 cursor-pointer"
              >
                Жабу ✕
              </button>
            </div>

            {/* Sentence by sentence view */}
            <div className="space-y-3 overflow-y-auto pr-1 flex-1">
              {selectedSession.sentenceResults?.map((res, i) => (
                <div
                  key={i}
                  className="p-4 rounded-[14px] bg-[#f5f5f7] dark:bg-[#000000] border border-[rgba(0,0,0,0.04)] dark:border-[rgba(255,255,255,0.06)] space-y-2 text-[13px]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#86868b]">
                      Сөйлем {i + 1}
                    </span>
                    <span
                      className={`font-semibold px-2 py-0.5 rounded-full text-[11px] ${
                        res.accuracy >= 90
                          ? "bg-[rgba(52,199,89,0.12)] text-[#34c759]"
                          : "bg-[rgba(255,149,0,0.12)] text-[#ff9500]"
                      }`}
                    >
                      {res.accuracy}%
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] uppercase font-semibold text-[#86868b]">
                      Түпнұсқа:
                    </span>
                    <p className="font-medium text-[#1d1d1f] dark:text-white">
                      {res.originalText}
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] uppercase font-semibold text-[#86868b]">
                      Сіздің жауабыңыз:
                    </span>
                    <p className="italic text-[#86868b]">
                      {res.userAnswer || "(бос)"}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedSession(null)}
                className="apple-btn-secondary text-[13px] !py-2 !px-5"
              >
                Жабу
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
