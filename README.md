# English Dictation Trainer 🎧

An educational, AI-powered English listening and dictation practice web application inspired by 7ESL, enhanced with natural human-like voice synthesis using the **ElevenLabs Text-to-Speech API**.

The application transforms any English passage into an interactive listening exercise: splitting the text into sentences, synthesizing natural speech, enforcing focused listening with anti-cheating DOM guards, providing configurable pause countdowns, and performing word-level diff analysis with precision scoring.

---

## 🌟 Key Features

1. **Text Processing & CEFR Difficulty Estimation**
   - Paste any paragraph, essay, or dialogue.
   - Smart sentence segmentation with abbreviation protection (`Mr.`, `Dr.`, `e.g.`, `etc.`, `U.S.`, middle initials).
   - Automated Readability & CEFR Level analysis (A1, A2, B1, B2, C1, C2) with syllable and sentence-length heuristics.
   - Quick-load curated sample passages (Beginner, Intermediate, Advanced).
   - Support for drag & drop and `.txt` / `.md` file imports.

2. **Natural AI Speech (ElevenLabs TTS)**
   - High-fidelity natural voice synthesis via ElevenLabs.
   - American and British English voice selection (Rachel, Adam, Nicole, George, Charlotte, Alice, etc.).
   - Voice preview samples directly in the settings panel.
   - Model selection: `Eleven Multilingual v2`, `Eleven Turbo v2.5`, `Eleven Flash v2.5`.
   - Dynamic playback speeds: `0.5x`, `0.75x`, `1.0x`, `1.25x`, `1.5x`.

3. **Intelligent Pause & Countdown System**
   - Configurable pause duration after audio finishes: `0s`, `1s`, `2s`, `3s`, `4s`, `5s`, `7s`, `10s` (Default: 3s).
   - Visual countdown timer: *"Audio finished. Next sentence in 3... 2... 1..."*.
   - Auto Next toggle (Automatic flow vs Manual mode for beginners).

4. **Zero Client-Side Key Exposure & Security**
   - `ELEVENLABS_API_KEY` exists **exclusively on the server** in `.env`.
   - Never exposed in frontend bundles, `localStorage`, or client-side JavaScript.
   - Dedicated server API routes (`/api/tts`, `/api/voices`, `/api/status`) proxy all ElevenLabs calls.

5. **Deterministic Audio Caching & Performance**
   - Replaying a sentence **never** generates a redundant ElevenLabs API call.
   - In-memory & Blob caching keyed deterministically by `(sentenceText, voiceId, modelId)`.
   - Background pre-fetching of the next sentence for instant transitions without lag.

6. **Anti-Cheating Design**
   - The original sentence is strictly hidden during active dictation.
   - It is never rendered into visible DOM text before checking.
   - Optional **First-Letter Hint** (`Y____ I g__ t_ t__ u________.`) available on explicit click.

7. **Word-Level Diff Alignment & Precision Scoring**
   - Needleman-Wunsch / Wagner-Fischer dynamic programming sequence alignment.
   - Categorizes each word into:
     - `✓ Correct` (Emerald)
     - `✕ Incorrect / Wrong` (Rose substitution)
     - `* Missing` (Amber omission)
     - `− Extra` (Purple unrequested addition)
   - Configurable normalization:
     - Ignore Capitalization (default ON)
     - Ignore Punctuation (default ON)
     - Strict Mode (demands exact case and punctuation)

8. **Comprehensive Results & Mistake Practice Mode**
   - Final results dashboard with circular accuracy gauge.
   - Performance tier rating: *Easy*, *Moderate*, *Difficult*.
   - Statistics: total sentences, words, correct, incorrect, missing, replays, practice time.
   - **Most Difficult Words** ranked leaderboard.
   - **Targeted Mistake Practice**: re-run only the sentences containing mistakes until mastered.

9. **History & Offline-First Privacy**
   - Past completed sessions saved locally in `localStorage`.
   - View past scores, inspect sentence-by-sentence answers, or re-practice previous texts.

