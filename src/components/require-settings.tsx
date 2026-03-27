"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useStore } from "@/state/use-flowlingo-store";
import { ROUTES } from "@/constants/routes";

interface RequireSettingsProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RequireSettings({ children, fallback = null }: RequireSettingsProps) {
  const router = useRouter();
  const settings = useStore((s) => s.settings);

  useEffect(() => {
    if (!settings) router.replace(ROUTES.SETUP);
  }, [settings, router]);

  if (!settings) return <>{fallback}</>;
  return <>{children}</>;
}
