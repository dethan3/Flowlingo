"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import {
  mockGenerateScenario,
  mockRecommendScenario,
} from "@/services/mock-ai";
import {
  useReplayExpressions,
  useStore,
  useStreak,
  useTodayRecord,
} from "@/state/use-flowlingo-store";

const DIFFICULTY_LABELS: Record<number, string> = {
  1: "Beginner",
  2: "Elementary",
  3: "Intermediate",
  4: "Advanced",
};

export default function TodayPage() {
  const router = useRouter();
  const settings = useStore((s) => s.settings);
  const currentScenario = useStore((s) => s.currentScenario);
  const setCurrentScenario = useStore((s) => s.setCurrentScenario);
  const recentTitles = useStore((s) => s.recentScenarioTitles);
  const streak = useStreak();
  const todayRecord = useTodayRecord();
  const replayExprs = useReplayExpressions();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!settings) router.replace("/setup");
  }, [settings, router]);

  const generateScenario = useCallback(() => {
    if (!settings) return;
    setLoading(true);
    const rec = mockRecommendScenario({
      domains: settings.domains,
      recentScenarios: recentTitles,
      difficulty: settings.difficulty,
    });
    const sentenceCount =
      settings.dailyMinutes === 5 ? 4 : settings.dailyMinutes === 15 ? 8 : 6;
    const scenario = mockGenerateScenario({
      difficulty: settings.difficulty,
      domain: rec.domain,
      sentenceCount,
    });
    setCurrentScenario(scenario);
    setLoading(false);
  }, [settings, recentTitles, setCurrentScenario]);

  if (!settings) return null;

  const isDone = todayRecord?.practiceCompleted && todayRecord?.replayCompleted;

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div>
        <p className="text-accent text-xs font-semibold tracking-widest uppercase mb-1">
          Today
        </p>
        <h1 className="text-2xl font-bold tracking-tight">
          {isDone
            ? "All done for today!"
            : "Ready for your daily English?"}
        </h1>
        {streak > 0 && (
          <p className="text-muted text-sm mt-1">
            {streak} day streak — keep it going!
          </p>
        )}
      </div>

      {/* Scenario card */}
      <div className="rounded-2xl border border-border bg-surface p-5 flex flex-col gap-4">
        {currentScenario && !isDone ? (
          <>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold text-base">
                  {currentScenario.title}
                </h2>
                <p className="text-muted text-sm mt-0.5">
                  {currentScenario.description}
                </p>
              </div>
              <span className="shrink-0 text-xs px-2.5 py-1 rounded-full bg-accent-light text-accent-dark font-medium">
                {DIFFICULTY_LABELS[currentScenario.difficulty]}
              </span>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/scenario/${currentScenario.id}`}
                className="flex-1 py-3 rounded-xl bg-accent text-white text-sm font-medium text-center hover:bg-accent-dark transition-colors"
              >
                Start
              </Link>
              <button
                onClick={generateScenario}
                disabled={loading}
                className="py-3 px-4 rounded-xl border border-border text-sm font-medium hover:bg-surface-dim transition-colors disabled:opacity-50"
              >
                Shuffle
              </button>
            </div>
          </>
        ) : isDone ? (
          <div className="text-center py-4">
            <p className="text-2xl mb-2">🎉</p>
            <p className="font-semibold">Great work today!</p>
            <p className="text-muted text-sm mt-1">
              Come back tomorrow for a new scenario.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-2">
            <p className="text-muted text-sm">
              Generate today&apos;s scenario to get started.
            </p>
            <button
              onClick={generateScenario}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent-dark transition-colors disabled:opacity-50"
            >
              {loading ? "Generating..." : "Generate Scenario"}
            </button>
          </div>
        )}
      </div>

      {/* Replay prompt */}
      {replayExprs.length > 0 && !isDone && (
        <div className="rounded-2xl border border-border bg-surface p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted">
              Expressions to review
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-warning/10 text-warning font-medium">
              {replayExprs.length}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {replayExprs.map((e) => (
              <div
                key={e.id}
                className="text-sm py-2 px-3 rounded-xl bg-surface-dim"
              >
                <span className="font-medium">{e.text}</span>
                <span className="text-muted ml-2">{e.meaning}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-border bg-surface p-3 text-center">
          <p className="text-lg font-bold text-accent">{streak}</p>
          <p className="text-xs text-muted">Streak</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-3 text-center">
          <p className="text-lg font-bold">
            {useStore.getState().savedExpressions.length}
          </p>
          <p className="text-xs text-muted">Saved</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-3 text-center">
          <p className="text-lg font-bold">
            {DIFFICULTY_LABELS[settings.difficulty]}
          </p>
          <p className="text-xs text-muted">Level</p>
        </div>
      </div>
    </div>
  );
}
