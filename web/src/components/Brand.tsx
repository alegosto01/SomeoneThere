export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <a className={`brand ${compact ? 'brand-compact' : ''}`} href="#top" aria-label="SomeoneThere home">
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 44 58" fill="none">
          <path
            d="M9 3.5h24a6.5 6.5 0 0 1 6.5 6.5v32a6.5 6.5 0 0 1-6.5 6.5h-3.2v7.2l-8.4-7.2H9A6.5 6.5 0 0 1 2.5 42V10A6.5 6.5 0 0 1 9 3.5Z"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinejoin="round"
          />
          <ellipse cx="21" cy="11.5" rx="2.7" ry="2.2" stroke="currentColor" strokeWidth="2" />
          <circle cx="21" cy="26" r="6.1" stroke="var(--green)" strokeWidth="3.8" />
          <path d="M10.8 43c0-6.7 4.6-11.4 10.2-11.4S31.2 36.3 31.2 43" stroke="var(--green)" strokeWidth="3.8" strokeLinecap="round" />
        </svg>
      </span>
      <span>Someone<span className="brand-there">There</span></span>
    </a>
  );
}
