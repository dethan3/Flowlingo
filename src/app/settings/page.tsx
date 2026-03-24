"use client";

import { useRouter } from "next/navigation";

import { useStore, useStreak } from "@/state/use-flowlingo-store";
import type { DailyMinutes, Difficulty, Domain } from "@/types/domain";

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string }[] = [
  { value: 1, label: "Level 1 — Beginner" },
  { value: 2, label: "Level 2 — Elementary" },
  { value: 3, label: "Level 3 — Intermediate" },
  { value: 4, label: "Level 4 — Advanced" },
];

const DOMAIN_OPTIONS: { value: Domain; label: string }[] = [
  { value: "daily-life", label: "Daily Life" },
  { value: "travel", label: "Travel" },
  { value: "work", label: "Work" },
  { value: "social", label: "Social" },
  { value: "culture", label: "Culture" },
];

const TIME_OPTIONS: { value: DailyMinutes; label: string }[] = [
  { value: 5, label: "5 min" },
  { value: 10, label: "10 min" },
  { value: 15, label: "15 min" },
];

export default function SettingsPage() {
  const router = useRouter();
  const settings = useStore((s) => s.settings);
  const updateSettings = useStore((s) => s.updateSettings);
  const savedExpressions = useStore((s) => s.savedExpressions);
  const dailyRecords = useStore((s) => s.dailyRecords);
  const resetAll = useStore((s) => s.resetAll);
  const streak = useStreak();

  if (!settings) {
    router.replace("/setup");
    return null;
  }

  function toggleDomain(d: Domain) {
    if (!settings) return;
    const current = settings.domains;
    const next = current.includes(d)
      ? current.filter((x) => x !== d)
      : [...current, d];
    if (next.length > 0) {
      updateSettings({ domains: next });
    }
  }

  function handleReset() {
    if (window.confirm("Reset all data? This cannot be undone.")) {
      resetAll();
      router.replace("/setup");
    }
  }

  const mastered = savedExpressions.filter(
    (e) => e.familiarity === "mastered"
  ).length;
  const learning = savedExpressions.filter(
    (e) => e.familiarity === "learning"
  ).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <p className="text-accent text-xs font-semibold tracking-widest uppercase mb-1">
          Settings
        </p>
        <h1 className="text-2xl font-bold tracking-tight">Your profile</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-border bg-surface p-3 text-center">
          <p className="text-lg font-bold text-accent">{streak}</p>
          <p className="text-xs text-muted">Streak</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-3 text-center">
          <p className="text-lg font-bold">{dailyRecords.length}</p>
          <p className="text-xs text-muted">Days</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-3 text-center">
          <p className="text-lg font-bold">{savedExpressions.length}</p>
          <p className="text-xs text-muted">Expressions</p>
        </div>
      </div>

      {mastered + learning > 0 && (
        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-sm font-medium mb-2">Expression breakdown</p>
          <div className="flex items-center gap-4 text-xs text-muted">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-success" />
              Mastered: {mastered}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-accent" />
              Learning: {learning}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-border" />
              New: {savedExpressions.length - mastered - learning}
            </span>
          </div>
        </div>
      )}

      {/* Difficulty */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">Difficulty</p>
        <div className="flex flex-col gap-2">
          {DIFFICULTY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateSettings({ difficulty: opt.value })}
              className={`text-left text-sm p-3.5 rounded-xl border transition-all ${
                settings.difficulty === opt.value
                  ? "border-accent bg-accent-light"
                  : "border-border bg-surface hover:border-accent/30"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Domains */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">Interests</p>
        <div className="grid grid-cols-2 gap-2">
          {DOMAIN_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => toggleDomain(opt.value)}
              className={`text-sm p-3 rounded-xl border text-left font-medium transition-all ${
                settings.domains.includes(opt.value)
                  ? "border-accent bg-accent-light text-accent-dark"
                  : "border-border bg-surface hover:border-accent/30"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Daily time */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">Daily time</p>
        <div className="flex gap-2">
          {TIME_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateSettings({ dailyMinutes: opt.value })}
              className={`flex-1 text-sm p-3 rounded-xl border text-center font-medium transition-all ${
                settings.dailyMinutes === opt.value
                  ? "border-accent bg-accent-light text-accent-dark"
                  : "border-border bg-surface hover:border-accent/30"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reset */}
      <div className="pt-4 border-t border-border">
        <button
          onClick={handleReset}
          className="text-sm text-danger hover:underline"
        >
          Reset all data
        </button>
      </div>
    </div>
  );
}
