"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { SectionCard, Pill } from "@/components/cards";
import { useCurrentLesson, useFlowlingoStore } from "@/state/use-flowlingo-store";

export default function PracticePage() {
  const router = useRouter();
  const profile = useFlowlingoStore((state) => state.profile);
  const completePractice = useFlowlingoStore((state) => state.completePractice);
  const lesson = useCurrentLesson();
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (!profile) {
      router.replace("/onboarding");
    }
  }, [profile, router]);

  if (!profile || !lesson) {
    return null;
  }

  const lessonId = lesson.id;
  const targetSentence = lesson.sentences[1] ?? lesson.sentences[0];
  const practiceType = profile.level === "beginner" ? "comprehension" : "retell";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    completePractice(lessonId, targetSentence.id, practiceType);
    router.push("/replay");
  }

  return (
    <>
      <section className="hero">
        <p className="eyebrow">Practice</p>
        <h1>Keep the output light.</h1>
        <p>This is not a test. We only want one gentle step that helps the lesson settle in.</p>
      </section>

      <SectionCard>
        <div className="button-row">
          <Pill>{practiceType}</Pill>
          <Pill>{lesson.title}</Pill>
        </div>
      </SectionCard>

      <form className="section-card stack-md" onSubmit={handleSubmit}>
        <div className="stack-sm">
          <span className="muted">Prompt</span>
          <p className="sentence-text">{targetSentence.text}</p>
          <p className="page-subtitle">
            {practiceType === "retell"
              ? "Rewrite the idea in your own simple English."
              : "Answer with one short sentence that shows you understood it."}
          </p>
        </div>

        <label className="field-label">
          Your response
          <textarea
            className="input"
            rows={5}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Write a short, low-pressure response..."
          />
        </label>

        <div className="button-row">
          <button className="button" type="submit">
            Mark practice complete
          </button>
          <Link href={`/lesson/${lesson.id}`} className="ghost-button">
            Back to lesson
          </Link>
        </div>
      </form>
    </>
  );
}
