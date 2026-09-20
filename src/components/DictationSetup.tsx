"use client";

import React, { useState, useMemo, useRef } from "react";
import {
  FileText,
  Upload,
  Play,
  Sparkles,
  BarChart3,
  Check,
  BookOpen,
  Volume2,
  Clock,
  Gauge,
} from "lucide-react";
import { analyzeText } from "@/lib/sentenceSplitter";
import { SAMPLE_TEXTS } from "@/lib/sampleTexts";
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
  const [inputText, setInputText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [showPreflight, setShowPreflight] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Real-time analysis of the entered text
  const analysis = useMemo(() => {
    return analyzeText(inputText);
  }, [inputText]);

  // Load a curated sample passage
  const handleSelectSample = (sampleId: string) => {
    const sample = SAMPLE_TEXTS.find((s) => s.id === sampleId);
    if (sample) {
      setInputText(sample.text);
    }
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

  // Click start -> trigger pre-flight briefing or direct start
  const handleProceedToBriefing = () => {
    if (analysis.sentences.length === 0) return;
    setShowPreflight(true);
  };

  const handleConfirmStart = () => {
    setShowPreflight(false);
    onStartSession(analysis.sentences, inputText);
  };

  const difficultyBadgeColor = {
    A1: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    A2: "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border-teal-200 dark:border-teal-800",
    B1: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    B2: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
    C1: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    C2: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-200 dark:border-rose-800",
  }[analysis.difficulty.level];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hero Intro */}
      <div className="text-center space-y-2 py-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Listening Practice</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          AI English Dictation Trainer
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Paste any English passage, listen to natural ElevenLabs AI speech, transcribe sentence by sentence, and receive immediate word-by-word feedback.
        </p>
      </div>

      {/* Main Text Input Card */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-7 shadow-sm border transition-all ${
          isDragging
            ? "border-blue-500 ring-4 ring-blue-500/10 bg-blue-50/50 dark:bg-blue-950/20"
            : "border-slate-200 dark:border-slate-800"
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <label
            htmlFor="dictation-input"
            className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200"
          >
            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>English Practice Passage</span>
          </label>

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
              className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import .txt / .md</span>
            </button>
          </div>
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            id="dictation-input"
            rows={7}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your English text here... (e.g. news articles, stories, essays, or transcripts)"
            className="w-full p-4 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 font-sans text-base sm:text-lg leading-relaxed resize-y transition-all"
          />

          {isDragging && (
            <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-500/20 rounded-xl border-2 border-dashed border-blue-500 flex flex-col items-center justify-center backdrop-blur-xs pointer-events-none">
              <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-bounce mb-1" />
              <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                Drop your English text file here
              </p>
            </div>
          )}
        </div>

        {/* Character, Word, and Sentence Counters */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span>
              <strong>{analysis.characterCount}</strong> characters
            </span>
            <span>•</span>
            <span>
              <strong>{analysis.wordCount}</strong> words
            </span>
            <span>•</span>
            <span>
              <strong>{analysis.sentenceCount}</strong> sentences
            </span>
          </div>

          {inputText.length > 0 && (
            <button
              onClick={() => setInputText("")}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline"
            >
              Clear
            </button>
          )}
        </div>

        {/* Sample Texts Selector */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-500" />
              Or try a sample passage:
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {SAMPLE_TEXTS.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSelectSample(sample.id)}
                className="text-left p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 hover:bg-blue-50/60 dark:hover:bg-blue-950/30 hover:border-blue-300 dark:hover:border-blue-700/60 transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {sample.title}
                  </span>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {sample.level}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                  {sample.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Text Analytics Box & Start Button */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Estimated Level:
                </span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${difficultyBadgeColor}`}
                >
                  {analysis.difficulty.label}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {analysis.sentenceCount === 0
                  ? "Paste text above to preview sentences"
                  : `${analysis.sentenceCount} sentence${analysis.sentenceCount === 1 ? "" : "s"} ready for dictation`}
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={analysis.sentences.length === 0}
            onClick={handleProceedToBriefing}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Start Dictation</span>
            <Play className="w-4 h-4 fill-white group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Pre-flight Briefing Modal (Section 31) */}
      {showPreflight && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Ready for Dictation?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                You will listen to natural AI speech sentence-by-sentence.
              </p>
            </div>

            {/* Session Parameters Card */}
            <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-4 border border-slate-200 dark:border-slate-800 space-y-3 text-sm">
              <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <FileText className="w-4 h-4 text-blue-500" />
                  Content:
                </span>
                <span className="font-semibold">
                  {analysis.sentenceCount} sentences • {analysis.wordCount} words
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <Volume2 className="w-4 h-4 text-indigo-500" />
                  Voice:
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
                  Speed:
                </span>
                <span className="font-semibold">{settings.speed}x</span>
              </div>

              <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <Clock className="w-4 h-4 text-emerald-500" />
                  Pause Duration:
                </span>
                <span className="font-semibold">
                  {settings.pauseDuration} seconds
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center italic">
              *The original sentence will remain hidden until you check your answer.
            </p>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowPreflight(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs text-slate-700 dark:text-slate-300 transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleConfirmStart}
                className="flex-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-xs text-white shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>START DICTATION</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
