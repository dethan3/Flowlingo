import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "default" | "compact";
  className?: string;
}

export function Card({
  padding = "default",
  className = "",
  children,
  ...rest
}: CardProps) {
  const paddingStyle = padding === "compact" ? "p-3" : "p-5";

  return (
    <div
      className={`rounded-2xl border border-border bg-surface ${paddingStyle} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
