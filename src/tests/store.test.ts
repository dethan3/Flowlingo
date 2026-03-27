import { describe, it, expect, beforeEach } from "vitest";
import { useStore } from "@/state/use-flowlingo-store";
import type { Expression, Scenario, UserSettings } from "@/types/domain";

const mockSettings: UserSettings = {
  difficulty: 2,
  domains: ["daily-life", "travel"],
  dailyMinutes: 10,
  learningMode: "custom",
};

const mockExpression = (id: string, overrides?: Partial<Expression>): Expression => ({
  id,
  text: `expr-${id}`,
  meaning: `meaning-${id}`,
  example: `example-${id}`,
  familiarity: "new",
  savedAt: null,
  sourceScenarioId: "scenario-1",
  sourceSentenceText: "Test sentence",
  ...overrides,
});

const mockScenario: Scenario = {
  id: "scenario-1",
  title: "A Test Scenario",
  description: "Test description",
  domain: "daily-life",
  difficulty: 2,
  sentences: [
    {
      id: "s1",
      text: "Hello there!",
      translation: "你好！",
      expressions: [mockExpression("e1")],
    },
  ],
  practicePrompt: {
    type: "comprehension",
    question: "What was said?",
    options: ["Hello", "Goodbye"],
    referenceAnswer: "Hello",
  },
  generatedAt: new Date().toISOString(),
};

function resetStore() {
  useStore.getState().resetAll();
}

