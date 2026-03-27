import type { Difficulty } from "@/types/domain";
import { WORD_BANK, type TestWord } from "@/data/word-bank";

// ── Types ────────────────────────────────────────────────────

export type TestPhase = "know-check" | "meaning-check";

export interface TestStep {
  word: TestWord;
  phase: TestPhase;
}

export interface TestState {
  /** Words already shown (ids = word strings) */
  seen: Set<string>;
  /** Answers: word -> { claimedKnown, meaningCorrect? } */
  answers: Map<string, { claimedKnown: boolean; meaningCorrect?: boolean }>;
  /** Current estimated level (1-4) */
  currentLevel: Difficulty;
  /** Total steps taken */
  stepCount: number;
  /** Is the test finished? */
  finished: boolean;
}

// ── Constants ────────────────────────────────────────────────

const MAX_STEPS = 24;
const MIN_STEPS = 12;
const MEANING_CHECK_RATE = 0.3;
const CONVERGENCE_THRESHOLD = 3; // consecutive same-level correct to converge

// ── Helpers ──────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function clampLevel(n: number): Difficulty {
  return Math.max(1, Math.min(4, Math.round(n))) as Difficulty;
}

// ── Engine ───────────────────────────────────────────────────

export function createTestState(): TestState {
  return {
    seen: new Set(),
    answers: new Map(),
    currentLevel: 2, // start at middle
    stepCount: 0,
    finished: false,
  };
}

/**
 * Pick the next word to show. Returns null if test should end.
 */
export function getNextWord(state: TestState): TestWord | null {
  if (state.finished || state.stepCount >= MAX_STEPS) return null;

  const level = state.currentLevel;
  const candidates = WORD_BANK.filter(
    (w) => w.level === level && !state.seen.has(w.word)
  );

  if (candidates.length > 0) {
    return shuffle(candidates)[0];
  }

  // If no candidates at current level, try adjacent levels
  for (const delta of [1, -1, 2, -2]) {
    const alt = level + delta;
    if (alt < 1 || alt > 4) continue;
    const altCandidates = WORD_BANK.filter(
      (w) => w.level === alt && !state.seen.has(w.word)
    );
    if (altCandidates.length > 0) {
      return shuffle(altCandidates)[0];
    }
  }

  return null; // exhausted all words
}

/**
 * Determine if we should follow up with a meaning check for this word.
 */
export function shouldCheckMeaning(state: TestState): boolean {
  // Roughly 30% of "I know" answers get a meaning check
  return Math.random() < MEANING_CHECK_RATE;
}

/**
 * Record that the user said "I know this" or "I don't know this".
 * Returns whether a meaning check should follow.
 */
export function recordKnowAnswer(
  state: TestState,
  word: TestWord,
  claimedKnown: boolean
): { needsMeaningCheck: boolean } {
  state.seen.add(word.word);
  state.answers.set(word.word, { claimedKnown });
  state.stepCount++;

  if (!claimedKnown) {
    // User doesn't know this word — adjust level down if word is at or below current level
    if (word.level <= state.currentLevel) {
      state.currentLevel = clampLevel(state.currentLevel - 0.5);
    }
    return { needsMeaningCheck: false };
  }

  // User claims to know — maybe check meaning
  const check = shouldCheckMeaning(state);
  return { needsMeaningCheck: check };
}

/**
 * Record the result of a meaning check.
 */
export function recordMeaningAnswer(
  state: TestState,
  word: TestWord,
  selectedMeaning: string
): { correct: boolean } {
  const correct = selectedMeaning === word.correctMeaning;
  const existing = state.answers.get(word.word);
  if (existing) {
    existing.meaningCorrect = correct;
  }

  if (correct && word.level >= state.currentLevel) {
    // Confirmed knowledge at this level — try harder
    state.currentLevel = clampLevel(state.currentLevel + 0.5);
  } else if (!correct) {
    // Failed meaning check — penalize (they claimed to know but didn't)
    state.currentLevel = clampLevel(state.currentLevel - 0.5);
  }

  return { correct };
}

/**
 * Check if the test should end early (convergence).
 */
export function shouldFinish(state: TestState): boolean {
  if (state.stepCount >= MAX_STEPS) return true;
  if (state.stepCount < MIN_STEPS) return false;

  // Check for convergence: last N answers at the same level all correct
  const recentWords = Array.from(state.answers.entries()).slice(-CONVERGENCE_THRESHOLD);
  if (recentWords.length < CONVERGENCE_THRESHOLD) return false;

  const allSameLevel = recentWords.every(([word]) => {
    const w = WORD_BANK.find((b) => b.word === word);
    return w && w.level === state.currentLevel;
  });

  const allKnown = recentWords.every(
    ([, ans]) => ans.claimedKnown && ans.meaningCorrect !== false
  );

  return allSameLevel && allKnown;
}

/**
 * Calculate the final difficulty level from test results.
 */
export function calculateResult(state: TestState): Difficulty {
  // Weighted score based on answers
  let totalWeight = 0;
  let weightedSum = 0;

  state.answers.forEach((answer, word) => {
    const w = WORD_BANK.find((b) => b.word === word);
    if (!w) return;

    if (answer.claimedKnown) {
      if (answer.meaningCorrect === false) {
        // Claimed to know but got meaning wrong — counts against
        totalWeight += 1;
        weightedSum += Math.max(1, w.level - 1);
      } else {
        // Claimed to know (and meaning confirmed or not checked)
        totalWeight += 1;
        weightedSum += w.level;
      }
    } else {
      // Didn't know
      totalWeight += 1;
      weightedSum += Math.max(1, w.level - 1);
    }
  });

  if (totalWeight === 0) return 1;

  const avg = weightedSum / totalWeight;
  return clampLevel(avg);
}

/**
 * Finish the test and return the final level.
 */
export function finishTest(state: TestState): Difficulty {
  state.finished = true;
  return calculateResult(state);
}
