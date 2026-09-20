"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Check,
  SkipForward,
  RotateCcw,
  Lightbulb,
  Keyboard,
  CornerDownLeft,
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

      // Ctrl+Enter or Cmd+Enter triggers Check Answer from anywhere (even inside textarea)
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
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-7 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <label
          htmlFor="user-transcription"
          className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2"
        >
          <span>Your Transcription</span>
        </label>

        {/* Show Hint Button */}
        <button
          type="button"
          onClick={handleToggleHint}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            showHint
              ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400"
          }`}
          title="Show first letter of each word as a hint"
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>{showHint ? "Hide Hint" : "Show Hint"}</span>
        </button>
      </div>

      {/* Hint Banner */}
      {showHint && hintText && (
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs font-mono text-amber-900 dark:text-amber-200 tracking-wider animate-in fade-in duration-150">
          <div className="text-[11px] font-sans font-semibold text-amber-700 dark:text-amber-400 mb-1 flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Hint (First letters):</span>
          </div>
          <div className="text-sm font-bold select-none">{hintText}</div>
        </div>
      )}

      {/* Answer Textarea */}
      <textarea
        id="user-transcription"
        ref={textareaRef}
        rows={4}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type exactly what you hear..."
        spellCheck="true"
        autoCapitalize="sentences"
        autoCorrect="off"
        className="w-full p-4 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 font-sans text-base sm:text-lg leading-relaxed resize-y transition-all"
      />

      {/* Bottom Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          {/* Replay */}
          <button
            type="button"
            onClick={onReplay}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>Replay (R)</span>
          </button>

          {/* Skip */}
          <button
            type="button"
            onClick={onSkipSentence}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <SkipForward className="w-4 h-4" />
            <span>Skip</span>
          </button>
        </div>

        {/* Check Answer Button */}
        <button
          type="button"
          onClick={handleCheck}
          className="w-full sm:w-auto px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 group cursor-pointer"
        >
          <Check className="w-4 h-4" />
          <span>CHECK ANSWER</span>
          <span className="hidden sm:inline-flex items-center text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500 text-white/90">
            ⌘+↵
          </span>
        </button>
      </div>

      {/* Helpful keyboard shortcuts hint footer */}
      <div className="hidden sm:flex items-center justify-center gap-4 text-[11px] text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800/60">
        <span className="flex items-center gap-1">
          <Keyboard className="w-3 h-3" /> Shortcuts:
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
            ⌘/Ctrl + Enter
          </kbd>{" "}
          Check
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
            Space
          </kbd>{" "}
          Play/Pause
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
            R
          </kbd>{" "}
          Replay
        </span>
      </div>
    </div>
  );
}
