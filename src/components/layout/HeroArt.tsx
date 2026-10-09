// Decorative padlock illustration for the dashboard hero (pure SVG, no data).
export function HeroArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 520 440" className={className} aria-hidden fill="none">
      <defs>
        <linearGradient id="mg-lock" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#7d84e0" />
          <stop offset="100%" stopColor="#dce38a" />
        </linearGradient>
        <linearGradient id="mg-shackle" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#dce38a" />
          <stop offset="100%" stopColor="#7d84e0" />
        </linearGradient>
        <linearGradient id="mg-orbit" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#dce38a" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#7d84e0" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="mg-shield" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c9d0f5" />
          <stop offset="100%" stopColor="#8a90d8" />
        </linearGradient>
      </defs>

      {/* sparkles + code glyph */}
      <path className="mg-twinkle" d="M70 130 L78 155 L103 163 L78 171 L70 196 L62 171 L37 163 L62 155 Z" fill="#dce38a" fillOpacity="0.85" />
      <path className="mg-twinkle" style={{ animationDelay: "1.4s" }} d="M128 60 L132 74 L146 78 L132 82 L128 96 L124 82 L110 78 L124 74 Z" fill="#dce38a" fillOpacity="0.75" />
      <text x="262" y="58" fill="#dce38a" fontSize="22" fontFamily="var(--font-dm-mono), monospace" textAnchor="middle">
        &lt;/&gt;
      </text>

      {/* stacked browser windows */}
      <g stroke="rgba(255,255,255,0.55)" strokeWidth="1.2">
        <rect x="152" y="138" width="262" height="222" rx="6" strokeOpacity="0.35" />
        <rect x="146" y="132" width="262" height="222" rx="6" strokeOpacity="0.6" />
        <rect x="140" y="126" width="262" height="222" rx="6" />
        <line x1="140" y1="150" x2="402" y2="150" strokeOpacity="0.5" />
      </g>
      <g fill="rgba(255,255,255,0.7)">
        <circle cx="362" cy="138" r="3.5" />
        <circle cx="375" cy="138" r="3.5" />
        <circle cx="388" cy="138" r="3.5" />
      </g>

      {/* orbit */}
      <ellipse cx="270" cy="210" rx="215" ry="70" transform="rotate(-16 270 210)" stroke="url(#mg-orbit)" strokeWidth="1.6" strokeOpacity="0.8" />
      <path d="M158 300 l14 -2 l-9 11" stroke="#7d84e0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />

      {/* padlock */}
      <g className="mg-float">
        <path d="M200 205 V160 a70 70 0 0 1 140 0 V205" stroke="url(#mg-shackle)" strokeWidth="26" strokeLinecap="round" />
        <path d="M200 205 V160 a70 70 0 0 1 140 0 V205" stroke="rgba(255,255,255,0.25)" strokeWidth="1" transform="translate(-13 0)" />
        <g transform="rotate(-8 270 290)">
          <rect x="178" y="200" width="190" height="160" rx="18" fill="#d9df8f" fillOpacity="0.25" transform="translate(8 8)" />
          <rect x="178" y="200" width="190" height="160" rx="18" fill="url(#mg-lock)" />
          <rect x="178.5" y="200.5" width="189" height="159" rx="17.5" stroke="rgba(255,255,255,0.35)" />
          <circle cx="273" cy="268" r="17" fill="#0b0a0d" />
          <path d="M265 278 L262 315 h22 L281 278 Z" fill="#0b0a0d" />
          <circle cx="273" cy="268" r="21" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
        </g>
      </g>

      {/* shield badge */}
      <g transform="translate(372 196)">
        <path d="M30 0 L60 12 V38 C60 58 46 72 30 80 C14 72 0 58 0 38 V12 Z" fill="url(#mg-shield)" fillOpacity="0.92" />
        <path d="M18 40 l9 9 l17 -19" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