10. **Modern, Accessible UI**
    - Built with Next.js 16, React 19, TypeScript, and Tailwind CSS.
    - System / Light / Dark theme support with smooth transitions.
    - Responsive mobile layout with touch-friendly controls.
    - Keyboard shortcuts:
      - `Space`: Play / Pause (outside textarea)
      - `R`: Replay sentence
      - `Enter` or `⌘/Ctrl + Enter`: Check Answer
      - `N`: Next Sentence

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Webpack/Turbopack)
- **UI & Components**: [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [Lucide React](https://lucide.dev/)
- **Audio & Animations**: HTML5 Audio API, Canvas Confetti
- **Language**: TypeScript 5
- **TTS Engine**: [ElevenLabs API](https://elevenlabs.io/) (Server-Side Proxy)
- **Persistence**: `localStorage` (No external database required)

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18.18+ or v20+ / v22+
- npm, pnpm, or yarn
- ElevenLabs account & API key (free tier available at [elevenlabs.io](https://elevenlabs.io/))

### 1. Clone & Install Dependencies

```bash
git clone <repository-url>
cd f
npm install
```

### 2. Configure ElevenLabs API Key

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Open `.env` and add your ElevenLabs API key:

```env
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

> **Security Note**: Never commit your `.env` file. It is already added to `.gitignore`.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing

Run the automated test suite covering sentence segmentation, abbreviation protection, word-level diff, hints, and score calculation:

```bash
npm test
```

Build for production:

```bash
npm run build
```

---

## 📁 Architecture Overview

```
src/
├── app/
│   ├── api/
│   │   ├── tts/route.ts        # Server route: calls ElevenLabs TTS securely
│   │   ├── voices/route.ts     # Server route: fetches voice list / fallbacks
│   │   └── status/route.ts     # Server route: checks API key presence
│   ├── layout.tsx              # Root HTML & metadata
│   ├── globals.css             # Tailwind theme & soundwave animations
│   └── page.tsx                # Main dictation trainer orchestrator
├── components/
│   ├── Navbar.tsx              # Brand header, tabs, API status, theme toggle
│   ├── DictationSetup.tsx      # Text input, CEFR stats, sample texts, briefing
│   ├── DictationPlayer.tsx     # Audio visualizer, play/pause, replay, countdown
│   ├── AnswerInput.tsx         # Textarea, hints, keyboard shortcuts
│   ├── AnswerResult.tsx        # Word-level diff chips, legend, word breakdown
│   ├── FinalResults.tsx        # Dashboard, celebration, mistake practice trigger
│   ├── HistoryPanel.tsx        # LocalStorage session history inspector
│   └── SettingsPanel.tsx       # ElevenLabs voice, model, difficulty & API config
├── hooks/
│   ├── useAudioPlayer.ts       # Audio playback, speed, replay counters
│   ├── useSettings.ts          # Settings persistence & theme management
│   └── useHistory.ts           # Completed session persistence
├── lib/
│   ├── sentenceSplitter.ts     # Segmentation, abbreviations, CEFR estimation
│   ├── diffEngine.ts           # Needleman-Wunsch word diff & hint generator
│   ├── scoreCalculator.ts      # Accuracy score, session stats & rankings
│   ├── audioCache.ts           # In-memory & Blob audio cache & prefetcher
│   └── sampleTexts.ts          # Curated Beginner, Intermediate & Advanced texts
└── types/
    └── dictation.ts            # Core TypeScript interfaces
```

---

## 🌐 Production Deployment (Vercel)

1. Push your repository to GitHub.
2. Import the repository into [Vercel](https://vercel.com).
3. In **Project Settings** → **Environment Variables**, add:
   - Key: `ELEVENLABS_API_KEY`
   - Value: `your_production_elevenlabs_api_key`
4. Deploy! Next.js serverless functions will handle `/api/tts` securely.

---

## 📄 License

MIT License. Crafted for English learners and educators worldwide.
