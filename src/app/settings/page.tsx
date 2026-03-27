"use client";

import { useRouter } from "next/navigation";

import { RequireSettings } from "@/components/require-settings";
import { Button, Card, OptionButton, PageHeader, StatCard } from "@/components/ui";
import {
  DIFFICULTY_OPTIONS,
  DOMAIN_OPTIONS,
  TIME_OPTIONS,
} from "@/constants/options";
import { ROUTES } from "@/constants/routes";
import { getPathByDifficulty, getPathById } from "@/data/learning-paths";
import { useStore, useStreak } from "@/state/use-flowlingo-store";
import type { Domain } from "@/types/domain";

export default function SettingsPage() {
  return (
    <RequireSettings>
      <SettingsContent />
    </RequireSettings>
  );
}

function SettingsContent() {
  const router = useRouter();
  const settings = useStore((s) => s.settings)!;
  const updateSettings = useStore((s) => s.updateSettings);
  const savedExpressions = useStore((s) => s.savedExpressions);
  const dailyRecords = useStore((s) => s.dailyRecords);
  const learningProgress = useStore((s) => s.learningProgress);
  const startLearningPath = useStore((s) => s.startLearningPath);
  const resetAll = useStore((s) => s.resetAll);
  const streak = useStreak();

  const path = learningProgress ? getPathById(learningProgress.pathId) : null;

  function toggleDomain(d: Domain) {
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
      router.replace(ROUTES.SETUP);
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
      <PageHeader label="Settings" title="Your profile" />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard value={streak} label="Streak" highlight />
        <StatCard value={dailyRecords.length} label="Days" />
        <StatCard value={savedExpressions.length} label="Expressions" />
      </div>

      {mastered + learning > 0 && (
        <Card padding="compact" className="p-4">
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
        </Card>
      )}

      {/* Difficulty */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">Difficulty</p>
        <div className="flex flex-col gap-2">
          {DIFFICULTY_OPTIONS.map((opt) => (
            <OptionButton
              key={opt.value}
              selected={settings.difficulty === opt.value}
              onClick={() => updateSettings({ difficulty: opt.value })}
            >
              {opt.label}
            </OptionButton>
          ))}
        </div>
      </div>

      {/* Domains */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">Interests</p>
        <div className="grid grid-cols-2 gap-2">
          {DOMAIN_OPTIONS.map((opt) => (
            <OptionButton
              key={opt.value}
              selected={settings.domains.includes(opt.value)}
              onClick={() => toggleDomain(opt.value)}
            >
              {opt.label}
            </OptionButton>
          ))}
        </div>
      </div>

      {/* Daily time */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">Daily time</p>
        <div className="flex gap-2">
          {TIME_OPTIONS.map((opt) => (
            <OptionButton
              key={opt.value}
              selected={settings.dailyMinutes === opt.value}
              onClick={() => updateSettings({ dailyMinutes: opt.value })}
              className="flex-1 text-center"
            >
              {opt.label}
            </OptionButton>
          ))}
        </div>
      </div>

      {/* Learning mode */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">Learning mode</p>
        <div className="flex gap-2">
          <OptionButton
            selected={settings.learningMode === "guided"}
            onClick={() => {
              updateSettings({ learningMode: "guided" });
              if (!learningProgress) {
                const p = getPathByDifficulty(settings.difficulty);
                if (p) startLearningPath(p.id);
              }
            }}
            className="flex-1 text-center"
          >
            Guided
          </OptionButton>
          <OptionButton
            selected={settings.learningMode === "custom"}
            onClick={() => updateSettings({ learningMode: "custom" })}
            className="flex-1 text-center"
          >
            Free Explore
          </OptionButton>
        </div>
        {settings.learningMode === "guided" && path && learningProgress && (
          <Card padding="compact" className="p-3">
            <p className="text-xs font-medium">{path.title}</p>
            <p className="text-xs text-muted mt-0.5">
              {learningProgress.completedStepIds.length} / {path.steps.length} lessons completed
            </p>
          </Card>
        )}
      </div>

      {/* Retake level test */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">Level assessment</p>
        <Button
          variant="secondary"
          onClick={() => router.push(ROUTES.VOCAB_TEST)}
        >
          Retake vocabulary test
        </Button>
      </div>

      {/* Reset */}
      <div className="pt-4 border-t border-border">
        <Button variant="danger" onClick={handleReset}>
          Reset all data
        </Button>
      </div>
    </div>
  );
}
