"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useFlowlingoStore } from "@/state/use-flowlingo-store";

export default function HomePage() {
  const router = useRouter();
  const profile = useFlowlingoStore((state) => state.profile);

  useEffect(() => {
    router.replace(profile ? "/today" : "/onboarding");
  }, [profile, router]);

  return (
    <section className="hero">
      <p className="eyebrow">Flowlingo</p>
      <h1>Preparing your daily loop...</h1>
      <p>We are opening the calmest path into English we can build.</p>
    </section>
  );
}
