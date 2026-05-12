export function WaveBg() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <svg
        className="absolute inset-0 w-full h-full opacity-40"
        viewBox="0 0 1440 800"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="wave-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0" />
            <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#f0abfc" stopOpacity="0" />
          </linearGradient>
        </defs>
        {Array.from({ length: 6 }).map((_, i) => (
          <path
            key={i}
            d={`M 0 ${200 + i * 90} Q 360 ${150 + i * 80} 720 ${
              220 + i * 90
            } T 1440 ${180 + i * 95}`}
            fill="none"
            stroke="url(#wave-grad)"
            strokeWidth="1"
            opacity={0.5 - i * 0.06}
          />
        ))}
      </svg>
    </div>
  );
}
