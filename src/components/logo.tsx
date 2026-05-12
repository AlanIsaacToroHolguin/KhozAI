export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div className="relative">
        <div className="w-7 h-7 rounded-md bg-[var(--color-accent)] flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 13L8 3L13 13M5 9H11"
              stroke="#0a1620"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      <span className="text-lg font-semibold tracking-tight text-[var(--color-fg)]">
        Khoz<span className="text-[var(--color-accent)]">AI</span>
      </span>
    </div>
  );
}
