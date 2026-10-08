export default function LeafIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden
      className={`h-4 w-4 shrink-0 ${className}`}
    >
      <path
        d="M3 17C3 9 9 3 17 3C17 11 11 17 3 17Z"
        fill="currentColor"
        opacity="0.85"
      />
      <path
        d="M4 16L16 4"
        stroke="var(--color-cream)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
