interface SpinnerProps {
  size?: "sm" | "default" | "lg";
  className?: string;
}

const sizeStyles = {
  sm: "w-4 h-4 border-[2px]",
  default: "w-6 h-6 border-[2px]",
  lg: "w-10 h-10 border-[3px]",
};

export function Spinner({ size = "default", className = "" }: SpinnerProps) {
  return (
    <div
      className={`${sizeStyles[size]} rounded-full border-accent/30 border-t-accent animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
