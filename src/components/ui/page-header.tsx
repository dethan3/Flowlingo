interface PageHeaderProps {
  label?: string;
  title: string;
  subtitle?: string;
  className?: string;
}

export function PageHeader({
  label,
  title,
  subtitle,
  className = "",
}: PageHeaderProps) {
  return (
    <div className={className}>
      {label && (
        <p className="text-accent text-xs font-semibold tracking-widest uppercase mb-1">
          {label}
        </p>
      )}
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      {subtitle && (
        <p className="text-muted text-sm mt-1">{subtitle}</p>
      )}
    </div>
  );
}
