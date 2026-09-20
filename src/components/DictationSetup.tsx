"use client";

import React, { useState, useMemo, useRef } from "react";
import {
  Upload,
  Play,
  Sparkles,
  Volume2,
  Clock,
  Gauge,
  Brain,
  FileText,
  Check,
} from "lucide-react";
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
  settings,
  onOpenSettings,
}: DictationSetupProps) {
  const [selectedFeaturedId, setSelectedFeaturedId] = useState<string>("text-1");
  const [inputText, setInputText] = useState(FEATURED_TEXTS[0].text);
  const [activeTab, setActiveTab] = useState<"featured" | "custom">("featured");
  const [isDragging, setIsDragging] = useState(false);
  const [showPreflight, setShowPreflight] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Real-time analysis of the current text
  const analysis = useMemo(() => {
    return analyzeText(inputText);
  }, [inputText]);

  // Determine if active selection is one of the 2 featured pre-rendered texts
  const currentFeatured = useMemo(() => {
    return FEATURED_TEXTS.find((f) => f.id === selectedFeaturedId);
  }, [selectedFeaturedId]);

  const isFeaturedActive =
    activeTab === "featured" &&
    !!currentFeatured &&
    inputText.trim() === currentFeatured.text.trim();

  // Select one of the two core texts
  const handleSelectFeatured = (item: FeaturedText) => {
    setSelectedFeaturedId(item.id);
    setInputText(item.text);
    setActiveTab("featured");
  };

  // Direct start from featured card
  const handleQuickStartFeatured = (item: FeaturedText) => {
    setSelectedFeaturedId(item.id);
    setInputText(item.text);
    setActiveTab("featured");
    setShowPreflight(true);
  };

  // Handle file uploads (.txt, .md)
  const handleFile = (file: File) => {
    if (
      file.type === "text/plain" ||
      file.name.endsWith(".txt") ||
      file.name.endsWith(".md")
    ) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (content) {
          setInputText(content);
          setActiveTab("custom");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleConfirmStart = () => {
    setShowPreflight(false);
    if (isFeaturedActive && currentFeatured) {
      onStartSession(currentFeatured.sentences, currentFeatured.text);
    } else {
      onStartSession(analysis.sentences, inputText);
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
          English Dictation Trainer.
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

      {/* 3. Featured 2 Texts — Apple Store Utility Cards with Product Shadow */}
      {activeTab === "featured" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {FEATURED_TEXTS.map((item) => {
              const isSelected = selectedFeaturedId === item.id;
              return (
                <div
                  key={item.id}
                  className={`relative rounded-[18px] bg-white dark:bg-[#1d1d1f] p-5 sm:p-7 transition-all flex flex-col justify-between border ${
                    isSelected
                      ? "border-[#0066cc] dark:border-[#2997ff] ring-2 ring-[#0066cc]/20 dark:ring-[#2997ff]/20 apple-product-shadow"
                      : "border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] hover:border-[rgba(0,0,0,0.18)]"
                  }`}
                >
                  <div className="space-y-3 sm:space-y-4">
                    {/* Top Micro Header */}
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] sm:text-[12px] font-semibold tracking-[-0.01em] text-[#0066cc] dark:text-[#2997ff] uppercase">
                        {item.number}-Мәтін • {item.level}
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-normal px-2.5 py-0.5 rounded-full bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#86868b]">
                        {item.topic}
                      </span>
                    </div>

                    {/* Title & Subtitle */}
                    <div className="space-y-1">
                      <h3 className="text-[18px] sm:text-[21px] font-semibold text-[#1d1d1f] dark:text-white tracking-[-0.018em] leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-[12px] sm:text-[13px] text-[#86868b] font-normal">
                        {item.subtitle}
                      </p>
                    </div>

                    {/* Kazakh Narrative */}
                    <p className="text-[13px] sm:text-[14px] text-[#1d1d1f]/80 dark:text-[#f5f5f7]/80 leading-[1.47] font-normal">
                      {item.description}
                    </p>

                    {/* Meta details & Zero-API Badge */}
                    <div className="space-y-2 pt-1 border-t border-[rgba(0,0,0,0.04)] dark:border-[rgba(255,255,255,0.06)]">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-[12px] text-[#86868b]">
                        <span><strong>{item.sentencesCount}</strong> сөйлем</span>
                        <span>•</span>
                        <span><strong>{item.wordCount}</strong> сөз</span>
                        <span>•</span>
                        <span>CEFR {item.cefr}</span>
                      </div>

                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-normal bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#34c759]" />
                        <span>Алдын-ала сақталған аудио (0s кідіріс)</span>
                      </div>
                    </div>
                  </div>

                  {/* Apple Dual Pill CTA grammar (Stack on mobile, side-by-side on tablet/desktop) */}
                  <div className="mt-5 pt-4 border-t border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.06)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={() => handleSelectFeatured(item)}
                      className={`apple-btn-secondary text-[13px] !py-2.5 sm:!py-2 !px-4 justify-center ${
                        isSelected ? "!bg-[rgba(0,102,204,0.08)] font-medium" : ""
                      }`}
                    >
                      {isSelected ? "Таңдалды ✓" : "Мәтінді ашу"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickStartFeatured(item)}
                      className="apple-btn-primary text-[13px] !py-2.5 sm:!py-2 !px-5 justify-center"
                    >
                      <span>Тыңдауды бастау</span>
                      <Play className="w-3 h-3 fill-current ml-1" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Text Editor & Utility Card */}
      <div className="rounded-[18px] bg-white dark:bg-[#1d1d1f] p-4 sm:p-8 border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] space-y-4">
        <div className="flex items-center justify-between border-b border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.06)] pb-3">
          <span className="text-[13px] sm:text-[14px] font-semibold text-[#1d1d1f] dark:text-white tracking-[-0.01em]">
            {activeTab === "featured" ? "Таңдалған мәтін құрамы" : "Өз мәтініңізді енгізіңіз"}
          </span>

          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              accept=".txt,.md"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFile(e.target.files[0]);
                }
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 text-[11px] sm:text-[12px] text-[#86868b] hover:text-[#0066cc] dark:hover:text-[#2997ff] font-normal px-2.5 sm:px-3 py-1 rounded-full border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.1)] transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Файл жүктеу (.txt)</span>
            </button>
          </div>
        </div>

        {/* Textarea */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className="relative"
        >
          <textarea
            id="dictation-input"
            rows={activeTab === "featured" ? 5 : 7}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              setActiveTab("custom");
            }}
            placeholder="Мәтінді осында жазыңыз немесе қойыңыз..."
            className="w-full p-3 sm:p-4 rounded-[14px] text-[#1d1d1f] dark:text-[#f5f5f7] placeholder:text-[#86868b] bg-[#f5f5f7] dark:bg-[#000000] border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.08)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] font-sans text-[16px] sm:text-[17px] leading-[1.47] resize-y transition-all"
          />

          {isDragging && (
            <div className="absolute inset-0 bg-[#0066cc]/10 rounded-[14px] border-2 border-dashed border-[#0066cc] flex flex-col items-center justify-center pointer-events-none">
              <Upload className="w-8 h-8 text-[#0066cc] animate-bounce mb-1" />
              <p className="text-[14px] font-semibold text-[#0066cc]">
                Файлды осында тастаңыз
              </p>
            </div>
          )}
        </div>

        {/* Metric Counters & Primary CTA */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[12px] sm:text-[13px] text-[#86868b]">
            <span><strong>{isFeaturedActive && currentFeatured ? currentFeatured.sentencesCount : analysis.sentenceCount}</strong> сөйлем</span>
            <span>•</span>
            <span><strong>{isFeaturedActive && currentFeatured ? currentFeatured.wordCount : analysis.wordCount}</strong> сөз</span>
            <span>•</span>
            <span className="text-[#0066cc] dark:text-[#2997ff]">
              {analysis.difficulty.label}
            </span>
          </div>

          <button
            type="button"
            disabled={analysis.sentences.length === 0}
            onClick={() => setShowPreflight(true)}
            className="apple-btn-primary w-full sm:w-auto text-[14px] !py-3 sm:!py-2.5 !px-7 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs justify-center"
          >
            <span>Тыңдауды бастау</span>
            <Play className="w-3.5 h-3.5 fill-current ml-1" />
          </button>
        </div>
      </div>

      {/* 5. Pre-flight Briefing Modal Sheet */}
      {showPreflight && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#1d1d1f] rounded-[20px] sm:rounded-[24px] max-w-md w-full p-5 sm:p-7 shadow-2xl border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] space-y-5 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-2">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#0066cc] dark:text-[#2997ff] flex items-center justify-center mx-auto">
                <Brain className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-[20px] sm:text-[24px] font-semibold text-[#1d1d1f] dark:text-white tracking-[-0.02em]">
                Жаттығуға дайынсыз ба?
              </h3>
              <p className="text-[13px] sm:text-[14px] text-[#86868b] leading-[1.47]">
                ElevenLabs AI дауысы әр сөйлемді ретімен оқиды. Әр сөйлемді мұқият тыңдап, интонациясын меңгеріңіз.
              </p>
            </div>

            {isFeaturedActive && (
              <div className="flex items-center gap-2 p-2.5 sm:p-3 rounded-[12px] bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[11px] sm:text-[12px] text-[#1d1d1f] dark:text-[#f5f5f7]">
                <span className="w-2 h-2 rounded-full bg-[#34c759] shrink-0" />
                <span>Алдын-ала сақталған табиғи аудио: API лимиті жұмсалмайды.</span>
              </div>
            )}

            {/* Session Parameters Grid */}
            <div className="rounded-[14px] bg-[#f5f5f7] dark:bg-[#000000] p-3.5 sm:p-4 space-y-2.5 text-[13px] sm:text-[14px]">
              <div className="flex items-center justify-between text-[#1d1d1f] dark:text-[#f5f5f7]">
                <span className="text-[#86868b]">Көлемі:</span>
                <span className="font-semibold">
                  {isFeaturedActive && currentFeatured
                    ? `${currentFeatured.sentencesCount} сөйлем • ${currentFeatured.wordCount} сөз`
                    : `${analysis.sentenceCount} сөйлем • ${analysis.wordCount} сөз`}
                </span>
              </div>

              <div className="flex items-center justify-between text-[#1d1d1f] dark:text-[#f5f5f7]">
                <span className="text-[#86868b]">Дауыс:</span>
                <span className="font-semibold">{settings.voiceName}</span>
              </div>

              <div className="flex items-center justify-between text-[#1d1d1f] dark:text-[#f5f5f7]">
                <span className="text-[#86868b]">Жылдамдық:</span>
                <span className="font-semibold">{settings.speed}x</span>
              </div>

              <div className="flex items-center justify-between text-[#1d1d1f] dark:text-[#f5f5f7]">
                <span className="text-[#86868b]">Үзіліс:</span>
                <span className="font-semibold">{settings.pauseDuration} секунд</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setShowPreflight(false)}
                className="apple-btn-secondary flex-1 !py-2.5 text-[13px] justify-center"
              >
                Артқа
              </button>
              <button
                type="button"
                onClick={handleConfirmStart}
                className="apple-btn-primary flex-1 !py-2.5 text-[13px] justify-center"
              >
                <span>Бастау</span>
                <Play className="w-3.5 h-3.5 fill-current ml-1" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
