"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { RequireScenario } from "@/components/require-scenario";
import { Button, ProgressBar } from "@/components/ui";
import { ROUTES } from "@/constants/routes";
import { useStore } from "@/state/use-flowlingo-store";
import type { Expression } from "@/types/domain";

export default function ScenarioPage() {
  return (
    <RequireScenario>
      <ScenarioContent />
    </RequireScenario>
  );
}

function ScenarioContent() {
  const router = useRouter();
  const scenario = useStore((s) => s.currentScenario)!;
  const saveExpression = useStore((s) => s.saveExpression);
  const savedExpressions = useStore((s) => s.savedExpressions);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [expandedExpr, setExpandedExpr] = useState<string | null>(null);

  const sentences = scenario.sentences;
  const current = sentences[currentIdx];
  const isLast = currentIdx === sentences.length - 1;

  function isSaved(exprId: string) {
    return savedExpressions.some((e) => e.id === exprId);
  }

  function handleSave(expr: Expression) {
    saveExpression(expr);
  }

  function handleNext() {
    if (isLast) {
      router.push(ROUTES.PRACTICE(scenario.id));
    } else {
      setCurrentIdx((i) => i + 1);
      setShowTranslation(false);
      setExpandedExpr(null);
    }
  }

  return (
    <div className="flex flex-col gap-5 min-h-[80vh]">
      {/* Header */}
      <div>
        <button
          onClick={() => router.push(ROUTES.TODAY)}
          className="text-muted text-sm mb-2 hover:text-ink transition-colors"
        >
          ← Back
        </button>
        <h1 className="text-xl font-bold tracking-tight">
          {scenario.title}
        </h1>
        <p className="text-muted text-sm mt-0.5">{scenario.description}</p>
      </div>

      {/* Progress bar */}
      <ProgressBar value={currentIdx + 1} max={sentences.length} />

      {/* Previous sentences (dimmed) */}
      <div className="flex flex-col gap-2">
        {sentences.slice(0, currentIdx).map((s) => (
          <div
            key={s.id}
            className="py-2 px-3 rounded-xl bg-surface-dim/50 text-sm text-muted"
          >
            {s.text}
          </div>
        ))}
      </div>

      {/* Current sentence */}
      {current && (
        <div className="rounded-2xl border-2 border-accent/30 bg-surface p-5 flex flex-col gap-4">
          <p className="text-lg leading-relaxed font-medium">
            {current.text}
          </p>

          {/* Translation toggle */}
          <button
            onClick={() => setShowTranslation(!showTranslation)}
            className="text-sm text-accent font-medium text-left"
          >
            {showTranslation ? "Hide translation" : "Show translation"}
          </button>
          {showTranslation && (
            <p className="text-sm text-muted bg-surface-dim rounded-xl p-3">
              {current.translation}
            </p>
          )}

          {/* Expressions */}
          {current.expressions.length > 0 && (
            <div className="flex flex-col gap-2">
              {current.expressions.map((expr) => (
                <div key={expr.id}>
                  <button
                    onClick={() =>
                      setExpandedExpr(
                        expandedExpr === expr.id ? null : expr.id
                      )
                    }
                    className={`w-full text-left text-sm px-3 py-2 rounded-xl transition-colors ${
                      expandedExpr === expr.id
                        ? "bg-accent-light text-accent-dark"
                        : "bg-surface-dim hover:bg-accent-light/50"
                    }`}
                  >
                    <span className="font-semibold">{expr.text}</span>
                  </button>

                  {expandedExpr === expr.id && (
                    <div className="mt-2 ml-1 pl-3 border-l-2 border-accent/20 flex flex-col gap-2">
                      <p className="text-sm text-muted">{expr.meaning}</p>
                      <p className="text-sm italic text-muted">
                        e.g. {expr.example}
                      </p>
                      <Button
                        size="sm"
                        variant={isSaved(expr.id) ? "secondary" : "primary"}
                        onClick={() => handleSave(expr)}
                        disabled={isSaved(expr.id)}
                        className={`self-start rounded-lg ${
                          isSaved(expr.id) ? "bg-success/10 text-success border-success/20" : ""
                        }`}
                      >
                        {isSaved(expr.id) ? "Saved ✓" : "Save Expression"}
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="mt-auto pt-4 pb-4">
        <Button onClick={handleNext} fullWidth>
          {isLast ? "Continue to Practice" : "Next Sentence"}
        </Button>
        {!isLast && (
          <p className="text-center text-xs text-muted mt-2">
            {currentIdx + 1} of {sentences.length}
          </p>
        )}
      </div>
    </div>
  );
}
