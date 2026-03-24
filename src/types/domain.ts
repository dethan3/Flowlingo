// --- Enums / Unions ---

export type Difficulty = 1 | 2 | 3 | 4;

export type Domain =
  | "daily-life"
  | "travel"
  | "work"
  | "social"
  | "culture";

export type DailyMinutes = 5 | 10 | 15;

export type Familiarity = "new" | "learning" | "mastered";

export type PracticeType = "comprehension" | "fill-in" | "retell";

// --- User Settings ---

export interface UserSettings {
  difficulty: Difficulty;
  domains: Domain[];
  dailyMinutes: DailyMinutes;
}

// --- Scenario (AI-generated) ---

export interface Expression {
  id: string;
  text: string;
  meaning: string;
  example: string;
  familiarity: Familiarity;
  savedAt: string | null;
  sourceScenarioId: string;
  sourceSentenceText: string;
}

export interface Sentence {
  id: string;
  text: string;
  translation: string;
  expressions: Expression[];
}

export interface PracticePrompt {
  type: PracticeType;
  question: string;
  options: string[] | null;
  referenceAnswer: string;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  domain: Domain;
  difficulty: Difficulty;
  sentences: Sentence[];
  practicePrompt: PracticePrompt;
  generatedAt: string;
}

// --- Daily Record ---

export interface DailyRecord {
  date: string;
  scenarioId: string;
  practiceCompleted: boolean;
  replayCompleted: boolean;
  expressionsSaved: number;
  streak: number;
}
