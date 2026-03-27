import type { HTMLAttributes } from "react";

interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: "default" | "thick";
  color?: "accent" | "success";
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  size = "default",
  color = "accent",
  className = "",
  ...rest
}: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  const heightStyle = size === "thick" ? "h-2.5" : "h-1.5";
  const colorStyle = color === "success" ? "bg-success" : "bg-accent";

  return (
    <div
      className={`${heightStyle} rounded-full bg-border overflow-hidden ${className}`}
      {...rest}
    >
      <div
        className={`h-full rounded-full ${colorStyle} transition-all duration-300`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
