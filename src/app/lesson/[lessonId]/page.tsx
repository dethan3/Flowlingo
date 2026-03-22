"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";

import { SectionCard } from "@/components/cards";
import { getLessonById } from "@/data/lessons";
import { useFlowlingoStore } from "@/state/use-flowlingo-store";

export default function LessonPage() {
  const params = useParams<{ lessonId: string }>();
  const lesson = getLessonById(params.lessonId);
  const savePhrase = useFlowlingoStore((state) => state.savePhrase);
  const savedPhrases = useFlowlingoStore((state) => state.savedPhrases);
  const [activeSentenceId, setActiveSentenceId] = useState(lesson?.sentences[0]?.id ?? "");

  if (!lesson) {
    notFound();
  }

  const activeSentence = lesson.sentences.find((sentence) => sentence.id === activeSentenceId) ?? lesson.sentences[0];

  return (
    <>
      <section className="hero">
        <p className="eyebrow">Lesson</p>
        <h1>{lesson.title}</h1>
        <p>{lesson.summary}</p>
      </section>

      <SectionCard>
        <div className="row">
          <div className="stack-sm">
            <span className="muted">Estimated time</span>
            <strong>{lesson.estimatedMinutes} minutes</strong>
          </div>
          <div className="button-row">
            <Link href="/today" className="ghost-button">
              Back
            </Link>
            <Link href="/practice" className="button">
              Continue to practice
            </Link>
          </div>
        </div>
      </SectionCard>

      <SectionCard>
        <div className="stack-md">
          <div>
            <span className="muted">Sentence flow</span>
          </div>
          <ul className="sentence-list">
            {lesson.sentences.map((sentence) => {
              const isActive = sentence.id === activeSentence.id;

              return (
                <li
                  key={sentence.id}
                  className={isActive ? "sentence-card sentence-card--active" : "sentence-card"}
                >
                  <div className="stack-sm">
                    <p className="sentence-text">{sentence.text}</p>
                    <div className="button-row">
                      <button className="button-secondary" type="button" onClick={() => setActiveSentenceId(sentence.id)}>
                        Open detail
                      </button>
                      <button className="ghost-button" type="button">
                        Replay audio
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </SectionCard>

      <SectionCard>
        <div className="detail-box stack-md">
          <div className="stack-sm">
            <span className="muted">Sentence detail</span>
            <p className="sentence-text">{activeSentence.text}</p>
            <p>{activeSentence.translation}</p>
          </div>

          <div className="stack-sm">
            <span className="muted">Key expressions</span>
            <ul className="phrase-list">
              {activeSentence.phrases.map((phrase) => {
                const alreadySaved = savedPhrases.some((item) => item.id === phrase.id);

                return (
                  <li key={phrase.id} className="phrase-card">
                    <div className="stack-sm">
                      <strong>{phrase.text}</strong>
                      <p>{phrase.meaning}</p>
                      <p className="muted">Example: {phrase.example}</p>
                      <div className="button-row">
                        <button
                          className={alreadySaved ? "button-secondary" : "button"}
                          type="button"
                          onClick={() => savePhrase(phrase)}
                        >
                          {alreadySaved ? "Saved" : "Save expression"}
                        </button>
                        <button className="ghost-button" type="button">
                          Slow replay
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </SectionCard>
    </>
  );
}
