"use client";

import { SectionCard, Pill } from "@/components/cards";
import { useFlowlingoStore } from "@/state/use-flowlingo-store";

export default function ProfilePage() {
  const profile = useFlowlingoStore((state) => state.profile);
  const dailyPlan = useFlowlingoStore((state) => state.dailyPlan);
  const savedPhrases = useFlowlingoStore((state) => state.savedPhrases);
  const resetDemo = useFlowlingoStore((state) => state.resetDemo);

  if (!profile) {
    return (
      <section className="section-card empty-state">
        <h1 className="page-title">No profile yet</h1>
        <p className="page-subtitle">Run onboarding once and this page becomes your calm settings and progress space.</p>
      </section>
    );
  }

  return (
    <>
      <section className="hero">
        <p className="eyebrow">Profile</p>
        <h1>Small signals, not noisy dashboards.</h1>
        <p>This first version keeps your profile focused on the choices that shape the daily loop.</p>
      </section>

      <SectionCard>
        <div className="button-row">
          <Pill>{profile.goal}</Pill>
          <Pill>{profile.level}</Pill>
          <Pill>{profile.dailyMinutes} minutes</Pill>
        </div>
        <p className="page-subtitle">Topics: {profile.topics.join(", ")}</p>
      </SectionCard>

      <SectionCard>
        <div className="stack-sm">
          <span className="muted">Current demo state</span>
          <p>Today&apos;s lesson: {dailyPlan?.lessonId ?? "not generated yet"}</p>
          <p>Saved expressions: {savedPhrases.length}</p>
        </div>
      </SectionCard>

      <SectionCard>
        <button className="ghost-button" type="button" onClick={() => resetDemo()}>
          Reset demo data
        </button>
      </SectionCard>
    </>
  );
}
