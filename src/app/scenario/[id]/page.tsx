"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useStore } from "@/state/use-flowlingo-store";
import type { Expression } from "@/types/domain";

export default function ScenarioPage() {
  const router = useRouter();
  const scenario = useStore((s) => s.currentScenario);
  const saveExpression = useStore((s) => s.saveExpression);
  const savedExpressions = useStore((s) => s.savedExpressions);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [expandedExpr, setExpandedExpr] = useState<string | null>(null);

  useEffect(() => {
    if (!scenario) router.replace("/today");
  }, [scenario, router]);

  if (!scenario) return null;

  const sentences = scenario.sentences;
  const current = sentences[currentIdx];
  const isLast = currentIdx === sentences.length - 1;
  const progress = ((currentIdx + 1) / sentences.length) * 100;

  function isSaved(exprId: string) {
    return savedExpressions.some((e) => e.id === exprId);
  }

  function handleSave(expr: Expression) {
    saveExpression(expr);
  }

  function handleNext() {
    if (isLast) {
      router.push(`/practice/${scenario!.id}`);
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
          onClick={() => router.push("/today")}
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
      <div className="h-1.5 rounded-full bg-border overflow-hidden">
        <div
          className="h-full rounded-full bg-accent transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Previous sentences (dimmed) */}
      <div className="flex flex-col gap-2">
        {sentences.slice(0, currentIdx).map((s, i) => (
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
                      <button
                        onClick={() => handleSave(expr)}
                        disabled={isSaved(expr.id)}
                        className={`self-start text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                          isSaved(expr.id)
                            ? "bg-success/10 text-success"
                            : "bg-accent text-white hover:bg-accent-dark"
                        }`}
                      >
                        {isSaved(expr.id) ? "Saved ✓" : "Save Expression"}
                      </button>
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
        <button
          onClick={handleNext}
          className="w-full py-3.5 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent-dark transition-colors"
        >
          {isLast ? "Continue to Practice" : "Next Sentence"}
        </button>
        {!isLast && (
          <p className="text-center text-xs text-muted mt-2">
            {currentIdx + 1} of {sentences.length}
          </p>
        )}
      </div>
    </div>
  );
}
