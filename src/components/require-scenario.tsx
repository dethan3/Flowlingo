"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useStore } from "@/state/use-flowlingo-store";
import { ROUTES } from "@/constants/routes";

interface RequireScenarioProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RequireScenario({ children, fallback = null }: RequireScenarioProps) {
  const router = useRouter();
  const scenario = useStore((s) => s.currentScenario);

  useEffect(() => {
    if (!scenario) router.replace(ROUTES.TODAY);
  }, [scenario, router]);

  if (!scenario) return <>{fallback}</>;
  return <>{children}</>;
}
