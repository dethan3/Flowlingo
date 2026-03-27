"use client";

import { useCallback, useState } from "react";

import { RequireSettings } from "@/components/require-settings";
import {
  Badge,
  Button,
  Card,
  ErrorBanner,
  PageHeader,
  ProgressBar,
  Spinner,
  StatCard,
} from "@/components/ui";
import { DIFFICULTY_LABELS } from "@/constants/options";
import { ROUTES } from "@/constants/routes";
import { getPathById } from "@/data/learning-paths";
import {
  mockGenerateGuidedScenario,
  mockGenerateScenario,
  mockRecommendScenario,
} from "@/services/mock-ai";
import {
  useReplayExpressions,
  useStore,
  useStreak,
  useTodayRecord,
} from "@/state/use-flowlingo-store";

export default function TodayPage() {
  return (
    <RequireSettings>
      <TodayContent />
    </RequireSettings>
  );
}

function TodayContent() {
  const settings = useStore((s) => s.settings)!;
  const currentScenario = useStore((s) => s.currentScenario);
  const setCurrentScenario = useStore((s) => s.setCurrentScenario);
  const recentTitles = useStore((s) => s.recentScenarioTitles);
  const learningProgress = useStore((s) => s.learningProgress);
  const advanceLearningPath = useStore((s) => s.advanceLearningPath);
  const savedCount = useStore((s) => s.savedExpressions.length);
  const streak = useStreak();
  const todayRecord = useTodayRecord();
  const replayExprs = useReplayExpressions();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isGuided = settings.learningMode === "guided";
  const path = learningProgress ? getPathById(learningProgress.pathId) : null;
  const currentStep =
    path && learningProgress
      ? path.steps[learningProgress.currentStepIndex] ?? null
      : null;
  const pathComplete = path && learningProgress
    ? learningProgress.currentStepIndex >= path.steps.length
    : false;

  const sentenceCount =
    settings.dailyMinutes === 5 ? 4 : settings.dailyMinutes === 15 ? 8 : 6;

  // ── Custom mode scenario generation ──
  const generateCustomScenario = useCallback(() => {
    if (!settings) return;
    setLoading(true);
    setError(null);
    try {
      const rec = mockRecommendScenario({
        domains: settings.domains,
        recentScenarios: recentTitles,
        difficulty: settings.difficulty,
      });
      const scenario = mockGenerateScenario({
        difficulty: settings.difficulty,
        domain: rec.domain,
        sentenceCount,
      });
      setCurrentScenario(scenario);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate scenario. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [settings, recentTitles, setCurrentScenario, sentenceCount]);

  // ── Guided mode scenario generation ──
  const generateGuidedScenario = useCallback(() => {
    if (!currentStep) return;
    setLoading(true);
    setError(null);
    try {
      const scenario = mockGenerateGuidedScenario({
        stepId: currentStep.id,
        title: currentStep.title,
        scenarioPrompt: currentStep.scenarioPrompt,
        domain: currentStep.domain,
        difficulty: currentStep.difficulty,
        sentenceCount,
      });
      setCurrentScenario(scenario);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate scenario. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [currentStep, setCurrentScenario, sentenceCount]);

  const isDone = todayRecord?.practiceCompleted && todayRecord?.replayCompleted;

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <PageHeader
        label="Today"
        title={isDone ? "All done for today!" : "Ready for your daily English?"}
        subtitle={streak > 0 ? `${streak} day streak — keep it going!` : undefined}
      />

      {/* Mode badge */}
      <div className="flex items-center gap-2">
        <Badge variant={isGuided ? "accent" : "muted"} size="sm">
          {isGuided ? "Guided Path" : "Free Explore"}
        </Badge>
        {isGuided && path && !pathComplete && (
          <span className="text-xs text-muted">
            Lesson {(learningProgress?.currentStepIndex ?? 0) + 1} of {path.steps.length}
          </span>
        )}
      </div>

      {/* Error message */}
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      {/* Guided mode: path progress + next step */}
      {isGuided && path && !isDone && (
        <>
          {/* Path progress bar */}
          <ProgressBar
            value={learningProgress?.completedStepIds.length ?? 0}
            max={path.steps.length}
            size="thick"
            color="success"
          />

          {pathComplete ? (
            <Card className="text-center py-6">
              <p className="text-2xl mb-2">🏆</p>
              <p className="font-semibold">Path complete!</p>
              <p className="text-muted text-sm mt-1">
                You&apos;ve finished all {path.steps.length} lessons in {path.title}.
              </p>
              <p className="text-muted text-xs mt-2">
                Switch to Free Explore mode for unlimited scenarios, or retake the test for a new path.
              </p>
            </Card>
          ) : currentStep && (
            <Card className="flex flex-col gap-3">
              <div>
                <p className="text-xs text-muted font-medium uppercase tracking-wider mb-1">
                  Next lesson
                </p>
                <h2 className="font-semibold text-base">{currentStep.title}</h2>
                <p className="text-muted text-sm mt-0.5">
                  {currentStep.description}
                </p>
              </div>

              {currentScenario ? (
                <div className="flex gap-3">
                  <Button href={ROUTES.SCENARIO(currentScenario.id)} fullWidth>
                    Continue
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={generateGuidedScenario}
                  disabled={loading}
                  fullWidth
                >
                  {loading ? "Generating..." : "Start Lesson"}
                </Button>
              )}
            </Card>
          )}
        </>
      )}

      {/* Custom mode: scenario card */}
      {!isGuided && !isDone && (
        <Card className="flex flex-col gap-4">
          {currentScenario ? (
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
                <Badge className="shrink-0">
                  {DIFFICULTY_LABELS[currentScenario.difficulty]}
                </Badge>
              </div>
              <div className="flex gap-3">
                <Button href={ROUTES.SCENARIO(currentScenario.id)} fullWidth>
                  Start
                </Button>
                <Button
                  variant="secondary"
                  onClick={generateCustomScenario}
                  disabled={loading}
                >
                  {loading ? <Spinner size="sm" /> : "Shuffle"}
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 py-2">
              <p className="text-muted text-sm">
                Generate today&apos;s scenario to get started.
              </p>
              <Button onClick={generateCustomScenario} disabled={loading} fullWidth>
                {loading ? "Generating..." : "Generate Scenario"}
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Done state */}
      {isDone && (
        <Card className="text-center py-4">
          <p className="text-2xl mb-2">🎉</p>
          <p className="font-semibold">Great work today!</p>
          <p className="text-muted text-sm mt-1">
            Come back tomorrow for a new {isGuided ? "lesson" : "scenario"}.
          </p>
        </Card>
      )}

      {/* Replay prompt */}
      {replayExprs.length > 0 && !isDone && (
        <Card className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted">
              Expressions to review
            </span>
            <Badge variant="warning" size="sm">
              {replayExprs.length}
            </Badge>
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
        </Card>
      )}

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard value={streak} label="Streak" highlight />
        <StatCard value={savedCount} label="Saved" />
        <StatCard value={DIFFICULTY_LABELS[settings.difficulty]} label="Level" />
      </div>
    </div>
  );
}
