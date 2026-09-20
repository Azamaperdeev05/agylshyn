"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Check,
  SkipForward,
  RotateCcw,
  Lightbulb,
  Keyboard,
} from "lucide-react";
import { generateHint } from "@/lib/diffEngine";

interface AnswerInputProps {
  originalSentence: string;
  onCheckAnswer: (userAnswer: string, usedHint: boolean) => void;
  onSkipSentence: () => void;
  onReplay: () => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNextSentence?: () => void;
  canNextSentence?: boolean;
}

export function AnswerInput({
  originalSentence,
  onCheckAnswer,
  onSkipSentence,
  onReplay,
  isPlaying,
  onTogglePlay,
  onNextSentence,
  canNextSentence,
}: AnswerInputProps) {
  const [answer, setAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [hintText, setHintText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus textarea when active
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Handle Hint generation (masks all letters except first)
  const handleToggleHint = () => {
    if (!showHint) {
      const generated = generateHint(originalSentence);
      setHintText(generated);
      setShowHint(true);
    } else {
      setShowHint(false);
    }
  };

  const handleCheck = () => {
    onCheckAnswer(answer, showHint);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInsideInput =
        target.tagName === "TEXTAREA" || target.tagName === "INPUT";

      // Ctrl+Enter or Cmd+Enter triggers Check Answer from anywhere
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleCheck();
        return;
      }

      // If user is inside the textarea, allow normal typing without hijacking Space or R
      if (isInsideInput) {
        return;
      }

      // Space -> Play / Pause
      if (e.code === "Space") {
        e.preventDefault();
        onTogglePlay();
      }
      // R -> Replay
      else if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        onReplay();
      }
      // N -> Next sentence (if allowed)
      else if ((e.key === "n" || e.key === "N") && canNextSentence && onNextSentence) {
        e.preventDefault();
        onNextSentence();
      }
      // Enter outside textarea -> Check answer
      else if (e.key === "Enter") {
        e.preventDefault();
        handleCheck();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [answer, showHint, isPlaying, onTogglePlay, onReplay, canNextSentence, onNextSentence]);

  return (
    <div className="rounded-[18px] bg-white dark:bg-[#1d1d1f] p-6 sm:p-8 border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] space-y-4">
      <div className="flex items-center justify-between">
        <label
          htmlFor="user-transcription"
          className="text-[14px] font-semibold text-[#1d1d1f] dark:text-white tracking-[-0.01em]"
        >
          Естіген сөйлемді теріңіз
        </label>

        {/* Show Hint Button (Apple Ghost Pill) */}
        <button
          type="button"
          onClick={handleToggleHint}
          className={`apple-btn-secondary text-[12px] !py-1 !px-3 ${
            showHint ? "!bg-[rgba(0,102,204,0.08)]" : ""
          }`}
          title="Бірінші әріптер бойынша көмек"
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>{showHint ? "Көмекті жабу" : "Көмек (Hint)"}</span>
        </button>
      </div>

      {/* Hint Banner */}
      {showHint && hintText && (
        <div className="p-3.5 rounded-[12px] bg-[#f5f5f7] dark:bg-[#000000] border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.08)] text-[13px] font-mono tracking-wider animate-in fade-in duration-150">
          <div className="text-[11px] font-sans font-semibold text-[#86868b] mb-1 flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Көмек (Әр сөздің алғашқы әрпі):</span>
          </div>
          <div className="text-[15px] font-semibold text-[#1d1d1f] dark:text-white select-none">
            {hintText}
          </div>
        </div>
      )}

      {/* Answer Textarea */}
      <textarea
        id="user-transcription"
        ref={textareaRef}
        rows={4}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Естігеніңізді осында теріңіз..."
        spellCheck="true"
        autoCapitalize="sentences"
        autoCorrect="off"
        className="w-full p-4 rounded-[14px] text-[#1d1d1f] dark:text-[#f5f5f7] placeholder:text-[#86868b] bg-[#f5f5f7] dark:bg-[#000000] border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.08)] focus:outline-none focus:ring-2 focus:ring-[#0071e3] font-sans text-[17px] leading-[1.47] resize-y transition-all"
      />

      {/* Bottom Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          {/* Replay */}
          <button
            type="button"
            onClick={onReplay}
            className="apple-btn-secondary text-[13px] !py-2 !px-4"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Қайталау (R)</span>
          </button>

          {/* Skip */}
          <button
            type="button"
            onClick={onSkipSentence}
            className="text-[13px] text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white px-3 py-2 transition-colors cursor-pointer"
          >
            <span>Өткізіп жіберу</span>
          </button>
        </div>

        {/* Check Answer Button: Apple Action Blue Pill */}
        <button
          type="button"
          onClick={handleCheck}
          className="apple-btn-primary text-[14px] !py-2.5 !px-7 font-normal"
        >
          <Check className="w-4 h-4" />
          <span>Тексеру</span>
          <span className="hidden sm:inline-flex items-center text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/20 text-white">
            ⌘+↵
          </span>
        </button>
      </div>

      {/* Keyboard shortcuts subtle footer */}
      <div className="hidden sm:flex items-center justify-center gap-4 text-[11px] text-[#86868b] pt-2 border-t border-[rgba(0,0,0,0.04)] dark:border-[rgba(255,255,255,0.06)]">
        <span className="flex items-center gap-1">
          <Keyboard className="w-3 h-3" /> Пернелер:
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 rounded bg-[#f5f5f7] dark:bg-[#000000] border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.08)] font-mono text-[10px]">
            ⌘/Ctrl + Enter
          </kbd>{" "}
          Тексеру
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 rounded bg-[#f5f5f7] dark:bg-[#000000] border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.08)] font-mono text-[10px]">
            Space
          </kbd>{" "}
          Ойнату/Тоқтату
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 rounded bg-[#f5f5f7] dark:bg-[#000000] border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.08)] font-mono text-[10px]">
            R
          </kbd>{" "}
          Қайталау
        </span>
      </div>
    </div>
  );
}
