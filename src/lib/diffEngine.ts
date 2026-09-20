import type { DiffToken, DiffTokenType } from "../types/dictation.ts";

export interface DiffOptions {
  ignoreCapitalization: boolean;
  ignorePunctuation: boolean;
  strictMode: boolean;
}

export interface WordToken {
  raw: string;
  clean: string;
}

/**
 * Strips punctuation from a word for relaxed comparison
 */
export function cleanWord(
  word: string,
  ignoreCap: boolean,
  ignorePunct: boolean
): string {
  let cleaned = word.trim();
  if (ignorePunct) {
    cleaned = cleaned.replace(/[.,/#!$%^&*;:{}=\-_`~()?"'’“”]/g, "");
  }
  if (ignoreCap) {
    cleaned = cleaned.toLowerCase();
  }
  return cleaned;
}

/**
 * Tokenizes sentence into sequence of word tokens
 */
export function tokenizeSentence(
  sentence: string,
  options: DiffOptions
): WordToken[] {
  if (!sentence) return [];
  const words = sentence.trim().split(/\s+/).filter(Boolean);

  return words.map((raw) => ({
    raw,
    clean: cleanWord(
      raw,
      !options.strictMode && options.ignoreCapitalization,
      !options.strictMode && options.ignorePunctuation
    ),
  }));
}

/**
 * Determines whether two word tokens match given current options
 */
function areTokensEqual(
  expected: WordToken,
  actual: WordToken,
  options: DiffOptions
): boolean {
  if (options.strictMode) {
    return expected.raw === actual.raw;
  }
  return expected.clean === actual.clean;
}

/**
 * Word-level alignment algorithm based on Needleman-Wunsch / Wagner-Fischer
 * Accurately detects:
 * - correct words
 * - wrong words (substituted)
 * - missing words (omitted from expected)
 * - extra words (inserted in user answer)
 */
export function compareSentences(
  expectedText: string,
  actualText: string,
  options: DiffOptions = {
    ignoreCapitalization: true,
    ignorePunctuation: true,
    strictMode: false,
  }
): {
  tokens: DiffToken[];
  correctWords: number;
  wrongWords: number;
  missingWords: number;
  extraWords: number;
  totalExpectedWords: number;
  accuracy: number;
} {
  const expectedTokens = tokenizeSentence(expectedText, options);
  const actualTokens = tokenizeSentence(actualText, options);

  const m = expectedTokens.length;
  const n = actualTokens.length;

  if (m === 0 && n === 0) {
    return {
      tokens: [],
      correctWords: 0,
      wrongWords: 0,
      missingWords: 0,
      extraWords: 0,
      totalExpectedWords: 0,
      accuracy: 100,
    };
  }

  // Cost matrix initialization
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0)
  );

  const MATCH_COST = 0;
  const WRONG_COST = 1.2;
  const MISSING_COST = 1.0;
  const EXTRA_COST = 1.0;

  for (let i = 0; i <= m; i++) dp[i][0] = i * MISSING_COST;
  for (let j = 0; j <= n; j++) dp[0][j] = j * EXTRA_COST;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const isEq = areTokensEqual(
        expectedTokens[i - 1],
        actualTokens[j - 1],
        options
      );

      const matchOrSubCost = isEq ? MATCH_COST : WRONG_COST;

      dp[i][j] = Math.min(
        dp[i - 1][j - 1] + matchOrSubCost, // Match or substitution
        dp[i - 1][j] + MISSING_COST, // Missing from actual
        dp[i][j - 1] + EXTRA_COST // Extra in actual
      );
    }
  }

  // Backtracking to find aligned tokens
  let i = m;
  let j = n;
  const resultTokens: DiffToken[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0) {
      const isEq = areTokensEqual(
        expectedTokens[i - 1],
        actualTokens[j - 1],
        options
      );
      const matchOrSubCost = isEq ? MATCH_COST : WRONG_COST;

      // Check if came from diagonal
      if (
        Math.abs(dp[i][j] - (dp[i - 1][j - 1] + matchOrSubCost)) < 0.001
      ) {
        if (isEq) {
          resultTokens.unshift({
            type: "correct",
            expected: expectedTokens[i - 1].raw,
            actual: actualTokens[j - 1].raw,
            cleanExpected: expectedTokens[i - 1].clean,
            cleanActual: actualTokens[j - 1].clean,
          });
        } else {
          resultTokens.unshift({
            type: "wrong",
            expected: expectedTokens[i - 1].raw,
            actual: actualTokens[j - 1].raw,
            cleanExpected: expectedTokens[i - 1].clean,
            cleanActual: actualTokens[j - 1].clean,
          });
        }
        i--;
        j--;
        continue;
      }
    }

    if (i > 0 && Math.abs(dp[i][j] - (dp[i - 1][j] + MISSING_COST)) < 0.001) {
      resultTokens.unshift({
        type: "missing",
        expected: expectedTokens[i - 1].raw,
        cleanExpected: expectedTokens[i - 1].clean,
      });
      i--;
    } else if (
      j > 0 &&
      Math.abs(dp[i][j] - (dp[i][j - 1] + EXTRA_COST)) < 0.001
    ) {
      resultTokens.unshift({
        type: "extra",
        actual: actualTokens[j - 1].raw,
        cleanActual: actualTokens[j - 1].clean,
      });
      j--;
    } else {
      // Fallback
      if (i > 0 && j > 0) {
        resultTokens.unshift({
          type: "wrong",
          expected: expectedTokens[i - 1].raw,
          actual: actualTokens[j - 1].raw,
        });
        i--;
        j--;
      } else if (i > 0) {
        resultTokens.unshift({
          type: "missing",
          expected: expectedTokens[i - 1].raw,
        });
        i--;
      } else {
        resultTokens.unshift({
          type: "extra",
          actual: actualTokens[j - 1].raw,
        });
        j--;
      }
    }
  }

  let correctWords = 0;
  let wrongWords = 0;
  let missingWords = 0;
  let extraWords = 0;

  for (const t of resultTokens) {
    if (t.type === "correct") correctWords++;
    else if (t.type === "wrong") wrongWords++;
    else if (t.type === "missing") missingWords++;
    else if (t.type === "extra") extraWords++;
  }

  const totalExpectedWords = m;

  // Sensible accuracy score:
  // Accuracy percentage based on correct words penalized slightly for extra unrequested words
  let accuracy = 0;
  if (totalExpectedWords > 0) {
    const rawScore = (correctWords - extraWords * 0.5) / totalExpectedWords;
    accuracy = Math.round(Math.max(0, Math.min(1, rawScore)) * 100);
  } else if (extraWords === 0) {
    accuracy = 100;
  }

  return {
    tokens: resultTokens,
    correctWords,
    wrongWords,
    missingWords,
    extraWords,
    totalExpectedWords,
    accuracy,
  };
}

/**
 * Generates a hint that masks words except for their first letter
 * Example: "Yesterday, I went to the university." -> "Y________, I w___ t_ t__ u_________."
 */
export function generateHint(sentence: string): string {
  if (!sentence) return "";

  return sentence.replace(/\b([a-zA-Z])([a-zA-Z0-9'-]*)\b/g, (_match, first, rest) => {
    return first + "_".repeat(rest.length);
  });
}
