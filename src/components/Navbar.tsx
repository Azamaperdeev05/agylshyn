"use client";

import React, { useState, useEffect } from "react";
import { Headphones, History, Settings, Sparkles, Moon, Sun, Monitor, CheckCircle2, AlertCircle } from "lucide-react";
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
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <button
          onClick={() => setActiveTab("practice")}
          className="flex items-center gap-3 group text-left focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white tracking-tight text-lg">
                English Dictation
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                ElevenLabs AI
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Listen • Type • Check • Master
            </p>
          </div>
        </button>

        {/* Center Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-800">
          <button
            onClick={() => setActiveTab("practice")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === "practice"
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Practice</span>
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === "history"
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <History className="w-4 h-4" />
            <span>History</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === "settings"
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </nav>

        {/* Right side controls: ElevenLabs Status & Theme Selector */}
        <div className="flex items-center gap-3">
          {/* ElevenLabs API Badge */}
          <button
            onClick={() => setActiveTab("settings")}
            title={
              apiStatus.configured
                ? "ElevenLabs API connected"
                : "ElevenLabs API key missing in .env"
            }
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
              apiStatus.configured
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
            }`}
          >
            {apiStatus.configured ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>API Ready</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                <span>Setup Key</span>
              </>
            )}
          </button>

          {/* Theme Mode Selector */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
            <button
              onClick={() => onThemeChange("light")}
              title="Light mode"
              className={`p-1.5 rounded-md transition-all ${
                theme === "light"
                  ? "bg-white text-amber-500 shadow-xs dark:bg-slate-700"
                  : "hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onThemeChange("dark")}
              title="Dark mode"
              className={`p-1.5 rounded-md transition-all ${
                theme === "dark"
                  ? "bg-white text-blue-500 shadow-xs dark:bg-slate-700 dark:text-blue-400"
                  : "hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onThemeChange("system")}
              title="System mode"
              className={`p-1.5 rounded-md transition-all ${
                theme === "system"
                  ? "bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-slate-100"
                  : "hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
