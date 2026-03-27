"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { RequireScenario } from "@/components/require-scenario";
import { Button, Card, ErrorBanner, PageHeader } from "@/components/ui";
import { ROUTES } from "@/constants/routes";
import { mockEvaluatePractice } from "@/services/mock-ai";
import { useStore } from "@/state/use-flowlingo-store";

const PRACTICE_TITLES: Record<string, string> = {
  comprehension: "Check your understanding",
  "fill-in": "Fill in the expression",
  retell: "Retell in your own words",
};

export default function PracticePage() {
  return (
    <RequireScenario>
      <PracticeContent />
    </RequireScenario>
  );
}

function PracticeContent() {
  const router = useRouter();
  const scenario = useStore((s) => s.currentScenario)!;
  const completePractice = useStore((s) => s.completePractice);

  const [userAnswer, setUserAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    correct: boolean;
    feedback: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const prompt = scenario.practicePrompt;

  function handleSubmit() {
    setError(null);
    try {
      const answer =
        prompt.type === "comprehension" ? selectedOption ?? "" : userAnswer;
      const result = mockEvaluatePractice({
        practiceType: prompt.type,
        userAnswer: answer,
        referenceAnswer: prompt.referenceAnswer,
      });
      setFeedback(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to evaluate your answer. Please try again."
      );
    }
  }

  function handleContinue() {
    completePractice();
    router.push(ROUTES.REPLAY);
  }

  function handleSkip() {
    completePractice();
    router.push(ROUTES.REPLAY);
  }

  return (
    <div className="flex flex-col gap-5 min-h-[80vh]">
      {/* Header */}
      <PageHeader
        label="Practice"
        title={PRACTICE_TITLES[prompt.type] ?? "Practice"}
      />

      {/* Question */}
      <Card className="flex flex-col gap-4">
        <p className="text-base font-medium leading-relaxed">
          {prompt.question}
        </p>

        {/* Comprehension — multiple choice */}
        {prompt.type === "comprehension" && prompt.options && (
          <div className="flex flex-col gap-2">
            {prompt.options.map((opt) => (
              <button
                key={opt}
                onClick={() => !feedback && setSelectedOption(opt)}
                disabled={!!feedback}
                className={`text-left text-sm p-3.5 rounded-xl border transition-all ${
                  feedback
                    ? opt === prompt.referenceAnswer
                      ? "border-success bg-success/10 text-success"
                      : selectedOption === opt
                        ? "border-danger bg-danger/10 text-danger"
                        : "border-border bg-surface opacity-50"
                    : selectedOption === opt
                      ? "border-accent bg-accent-light"
                      : "border-border bg-surface hover:border-accent/30"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* Fill-in or Retell — text input */}
        {(prompt.type === "fill-in" || prompt.type === "retell") && (
          <textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            disabled={!!feedback}
            placeholder={
              prompt.type === "fill-in"
                ? "Type the missing expression..."
                : "Write your retelling here..."
            }
            rows={prompt.type === "retell" ? 4 : 2}
            className="w-full text-sm p-3.5 rounded-xl border border-border bg-surface-dim resize-none focus:outline-none focus:border-accent transition-colors disabled:opacity-60"
          />
        )}

        {/* Error */}
        {error && <ErrorBanner message={error} />}

        {/* Feedback */}
        {feedback && (
          <div
            className={`text-sm p-3.5 rounded-xl ${
              feedback.correct
                ? "bg-success/10 text-success"
                : "bg-warning/10 text-warning"
            }`}
          >
            {feedback.feedback}
          </div>
        )}
      </Card>

      {/* Actions */}
      <div className="mt-auto pt-4 pb-4 flex flex-col gap-2">
        {!feedback ? (
          <>
            <Button
              onClick={handleSubmit}
              fullWidth
              disabled={
                prompt.type === "comprehension"
                  ? !selectedOption
                  : userAnswer.trim().length === 0
              }
            >
              Check
            </Button>
            <Button variant="ghost" onClick={handleSkip} fullWidth>
              Skip for now
            </Button>
          </>
        ) : (
          <Button onClick={handleContinue} fullWidth>
            Continue to Review
          </Button>
        )}
      </div>
    </div>
  );
}
