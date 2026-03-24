"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useStore } from "@/state/use-flowlingo-store";

export default function HomePage() {
  const router = useRouter();
  const settings = useStore((s) => s.settings);

  useEffect(() => {
    router.replace(settings ? "/today" : "/setup");
  }, [settings, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
      <div className="w-10 h-10 rounded-full bg-accent/20 animate-pulse" />
      <p className="text-muted text-sm">Loading Flowlingo...</p>
    </div>
  );
}
