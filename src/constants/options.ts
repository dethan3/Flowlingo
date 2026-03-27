import type { DailyMinutes, Difficulty, Domain } from "@/types/domain";

export const DIFFICULTY_OPTIONS: {
  value: Difficulty;
  label: string;
  shortLabel: string;
  desc: string;
}[] = [
  { value: 1, label: "Level 1 — Beginner", shortLabel: "Beginner", desc: "Short, simple sentences" },
  { value: 2, label: "Level 2 — Elementary", shortLabel: "Elementary", desc: "Everyday conversations" },
  { value: 3, label: "Level 3 — Intermediate", shortLabel: "Intermediate", desc: "Workplace & social" },
  { value: 4, label: "Level 4 — Advanced", shortLabel: "Advanced", desc: "Nuanced, natural English" },
];

export const DOMAIN_OPTIONS: { value: Domain; label: string }[] = [
  { value: "daily-life", label: "Daily Life" },
  { value: "travel", label: "Travel" },
  { value: "work", label: "Work" },
  { value: "social", label: "Social" },
  { value: "culture", label: "Culture" },
];

export const TIME_OPTIONS: { value: DailyMinutes; label: string }[] = [
  { value: 5, label: "5 min" },
  { value: 10, label: "10 min" },
  { value: 15, label: "15 min" },
];

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  1: "Beginner",
  2: "Elementary",
  3: "Intermediate",
  4: "Advanced",
};

export const FAMILIARITY_STYLES: Record<string, string> = {
  new: "accent",
  learning: "warning",
  mastered: "success",
} as const;
