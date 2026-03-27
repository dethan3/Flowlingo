"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";

import { ROUTES, HIDE_NAV_PATHS } from "@/constants/routes";

const navItems = [
  { href: ROUTES.TODAY, label: "Today", icon: "☀" },
  { href: ROUTES.LIBRARY, label: "Expressions", icon: "📖" },
  { href: ROUTES.SETTINGS, label: "Settings", icon: "⚙" },
];

export function AppShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const showNav = !HIDE_NAV_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  return (
    <div className="min-h-dvh mx-auto max-w-[480px] pb-24 px-4 pt-6">
      <main>{children}</main>
      {showNav && (
        <nav
          className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[min(calc(100%-32px),448px)] grid grid-cols-3 gap-1 p-1.5 rounded-2xl bg-ink/90 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.2)]"
          aria-label="Primary navigation"
        >
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                  active
                    ? "bg-white/15 text-white"
                    : "text-white/60 hover:text-white/80"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
