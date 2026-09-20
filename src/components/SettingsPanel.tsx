"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Volume2,
  Key,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sliders,
  Sparkles,
  Play,
  Sun,
  Moon,
  Monitor,
  Zap,
} from "lucide-react";
import {
  UserSettings,
  VoiceOption,
  DifficultyPreset,
  ThemeMode,
} from "@/types/dictation";

interface SettingsPanelProps {
  settings: UserSettings;
  updateSettings: (newPartial: Partial<UserSettings>) => void;
  applyPreset: (preset: DifficultyPreset) => void;
}

const AVAILABLE_MODELS = [
  {
    id: "eleven_multilingual_v2",
    name: "Eleven Multilingual v2",
    description: "Ең табиғи адам дауысы. Диктант жаттығуына арнайы ұсынылады.",
    recommended: true,
  },
  {
    id: "eleven_turbo_v2_5",
    name: "Eleven Turbo v2.5",
    description: "Жоғары жылдамдық және төмен кідіріспен дыбыстау.",
  },
  {
    id: "eleven_flash_v2_5",
    name: "Eleven Flash v2.5",
    description: "Жылдам генерация және табиғи ағылшын интонациясы.",
  },
];

export function SettingsPanel({
  settings,
  updateSettings,
  applyPreset,
}: SettingsPanelProps) {
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [loadingVoices, setLoadingVoices] = useState(true);
  const [apiStatus, setApiStatus] = useState<{ configured: boolean; message: string }>({
    configured: false,
    message: "Сервер тексерілуде...",
  });
  const [activeVoiceAccentFilter, setActiveVoiceAccentFilter] = useState<
    "all" | "American" | "British"
  >("all");
  const [previewingAudio, setPreviewingAudio] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/status")
      .then((res) => res.json())
      .then((data) => {
        setApiStatus({
          configured: Boolean(data.configured),
          message: data.message,
        });
      })
      .catch(() => {
        setApiStatus({
          configured: false,
          message: "Сервермен байланыс орнатылмады.",
        });
      });

    fetch("/api/voices")
      .then((res) => res.json())
      .then((data) => {
        if (data.voices && Array.isArray(data.voices)) {
          setVoices(data.voices);
        }
      })
      .catch(() => {})
      .finally(() => {
        setLoadingVoices(false);
      });
  }, []);

  const filteredVoices = voices.filter((v) => {
    if (activeVoiceAccentFilter === "all") return true;
    if (activeVoiceAccentFilter === "American") {
      return (
        v.accent?.toLowerCase().includes("american") ||
        (!v.accent && v.description?.toLowerCase().includes("american"))
      );
    }
    if (activeVoiceAccentFilter === "British") {
      return (
        v.accent?.toLowerCase().includes("british") ||
        (!v.accent && v.description?.toLowerCase().includes("british"))
      );
    }
    return true;
  });

  const handlePlayVoicePreview = (url?: string) => {
    if (!url) return;
    if (previewingAudio === url) {
      setPreviewingAudio(null);
      return;
    }
    const audio = new Audio(url);
    setPreviewingAudio(url);
    audio.play().catch(() => {});
    audio.onended = () => setPreviewingAudio(null);
  };

  return (
    <div className="max-w-[840px] mx-auto space-y-8 py-4 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-semibold text-[#1d1d1f] dark:text-white tracking-[-0.02em]">
          Баптаулар
        </h2>
        <p className="text-[14px] text-[#86868b] mt-0.5">
          ElevenLabs AI дауыстары, жылдамдық параметрлері және тексеру қатаңдығы.
        </p>
      </div>

      {/* 1. API Status Card */}
      <div className="rounded-[18px] bg-white dark:bg-[#1d1d1f] p-4 sm:p-7 border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#0066cc] dark:text-[#2997ff] flex items-center justify-center">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-[17px] text-[#1d1d1f] dark:text-white tracking-[-0.015em]">
                ElevenLabs API Интеграциясы
              </h3>
              <p className="text-[13px] text-[#86868b]">
                Серверлік қауіпсіз байланыс
              </p>
            </div>
          </div>

          <span
            className={`text-[12px] font-medium px-3 py-1 rounded-full flex items-center gap-1.5 ${
              apiStatus.configured
                ? "bg-[rgba(52,199,89,0.1)] text-[#34c759]"
                : "bg-[rgba(255,149,0,0.1)] text-[#ff9500]"
            }`}
          >
            {apiStatus.configured ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Серверде белсенді</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Кілт бапталмаған</span>
              </>
            )}
          </span>
        </div>

        <div className="p-4 rounded-[14px] bg-[#f5f5f7] dark:bg-[#000000] border border-[rgba(0,0,0,0.04)] dark:border-[rgba(255,255,255,0.06)] text-[13px] text-[#86868b] space-y-1 leading-[1.47]">
          <div className="flex items-center gap-1.5 font-semibold text-[#1d1d1f] dark:text-white">
            <ShieldCheck className="w-4 h-4 text-[#0066cc] dark:text-[#2997ff]" />
            <span>Қауіпсіздік протоколы</span>
          </div>
          <p>
            API кілті браузерге немесе localStorage-ке сақталмайды. Барлық дауыстық генерация Vercel серверінде орындалады.
          </p>
        </div>
      </div>

      {/* 2. Voice Selection */}
      <div className="rounded-[18px] bg-white dark:bg-[#1d1d1f] p-4 sm:p-7 border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-[#0066cc] dark:text-[#2997ff]" />
            <h3 className="font-semibold text-[17px] text-[#1d1d1f] dark:text-white tracking-[-0.015em]">
              ElevenLabs Диктор дауысы
            </h3>
          </div>

          {/* Accent filters: All / American / British (Apple segmented pill) */}
          <div className="flex items-center gap-0.5 bg-[#f5f5f7] dark:bg-[#000000] p-1 rounded-full text-[12px]">
            {(["all", "American", "British"] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveVoiceAccentFilter(filter)}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  activeVoiceAccentFilter === filter
                    ? "bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white font-semibold shadow-xs"
                    : "text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white"
                }`}
              >
                {filter === "all" ? "Барлық акценттер" : `${filter}`}
              </button>
            ))}
          </div>
        </div>

        {/* Voice Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
          {filteredVoices.map((v) => {
            const isSelected = settings.voiceId === v.voice_id;
            return (
              <div
                key={v.voice_id}
                onClick={() =>
                  updateSettings({
                    voiceId: v.voice_id,
                    voiceName: v.name,
                    voiceAccent: v.accent,
                  })
                }
                className={`p-4 rounded-[14px] border transition-all cursor-pointer text-left flex flex-col justify-between ${
                  isSelected
                    ? "border-[#0066cc] dark:border-[#2997ff] bg-[rgba(0,102,204,0.04)] ring-2 ring-[#0066cc]/20"
                    : "border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.08)] hover:border-[rgba(0,0,0,0.15)] bg-white dark:bg-[#1d1d1f]"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[15px] text-[#1d1d1f] dark:text-white">
                      {v.name}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#0066cc] text-white">
                        Таңдалды
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {v.accent && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#86868b]">
                        {v.accent}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-[12px] text-[#86868b] line-clamp-2">
                  {v.description || "Табиғи және таза дауыс."}
                </p>

                {v.preview_url && (
                  <div className="mt-3 pt-2 border-t border-[rgba(0,0,0,0.04)] dark:border-[rgba(255,255,255,0.06)] flex justify-end">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayVoicePreview(v.preview_url);
                      }}
                      className="text-[12px] text-[#0066cc] dark:text-[#2997ff] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>
                        {previewingAudio === v.preview_url
                          ? "Ойналуда..."
                          : "Дауысын тыңдау"}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. AI Model Selector */}
      <div className="rounded-[18px] bg-white dark:bg-[#1d1d1f] p-4 sm:p-7 border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-[#0066cc] dark:text-[#2997ff]" />
          <div>
            <h3 className="font-semibold text-[17px] text-[#1d1d1f] dark:text-white tracking-[-0.015em]">
              AI Дыбыстау Моделі
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {AVAILABLE_MODELS.map((model) => {
            const isSelected = settings.modelId === model.id;
            return (
              <button
                key={model.id}
                type="button"
                onClick={() => updateSettings({ modelId: model.id })}
                className={`p-4 rounded-[14px] border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "border-[#0066cc] dark:border-[#2997ff] bg-[rgba(0,102,204,0.04)] ring-2 ring-[#0066cc]/20"
                    : "border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.08)] hover:border-[rgba(0,0,0,0.15)] bg-white dark:bg-[#1d1d1f]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-[14px] text-[#1d1d1f] dark:text-white">
                    {model.name}
                  </span>
                  {model.recommended && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[rgba(52,199,89,0.12)] text-[#34c759]">
                      Ұсынылады
                    </span>
                  )}
                </div>
                <p className="text-[12px] text-[#86868b] leading-[1.47]">
                  {model.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Difficulty Presets */}
      <div className="rounded-[18px] bg-white dark:bg-[#1d1d1f] p-4 sm:p-7 border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] space-y-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-[#0066cc] dark:text-[#2997ff]" />
          <div>
            <h3 className="font-semibold text-[17px] text-[#1d1d1f] dark:text-white tracking-[-0.015em]">
              Дайын деңгейлер (Presets)
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => applyPreset("beginner")}
            className={`p-4 rounded-[14px] border text-left transition-all cursor-pointer ${
              settings.difficultyPreset === "beginner"
                ? "border-[#0066cc] dark:border-[#2997ff] ring-2 ring-[#0066cc]/20 bg-[rgba(0,102,204,0.04)]"
                : "border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.08)]"
            }`}
          >
            <span className="font-semibold text-[15px] text-[#1d1d1f] dark:text-white block">
              Бастауыш (Beginner)
            </span>
            <ul className="text-[12px] text-[#86868b] space-y-0.5 mt-2">
              <li>• Жылдамдық: 0.75x</li>
              <li>• Үзіліс: 5 секунд</li>
              <li>• Қайталау: Шексіз</li>
            </ul>
          </button>

          <button
            type="button"
            onClick={() => applyPreset("intermediate")}
            className={`p-4 rounded-[14px] border text-left transition-all cursor-pointer ${
              settings.difficultyPreset === "intermediate"
                ? "border-[#0066cc] dark:border-[#2997ff] ring-2 ring-[#0066cc]/20 bg-[rgba(0,102,204,0.04)]"
                : "border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.08)]"
            }`}
          >
            <span className="font-semibold text-[15px] text-[#1d1d1f] dark:text-white block">
              Орташа (Intermediate)
            </span>
            <ul className="text-[12px] text-[#86868b] space-y-0.5 mt-2">
              <li>• Жылдамдық: 1.0x</li>
              <li>• Үзіліс: 3 секунд</li>
              <li>• Қайталау: 3 рет</li>
            </ul>
          </button>

          <button
            type="button"
            onClick={() => applyPreset("advanced")}
            className={`p-4 rounded-[14px] border text-left transition-all cursor-pointer ${
              settings.difficultyPreset === "advanced"
                ? "border-[#0066cc] dark:border-[#2997ff] ring-2 ring-[#0066cc]/20 bg-[rgba(0,102,204,0.04)]"
                : "border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.08)]"
            }`}
          >
            <span className="font-semibold text-[15px] text-[#1d1d1f] dark:text-white block">
              Жоғары (Advanced)
            </span>
            <ul className="text-[12px] text-[#86868b] space-y-0.5 mt-2">
              <li>• Жылдамдық: 1.25x</li>
              <li>• Үзіліс: 2 секунд</li>
              <li>• Қайталау: 1 рет</li>
            </ul>
          </button>
        </div>
      </div>

      {/* 5. Answer Comparison Rules */}
      <div className="rounded-[18px] bg-white dark:bg-[#1d1d1f] p-4 sm:p-7 border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] space-y-4">
        <h3 className="font-semibold text-[17px] text-[#1d1d1f] dark:text-white tracking-[-0.015em]">
          Жауапты тексеру ережелері
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-[14px] bg-[#f5f5f7] dark:bg-[#000000]">
            <div>
              <span className="font-semibold text-[14px] text-[#1d1d1f] dark:text-white">
                Бас әріптерге мән бермеу (Ignore Capitalization)
              </span>
              <p className="text-[12px] text-[#86868b]">
                "Yesterday" және "yesterday" бірдей деп саналады.
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.ignoreCapitalization}
              onChange={(e) =>
                updateSettings({ ignoreCapitalization: e.target.checked })
              }
              className="w-5 h-5 accent-[#0066cc] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-[14px] bg-[#f5f5f7] dark:bg-[#000000]">
            <div>
              <span className="font-semibold text-[14px] text-[#1d1d1f] dark:text-white">
                Тыныс белгілеріне мән бермеу (Ignore Punctuation)
              </span>
              <p className="text-[12px] text-[#86868b]">
                Үтір, нүкте, тырнақшалар қате ретінде есептелмейді.
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.ignorePunctuation}
              onChange={(e) =>
                updateSettings({ ignorePunctuation: e.target.checked })
              }
              className="w-5 h-5 accent-[#0066cc] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-[14px] bg-[#f5f5f7] dark:bg-[#000000]">
            <div>
              <span className="font-semibold text-[14px] text-[#1d1d1f] dark:text-white">
                Қатаң режим (Strict Mode)
              </span>
              <p className="text-[12px] text-[#86868b]">
                Әрбір әріп пен тыныс белгісінің 100% дәл келуін талап етеді.
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.strictMode}
              onChange={(e) =>
                updateSettings({ strictMode: e.target.checked })
              }
              className="w-5 h-5 accent-[#0066cc] cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
