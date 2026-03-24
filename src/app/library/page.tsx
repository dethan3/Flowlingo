"use client";

import { useState } from "react";

import { useStore } from "@/state/use-flowlingo-store";
import type { Familiarity } from "@/types/domain";

const FILTERS: { value: Familiarity | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "learning", label: "Learning" },
  { value: "mastered", label: "Mastered" },
];

const FAMILIARITY_STYLES: Record<Familiarity, string> = {
  new: "bg-accent-light text-accent-dark",
  learning: "bg-warning/10 text-warning",
  mastered: "bg-success/10 text-success",
};

export default function LibraryPage() {
  const expressions = useStore((s) => s.savedExpressions);
  const [filter, setFilter] = useState<Familiarity | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered =
    filter === "all"
      ? expressions
      : expressions.filter((e) => e.familiarity === filter);

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div>
        <p className="text-accent text-xs font-semibold tracking-widest uppercase mb-1">
          Expression Library
        </p>
        <h1 className="text-2xl font-bold tracking-tight">
          Your expressions
        </h1>
        <p className="text-muted text-sm mt-1">
          {expressions.length} saved total
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
              filter === f.value
                ? "bg-accent text-white"
                : "bg-surface-dim text-muted hover:text-ink"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted text-sm">
            {expressions.length === 0
              ? "No expressions saved yet. Start a scenario to begin collecting!"
              : "No expressions match this filter."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((expr) => (
            <div key={expr.id}>
              <button
                onClick={() =>
                  setExpandedId(expandedId === expr.id ? null : expr.id)
                }
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  expandedId === expr.id
                    ? "border-accent/30 bg-surface"
                    : "border-border bg-surface hover:border-accent/20"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="font-medium text-sm">{expr.text}</span>
                  <span
                    className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      FAMILIARITY_STYLES[expr.familiarity]
                    }`}
                  >
                    {expr.familiarity}
                  </span>
                </div>
                <p className="text-muted text-xs mt-1">{expr.meaning}</p>
              </button>

              {expandedId === expr.id && (
                <div className="mx-4 mt-1 mb-2 p-3 rounded-xl bg-surface-dim flex flex-col gap-2">
                  <p className="text-sm italic text-muted">
                    e.g. {expr.example}
                  </p>
                  <p className="text-xs text-muted">
                    From: &ldquo;{expr.sourceSentenceText}&rdquo;
                  </p>
                  {expr.savedAt && (
                    <p className="text-xs text-muted">
                      Saved: {new Date(expr.savedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
