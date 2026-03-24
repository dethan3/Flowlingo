"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useStore } from "@/state/use-flowlingo-store";
import type { DailyMinutes, Difficulty, Domain } from "@/types/domain";

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string; desc: string }[] = [
  { value: 1, label: "Level 1", desc: "Beginner — short, simple sentences" },
  { value: 2, label: "Level 2", desc: "Elementary — everyday conversations" },
  { value: 3, label: "Level 3", desc: "Intermediate — workplace & social" },
  { value: 4, label: "Level 4", desc: "Advanced — nuanced, natural English" },
];

const DOMAIN_OPTIONS: { value: Domain; label: string }[] = [
  { value: "daily-life", label: "Daily Life" },
  { value: "travel", label: "Travel" },
  { value: "work", label: "Work" },
  { value: "social", label: "Social" },
  { value: "culture", label: "Culture" },
];

const TIME_OPTIONS: { value: DailyMinutes; label: string }[] = [
  { value: 5, label: "5 min" },
  { value: 10, label: "10 min" },
  { value: 15, label: "15 min" },
];

type Step = "difficulty" | "domains" | "time";

export default function SetupPage() {
  const router = useRouter();
  const saveSettings = useStore((s) => s.saveSettings);

  const [step, setStep] = useState<Step>("difficulty");
  const [difficulty, setDifficulty] = useState<Difficulty>(2);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [dailyMinutes, setDailyMinutes] = useState<DailyMinutes>(10);

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
    });
    router.replace("/today");
  }

  return (
    <div className="flex flex-col gap-8 min-h-[80vh]">
      {/* Header */}
      <div className="pt-8">
        <p className="text-accent text-xs font-semibold tracking-widest uppercase mb-2">
          Flowlingo
        </p>
        <h1 className="text-3xl font-bold tracking-tight">
          {step === "difficulty" && "Choose your level"}
          {step === "domains" && "What interests you?"}
          {step === "time" && "How much time per day?"}
        </h1>
        <p className="text-muted text-sm mt-2">
          {step === "difficulty" && "You can always change this later."}
          {step === "domains" && "Pick one or more topics you'd like to explore."}
          {step === "time" && "We'll adjust the content to fit your schedule."}
        </p>
      </div>

      {/* Step content */}
      <div className="flex-1 flex flex-col gap-3">
        {step === "difficulty" &&
          DIFFICULTY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setDifficulty(opt.value)}
              className={`text-left p-4 rounded-2xl border transition-all ${
                difficulty === opt.value
                  ? "border-accent bg-accent-light"
                  : "border-border bg-surface hover:border-accent/30"
              }`}
            >
              <span className="font-semibold text-sm">{opt.label}</span>
              <span className="block text-muted text-xs mt-0.5">
                {opt.desc}
              </span>
            </button>
          ))}

        {step === "domains" && (
          <div className="grid grid-cols-2 gap-3">
            {DOMAIN_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => toggleDomain(opt.value)}
                className={`p-4 rounded-2xl border text-left text-sm font-medium transition-all ${
                  domains.includes(opt.value)
                    ? "border-accent bg-accent-light text-accent-dark"
                    : "border-border bg-surface hover:border-accent/30"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {step === "time" && (
          <div className="flex gap-3">
            {TIME_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setDailyMinutes(opt.value)}
                className={`flex-1 p-5 rounded-2xl border text-center font-semibold transition-all ${
                  dailyMinutes === opt.value
                    ? "border-accent bg-accent-light text-accent-dark"
                    : "border-border bg-surface hover:border-accent/30"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pb-4">
        {step !== "difficulty" && (
          <button
            onClick={() =>
              setStep(step === "time" ? "domains" : "difficulty")
            }
            className="flex-1 py-3.5 rounded-xl border border-border text-sm font-medium hover:bg-surface-dim transition-colors"
          >
            Back
          </button>
        )}
        <button
          onClick={() => {
            if (step === "difficulty") setStep("domains");
            else if (step === "domains") setStep("time");
            else handleFinish();
          }}
          className="flex-1 py-3.5 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent-dark transition-colors"
        >
          {step === "time" ? "Start Learning" : "Continue"}
        </button>
      </div>
    </div>
  );
}
