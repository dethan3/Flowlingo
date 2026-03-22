"use client";

import Link from "next/link";

import { SectionCard, Pill } from "@/components/cards";
import { useCurrentLesson, useFlowlingoStore, useReplayQueue } from "@/state/use-flowlingo-store";

export default function CompletePage() {
  const lesson = useCurrentLesson();
  const replayQueue = useReplayQueue();
  const completeLesson = useFlowlingoStore((state) => state.completeLesson);
  const savedPhrases = useFlowlingoStore((state) => state.savedPhrases);

  if (!lesson) {
    return (
      <section className="section-card empty-state">
        <h1 className="page-title">Nothing to complete yet</h1>
        <Link href="/today" className="button">
          Go to Today
        </Link>
      </section>
    );
  }

  return (
    <>
      <section className="hero">
        <p className="eyebrow">Complete</p>
        <h1>You finished today&apos;s loop.</h1>
        <p>That matters more than perfection. Understanding a little more, a little more often, is the whole game.</p>
      </section>

      <SectionCard>
        <div className="stack-sm">
          <div className="button-row">
            <Pill>{lesson.title}</Pill>
            <Pill>{savedPhrases.length} saved expressions</Pill>
            <Pill>{replayQueue.length} replay items</Pill>
          </div>
          <p className="page-subtitle">The demo keeps the end state simple: one lesson done, a few useful phrases saved, and a clear reason to come back tomorrow.</p>
        </div>
      </SectionCard>

      <SectionCard>
        <div className="button-row">
          <button className="button" type="button" onClick={() => completeLesson(lesson.id)}>
            Mark day complete
          </button>
          <Link href="/today" className="button-secondary">
            Return to Today
          </Link>
        </div>
      </SectionCard>
    </>
  );
}
