"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { SectionCard, Pill } from "@/components/cards";
import { useCurrentLesson, useFlowlingoStore, useReplayQueue } from "@/state/use-flowlingo-store";

export default function TodayPage() {
  const router = useRouter();
  const profile = useFlowlingoStore((state) => state.profile);
  const dailyPlan = useFlowlingoStore((state) => state.dailyPlan);
  const practiceAttempts = useFlowlingoStore((state) => state.practiceAttempts);
  const lesson = useCurrentLesson();
  const replayQueue = useReplayQueue();

  useEffect(() => {
    if (!profile) {
      router.replace("/onboarding");
    }
  }, [profile, router]);

  if (!profile || !dailyPlan || !lesson) {
    return (
      <section className="section-card empty-state">
        <h1 className="page-title">No plan yet</h1>
        <p className="page-subtitle">We need a short onboarding pass before we can shape today&apos;s lesson.</p>
        <Link href="/onboarding" className="button">
          Go to onboarding
        </Link>
      </section>
    );
  }

  const completedSteps = Number(practiceAttempts.length > 0) + Number(replayQueue.length > 0) + Number(dailyPlan.completed);
  const progress = Math.min(100, Math.round((completedSteps / 3) * 100));

  return (
    <>
      <section className="hero">
        <p className="eyebrow">Today</p>
        <h1>Your English feels lighter when the next step is obvious.</h1>
        <p>Today&apos;s loop is short, focused, and shaped around the topics you picked.</p>
      </section>

      <SectionCard>
        <div className="row">
          <div className="stack-sm">
            <span className="muted">Daily progress</span>
            <strong>{progress}% complete</strong>
          </div>
          <Pill>{profile.dailyMinutes} min pace</Pill>
        </div>
        <div className="progress-bar" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>
      </SectionCard>

      <SectionCard>
        <div className="stack-sm">
          <span className="muted">Today&apos;s lesson</span>
          <h2>{lesson.title}</h2>
          <p>{lesson.summary}</p>
          <div className="button-row">
            <Link href={`/lesson/${lesson.id}`} className="button">
              Start lesson
            </Link>
            <Pill>{lesson.topic}</Pill>
            <Pill>{lesson.difficulty}</Pill>
          </div>
        </div>
      </SectionCard>

      <SectionCard>
        <div className="stack-sm">
          <span className="muted">Replay queue</span>
          <p className="page-subtitle">Keep 2-3 expressions close so they come back naturally later.</p>
          <ul className="phrase-list">
            {replayQueue.map((phrase) => (
              <li key={phrase.id} className="phrase-card">
                <strong>{phrase.text}</strong>
                <p className="muted">{phrase.meaning}</p>
              </li>
            ))}
          </ul>
          <Link href="/replay" className="button-secondary">
            Review expressions
          </Link>
        </div>
      </SectionCard>
    </>
  );
}
