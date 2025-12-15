export function Logo({ size = 28 }: { size?: number }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 128 128"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#7c3aed" />
            <stop offset="1" stopColor="#22c55e" />
          </linearGradient>
        </defs>
        <rect
          x="10"
          y="10"
          width="108"
          height="108"
          rx="26"
          fill="rgba(255,255,255,0.03)"
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="4"
        />
        <path
          d="M40 78c0-18 14-32 32-32h16v10H72c-12 0-22 10-22 22v6h38v10H50c-6 0-10-4-10-10z"
          fill="url(#lg)"
        />
        <circle cx="88" cy="48" r="6" fill="url(#lg)" />
      </svg>
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
        <span style={{ fontWeight: 900, letterSpacing: "-0.02em" }}>EduCore</span>
        <span style={{ color: "var(--muted)", fontSize: 12 }}>Lengua · Primaria</span>
      </div>
    </div>
  );
}