describe("FlowlingoStore", () => {
  beforeEach(() => {
    resetStore();
  });

  describe("settings", () => {
    it("starts with null settings", () => {
      expect(useStore.getState().settings).toBeNull();
    });

    it("saves settings", () => {
      useStore.getState().saveSettings(mockSettings);
      expect(useStore.getState().settings).toEqual(mockSettings);
    });

    it("updates settings partially", () => {
      useStore.getState().saveSettings(mockSettings);
      useStore.getState().updateSettings({ difficulty: 3 });
      expect(useStore.getState().settings?.difficulty).toBe(3);
      expect(useStore.getState().settings?.domains).toEqual(["daily-life", "travel"]);
    });

    it("updateSettings does nothing when settings is null", () => {
      useStore.getState().updateSettings({ difficulty: 3 });
      expect(useStore.getState().settings).toBeNull();
    });
  });

  describe("scenario", () => {
    it("sets current scenario and tracks title", () => {
      useStore.getState().setCurrentScenario(mockScenario);
      expect(useStore.getState().currentScenario?.id).toBe("scenario-1");
      expect(useStore.getState().recentScenarioTitles).toContain("A Test Scenario");
    });

    it("deduplicates recent scenario titles", () => {
      useStore.getState().setCurrentScenario(mockScenario);
      useStore.getState().setCurrentScenario(mockScenario);
      const titles = useStore.getState().recentScenarioTitles;
      expect(titles.filter((t) => t === "A Test Scenario")).toHaveLength(1);
    });

    it("limits recent titles to 20", () => {
      for (let i = 0; i < 25; i++) {
        useStore.getState().setCurrentScenario({
          ...mockScenario,
          id: `scenario-${i}`,
          title: `Scenario ${i}`,
        });
      }
      expect(useStore.getState().recentScenarioTitles).toHaveLength(20);
      expect(useStore.getState().recentScenarioTitles[0]).toBe("Scenario 24");
    });
  });

  describe("expressions", () => {
    it("saves an expression with familiarity 'new' and timestamp", () => {
      const expr = mockExpression("e1");
      useStore.getState().saveExpression(expr);
      const saved = useStore.getState().savedExpressions;
      expect(saved).toHaveLength(1);
      expect(saved[0].familiarity).toBe("new");
      expect(saved[0].savedAt).toBeTruthy();
    });

    it("deduplicates expressions by id", () => {
      const expr = mockExpression("e1");
      useStore.getState().saveExpression(expr);
      useStore.getState().saveExpression(expr);
      expect(useStore.getState().savedExpressions).toHaveLength(1);
    });

    it("updates expression familiarity", () => {
      useStore.getState().saveExpression(mockExpression("e1"));
      useStore.getState().updateExpressionFamiliarity("e1", "mastered");
      expect(useStore.getState().savedExpressions[0].familiarity).toBe("mastered");
    });

    it("does not affect other expressions when updating familiarity", () => {
      useStore.getState().saveExpression(mockExpression("e1"));
      useStore.getState().saveExpression(mockExpression("e2"));
      useStore.getState().updateExpressionFamiliarity("e1", "mastered");
      expect(useStore.getState().savedExpressions[1].familiarity).toBe("new");
    });
  });

  describe("daily record lifecycle", () => {
    it("completePractice creates a daily record", () => {
      useStore.getState().setCurrentScenario(mockScenario);
      useStore.getState().completePractice();
      const records = useStore.getState().dailyRecords;
      expect(records).toHaveLength(1);
      expect(records[0].practiceCompleted).toBe(true);
      expect(records[0].replayCompleted).toBe(false);
    });

    it("completeReplay marks replay as done for today", () => {
      useStore.getState().setCurrentScenario(mockScenario);
      useStore.getState().completePractice();
      useStore.getState().completeReplay();
      const records = useStore.getState().dailyRecords;
      expect(records[0].replayCompleted).toBe(true);
    });

    it("completeDay marks both practice and replay as done", () => {
      useStore.getState().setCurrentScenario(mockScenario);
      useStore.getState().completeDay();
      const records = useStore.getState().dailyRecords;
      expect(records).toHaveLength(1);
      expect(records[0].practiceCompleted).toBe(true);
      expect(records[0].replayCompleted).toBe(true);
    });

    it("completePractice updates existing record instead of creating duplicate", () => {
      useStore.getState().setCurrentScenario(mockScenario);
      useStore.getState().completePractice();
      useStore.getState().completePractice();
      expect(useStore.getState().dailyRecords).toHaveLength(1);
    });
  });

  describe("vocabTestResult", () => {
    it("starts as null", () => {
      expect(useStore.getState().vocabTestResult).toBeNull();
    });

    it("saves a vocab test result", () => {
      const result = { level: 3 as const, wordsTestedCount: 18, completedAt: "2025-01-01T00:00:00Z" };
      useStore.getState().saveVocabTestResult(result);
      expect(useStore.getState().vocabTestResult).toEqual(result);
    });
  });

  describe("learningProgress", () => {
    it("starts as null", () => {
      expect(useStore.getState().learningProgress).toBeNull();
    });

    it("starts a learning path", () => {
      useStore.getState().startLearningPath("path-beginner");
      const progress = useStore.getState().learningProgress;
      expect(progress).not.toBeNull();
      expect(progress!.pathId).toBe("path-beginner");
      expect(progress!.currentStepIndex).toBe(0);
      expect(progress!.completedStepIds).toHaveLength(0);
      expect(progress!.startedAt).toBeTruthy();
    });

    it("advances the learning path", () => {
      useStore.getState().startLearningPath("path-beginner");
      useStore.getState().advanceLearningPath("b-1");
      const progress = useStore.getState().learningProgress!;
      expect(progress.completedStepIds).toContain("b-1");
      expect(progress.currentStepIndex).toBe(1);
    });

    it("does not duplicate completed step ids", () => {
      useStore.getState().startLearningPath("path-beginner");
      useStore.getState().advanceLearningPath("b-1");
      useStore.getState().advanceLearningPath("b-1");
      expect(useStore.getState().learningProgress!.completedStepIds).toHaveLength(1);
    });

    it("does nothing when no path is started", () => {
      useStore.getState().advanceLearningPath("b-1");
      expect(useStore.getState().learningProgress).toBeNull();
    });
  });

  describe("resetAll", () => {
    it("resets everything to initial state", () => {
      useStore.getState().saveSettings(mockSettings);
      useStore.getState().setCurrentScenario(mockScenario);
      useStore.getState().saveExpression(mockExpression("e1"));
      useStore.getState().saveVocabTestResult({ level: 2, wordsTestedCount: 15, completedAt: "2025-01-01" });
      useStore.getState().startLearningPath("path-beginner");
      useStore.getState().resetAll();

      const state = useStore.getState();
      expect(state.settings).toBeNull();
      expect(state.currentScenario).toBeNull();
      expect(state.savedExpressions).toHaveLength(0);
      expect(state.dailyRecords).toHaveLength(0);
      expect(state.recentScenarioTitles).toHaveLength(0);
      expect(state.vocabTestResult).toBeNull();
      expect(state.learningProgress).toBeNull();
    });
  });
});
