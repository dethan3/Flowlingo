"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button, Card, OptionButton, PageHeader } from "@/components/ui";
import {
  DIFFICULTY_OPTIONS,
  DOMAIN_OPTIONS,
  TIME_OPTIONS,
} from "@/constants/options";
import { ROUTES } from "@/constants/routes";
import { getPathByDifficulty } from "@/data/learning-paths";
import { useStore } from "@/state/use-flowlingo-store";
import type {
  DailyMinutes,
  Difficulty,
  Domain,
  LearningMode,
} from "@/types/domain";

type Step = "difficulty" | "domains" | "time" | "mode";

const STEP_CONFIG: Record<Step, { title: string; subtitle: string }> = {
  difficulty: {
    title: "Choose your level",
    subtitle: "You can always change this later.",
  },
  domains: {
    title: "What interests you?",
    subtitle: "Pick one or more topics you'd like to explore.",
  },
  time: {
    title: "How much time per day?",
    subtitle: "We'll adjust the content to fit your schedule.",
  },
  mode: {
    title: "How would you like to learn?",
    subtitle: "Choose a learning style that suits you.",
  },
};

const STEPS_ORDER: Step[] = ["difficulty", "domains", "time", "mode"];

export default function SetupPage() {
  const router = useRouter();
  const saveSettings = useStore((s) => s.saveSettings);
  const startLearningPath = useStore((s) => s.startLearningPath);

  // If difficulty was already set via vocab test, skip the difficulty step
  const existingSettings = useStore((s) => s.settings);
  const hasVocabLevel = !!existingSettings?.difficulty;

  const firstStep = hasVocabLevel ? "domains" : "difficulty";
  const [step, setStep] = useState<Step>(firstStep);
  const [difficulty, setDifficulty] = useState<Difficulty>(existingSettings?.difficulty ?? 2);
  const [domains, setDomains] = useState<Domain[]>(existingSettings?.domains ?? []);
  const [dailyMinutes, setDailyMinutes] = useState<DailyMinutes>(existingSettings?.dailyMinutes ?? 10);
  const [learningMode, setLearningMode] = useState<LearningMode>(existingSettings?.learningMode ?? "guided");

  const guidedPath = getPathByDifficulty(difficulty);

  function toggleDomain(d: Domain) {
    setDomains((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  }

  function handleFinish() {
    saveSettings({
      difficulty,
      domains: domains.length > 0 ? domains : ["daily-life"],
      dailyMinutes,
      learningMode,
    });

    // If guided mode, start the learning path
    if (learningMode === "guided" && guidedPath) {
      startLearningPath(guidedPath.id);
    }

    router.replace(ROUTES.TODAY);
  }

  function goBack() {
    const idx = STEPS_ORDER.indexOf(step);
    for (let i = idx - 1; i >= 0; i--) {
      const prev = STEPS_ORDER[i];
      if (prev === "difficulty" && hasVocabLevel) continue;
      setStep(prev);
      return;
    }
  }

  function goNext() {
    const idx = STEPS_ORDER.indexOf(step);
    if (idx < STEPS_ORDER.length - 1) {
      setStep(STEPS_ORDER[idx + 1]);
    } else {
      handleFinish();
    }
  }

  const isFirstStep = step === firstStep;
  const isLastStep = step === "mode";

  return (
    <div className="flex flex-col gap-8 min-h-[80vh]">
      {/* Header */}
      <PageHeader
        label="Flowlingo"
        title={STEP_CONFIG[step].title}
        subtitle={STEP_CONFIG[step].subtitle}
        className="pt-8"
      />

      {/* Step content */}
      <div className="flex-1 flex flex-col gap-3">
        {step === "difficulty" &&
          DIFFICULTY_OPTIONS.map((opt) => (
            <OptionButton
              key={opt.value}
              selected={difficulty === opt.value}
              onClick={() => setDifficulty(opt.value)}
              className="p-4 rounded-2xl"
            >
              <span className="font-semibold text-sm">{opt.shortLabel}</span>
              <span className="block text-muted text-xs mt-0.5">
                {opt.desc}
              </span>
            </OptionButton>
          ))}

        {step === "domains" && (
          <div className="grid grid-cols-2 gap-3">
            {DOMAIN_OPTIONS.map((opt) => (
              <OptionButton
                key={opt.value}
                selected={domains.includes(opt.value)}
                onClick={() => toggleDomain(opt.value)}
                className="p-4 rounded-2xl"
              >
                {opt.label}
              </OptionButton>
            ))}
          </div>
        )}

        {step === "time" && (
          <div className="flex gap-3">
            {TIME_OPTIONS.map((opt) => (
              <OptionButton
                key={opt.value}
                selected={dailyMinutes === opt.value}
                onClick={() => setDailyMinutes(opt.value)}
                className="flex-1 p-5 rounded-2xl text-center font-semibold"
              >
                {opt.label}
              </OptionButton>
            ))}
          </div>
        )}

        {step === "mode" && (
          <div className="flex flex-col gap-3">
            <OptionButton
              selected={learningMode === "guided"}
              onClick={() => setLearningMode("guided")}
              className="p-4 rounded-2xl"
            >
              <span className="font-semibold text-sm">Guided Path</span>
              <span className="block text-muted text-xs mt-0.5">
                Follow a structured curriculum with step-by-step lessons.
              </span>
              {guidedPath && (
                <Card padding="compact" className="mt-2 bg-surface-dim border-0">
                  <p className="text-xs font-medium">{guidedPath.title}</p>
                  <p className="text-xs text-muted">{guidedPath.steps.length} lessons · {guidedPath.description}</p>
                </Card>
              )}
            </OptionButton>

            <OptionButton
              selected={learningMode === "custom"}
              onClick={() => setLearningMode("custom")}
              className="p-4 rounded-2xl"
            >
              <span className="font-semibold text-sm">Free Explore</span>
              <span className="block text-muted text-xs mt-0.5">
                AI picks fresh scenarios based on your interests each day.
              </span>
            </OptionButton>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pb-4">
        {!isFirstStep && (
          <Button variant="secondary" fullWidth onClick={goBack}>
            Back
          </Button>
        )}
        <Button fullWidth onClick={goNext}>
          {isLastStep ? "Start Learning" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
