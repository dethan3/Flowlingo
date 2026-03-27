"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type {
  DailyRecord,
  Expression,
  LearningProgress,
  Scenario,
  UserSettings,
  VocabTestResult,
} from "@/types/domain";

interface FlowlingoState {
  settings: UserSettings | null;
  currentScenario: Scenario | null;
  savedExpressions: Expression[];
  dailyRecords: DailyRecord[];
  recentScenarioTitles: string[];
  vocabTestResult: VocabTestResult | null;
  learningProgress: LearningProgress | null;

  saveSettings: (s: UserSettings) => void;
  updateSettings: (patch: Partial<UserSettings>) => void;
  setCurrentScenario: (scenario: Scenario) => void;
  clearCurrentScenario: () => void;
  saveExpression: (expr: Expression) => void;
  updateExpressionFamiliarity: (
    id: string,
    familiarity: Expression["familiarity"]
  ) => void;
  completePractice: () => void;
  completeReplay: () => void;
  completeDay: () => void;
  saveVocabTestResult: (result: VocabTestResult) => void;
  startLearningPath: (pathId: string) => void;
  advanceLearningPath: (stepId: string) => void;
  resetAll: () => void;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function currentStreak(records: DailyRecord[]): number {
  if (records.length === 0) return 0;
  const sorted = [...records].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  let streak = 0;
  const now = new Date();
  for (let i = 0; i < sorted.length; i++) {
    const expected = new Date(now);
    expected.setDate(expected.getDate() - i);
    const expectedStr = expected.toISOString().slice(0, 10);
    if (sorted[i].date === expectedStr) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

const initialState: Pick<
  FlowlingoState,
  | "settings"
  | "currentScenario"
  | "savedExpressions"
  | "dailyRecords"
  | "recentScenarioTitles"
  | "vocabTestResult"
  | "learningProgress"
> = {
  settings: null,
  currentScenario: null,
  savedExpressions: [],
  dailyRecords: [],
  recentScenarioTitles: [],
  vocabTestResult: null,
  learningProgress: null,
};

export const useStore = create<FlowlingoState>()(
  persist(
    (set, get) => ({
      ...initialState,

      saveSettings: (s) => set({ settings: s }),

      updateSettings: (patch) =>
        set((state) => ({
          settings: state.settings ? { ...state.settings, ...patch } : null,
        })),

      setCurrentScenario: (scenario) =>
        set((state) => ({
          currentScenario: scenario,
          recentScenarioTitles: [
            scenario.title,
            ...state.recentScenarioTitles.filter(
              (t) => t !== scenario.title
            ),
          ].slice(0, 20),
        })),

      clearCurrentScenario: () => set({ currentScenario: null }),

      saveExpression: (expr) =>
        set((state) => {
          if (state.savedExpressions.some((e) => e.id === expr.id))
            return state;
          const saved: Expression = {
            ...expr,
            familiarity: "new",
            savedAt: new Date().toISOString(),
          };
          return { savedExpressions: [...state.savedExpressions, saved] };
        }),

      updateExpressionFamiliarity: (id, familiarity) =>
        set((state) => ({
          savedExpressions: state.savedExpressions.map((e) =>
            e.id === id ? { ...e, familiarity } : e
          ),
        })),

      completePractice: () =>
        set((state) => {
          const today = todayStr();
          const existing = state.dailyRecords.find((r) => r.date === today);
          if (existing) {
            return {
              dailyRecords: state.dailyRecords.map((r) =>
                r.date === today ? { ...r, practiceCompleted: true } : r
              ),
            };
          }
          const scenario = state.currentScenario;
          return {
            dailyRecords: [
              ...state.dailyRecords,
              {
                date: today,
                scenarioId: scenario?.id ?? "",
                practiceCompleted: true,
                replayCompleted: false,
                expressionsSaved: 0,
                streak: currentStreak(state.dailyRecords) + 1,
              },
            ],
          };
        }),

      completeReplay: () =>
        set((state) => {
          const today = todayStr();
          return {
            dailyRecords: state.dailyRecords.map((r) =>
              r.date === today ? { ...r, replayCompleted: true } : r
            ),
          };
        }),

      completeDay: () =>
        set((state) => {
          const today = todayStr();
          const existing = state.dailyRecords.find((r) => r.date === today);
          const newExprs = state.savedExpressions.filter(
            (e) =>
              e.savedAt && e.savedAt.startsWith(today)
          ).length;
          const records = existing
            ? state.dailyRecords.map((r) =>
                r.date === today
                  ? {
                      ...r,
                      practiceCompleted: true,
                      replayCompleted: true,
                      expressionsSaved: newExprs,
                    }
                  : r
              )
            : [
                ...state.dailyRecords,
                {
                  date: today,
                  scenarioId: state.currentScenario?.id ?? "",
                  practiceCompleted: true,
                  replayCompleted: true,
                  expressionsSaved: newExprs,
                  streak: currentStreak(state.dailyRecords) + 1,
                },
              ];
          return { dailyRecords: records };
        }),

      saveVocabTestResult: (result) => set({ vocabTestResult: result }),

      startLearningPath: (pathId) =>
        set({
          learningProgress: {
            pathId,
            currentStepIndex: 0,
            completedStepIds: [],
            startedAt: new Date().toISOString(),
          },
        }),

      advanceLearningPath: (stepId) =>
        set((state) => {
          if (!state.learningProgress) return state;
          const completed = state.learningProgress.completedStepIds.includes(stepId)
            ? state.learningProgress.completedStepIds
            : [...state.learningProgress.completedStepIds, stepId];
          return {
            learningProgress: {
              ...state.learningProgress,
              completedStepIds: completed,
              currentStepIndex: completed.length,
            },
          };
        }),

      resetAll: () => set(initialState),
    }),
    {
      name: "flowlingo-v2",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        settings: state.settings,
        currentScenario: state.currentScenario,
        savedExpressions: state.savedExpressions,
        dailyRecords: state.dailyRecords,
        recentScenarioTitles: state.recentScenarioTitles,
        vocabTestResult: state.vocabTestResult,
        learningProgress: state.learningProgress,
      }),
      migrate: (persisted: unknown, version: number) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const state = persisted as Record<string, any>;
        if (version === 0) {
          // v0 → v1: add learningMode to existing settings, add new top-level fields
          if (state.settings && !state.settings.learningMode) {
            state.settings.learningMode = "custom";
          }
          if (state.vocabTestResult === undefined) {
            state.vocabTestResult = null;
          }
          if (state.learningProgress === undefined) {
            state.learningProgress = null;
          }
        }
        return state as FlowlingoState;
      },
    }
  )
);

export function useStreak() {
  const records = useStore((s) => s.dailyRecords);
  return currentStreak(records);
}

export function useTodayRecord() {
  const records = useStore((s) => s.dailyRecords);
  return records.find((r) => r.date === todayStr()) ?? null;
}

export function useReplayExpressions() {
  const saved = useStore((s) => s.savedExpressions);
  return saved
    .filter((e) => e.familiarity !== "mastered")
    .slice(0, 3);
}
