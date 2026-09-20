"use client";

import React, { useState, useMemo, useRef } from "react";
import {
  FileText,
  Upload,
  Play,
  Sparkles,
  BarChart3,
  BookOpen,
  Volume2,
  Clock,
  Gauge,
  ArrowRight,
  Brain,
  Layers,
  ChevronDown,
  ChevronUp,
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

  const currentFeatured = useMemo(() => {
    return FEATURED_TEXTS.find((f) => f.id === selectedFeaturedId);
  }, [selectedFeaturedId]);

  const isFeaturedActive =
    activeTab === "featured" &&
    !!currentFeatured &&
    inputText.trim() === currentFeatured.text.trim();

  const handleConfirmStart = () => {
    setShowPreflight(false);
    if (isFeaturedActive && currentFeatured) {
      onStartSession(currentFeatured.sentences, currentFeatured.text);
    } else {
      onStartSession(analysis.sentences, inputText);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="text-center space-y-2 py-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80 mb-1">
          <Brain className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Есте сақтау және диктант жаттығуы</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          English Dictation Trainer
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Жад пен ерекше есте сақтау қабілетіне арналған 2 негізгі ағылшынша мәтінді таңдап, ElevenLabs AI дауысымен тыңдап, диктант жазыңыз.
        </p>
      </div>

      {/* Featured 2 Texts Section (Primary Focus) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Негізгі екі мәтін:
            </h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Біреуін таңдап, бірден бастаңыз
          </span>
        </div>

        {/* 2 Featured Text Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FEATURED_TEXTS.map((item) => {
            const isSelected = selectedFeaturedId === item.id && activeTab === "featured";
            return (
              <div
                key={item.id}
                className={`relative rounded-2xl p-5 sm:p-6 border transition-all flex flex-col justify-between ${
                  isSelected
                    ? "border-blue-500 bg-white dark:bg-slate-900 shadow-md ring-2 ring-blue-500/20"
                    : "border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                      <span>{item.number}-Мәтін</span>
                    </span>

                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {item.level}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>

                  {/* Description in Kazakh */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Metrics preview */}
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <span>
                      <strong>{item.sentencesCount}</strong> сөйлем
                    </span>
                    <span>•</span>
                    <span>
                      <strong>{item.wordCount}</strong> сөз
                    </span>
                    <span>•</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                      {item.topic}
                    </span>
                  </div>

                  {/* Pre-generated Audio Badge */}
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-lg border border-emerald-200/80 dark:border-emerald-900/60 mt-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Дайын ElevenLabs AI аудиосы • Лимит жұмсалмайды</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => handleSelectFeatured(item)}
                    className={`text-xs font-semibold px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                      isSelected
                        ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {isSelected ? "Таңдалды ✓" : "Мәтінді қарау"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickStartFeatured(item)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer group"
                  >
                    <span>Диктантты бастау</span>
                    <Play className="w-3.5 h-3.5 fill-white group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mode Selector Tabs (Featured vs Custom) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-7 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("featured")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "featured"
                  ? "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              Таңдалған мәтін мәзірі
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("custom")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "custom"
                  ? "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              Басқа мәтін қою / Өзгерту
            </button>
          </div>

          {activeTab === "custom" && (
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
                className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-blue-600 font-medium px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Файл (.txt)</span>
              </button>
            </div>
          )}
        </div>

        {/* Text Area */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className="relative"
        >
          <textarea
            id="dictation-input"
            rows={activeTab === "featured" ? 6 : 8}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              setActiveTab("custom");
            }}
            placeholder="Мәтінді осында қойыңыз..."
            className="w-full p-4 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 font-sans text-base leading-relaxed resize-y transition-all"
          />

          {isDragging && (
            <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-500/20 rounded-xl border-2 border-dashed border-blue-500 flex flex-col items-center justify-center pointer-events-none">
              <Upload className="w-8 h-8 text-blue-600 animate-bounce mb-1" />
              <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                Мәтін файлын тастаңыз
              </p>
            </div>
          )}
        </div>

        {/* Counters & Difficulty Badge */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span>
              <strong>{analysis.sentenceCount}</strong> сөйлем
            </span>
            <span>•</span>
            <span>
              <strong>{analysis.wordCount}</strong> сөз
            </span>
            <span>•</span>
            <span>
              <strong>{analysis.characterCount}</strong> символ
            </span>
            <span>•</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {analysis.difficulty.label}
            </span>
          </div>

          <button
            type="button"
            disabled={analysis.sentences.length === 0}
            onClick={() => setShowPreflight(true)}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span>Диктантты бастау</span>
            <Play className="w-3.5 h-3.5 fill-white group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Pre-flight Briefing Modal */}
      {showPreflight && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Диктантты бастауға дайынсыз ба?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ElevenLabs AI дауысы әр сөйлемді ретімен оқиды.
              </p>
            </div>

            {isFeaturedActive && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Алдын-ала әзірленген AI аудиосы</p>
                  <p className="text-[11px] text-emerald-700/80 dark:text-emerald-300/80 mt-0.5">
                    Барлық {currentFeatured?.sentencesCount} сөйлемнің дыбысы жүктелген. ElevenLabs API квотасы жұмсалмайды, кідіріссіз ойнайды.
                  </p>
                </div>
              </div>
            )}

            {/* Session Parameters Card */}
            <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-4 border border-slate-200 dark:border-slate-800 space-y-3 text-sm">
              <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <FileText className="w-4 h-4 text-blue-500" />
                  Көлемі:
                </span>
                <span className="font-semibold">
                  {isFeaturedActive && currentFeatured
                    ? `${currentFeatured.sentencesCount} сөйлем • ${currentFeatured.wordCount} сөз`
                    : `${analysis.sentenceCount} сөйлем • ${analysis.wordCount} сөз`}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <Volume2 className="w-4 h-4 text-indigo-500" />
                  Дауыс:
                </span>
                <span className="font-semibold flex items-center gap-1.5">
                  {settings.voiceName}
                  {settings.voiceAccent && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {settings.voiceAccent}
                    </span>
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <Gauge className="w-4 h-4 text-amber-500" />
                  Жылдамдық:
                </span>
                <span className="font-semibold">{settings.speed}x</span>
              </div>

              <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <Clock className="w-4 h-4 text-emerald-500" />
                  Үзіліс (Pause):
                </span>
                <span className="font-semibold">
                  {settings.pauseDuration} секунд
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center italic">
              *Жауапты тексергенге дейін түпнұсқа сөйлем экранда көрсетілмейді.
            </p>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowPreflight(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs text-slate-700 dark:text-slate-300 transition-colors"
              >
                Артқа
              </button>
              <button
                type="button"
                onClick={handleConfirmStart}
                className="flex-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-xs text-white shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>БАСТАУ</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
