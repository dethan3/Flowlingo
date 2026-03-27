import type { HTMLAttributes } from "react";

type BadgeVariant = "accent" | "success" | "warning" | "muted" | "danger";

const variantStyles: Record<BadgeVariant, string> = {
  accent: "bg-accent-light text-accent-dark",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  muted: "bg-surface-dim text-muted",
  danger: "bg-danger/10 text-danger",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: "default" | "sm";
  className?: string;
}

export function Badge({
  variant = "accent",
  size = "default",
  className = "",
  children,
  ...rest
}: BadgeProps) {
  const sizeStyle =
    size === "sm"
      ? "text-[10px] px-2 py-0.5"
      : "text-xs px-2.5 py-1";

  return (
    <span
      className={`inline-block rounded-full font-medium ${sizeStyle} ${variantStyles[variant]} ${className}`}
      {...rest}
    >
      {children}
    </span>
  );
}
