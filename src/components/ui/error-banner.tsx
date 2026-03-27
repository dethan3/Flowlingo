interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export function ErrorBanner({
  message,
  onDismiss,
  className = "",
}: ErrorBannerProps) {
  return (
    <div
      className={`rounded-2xl border border-danger/30 bg-danger/5 p-4 flex items-start gap-3 ${className}`}
    >
      <span className="shrink-0 text-danger text-sm mt-0.5">!</span>
      <div className="flex-1">
        <p className="text-sm text-danger">{message}</p>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-xs text-muted hover:text-ink mt-1 transition-colors"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
}
