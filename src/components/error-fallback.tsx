"use client";

interface ErrorFallbackProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export function ErrorFallback({ error, reset }: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4 text-center">
      <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center">
        <span className="text-xl">!</span>
      </div>
      <h2 className="text-lg font-bold tracking-tight">
        Something went wrong
      </h2>
      <p className="text-muted text-sm max-w-[300px]">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <button
        onClick={reset}
        className="mt-2 px-6 py-3 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent-dark transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
