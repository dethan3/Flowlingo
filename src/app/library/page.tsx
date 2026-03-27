"use client";

import { useState } from "react";

import { Badge, PageHeader } from "@/components/ui";
import { useStore } from "@/state/use-flowlingo-store";
import type { Familiarity } from "@/types/domain";

const FILTERS: { value: Familiarity | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "learning", label: "Learning" },
  { value: "mastered", label: "Mastered" },
];

const FAMILIARITY_BADGE_VARIANT: Record<Familiarity, "accent" | "warning" | "success"> = {
  new: "accent",
  learning: "warning",
  mastered: "success",
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
      <PageHeader
        label="Expression Library"
        title="Your expressions"
        subtitle={`${expressions.length} saved total`}
      />

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
                  <Badge
                    variant={FAMILIARITY_BADGE_VARIANT[expr.familiarity]}
                    size="sm"
                    className="shrink-0"
                  >
                    {expr.familiarity}
                  </Badge>
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
