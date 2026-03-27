"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";

import { Button, Card, PageHeader, ProgressBar } from "@/components/ui";
import { DIFFICULTY_LABELS } from "@/constants/options";
import { ROUTES } from "@/constants/routes";
import type { TestWord } from "@/data/word-bank";
import {
  createTestState,
  finishTest,
  getNextWord,
  recordKnowAnswer,
  recordMeaningAnswer,
  shouldFinish,
  type TestState,
} from "@/lib/vocab-test-engine";
import { useStore } from "@/state/use-flowlingo-store";

type Screen = "intro" | "know-check" | "meaning-check" | "feedback" | "result";

const MAX_STEPS = 24;

export default function VocabTestPage() {
  const router = useRouter();
  const saveSettings = useStore((s) => s.saveSettings);
  const saveVocabTestResult = useStore((s) => s.saveVocabTestResult);
  const settings = useStore((s) => s.settings);

  const stateRef = useRef<TestState>(createTestState());
  const [screen, setScreen] = useState<Screen>("intro");
  const [currentWord, setCurrentWord] = useState<TestWord | null>(null);
  const [selectedMeaning, setSelectedMeaning] = useState<string | null>(null);
  const [meaningCorrect, setMeaningCorrect] = useState<boolean | null>(null);
  const [stepCount, setStepCount] = useState(0);
  const [resultLevel, setResultLevel] = useState<number | null>(null);

  const shuffledOptions = useMemo(() => {
    if (!currentWord) return [];
    const opts = [...currentWord.meaningOptions];
    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opts[i], opts[j]] = [opts[j], opts[i]];
    }
    return opts;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWord?.word]);

  const advanceOrFinish = useCallback(() => {
    const state = stateRef.current;
    if (shouldFinish(state)) {
      const level = finishTest(state);
      setResultLevel(level);
      setScreen("result");
      return;
    }
    const next = getNextWord(state);
    if (!next) {
      const level = finishTest(state);
      setResultLevel(level);
      setScreen("result");
      return;
    }
    setCurrentWord(next);
    setSelectedMeaning(null);
    setMeaningCorrect(null);
    setScreen("know-check");
  }, []);

  const handleStart = useCallback(() => {
    stateRef.current = createTestState();
    setStepCount(0);
    advanceOrFinish();
  }, [advanceOrFinish]);

  const handleKnowAnswer = useCallback(
    (claimedKnown: boolean) => {
      if (!currentWord) return;
      const state = stateRef.current;
      const { needsMeaningCheck } = recordKnowAnswer(state, currentWord, claimedKnown);
      setStepCount(state.stepCount);

      if (needsMeaningCheck && claimedKnown) {
        setScreen("meaning-check");
      } else {
        advanceOrFinish();
      }
    },
    [currentWord, advanceOrFinish]
  );

  const handleMeaningAnswer = useCallback(
    (meaning: string) => {
      if (!currentWord) return;
      setSelectedMeaning(meaning);
      const state = stateRef.current;
      const { correct } = recordMeaningAnswer(state, currentWord, meaning);
      setMeaningCorrect(correct);
      setScreen("feedback");
    },
    [currentWord]
  );

  const handleFeedbackContinue = useCallback(() => {
    advanceOrFinish();
  }, [advanceOrFinish]);

  const handleAcceptResult = useCallback(() => {
    if (resultLevel === null) return;
    const existing = settings;

    saveVocabTestResult({
      level: resultLevel as 1 | 2 | 3 | 4,
      wordsTestedCount: stateRef.current.answers.size,
      completedAt: new Date().toISOString(),
    });

    saveSettings({
      difficulty: resultLevel as 1 | 2 | 3 | 4,
      domains: existing?.domains ?? ["daily-life"],
      dailyMinutes: existing?.dailyMinutes ?? 10,
      learningMode: existing?.learningMode ?? "custom",
    });

    // If this is a fresh setup, go to setup to pick domains/time
    // If retaking from settings, go back to settings
    if (existing && existing.domains.length > 0) {
      router.replace(ROUTES.SETTINGS);
    } else {
      router.replace(ROUTES.SETUP);
    }
  }, [resultLevel, settings, saveSettings, saveVocabTestResult, router]);

  // ── Render ─────────────────────────────────────────────

  if (screen === "intro") {
    return (
      <div className="flex flex-col gap-8 min-h-[80vh]">
        <PageHeader
          label="Flowlingo"
          title="Let's find your level"
          subtitle="We'll show you some English words. Just tell us if you know them — it takes about 2 minutes."
          className="pt-8"
        />

        <Card className="flex flex-col gap-3">
          <div className="flex items-center gap-3 text-sm">
            <span className="w-8 h-8 rounded-full bg-accent-light text-accent-dark flex items-center justify-center font-bold text-xs">1</span>
            <span className="text-muted">We show you a word</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="w-8 h-8 rounded-full bg-accent-light text-accent-dark flex items-center justify-center font-bold text-xs">2</span>
            <span className="text-muted">You say if you know it or not</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="w-8 h-8 rounded-full bg-accent-light text-accent-dark flex items-center justify-center font-bold text-xs">3</span>
            <span className="text-muted">Sometimes we check the meaning</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="w-8 h-8 rounded-full bg-accent-light text-accent-dark flex items-center justify-center font-bold text-xs">4</span>
            <span className="text-muted">We find the right level for you</span>
          </div>
        </Card>

        <div className="mt-auto pb-4">
          <Button onClick={handleStart} fullWidth>
            Start Test
          </Button>
        </div>
      </div>
    );
  }

  if (screen === "know-check" && currentWord) {
    return (
      <div className="flex flex-col gap-5 min-h-[80vh]">
        <div>
          <p className="text-muted text-xs mb-1">
            Word {stepCount + 1} of ~{MAX_STEPS}
          </p>
          <ProgressBar value={stepCount} max={MAX_STEPS} />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <p className="text-sm text-muted">Do you know this word?</p>
          <p className="text-4xl font-bold tracking-tight text-center">
            {currentWord.word}
          </p>
        </div>

        <div className="flex gap-3 pb-4">
          <Button
            variant="secondary"
            fullWidth
            onClick={() => handleKnowAnswer(false)}
          >
            I don&apos;t know
          </Button>
          <Button fullWidth onClick={() => handleKnowAnswer(true)}>
            I know this
          </Button>
        </div>
      </div>
    );
  }

  if (screen === "meaning-check" && currentWord) {
    return (
      <div className="flex flex-col gap-5 min-h-[80vh]">
        <div>
          <p className="text-muted text-xs mb-1">
            Meaning check
          </p>
          <ProgressBar value={stepCount} max={MAX_STEPS} />
        </div>

        <div className="flex flex-col gap-4 pt-4">
          <p className="text-sm text-muted">
            What does <span className="font-bold text-ink">{currentWord.word}</span> mean?
          </p>
          <div className="flex flex-col gap-2">
            {shuffledOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => handleMeaningAnswer(opt)}
                className="text-left text-sm p-3.5 rounded-xl border border-border bg-surface hover:border-accent/30 transition-all"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (screen === "feedback" && currentWord) {
    return (
      <div className="flex flex-col gap-5 min-h-[80vh]">
        <div>
          <p className="text-muted text-xs mb-1">
            Meaning check
          </p>
          <ProgressBar value={stepCount} max={MAX_STEPS} />
        </div>

        <div className="flex flex-col gap-4 pt-4">
          <p className="text-sm text-muted">
            What does <span className="font-bold text-ink">{currentWord.word}</span> mean?
          </p>
          <div className="flex flex-col gap-2">
            {shuffledOptions.map((opt) => {
              const isSelected = opt === selectedMeaning;
              const isCorrect = opt === currentWord.correctMeaning;
              let style = "border-border bg-surface opacity-50";
              if (isCorrect) {
                style = "border-success bg-success/10 text-success";
              } else if (isSelected && !meaningCorrect) {
                style = "border-danger bg-danger/10 text-danger";
              }
              return (
                <div
                  key={opt}
                  className={`text-left text-sm p-3.5 rounded-xl border transition-all ${style}`}
                >
                  {opt}
                </div>
              );
            })}
          </div>
          <div
            className={`text-sm p-3 rounded-xl ${
              meaningCorrect
                ? "bg-success/10 text-success"
                : "bg-warning/10 text-warning"
            }`}
          >
            {meaningCorrect ? "Correct!" : "Not quite — no worries, this helps us find your level."}
          </div>
        </div>

        <div className="mt-auto pb-4">
          <Button onClick={handleFeedbackContinue} fullWidth>
            Continue
          </Button>
        </div>
      </div>
    );
  }

  if (screen === "result" && resultLevel !== null) {
    return (
      <div className="flex flex-col gap-6 min-h-[80vh]">
        <div className="text-center pt-12 pb-4">
          <p className="text-5xl mb-4">🎯</p>
          <h1 className="text-2xl font-bold tracking-tight">
            Your level: {DIFFICULTY_LABELS[resultLevel as 1 | 2 | 3 | 4]}
          </h1>
          <p className="text-muted text-sm mt-2 max-w-[280px] mx-auto">
            We&apos;ll tailor your scenarios to this level. You can always change it in settings.
          </p>
        </div>

        <Card className="flex flex-col gap-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted">Words tested</span>
            <span className="font-medium">{stateRef.current.answers.size}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Estimated level</span>
            <span className="font-medium text-accent">
              Level {resultLevel} — {DIFFICULTY_LABELS[resultLevel as 1 | 2 | 3 | 4]}
            </span>
          </div>
        </Card>

        <div className="mt-auto pt-4 pb-4">
          <Button onClick={handleAcceptResult} fullWidth>
            {settings ? "Update My Level" : "Continue Setup"}
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
