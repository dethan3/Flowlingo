import { PropsWithChildren } from "react";

export function SectionCard({ children }: PropsWithChildren) {
  return <section className="section-card">{children}</section>;
}

export function Pill({ children }: PropsWithChildren) {
  return <span className="pill">{children}</span>;
}
