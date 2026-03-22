"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { lessons } from "@/data/lessons";
import { useFlowlingoStore } from "@/state/use-flowlingo-store";
import { Goal, Level, Topic } from "@/types/domain";

const goals: { value: Goal; label: string }[] = [
  { value: "build-confidence", label: "Build confidence" },
  { value: "daily-input", label: "Daily input" },
  { value: "travel", label: "Travel English" },
  { value: "work-communication", label: "Work communication" }
];

const levels: { value: Level; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "lower-intermediate", label: "Lower-intermediate" },
  { value: "intermediate", label: "Intermediate" }
];

const topics = Array.from(new Set<Topic>(lessons.map((lesson) => lesson.topic)));

export default function OnboardingPage() {
  const router = useRouter();
  const createProfile = useFlowlingoStore((state) => state.createProfile);

  const [goal, setGoal] = useState<Goal>("daily-input");
  const [level, setLevel] = useState<Level>("lower-intermediate");
  const [dailyMinutes, setDailyMinutes] = useState(12);
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>(["daily-life", "travel"]);

  function toggleTopic(topic: Topic) {
    setSelectedTopics((current) =>
      current.includes(topic) ? current.filter((item) => item !== topic) : [...current, topic]
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    createProfile({
      id: "demo-user",
      goal,
      level,
      dailyMinutes,
      topics: selectedTopics.length > 0 ? selectedTopics : ["daily-life"]
    });

    router.push("/today");
  }

  return (
    <>
      <section className="hero">
        <p className="eyebrow">Flowlingo</p>
        <h1>Learn English in a way that feels lighter.</h1>
        <p>
          We start with just enough signal to shape a calm daily lesson: your goal, your level, and the kind of
          English you want to live in.
        </p>
      </section>

      <form className="section-card stack-lg" onSubmit={handleSubmit}>
        <div className="stack-sm">
          <h2 className="page-title">Build your first week</h2>
          <p className="page-subtitle">This first demo keeps the setup short so you can get into your lesson quickly.</p>
        </div>

        <div className="stack-sm">
          <span className="muted">What brings you here?</span>
          <div className="choice-grid">
            {goals.map((item) => (
              <button
                key={item.value}
                type="button"
                className={goal === item.value ? "choice-chip choice-chip--active" : "choice-chip"}
                onClick={() => setGoal(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="stack-sm">
          <span className="muted">Choose your current level</span>
          <div className="choice-grid">
            {levels.map((item) => (
              <button
                key={item.value}
                type="button"
                className={level === item.value ? "choice-chip choice-chip--active" : "choice-chip"}
                onClick={() => setLevel(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="stack-sm">
          <span className="muted">Pick a few topics you want to keep meeting in English</span>
          <div className="choice-grid">
            {topics.map((topic) => (
              <button
                key={topic}
                type="button"
                className={selectedTopics.includes(topic) ? "choice-chip choice-chip--active" : "choice-chip"}
                onClick={() => toggleTopic(topic)}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        <label className="field-label">
          Daily time target
          <select
            className="select"
            value={dailyMinutes}
            onChange={(event) => setDailyMinutes(Number(event.target.value))}
          >
            <option value={10}>10 minutes</option>
            <option value={12}>12 minutes</option>
            <option value={15}>15 minutes</option>
          </select>
        </label>

        <div className="button-row">
          <button className="button" type="submit">
            Start today&apos;s lesson
          </button>
        </div>
      </form>
    </>
  );
}
