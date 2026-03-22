"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";

const navItems = [
  { href: "/today", label: "Today" },
  { href: "/practice", label: "Practice" },
  { href: "/replay", label: "Replay" },
  { href: "/profile", label: "Me" }
];

export function AppShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const showNav = pathname !== "/onboarding";

  return (
    <div className="app-frame">
      <main className="app-main">{children}</main>
      {showNav ? (
        <nav className="bottom-nav" aria-label="Primary navigation">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? "bottom-nav__item bottom-nav__item--active" : "bottom-nav__item"}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      ) : null}
    </div>
  );
}
