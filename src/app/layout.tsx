import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "English Dictation Trainer — AI-Powered Listening Practice",
  description:
    "Master English listening and spelling with natural ElevenLabs AI voice dictation, sentence-by-sentence practice, and instant word-level feedback.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className="min-h-full flex flex-col font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
