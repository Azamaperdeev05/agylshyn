"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { fetchSentenceAudio, prefetchSentenceAudio } from "@/lib/audioCache";
import { PlaybackSpeed } from "@/types/dictation";

interface UseAudioPlayerOptions {
  voiceId: string;
  modelId: string;
  speed: PlaybackSpeed;
  onEnded?: () => void;
}

export function useAudioPlayer({
  voiceId,
  modelId,
  speed,
  onEnded,
}: UseAudioPlayerOptions) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [replaysUsed, setReplaysUsed] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentSentenceRef = useRef<string>("");
  const onEndedRef = useRef(onEnded);

  useEffect(() => {
    onEndedRef.current = onEnded;
  }, [onEnded]);

  // Initialize or clean up HTMLAudioElement
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (onEndedRef.current) {
        onEndedRef.current();
      }
    };

    const handleError = () => {
      setIsPlaying(false);
      setIsLoading(false);
      setErrorMessage("Unable to play audio. Please try again.");
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.src = "";
    };
  }, []);

  // Update playbackRate when speed changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, [speed]);

  // Load and play a specific sentence
  const playSentence = useCallback(
    async (sentenceText: string, isReplay = false) => {
      if (!sentenceText) return;

      const audio = audioRef.current;
      if (!audio) return;

      setIsLoading(true);
      setErrorMessage(null);

      try {
        currentSentenceRef.current = sentenceText;

        // Fetch (from cache or ElevenLabs endpoint)
        const audioUrl = await fetchSentenceAudio(sentenceText, voiceId, modelId);

        if (audio.src !== audioUrl) {
          audio.src = audioUrl;
          audio.playbackRate = speed;
        }

        audio.currentTime = 0;
        await audio.play();
        setIsPlaying(true);

        if (isReplay) {
          setReplaysUsed((prev) => prev + 1);
        }
      } catch (err: unknown) {
        setIsPlaying(false);
        const msg =
          err instanceof Error
            ? err.message
            : "Failed to load audio. Please verify your ElevenLabs configuration.";
        setErrorMessage(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [voiceId, modelId, speed]
  );

  const pause = useCallback(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [isPlaying]);

  const resume = useCallback(async () => {
    if (audioRef.current && !isPlaying) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch {
        // Handle playback issue
      }
    }
  }, [isPlaying]);

  const replay = useCallback(async () => {
    if (currentSentenceRef.current) {
      await playSentence(currentSentenceRef.current, true);
    }
  }, [playSentence]);

  const resetReplayCount = useCallback(() => {
    setReplaysUsed(0);
    setCurrentTime(0);
    setDuration(0);
  }, []);

  const prefetchNext = useCallback(
    (nextSentenceText: string) => {
      prefetchSentenceAudio(nextSentenceText, voiceId, modelId);
    },
    [voiceId, modelId]
  );

  return {
    isPlaying,
    isLoading,
    errorMessage,
    currentTime,
    duration,
    replaysUsed,
    playSentence,
    pause,
    resume,
    replay,
    resetReplayCount,
    prefetchNext,
  };
}
