"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { SectionCard } from "@/components/cards";
import { useCurrentLesson, useReplayQueue } from "@/state/use-flowlingo-store";

export default function ReplayPage() {
  const router = useRouter();
  const lesson = useCurrentLesson();
  const replayQueue = useReplayQueue();

  useEffect(() => {
    if (!lesson) {
      router.replace("/today");
    }
  }, [lesson, router]);

  if (!lesson) {
    return null;
  }

  return (
    <>
      <section className="hero">
        <p className="eyebrow">Replay</p>
        <h1>Meet the useful phrases again, right away.</h1>
        <p>Repeating expressions inside new moments is what makes them start to feel usable.</p>
      </section>

      <SectionCard>
        <ul className="phrase-list">
          {replayQueue.map((phrase) => (
            <li key={phrase.id} className="phrase-card">
              <div className="stack-sm">
                <strong>{phrase.text}</strong>
                <p>{phrase.meaning}</p>
                <p className="muted">Try it in a new line: {phrase.example}</p>
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard>
        <div className="button-row">
          <Link href="/complete" className="button">
            Finish today
          </Link>
          <Link href="/practice" className="ghost-button">
            Back to practice
          </Link>
        </div>
      </SectionCard>
    </>
  );
}
