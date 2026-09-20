import assert from "node:assert/strict";
import { test, describe } from "node:test";
import {
  splitIntoSentences,
  analyzeText,
  estimateCEFRDifficulty,
} from "../src/lib/sentenceSplitter.ts";
import {
  compareSentences,
  generateHint,
  cleanWord,
} from "../src/lib/diffEngine.ts";
import {
  calculateSessionStats,
  formatDuration,
} from "../src/lib/scoreCalculator.ts";
import type { SentenceResult } from "../src/types/dictation.ts";

describe("Sentence Splitter & Analysis", () => {
  test("splits standard multi-sentence English text accurately", () => {
    const text = `Yesterday, I went to the university.
I met my friend near the library.
We studied English together for two hours.`;
    const sentences = splitIntoSentences(text);
    assert.equal(sentences.length, 3);
    assert.equal(sentences[0].text, "Yesterday, I went to the university.");
    assert.equal(sentences[1].text, "I met my friend near the library.");
    assert.equal(sentences[2].text, "We studied English together for two hours.");
    assert.equal(sentences[0].wordCount, 6);
  });

  test("protects common English abbreviations from being split", () => {
    const text = "Dr. Smith met Mr. Brown at 8 a.m. in the U.S. They discussed the project etc. with their team.";
    const sentences = splitIntoSentences(text);
    assert.equal(sentences.length, 2);
    assert.ok(sentences[0].text.includes("Dr. Smith"));
    assert.ok(sentences[0].text.includes("Mr. Brown"));
    assert.ok(sentences[0].text.includes("U.S."));
  });

  test("estimates CEFR difficulty sensibly", () => {
    const simple = analyzeText("I see a cat. The cat is black. I like the cat.");
    assert.ok(simple.difficulty.level === "A1" || simple.difficulty.level === "A2");

    const advanced = analyzeText(
      "Acquiring fluency in a second language demands deliberate listening comprehension and neurological synchronization. Consequently, phonetic nuances strengthen syntactic intuition."
    );
    assert.ok(advanced.difficulty.level === "B2" || advanced.difficulty.level === "C1" || advanced.difficulty.level === "C2");
  });
});

describe("Word-Level Diff Engine & Hint Generator", () => {
  test("identifies correct words and substitutions (Prompt Section 11)", () => {
    const original = "Yesterday, I went to the university.";
    const user = "Yesterday I go to the university.";

    const result = compareSentences(original, user, {
      ignoreCapitalization: true,
      ignorePunctuation: true,
      strictMode: false,
    });

    assert.equal(result.correctWords, 5);
    assert.equal(result.wrongWords, 1);
    assert.equal(result.missingWords, 0);
    assert.equal(result.extraWords, 0);
    assert.equal(result.totalExpectedWords, 6);
    assert.ok(result.accuracy >= 80 && result.accuracy <= 87);

    // Verify token details
    const wrongToken = result.tokens.find((t) => t.type === "wrong");
    assert.ok(wrongToken);
    assert.equal(wrongToken?.expected, "went");
    assert.equal(wrongToken?.actual, "go");
  });

  test("detects missing and extra words", () => {
    const original = "The quick brown fox jumps over the lazy dog";
    const user = "The very quick fox jumps over the lazy dog today";

    const result = compareSentences(original, user, {
      ignoreCapitalization: true,
      ignorePunctuation: true,
      strictMode: false,
    });

    // "brown" was omitted (missing)
    // "very" and "today" were added (extra)
    const missing = result.tokens.filter((t) => t.type === "missing");
    const extra = result.tokens.filter((t) => t.type === "extra");

    assert.ok(missing.length >= 1, "Should detect at least 1 missing word");
    assert.ok(extra.length >= 1, "Should detect at least 1 extra word");
    assert.equal(missing[0].expected, "brown");
  });

  test("honors strict mode for punctuation and case sensitivity (Section 38 & 39)", () => {
    const original = "I went home.";
    const user = "i went home";

    // Relaxed mode -> 100% match
    const relaxed = compareSentences(original, user, {
      ignoreCapitalization: true,
      ignorePunctuation: true,
      strictMode: false,
    });
    assert.equal(relaxed.accuracy, 100);

    // Strict mode -> differences flagged
    const strict = compareSentences(original, user, {
      ignoreCapitalization: false,
      ignorePunctuation: false,
      strictMode: true,
    });
    assert.ok(strict.accuracy < 100);
  });

  test("generates hint with first letter revealed and rest masked (Section 33)", () => {
    const hint = generateHint("Yesterday, I went to the university.");
    assert.ok(hint.startsWith("Y________,"));
    assert.ok(hint.includes("w___"));
    assert.ok(hint.includes("u_________"));
  });
});

describe("Score Calculator & Statistics", () => {
  test("aggregates session results and identifies difficult words", () => {
    const mockResults: SentenceResult[] = [
      {
        sentenceId: 1,
        originalText: "I went to school.",
        userAnswer: "I go to school.",
        tokens: [
          { type: "correct", expected: "I", actual: "I" },
          { type: "wrong", expected: "went", actual: "go" },
          { type: "correct", expected: "to", actual: "to" },
          { type: "correct", expected: "school.", actual: "school." },
        ],
        accuracy: 75,
        correctWords: 3,
        wrongWords: 1,
        missingWords: 0,
        extraWords: 0,
        totalExpectedWords: 4,
        replaysUsed: 2,
        hintUsed: false,
        timeTakenSeconds: 12,
      },
      {
        sentenceId: 2,
        originalText: "The environment is important.",
        userAnswer: "The enviroment is important.",
        tokens: [
          { type: "correct", expected: "The", actual: "The" },
          { type: "wrong", expected: "environment", actual: "enviroment" },
          { type: "correct", expected: "is", actual: "is" },
          { type: "correct", expected: "important.", actual: "important." },
        ],
        accuracy: 75,
        correctWords: 3,
        wrongWords: 1,
        missingWords: 0,
        extraWords: 0,
        totalExpectedWords: 4,
        replaysUsed: 1,
        hintUsed: false,
        timeTakenSeconds: 15,
      },
    ];

    const stats = calculateSessionStats(mockResults, 27);
    assert.equal(stats.totalSentences, 2);
    assert.equal(stats.totalWords, 8);
    assert.equal(stats.correctWords, 6);
    assert.equal(stats.incorrectWords, 2);
    assert.equal(stats.replaysCount, 3);
    assert.equal(stats.totalDurationSeconds, 27);
    assert.equal(stats.overallAccuracy, 75);

    // Difficult words extracted
    assert.ok(stats.difficultWords.some((d) => d.word === "environment"));
    assert.ok(stats.difficultWords.some((d) => d.word === "went"));
  });

  test("formats duration correctly", () => {
    assert.equal(formatDuration(45), "0m 45s");
    assert.equal(formatDuration(125), "2m 05s");
    assert.equal(formatDuration(3670), "1h 01m 10s");
  });
});
