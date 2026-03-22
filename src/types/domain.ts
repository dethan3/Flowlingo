export type Goal =
  | "build-confidence"
  | "daily-input"
  | "travel"
  | "work-communication";

export type Level = "beginner" | "lower-intermediate" | "intermediate";

export type Topic =
  | "daily-life"
  | "travel"
  | "work"
  | "friendship"
  | "culture";

export type PracticeType = "retell" | "comprehension";

export interface Phrase {
  id: string;
  text: string;
  meaning: string;
  example: string;
  familiarity: 1 | 2 | 3;
}

export interface Sentence {
  id: string;
  text: string;
  translation: string;
  audioKey: string;
  phrases: Phrase[];
}

export interface Lesson {
  id: string;
  title: string;
  topic: Topic;
  difficulty: Level;
  estimatedMinutes: number;
  summary: string;
  sentences: Sentence[];
}

export interface UserProfile {
  id: string;
  goal: Goal;
  topics: Topic[];
  level: Level;
  dailyMinutes: number;
}

export interface DailyPlan {
  date: string;
  lessonId: string;
  reviewPhraseIds: string[];
  practiceType: PracticeType;
  completed: boolean;
}

export interface PracticeAttempt {
  id: string;
  lessonId: string;
  type: PracticeType;
  sentenceId: string;
  completedAt: string;
}
