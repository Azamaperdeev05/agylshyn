"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  History,
  Settings,
  Sun,
  Moon,
  Monitor,
  CheckCircle2,
  AlertCircle,
  Play,
  Volume2,
} from "lucide-react";
import { ThemeMode } from "@/types/dictation";

interface NavbarProps {
  activeTab: "practice" | "history" | "settings";
  setActiveTab: (tab: "practice" | "history" | "settings") => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
}

export function Navbar({
  activeTab,
  setActiveTab,
  theme,
  onThemeChange,
}: NavbarProps) {
  const [apiStatus, setApiStatus] = useState<{ configured: boolean; loading: boolean }>({
    configured: false,
    loading: true,
  });

  useEffect(() => {
    fetch("/api/status")
      .then((res) => res.json())
      .then((data) => {
        setApiStatus({
          configured: Boolean(data.configured),
          loading: false,
        });
      })
      .catch(() => {
        setApiStatus({ configured: false, loading: false });
      });
  }, [activeTab]);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* 1. Global Nav (44px, Apple Clean White, 12px quiet typography) */}
      <div className="h-11 bg-white/95 dark:bg-[#161617]/95 text-[#86868b] border-b border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.08)] backdrop-blur-md">
        <div className="max-w-[1024px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between text-[12px] tracking-[-0.01em]">
          {/* Left: Minimalist Apple-style brand glyph */}
          <button
            type="button"
            onClick={() => setActiveTab("practice")}
            className="flex items-center gap-2 text-[#1d1d1f] dark:text-white hover:opacity-80 transition-opacity cursor-pointer"
          >
            <svg
              className="w-3.5 h-3.5 fill-current"
              viewBox="0 0 170 170"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.93-14.3-5.74-8.7-10.28-18.42-13.62-29.17-3.34-10.75-5.02-21.11-5.02-31.08 0-14.35 3.63-26.06 10.89-35.13 7.26-9.07 16.37-13.68 27.34-13.84 5.37 0 11.2 1.41 17.49 4.23 6.29 2.82 10.37 4.29 12.24 4.41 1.55 0 5.86-1.55 12.92-4.66 7.07-3.11 13.23-4.52 18.5-4.23 13.9.77 24.87 5.56 32.9 14.37-12.22 7.42-18.23 17.5-18.04 30.24.19 10.15 4.09 18.66 11.69 25.53 7.6 6.87 16.74 10.77 27.42 11.7-2.31 7.21-5.26 14.86-8.86 22.95zm-33.84-118.89c.12 1.63-.12 3.51-.73 5.64-.61 2.13-1.63 4.25-3.05 6.36-1.96 2.88-4.32 5.35-7.09 7.41-2.77 2.06-5.83 3.49-9.17 4.29-.46-1.52-.64-3.18-.54-4.99.1-1.81.65-3.79 1.65-5.94 1.76-3.72 4.15-6.85 7.18-9.39 3.03-2.54 6.55-4.07 10.56-4.59.39.4.79.79 1.19 1.21z" />
            </svg>
            <span className="font-semibold text-[#1d1d1f] dark:text-white tracking-tight">Dictation</span>
          </button>

          {/* Center: Quiet navigation links */}
          <nav className="hidden sm:flex items-center gap-7">
            <button
              type="button"
              onClick={() => setActiveTab("practice")}
              className={`transition-colors cursor-pointer ${
                activeTab === "practice" ? "text-[#1d1d1f] dark:text-white font-medium" : "text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white"
              }`}
            >
              Practice
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("history")}
              className={`transition-colors cursor-pointer ${
                activeTab === "history" ? "text-[#1d1d1f] dark:text-white font-medium" : "text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white"
              }`}
            >
              History
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className={`transition-colors cursor-pointer ${
                activeTab === "settings" ? "text-[#1d1d1f] dark:text-white font-medium" : "text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white"
              }`}
            >
              Settings
            </button>
          </nav>

          {/* Right: API indicator & Audio tech note */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className="flex items-center gap-1.5 text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors cursor-pointer"
            >
              {apiStatus.configured ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34c759]" />
                  <span>ElevenLabs Connected</span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff9f0a]" />
                  <span>Setup Key</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Sub-Nav Frosted Glass (52px, Pure White / 85% with backdrop-blur) */}
      <div className="h-[52px] bg-white/85 dark:bg-[#1d1d1f]/85 backdrop-blur-xl border-b border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)]">
        <div className="max-w-[1024px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          {/* Category Title: 21px / 600 tagline */}
          <div className="flex items-baseline gap-3">
            <button
              type="button"
              onClick={() => setActiveTab("practice")}
              className="text-[20px] sm:text-[21px] font-semibold text-[#1d1d1f] dark:text-white tracking-[-0.015em] cursor-pointer hover:opacity-90 transition-opacity"
            >
              English Dictation
            </button>
            <span className="text-[12px] font-normal text-[#86868b] hidden md:inline">
              Natural Speech AI
            </span>
          </div>

          {/* Right controls: Tabs + Theme + Signature Blue Pill CTA */}
          <div className="flex items-center gap-3">
            {/* Inline Sub-nav links on mobile & desktop */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("practice")}
                className={`text-[13px] px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                  activeTab === "practice"
                    ? "text-[#0066cc] dark:text-[#2997ff] font-semibold"
                    : "text-[#1d1d1f] dark:text-[#f5f5f7] hover:text-[#0066cc] dark:hover:text-[#2997ff]"
                }`}
              >
                Жаттығу
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("history")}
                className={`text-[13px] px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                  activeTab === "history"
                    ? "text-[#0066cc] dark:text-[#2997ff] font-semibold"
                    : "text-[#1d1d1f] dark:text-[#f5f5f7] hover:text-[#0066cc] dark:hover:text-[#2997ff]"
                }`}
              >
                Тарих
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("settings")}
                className={`text-[13px] px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                  activeTab === "settings"
                    ? "text-[#0066cc] dark:text-[#2997ff] font-semibold"
                    : "text-[#1d1d1f] dark:text-[#f5f5f7] hover:text-[#0066cc] dark:hover:text-[#2997ff]"
                }`}
              >
                Баптаулар
              </button>
            </div>

            {/* Apple Theme Toggle (Minimalist 3-state capsule) */}
            <div className="flex items-center bg-[rgba(0,0,0,0.06)] dark:bg-[rgba(255,255,255,0.1)] rounded-full p-0.5 text-[#86868b]">
              <button
                type="button"
                onClick={() => onThemeChange("light")}
                title="Light"
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  theme === "light"
                    ? "bg-white text-[#1d1d1f] shadow-xs"
                    : "hover:text-[#1d1d1f] dark:hover:text-white"
                }`}
              >
                <Sun className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => onThemeChange("dark")}
                title="Dark"
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  theme === "dark"
                    ? "bg-[#2c2c2e] text-white shadow-xs"
                    : "hover:text-[#1d1d1f] dark:hover:text-white"
                }`}
              >
                <Moon className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => onThemeChange("system")}
                title="System"
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  theme === "system"
                    ? "bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white shadow-xs"
                    : "hover:text-[#1d1d1f] dark:hover:text-white"
                }`}
              >
                <Monitor className="w-3 h-3" />
              </button>
            </div>

            {/* Apple Action Blue Pill CTA: persistent right-aligned action */}
            <button
              type="button"
              onClick={() => setActiveTab("practice")}
              className="apple-btn-primary text-[12px] sm:text-[13px] !py-1.5 !px-3.5"
            >
              <span>Бастау</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
