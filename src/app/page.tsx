"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { DictationSetup } from "@/components/DictationSetup";
import { DictationPlayer } from "@/components/DictationPlayer";
import { AnswerInput } from "@/components/AnswerInput";
import { AnswerResult } from "@/components/AnswerResult";
import { FinalResults } from "@/components/FinalResults";
import { HistoryPanel } from "@/components/HistoryPanel";
import { SettingsPanel } from "@/components/SettingsPanel";
import { useSettings } from "@/hooks/useSettings";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useHistory } from "@/hooks/useHistory";
import { compareSentences } from "@/lib/diffEngine";
import { calculateSessionStats } from "@/lib/scoreCalculator";
import {
  Sentence,
  SentenceResult,
  DictationState,
  HistorySession,
} from "@/types/dictation";

export default function Home() {
  const { settings, updateSettings, applyPreset } = useSettings();
  const { sessions, saveSession, deleteSession, clearHistory } = useHistory();

  // Navigation tab
  const [activeTab, setActiveTab] = useState<"practice" | "history" | "settings">(
    "practice"
  );

  // Dictation workflow state
  const [dictationState, setDictationState] = useState<DictationState>("setup");
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [sessionResults, setSessionResults] = useState<SentenceResult[]>([]);
  const [currentResult, setCurrentResult] = useState<SentenceResult | null>(null);

  // Timing and countdown
  const [isPausedCountdown, setIsPausedCountdown] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState<number>(settings.pauseDuration);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionStartTimeRef = useRef<number>(0);
  const sentenceStartTimeRef = useRef<number>(0);
  const rawTextSnippetRef = useRef<string>("");
  const isMistakePracticeModeRef = useRef<boolean>(false);

  // Clear countdown timer safely
  const clearCountdown = useCallback(() => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    setIsPausedCountdown(false);
  }, []);

  // Audio player hook
  const {
    isPlaying,
    isLoading,
    errorMessage,
    replaysUsed,
    playSentence,
    pause,
    resume,
    replay,
    resetReplayCount,
    prefetchNext,
  } = useAudioPlayer({
    voiceId: settings.voiceId,
    modelId: settings.modelId,
    speed: settings.speed,
    onEnded: () => {
      // Audio playback finished
      if (settings.pauseDuration > 0 && settings.autoNext) {
        setIsPausedCountdown(true);
        setCountdownSeconds(settings.pauseDuration);

        let remaining = settings.pauseDuration;
        countdownIntervalRef.current = setInterval(() => {
          remaining -= 1;
          if (remaining <= 0) {
            clearCountdown();
          } else {
            setCountdownSeconds(remaining);
          }
        }, 1000);
      }
    },
  });

  // Current sentence reference
  const currentSentence = sentences[currentSentenceIndex] || null;

  // Background pre-fetch next sentence whenever current index changes
  useEffect(() => {
    if (dictationState !== "setup" && dictationState !== "completed") {
      const nextIndex = currentSentenceIndex + 1;
      if (nextIndex < sentences.length) {
        const nextSentence = sentences[nextIndex];
        // Only fetch via API if it is not already a pre-generated static audio file
        if (!nextSentence.audioUrl) {
          prefetchNext(nextSentence.text);
        }
      }
    }
  }, [currentSentenceIndex, sentences, dictationState, prefetchNext]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  // Start a new session
  const handleStartSession = (
    newSentences: Sentence[],
    rawText: string,
    isMistakesMode = false
  ) => {
    if (newSentences.length === 0) return;

    clearCountdown();
    setSentences(newSentences);
    setCurrentSentenceIndex(0);
    setSessionResults([]);
    setCurrentResult(null);
    rawTextSnippetRef.current = rawText;
    isMistakePracticeModeRef.current = isMistakesMode;
    sessionStartTimeRef.current = Date.now();
    sentenceStartTimeRef.current = Date.now();
    resetReplayCount();

    setDictationState("playing");

    // Automatically play first sentence (Section 31)
    setTimeout(() => {
      playSentence(newSentences[0].text, false, newSentences[0].audioUrl);
    }, 150);
  };

  // Check user answer
  const handleCheckAnswer = (userAnswer: string, usedHint: boolean) => {
    if (!currentSentence) return;
    clearCountdown();

    const diff = compareSentences(currentSentence.text, userAnswer, {
      ignoreCapitalization: settings.ignoreCapitalization,
      ignorePunctuation: settings.ignorePunctuation,
      strictMode: settings.strictMode,
    });

    const timeTakenSeconds = Math.round(
      (Date.now() - sentenceStartTimeRef.current) / 1000
    );

    const result: SentenceResult = {
      sentenceId: currentSentence.id,
      originalText: currentSentence.text,
      userAnswer,
      tokens: diff.tokens,
      accuracy: diff.accuracy,
      correctWords: diff.correctWords,
      wrongWords: diff.wrongWords,
      missingWords: diff.missingWords,
      extraWords: diff.extraWords,
      totalExpectedWords: diff.totalExpectedWords,
      replaysUsed,
      hintUsed: usedHint,
      timeTakenSeconds,
    };

    setCurrentResult(result);
    setSessionResults((prev) => [...prev, result]);
    setDictationState("checked");
  };

  // Try current sentence again
  const handleTryAgain = () => {
    clearCountdown();
    // Remove last result from session results
    setSessionResults((prev) => prev.slice(0, -1));
    setCurrentResult(null);
    sentenceStartTimeRef.current = Date.now();
    setDictationState("playing");
    playSentence(currentSentence.text, false, currentSentence.audioUrl);
  };

  // Move to next sentence or finish
  const handleNextSentence = () => {
    clearCountdown();
    setCurrentResult(null);
    resetReplayCount();

    const nextIdx = currentSentenceIndex + 1;
    if (nextIdx < sentences.length) {
      setCurrentSentenceIndex(nextIdx);
      sentenceStartTimeRef.current = Date.now();
      setDictationState("playing");
      playSentence(sentences[nextIdx].text, false, sentences[nextIdx].audioUrl);
    } else {
      // Completed all sentences!
      setDictationState("completed");
      const totalDuration = Math.round(
        (Date.now() - sessionStartTimeRef.current) / 1000
      );
      const allResults = [...sessionResults];
      if (currentResult && !allResults.some((r) => r.sentenceId === currentResult.sentenceId)) {
        allResults.push(currentResult);
      }
      const stats = calculateSessionStats(allResults, totalDuration);

      // Save to localStorage history
      const title = isMistakePracticeModeRef.current
        ? "Mistake Practice Session"
        : sentences[0]?.text.slice(0, 45) || "Dictation Practice";

      saveSession(
        title,
        rawTextSnippetRef.current,
        allResults,
        stats.overallAccuracy,
        totalDuration,
        stats.performanceRating
      );
    }
  };

  // Skip sentence
  const handleSkipSentence = () => {
    if (!currentSentence) return;
    // Register as 0% accuracy
    const skippedResult: SentenceResult = {
      sentenceId: currentSentence.id,
      originalText: currentSentence.text,
      userAnswer: "(Skipped)",
      tokens: [
        {
          type: "missing",
          expected: currentSentence.text,
        },
      ],
      accuracy: 0,
      correctWords: 0,
      wrongWords: 0,
      missingWords: currentSentence.wordCount,
      extraWords: 0,
      totalExpectedWords: currentSentence.wordCount,
      replaysUsed,
      hintUsed: false,
      timeTakenSeconds: 0,
    };

    setSessionResults((prev) => [...prev, skippedResult]);
    handleNextSentence();
  };

  // Practice Mistakes Mode (Section 15)
  const handlePracticeMistakes = () => {
    const mistakeSentences = sessionResults
      .filter((r) => r.accuracy < 100)
      .map((r, i) => {
        const orig = sentences.find(
          (s) => s.id === r.sentenceId || s.text === r.originalText
        );
        return {
          id: i + 1,
          text: r.originalText,
          wordCount: r.totalExpectedWords,
          audioUrl: orig?.audioUrl,
        };
      });

    if (mistakeSentences.length > 0) {
      handleStartSession(mistakeSentences, rawTextSnippetRef.current, true);
    }
  };

  // Restart same text
  const handleRestartSameText = () => {
    handleStartSession(sentences, rawTextSnippetRef.current, false);
  };

  // New dictation text
  const handleNewDictation = () => {
    clearCountdown();
    setDictationState("setup");
    setSentences([]);
    setCurrentSentenceIndex(0);
    setSessionResults([]);
    setCurrentResult(null);
  };

  // Start from history
  const handleStartFromHistory = (histSession: HistorySession) => {
    const loadedSentences: Sentence[] = histSession.sentenceResults.map((r, i) => ({
      id: i + 1,
      text: r.originalText,
      wordCount: r.totalExpectedWords,
    }));
    setActiveTab("practice");
    handleStartSession(loadedSentences, histSession.snippet, false);
  };

  // Calculate final statistics for completed screen
  const totalDuration = Math.round(
    (Date.now() - sessionStartTimeRef.current) / 1000
  );
  const finalStats = calculateSessionStats(sessionResults, totalDuration);

  return (
    <div className="min-h-screen flex flex-col bg-[#ffffff] dark:bg-[#000000] text-[#1d1d1f] dark:text-[#f5f5f7] selection:bg-[#0066cc]/20">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={settings.theme}
        onThemeChange={(newTheme) => updateSettings({ theme: newTheme })}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1024px] w-full mx-auto px-3.5 sm:px-6 py-4 sm:py-10 pb-28 sm:pb-12">
        {activeTab === "practice" && (
          <div>
            {dictationState === "setup" && (
              <DictationSetup
                onStartSession={handleStartSession}
                settings={settings}
                onOpenSettings={() => setActiveTab("settings")}
              />
            )}

            {(dictationState === "playing" ||
              dictationState === "typing" ||
              dictationState === "checked") &&
              currentSentence && (
                <div className="max-w-[840px] mx-auto space-y-6">
                  {/* Audio Player Card */}
                  <DictationPlayer
                    currentSentenceNumber={currentSentenceIndex + 1}
                    totalSentences={sentences.length}
                    isPlaying={isPlaying}
                    isLoading={isLoading}
                    errorMessage={errorMessage}
                    replaysUsed={replaysUsed}
                    maxReplays={settings.maxReplays}
                    speed={settings.speed}
                    pauseDuration={settings.pauseDuration}
                    autoNext={settings.autoNext}
                    isPausedCountdown={isPausedCountdown}
                    countdownSeconds={countdownSeconds}
                    onPlay={() =>
                      playSentence(
                        currentSentence.text,
                        false,
                        currentSentence.audioUrl
                      )
                    }
                    onPause={pause}
                    onReplay={replay}
                    onSpeedChange={(speed) => updateSettings({ speed })}
                    onPauseDurationChange={(pauseDuration) =>
                      updateSettings({ pauseDuration })
                    }
                    onToggleAutoNext={() =>
                      updateSettings({
                        autoNext: !settings.autoNext,
                        _userSetAutoNext: true,
                      } as any)
                    }
                    onCancelCountdown={clearCountdown}
                    voiceName={settings.voiceName}
                  />

                  {/* Active Dictation Input (Anti-Cheat: original sentence NOT displayed in DOM) */}
                  {dictationState !== "checked" ? (
                    <AnswerInput
                      originalSentence={currentSentence.text}
                      onCheckAnswer={handleCheckAnswer}
                      onSkipSentence={handleSkipSentence}
                      onReplay={replay}
                      isPlaying={isPlaying}
                      onTogglePlay={isPlaying ? pause : resume}
                      onNextSentence={handleNextSentence}
                      canNextSentence={false}
                    />
                  ) : (
                    currentResult && (
                      <AnswerResult
                        result={currentResult}
                        isLastSentence={
                          currentSentenceIndex === sentences.length - 1
                        }
                        onTryAgain={handleTryAgain}
                        onNextSentence={handleNextSentence}
                      />
                    )
                  )}
                </div>
              )}

            {dictationState === "completed" && (
              <FinalResults
                stats={finalStats}
                results={sessionResults}
                onPracticeMistakes={handlePracticeMistakes}
                onRestartSameText={handleRestartSameText}
                onNewDictation={handleNewDictation}
              />
            )}
          </div>
        )}

        {activeTab === "history" && (
          <HistoryPanel
            sessions={sessions}
            onDeleteSession={deleteSession}
            onClearHistory={clearHistory}
            onStartSessionFromHistory={handleStartFromHistory}
          />
        )}

        {activeTab === "settings" && (
          <SettingsPanel
            settings={settings}
            updateSettings={updateSettings}
            applyPreset={applyPreset}
          />
        )}
      </main>

      {/* Apple Editorial Footer */}
      <footer className="bg-[#f5f5f7] dark:bg-[#000000] border-t border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] py-8 pb-28 sm:py-12 sm:pb-12 text-[12px] text-[#86868b]">
        <div className="max-w-[1024px] mx-auto px-4 sm:px-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.06)]">
            <p className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
              English Dictation Trainer
            </p>
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => setActiveTab("practice")}
                className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors cursor-pointer"
              >
                Жаттығу
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("history")}
                className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors cursor-pointer"
              >
                Тарих
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("settings")}
                className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors cursor-pointer"
              >
                Баптаулар
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1 text-[11px]">
            <p>
              Copyright © 2026 Dictation Trainer. Барлық құқықтар қорғалған.
            </p>
            <div className="flex items-center gap-3">
              <span>ElevenLabs AI Voice</span>
              <span>•</span>
              <span>Zero-Exposure Security</span>
              <span>•</span>
              <span>Local Storage</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
