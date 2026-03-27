interface StatCardProps {
  value: string | number;
  label: string;
  highlight?: boolean;
  className?: string;
}

export function StatCard({
  value,
  label,
  highlight = false,
  className = "",
}: StatCardProps) {
  return (
    <div
      className={`rounded-xl border border-border bg-surface p-3 text-center ${className}`}
    >
      <p className={`text-lg font-bold ${highlight ? "text-accent" : ""}`}>
        {value}
      </p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}
