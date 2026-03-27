"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button, PageHeader, ProgressBar } from "@/components/ui";
import { ROUTES } from "@/constants/routes";
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
      router.push(ROUTES.COMPLETE);
    } else {
      setCurrentIdx((i) => i + 1);
      setFlipped(false);
    }
  }

  function handleSkipAll() {
    completeReplay();
    router.push(ROUTES.COMPLETE);
  }

  if (isEmpty) {
    return (
      <div className="flex flex-col gap-5 min-h-[80vh]">
        <PageHeader
          label="Review"
          title="No expressions to review"
          subtitle="Save some expressions during your next scenario."
        />
        <Button onClick={handleSkipAll} fullWidth>
          Finish Today
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 min-h-[80vh]">
      {/* Header */}
      <PageHeader
        label="Review"
        title="Do you remember these?"
        subtitle={`${currentIdx + 1} of ${expressions.length}`}
      />

      {/* Progress */}
      <ProgressBar value={currentIdx + 1} max={expressions.length} />

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
          <Button variant="secondary" fullWidth onClick={() => handleMark(false)}>
            Still learning
          </Button>
          <Button fullWidth onClick={() => handleMark(true)}>
            Got it!
          </Button>
        </div>
      )}

      {!flipped && (
        <Button variant="ghost" onClick={handleSkipAll}>
          Skip review
        </Button>
      )}
    </div>
  );
}
