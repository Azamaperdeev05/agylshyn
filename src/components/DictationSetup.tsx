"use client";

import React, { useState, useMemo } from "react";
import { Play } from "lucide-react";
import { analyzeText } from "@/lib/sentenceSplitter";
import { FEATURED_TEXTS, FeaturedText } from "@/lib/sampleTexts";
import { Sentence, UserSettings } from "@/types/dictation";

interface DictationSetupProps {
  onStartSession: (sentences: Sentence[], rawText: string) => void;
  settings: UserSettings;
  onOpenSettings: () => void;
}

export function DictationSetup({
  onStartSession,
}: DictationSetupProps) {
  const [customText, setCustomText] = useState("");
  const [activeTab, setActiveTab] = useState<"featured" | "custom">("featured");

  // Real-time analysis of custom text
  const customAnalysis = useMemo(() => {
    return analyzeText(customText);
  }, [customText]);

  // Start directly from featured card
  const handleStartFeatured = (item: FeaturedText) => {
    onStartSession(item.sentences, item.text);
  };

  // Start directly from custom text
  const handleStartCustom = () => {
    if (customAnalysis.sentences.length > 0) {
      onStartSession(customAnalysis.sentences, customText);
    }
  };

  return (
    <div className="max-w-[980px] mx-auto space-y-8 sm:space-y-12 py-2 sm:py-4">
      {/* 1. Apple Hero Header Tile */}
      <div className="text-center space-y-2.5 pt-2 sm:pt-6 pb-1 sm:pb-2">
        <p className="text-[12px] sm:text-[14px] font-semibold text-[#86868b] tracking-wider uppercase">
          AI-Powered Listening Practice
        </p>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold text-[#1d1d1f] dark:text-white tracking-[-0.025em] leading-[1.12]">
          English Listening Trainer.
        </h1>
        <p className="text-[14px] sm:text-[18px] text-[#86868b] max-w-xl mx-auto leading-[1.47] font-normal tracking-[-0.012em] px-2">
          Жад пен ерекше есте сақтау қабілетіне арналған 2 негізгі мәтін. Табиғи ElevenLabs AI дауысымен тыңдап, сөйлем бойынша тыңдаңыз.
        </p>
      </div>

      {/* 2. Apple Segmented Control (Featured vs Custom) */}
      <div className="flex justify-center px-2">
        <div className="w-full max-w-[340px] sm:max-w-none sm:w-auto grid grid-cols-2 sm:inline-flex p-1 rounded-full bg-[#e5e5ea] dark:bg-[#2c2c2e] text-[12px] sm:text-[13px] font-normal tracking-[-0.01em]">
          <button
            type="button"
            onClick={() => setActiveTab("featured")}
            className={`px-3 sm:px-5 py-1.5 rounded-full transition-all duration-150 cursor-pointer text-center ${
              activeTab === "featured"
                ? "bg-white dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-white shadow-xs font-semibold"
                : "text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white"
            }`}
          >
            Негізгі екі мәтін
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("custom")}
            className={`px-3 sm:px-5 py-1.5 rounded-full transition-all duration-150 cursor-pointer text-center ${
              activeTab === "custom"
                ? "bg-white dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-white shadow-xs font-semibold"
                : "text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white"
            }`}
          >
            Өз мәтініңізді қою
          </button>
        </div>
      </div>

      {/* 3. Featured Texts Grid */}
      {activeTab === "featured" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {FEATURED_TEXTS.map((item, idx) => (
              <div
                key={item.id}
                className="relative rounded-[18px] bg-white dark:bg-[#1d1d1f] p-5 sm:p-7 transition-all flex flex-col justify-between border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] hover:border-[#0066cc]/40 dark:hover:border-[#2997ff]/40 apple-product-shadow"
              >
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] sm:text-[12px] font-semibold tracking-[-0.01em] text-[#0066cc] dark:text-[#2997ff] uppercase">
                      {idx + 1}-Мәтін • {item.level}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-normal px-2.5 py-0.5 rounded-full bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#86868b]">
                      {item.topic}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-[18px] sm:text-[21px] font-semibold text-[#1d1d1f] dark:text-white tracking-[-0.018em] leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[12px] sm:text-[13px] text-[#86868b] font-normal">
                      {item.subtitle}
                    </p>
                  </div>

                  <p className="text-[13px] sm:text-[14px] text-[#1d1d1f]/80 dark:text-[#f5f5f7]/80 leading-[1.47] font-normal">
                    {item.description}
                  </p>

                  <div className="space-y-2 pt-1 border-t border-[rgba(0,0,0,0.04)] dark:border-[rgba(255,255,255,0.06)]">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-[12px] text-[#86868b]">
                      <span>
                        <strong>{item.sentencesCount}</strong> сөйлем
                      </span>
                      <span>•</span>
                      <span>
                        <strong>{item.wordCount}</strong> сөз
                      </span>
                      <span>•</span>
                      <span>CEFR B2</span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-normal bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#34c759]" />
                      <span>Алдын-ала сақталған аудио (0s кідіріс)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.06)]">
                  <button
                    type="button"
                    onClick={() => handleStartFeatured(item)}
                    className="apple-btn-primary w-full text-[13px] !py-2.5 sm:!py-2 !px-5 justify-center"
                  >
                    <span>Тыңдауды бастау</span>
                    <Play className="w-3.5 h-3.5 fill-current ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Custom Text Input Tab */}
      {activeTab === "custom" && (
        <div className="rounded-[18px] bg-white dark:bg-[#1d1d1f] p-4 sm:p-8 border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] space-y-4">
          <div className="relative">
            <textarea
              id="dictation-input"
              rows={7}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Ағылшын мәтінін осында қойыңыз немесе жазыңыз..."
              className="w-full p-3 sm:p-4 rounded-[14px] text-[#1d1d1f] dark:text-[#f5f5f7] placeholder:text-[#86868b] bg-[#f5f5f7] dark:bg-[#000000] border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.08)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] font-sans text-[16px] sm:text-[17px] leading-[1.47] resize-y transition-all"
            />
          </div>

          {/* Metric Counters & Primary CTA */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[12px] sm:text-[13px] text-[#86868b]">
              <span>
                <strong>{customAnalysis.sentenceCount}</strong> сөйлем
              </span>
              <span>•</span>
              <span>
                <strong>{customAnalysis.wordCount}</strong> сөз
              </span>
              <span>•</span>
              <span className="text-[#0066cc] dark:text-[#2997ff]">
                {customAnalysis.difficulty.label}
              </span>
            </div>

            <button
              type="button"
              disabled={customAnalysis.sentences.length === 0}
              onClick={handleStartCustom}
              className="apple-btn-primary w-full sm:w-auto text-[14px] !py-3 sm:!py-2.5 !px-7 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs justify-center"
            >
              <span>Тыңдауды бастау</span>
              <Play className="w-3.5 h-3.5 fill-current ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
