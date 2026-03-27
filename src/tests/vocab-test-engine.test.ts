import { describe, it, expect, beforeEach } from "vitest";
import {
  createTestState,
  getNextWord,
  recordKnowAnswer,
  recordMeaningAnswer,
  shouldFinish,
  finishTest,
  calculateResult,
  type TestState,
} from "@/lib/vocab-test-engine";

describe("VocabTestEngine", () => {
  let state: TestState;

  beforeEach(() => {
    state = createTestState();
  });

  describe("createTestState", () => {
    it("starts with default values", () => {
      expect(state.currentLevel).toBe(2);
      expect(state.stepCount).toBe(0);
      expect(state.finished).toBe(false);
      expect(state.seen.size).toBe(0);
      expect(state.answers.size).toBe(0);
    });
  });

  describe("getNextWord", () => {
    it("returns a word at the current level", () => {
      const word = getNextWord(state);
      expect(word).not.toBeNull();
      // Should prefer current level (2)
      expect(word!.level).toBe(2);
    });

    it("returns null when finished", () => {
      state.finished = true;
      expect(getNextWord(state)).toBeNull();
    });

    it("returns null when max steps reached", () => {
      state.stepCount = 24;
      expect(getNextWord(state)).toBeNull();
    });

    it("does not return already-seen words", () => {
      const word1 = getNextWord(state);
      expect(word1).not.toBeNull();
      state.seen.add(word1!.word);
      const word2 = getNextWord(state);
      expect(word2).not.toBeNull();
      expect(word2!.word).not.toBe(word1!.word);
    });
  });

  describe("recordKnowAnswer", () => {
    it("marks word as seen and increments step count", () => {
      const word = getNextWord(state)!;
      recordKnowAnswer(state, word, true);
      expect(state.seen.has(word.word)).toBe(true);
      expect(state.stepCount).toBe(1);
      expect(state.answers.has(word.word)).toBe(true);
    });

    it("adjusts level down when user doesn't know a word at current level", () => {
      const word = getNextWord(state)!;
      const initialLevel = state.currentLevel;
      recordKnowAnswer(state, word, false);
      expect(state.currentLevel).toBeLessThanOrEqual(initialLevel);
    });
  });

  describe("recordMeaningAnswer", () => {
    it("returns correct=true when meaning matches", () => {
      const word = getNextWord(state)!;
      recordKnowAnswer(state, word, true);
      const result = recordMeaningAnswer(state, word, word.correctMeaning);
      expect(result.correct).toBe(true);
    });

    it("returns correct=false when meaning doesn't match", () => {
      const word = getNextWord(state)!;
      recordKnowAnswer(state, word, true);
      const wrongMeaning = word.meaningOptions.find(
        (m) => m !== word.correctMeaning
      )!;
      const result = recordMeaningAnswer(state, word, wrongMeaning);
      expect(result.correct).toBe(false);
    });

    it("adjusts level down on incorrect meaning", () => {
      const word = getNextWord(state)!;
      recordKnowAnswer(state, word, true);
      const before = state.currentLevel;
      const wrongMeaning = word.meaningOptions.find(
        (m) => m !== word.correctMeaning
      )!;
      recordMeaningAnswer(state, word, wrongMeaning);
      expect(state.currentLevel).toBeLessThanOrEqual(before);
    });
  });

  describe("shouldFinish", () => {
    it("returns true at max steps", () => {
      state.stepCount = 24;
      expect(shouldFinish(state)).toBe(true);
    });

    it("returns false below min steps", () => {
      state.stepCount = 5;
      expect(shouldFinish(state)).toBe(false);
    });
  });

  describe("calculateResult", () => {
    it("returns level 1 with no answers", () => {
      expect(calculateResult(state)).toBe(1);
    });

    it("reflects known words at a given level", () => {
      // Simulate knowing several level 3 words
      for (let i = 0; i < 5; i++) {
        const word = getNextWord(state);
        if (!word) break;
        recordKnowAnswer(state, word, true);
        recordMeaningAnswer(state, word, word.correctMeaning);
        state.currentLevel = 3; // force to level 3
      }
      const result = calculateResult(state);
      expect(result).toBeGreaterThanOrEqual(2);
    });
  });

  describe("finishTest", () => {
    it("marks the state as finished", () => {
      finishTest(state);
      expect(state.finished).toBe(true);
    });

    it("returns a valid difficulty level", () => {
      const level = finishTest(state);
      expect(level).toBeGreaterThanOrEqual(1);
      expect(level).toBeLessThanOrEqual(4);
    });
  });

  describe("full test simulation", () => {
    it("completes a test run without errors", () => {
      let steps = 0;
      while (!state.finished && steps < 30) {
        const word = getNextWord(state);
        if (!word || shouldFinish(state)) {
          finishTest(state);
          break;
        }
        const { needsMeaningCheck } = recordKnowAnswer(state, word, true);
        if (needsMeaningCheck) {
          recordMeaningAnswer(state, word, word.correctMeaning);
        }
        if (shouldFinish(state)) {
          finishTest(state);
        }
        steps++;
      }
      expect(state.finished).toBe(true);
      const level = calculateResult(state);
      expect(level).toBeGreaterThanOrEqual(1);
      expect(level).toBeLessThanOrEqual(4);
    });
  });
});
