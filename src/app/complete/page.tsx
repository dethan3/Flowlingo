"use client";

import Link from "next/link";
import { useEffect } from "react";

import { useStore, useStreak } from "@/state/use-flowlingo-store";

export default function CompletePage() {
  const scenario = useStore((s) => s.currentScenario);
  const savedExpressions = useStore((s) => s.savedExpressions);
  const completeDay = useStore((s) => s.completeDay);
  const streak = useStreak();

  useEffect(() => {
    completeDay();
  }, [completeDay]);

  const todayStr = new Date().toISOString().slice(0, 10);
  const todaySaved = savedExpressions.filter(
    (e) => e.savedAt && e.savedAt.startsWith(todayStr)
  ).length;
  const totalSaved = savedExpressions.length;
  const mastered = savedExpressions.filter(
    (e) => e.familiarity === "mastered"
  ).length;

  return (
    <div className="flex flex-col gap-6 min-h-[80vh]">
      {/* Celebration */}
      <div className="text-center pt-12 pb-4">
        <p className="text-5xl mb-4">🎉</p>
        <h1 className="text-2xl font-bold tracking-tight">
          Loop complete!
        </h1>
        <p className="text-muted text-sm mt-2 max-w-[280px] mx-auto">
          A little more English absorbed today. That&apos;s what adds up.
        </p>
      </div>

      {/* Today's summary */}
      <div className="rounded-2xl border border-border bg-surface p-5 flex flex-col gap-4">
        {scenario && (
          <div className="flex items-center gap-3 pb-3 border-b border-border">
            <span className="text-sm text-muted">Scenario</span>
            <span className="text-sm font-medium ml-auto">
              {scenario.title}
            </span>
          </div>
        )}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-2xl font-bold text-accent">{streak}</p>
            <p className="text-xs text-muted mt-0.5">Day streak</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{todaySaved}</p>
            <p className="text-xs text-muted mt-0.5">Saved today</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{totalSaved}</p>
            <p className="text-xs text-muted mt-0.5">Total saved</p>
          </div>
        </div>
      </div>

      {/* Expression progress */}
      {totalSaved > 0 && (
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-sm font-medium mb-3">Expression progress</p>
          <div className="h-2.5 rounded-full bg-border overflow-hidden flex">
            {mastered > 0 && (
              <div
                className="h-full bg-success"
                style={{
                  width: `${(mastered / totalSaved) * 100}%`,
                }}
              />
            )}
            <div
              className="h-full bg-accent"
              style={{
                width: `${((totalSaved - mastered) / totalSaved) * 100}%`,
              }}
            />
          </div>
          <div className="flex items-center gap-4 mt-2 text-xs text-muted">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-success" />
              Mastered ({mastered})
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-accent" />
              Learning ({totalSaved - mastered})
            </span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-auto pt-4 pb-4 flex flex-col gap-2">
        <Link
          href="/today"
          className="w-full py-3.5 rounded-xl bg-accent text-white text-sm font-medium text-center hover:bg-accent-dark transition-colors"
        >
          Back to Today
        </Link>
        <Link
          href="/library"
          className="w-full py-3 rounded-xl text-sm font-medium text-center text-muted hover:text-ink transition-colors"
        >
          View all expressions
        </Link>
      </div>
    </div>
  );
}
