export function BrandMark({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 256 256"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M128 16c-46.4 0-84 37.6-84 84 0 63 84 148 84 148s84-85 84-148c0-46.4-37.6-84-84-84Zm0 26a58 58 0 1 0 0 116 58 58 0 0 0 0-116Z"
      />
      <g fill="currentColor" stroke="currentColor" strokeWidth="17" strokeLinecap="round">
        <path d="M105.37 122.63 150.63 77.37" />
        <circle cx="96.18" cy="113.44" r="12.5" stroke="none" />
        <circle cx="114.56" cy="131.82" r="12.5" stroke="none" />
        <circle cx="141.44" cy="68.18" r="12.5" stroke="none" />
        <circle cx="159.82" cy="86.56" r="12.5" stroke="none" />
      </g>
    </svg>
  );
}
