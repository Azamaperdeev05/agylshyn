import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "English Dictation Trainer — Apple Design Edition",
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
      <body className="min-h-full flex flex-col font-sans bg-[#f5f5f7] dark:bg-[#000000] text-[#1d1d1f] dark:text-[#f5f5f7] antialiased transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
