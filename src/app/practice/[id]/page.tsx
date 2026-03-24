"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { mockEvaluatePractice } from "@/services/mock-ai";
import { useStore } from "@/state/use-flowlingo-store";

export default function PracticePage() {
  const router = useRouter();
  const scenario = useStore((s) => s.currentScenario);
  const completePractice = useStore((s) => s.completePractice);

  const [userAnswer, setUserAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    correct: boolean;
    feedback: string;
  } | null>(null);

  useEffect(() => {
    if (!scenario) router.replace("/today");
  }, [scenario, router]);

  if (!scenario) return null;

  const prompt = scenario.practicePrompt;

  function handleSubmit() {
    const answer =
      prompt.type === "comprehension" ? selectedOption ?? "" : userAnswer;
    const result = mockEvaluatePractice({
      practiceType: prompt.type,
      userAnswer: answer,
      referenceAnswer: prompt.referenceAnswer,
    });
    setFeedback(result);
  }

  function handleContinue() {
    completePractice();
    router.push("/replay");
  }

  function handleSkip() {
    completePractice();
    router.push("/replay");
  }

  return (
    <div className="flex flex-col gap-5 min-h-[80vh]">
      {/* Header */}
      <div>
        <p className="text-accent text-xs font-semibold tracking-widest uppercase mb-1">
          Practice
        </p>
        <h1 className="text-xl font-bold tracking-tight">
          {prompt.type === "comprehension" && "Check your understanding"}
          {prompt.type === "fill-in" && "Fill in the expression"}
          {prompt.type === "retell" && "Retell in your own words"}
        </h1>
      </div>

      {/* Question */}
      <div className="rounded-2xl border border-border bg-surface p-5 flex flex-col gap-4">
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
      </div>

      {/* Actions */}
      <div className="mt-auto pt-4 pb-4 flex flex-col gap-2">
        {!feedback ? (
          <>
            <button
              onClick={handleSubmit}
              disabled={
                prompt.type === "comprehension"
                  ? !selectedOption
                  : userAnswer.trim().length === 0
              }
              className="w-full py-3.5 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent-dark transition-colors disabled:opacity-40"
            >
              Check
            </button>
            <button
              onClick={handleSkip}
              className="w-full py-3 rounded-xl text-sm font-medium text-muted hover:text-ink transition-colors"
            >
              Skip for now
            </button>
          </>
        ) : (
          <button
            onClick={handleContinue}
            className="w-full py-3.5 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent-dark transition-colors"
          >
            Continue to Review
          </button>
        )}
      </div>
    </div>
  );
}
