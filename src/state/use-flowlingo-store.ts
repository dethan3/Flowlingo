"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { getLessonById } from "@/data/lessons";
import { buildDailyPlan, getReplayPhrases } from "@/services/demo-plan";
import { DailyPlan, Phrase, PracticeAttempt, UserProfile } from "@/types/domain";

interface FlowlingoState {
  profile: UserProfile | null;
  dailyPlan: DailyPlan | null;
  savedPhrases: Phrase[];
  practiceAttempts: PracticeAttempt[];
  completedLessons: string[];
  createProfile: (profile: UserProfile) => void;
  savePhrase: (phrase: Phrase) => void;
  completePractice: (lessonId: string, sentenceId: string, type: PracticeAttempt["type"]) => void;
  completeLesson: (lessonId: string) => void;
  resetDemo: () => void;
}

const initialState = {
  profile: null,
  dailyPlan: null,
  savedPhrases: [],
  practiceAttempts: [],
  completedLessons: []
};

export const useFlowlingoStore = create<FlowlingoState>()(
  persist(
    (set) => ({
      ...initialState,
      createProfile: (profile) =>
        set({
          profile,
          dailyPlan: buildDailyPlan(profile)
        }),
      savePhrase: (phrase) =>
        set((state) => ({
          savedPhrases:
            state.savedPhrases.find((item) => item.id === phrase.id) !== undefined
              ? state.savedPhrases
              : [...state.savedPhrases, phrase]
        })),
      completePractice: (lessonId, sentenceId, type) =>
        set((state) => ({
          practiceAttempts: [
            ...state.practiceAttempts,
            {
              id: `${lessonId}-${sentenceId}-${state.practiceAttempts.length + 1}`,
              lessonId,
              sentenceId,
              type,
              completedAt: new Date().toISOString()
            }
          ]
        })),
      completeLesson: (lessonId) =>
        set((state) => {
          const nextPlan = state.dailyPlan ? { ...state.dailyPlan, completed: true } : null;

          return {
            dailyPlan: nextPlan,
            completedLessons:
              state.completedLessons.includes(lessonId) ? state.completedLessons : [...state.completedLessons, lessonId]
          };
        }),
      resetDemo: () => set(initialState)
    }),
    {
      name: "flowlingo-demo",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        profile: state.profile,
        dailyPlan: state.dailyPlan,
        savedPhrases: state.savedPhrases,
        practiceAttempts: state.practiceAttempts,
        completedLessons: state.completedLessons
      })
    }
  )
);

export function useCurrentLesson() {
  const dailyPlan = useFlowlingoStore((state) => state.dailyPlan);

  if (!dailyPlan) {
    return null;
  }

  return getLessonById(dailyPlan.lessonId);
}

export function useReplayQueue() {
  const dailyPlan = useFlowlingoStore((state) => state.dailyPlan);
  const savedPhrases = useFlowlingoStore((state) => state.savedPhrases);

  if (!dailyPlan) {
    return [];
  }

  return getReplayPhrases(dailyPlan.lessonId, savedPhrases);
}
