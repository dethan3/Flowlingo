import type { ButtonHTMLAttributes } from "react";

interface OptionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  className?: string;
}

export function OptionButton({
  selected = false,
  className = "",
  children,
  ...rest
}: OptionButtonProps) {
  return (
    <button
      className={`text-left text-sm p-3.5 rounded-xl border font-medium transition-all ${
        selected
          ? "border-accent bg-accent-light text-accent-dark"
          : "border-border bg-surface hover:border-accent/30"
      } ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
