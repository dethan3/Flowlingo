"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  useReplayExpressions,
  useStore,
} from "@/state/use-flowlingo-store";

export default function ReplayPage() {
  const router = useRouter();
  const expressions = useReplayExpressions();
  const updateFamiliarity = useStore((s) => s.updateExpressionFamiliarity);
  const completeReplay = useStore((s) => s.completeReplay);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const current = expressions[currentIdx];
  const isLast = currentIdx === expressions.length - 1;
  const isEmpty = expressions.length === 0;

  function handleMark(familiar: boolean) {
    if (current) {
      updateFamiliarity(
        current.id,
        familiar ? "mastered" : "learning"
      );
    }
    if (isLast) {
      completeReplay();
      router.push("/complete");
    } else {
      setCurrentIdx((i) => i + 1);
      setFlipped(false);
    }
  }

  function handleSkipAll() {
    completeReplay();
    router.push("/complete");
  }

  if (isEmpty) {
    return (
      <div className="flex flex-col gap-5 min-h-[80vh]">
        <div>
          <p className="text-accent text-xs font-semibold tracking-widest uppercase mb-1">
            Review
          </p>
          <h1 className="text-xl font-bold tracking-tight">
            No expressions to review
          </h1>
          <p className="text-muted text-sm mt-1">
            Save some expressions during your next scenario.
          </p>
        </div>
        <button
          onClick={handleSkipAll}
          className="w-full py-3.5 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent-dark transition-colors"
        >
          Finish Today
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 min-h-[80vh]">
      {/* Header */}
      <div>
        <p className="text-accent text-xs font-semibold tracking-widest uppercase mb-1">
          Review
        </p>
        <h1 className="text-xl font-bold tracking-tight">
          Do you remember these?
        </h1>
        <p className="text-muted text-sm mt-1">
          {currentIdx + 1} of {expressions.length}
        </p>
      </div>

      {/* Progress */}
      <div className="h-1.5 rounded-full bg-border overflow-hidden">
        <div
          className="h-full rounded-full bg-accent transition-all duration-300"
          style={{
            width: `${((currentIdx + 1) / expressions.length) * 100}%`,
          }}
        />
      </div>

      {/* Card */}
      {current && (
        <button
          onClick={() => setFlipped(!flipped)}
          className="w-full text-left rounded-2xl border border-border bg-surface p-6 flex flex-col gap-4 min-h-[220px] transition-all hover:border-accent/30"
        >
          {!flipped ? (
            <>
              <p className="text-xl font-semibold leading-relaxed">
                {current.text}
              </p>
              <p className="text-sm text-muted mt-auto">
                Tap to reveal meaning
              </p>
            </>
          ) : (
            <>
              <p className="text-lg font-semibold text-accent">
                {current.text}
              </p>
              <p className="text-base text-muted">{current.meaning}</p>
              <div className="mt-2 p-3 rounded-xl bg-surface-dim">
                <p className="text-sm italic text-muted">
                  {current.example}
                </p>
              </div>
              <p className="text-xs text-muted mt-auto">
                From: {current.sourceSentenceText}
              </p>
            </>
          )}
        </button>
      )}

      {/* Actions */}
      {flipped && (
        <div className="flex gap-3 pt-2 pb-4">
          <button
            onClick={() => handleMark(false)}
            className="flex-1 py-3.5 rounded-xl border border-border text-sm font-medium hover:bg-surface-dim transition-colors"
          >
            Still learning
          </button>
          <button
            onClick={() => handleMark(true)}
            className="flex-1 py-3.5 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent-dark transition-colors"
          >
            Got it!
          </button>
        </div>
      )}

      {!flipped && (
        <button
          onClick={handleSkipAll}
          className="py-3 text-sm font-medium text-muted hover:text-ink transition-colors"
        >
          Skip review
        </button>
      )}
    </div>
  );
}
