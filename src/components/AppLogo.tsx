import React from 'react';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  animated?: boolean;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'md',
  showText = true,
  animated = true,
}) => {
  const dimensions = {
    sm: { icon: 28, text: 'text-sm', sub: 'text-[9px]' },
    md: { icon: 40, text: 'text-base', sub: 'text-[10px]' },
    lg: { icon: 56, text: 'text-xl', sub: 'text-xs' },
    xl: { icon: 84, text: 'text-3xl', sub: 'text-sm' },
  }[size];

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Visual Logo SVG: Retro CRT Monitor fusing with a Rising Bullish Stock Market Graph */}
      <div
        className="relative shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#1c2333] via-[#0f141c] to-[#080b0f] p-1.5 border border-[#30363d] shadow-lg shadow-emerald-950/40 group"
        style={{ width: dimensions.icon + 12, height: dimensions.icon + 12 }}
      >
        {/* Ambient glow behind the logo */}
        <div className="absolute inset-0 rounded-xl bg-emerald-500/15 blur-md pointer-events-none group-hover:bg-emerald-400/25 transition-all duration-500" />

        <svg
          width={dimensions.icon}
          height={dimensions.icon}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10"
        >
          <defs>
            {/* Screen Phosphor Gradient */}
            <linearGradient id="crtScreenGrad" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#06241a" />
              <stop offset="100%" stopColor="#02120d" />
            </linearGradient>

            {/* Rising Stock Graph Gradient */}
            <linearGradient id="stockLineGrad" x1="15" y1="80" x2="85" y2="15" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#6ee7b7" />
            </linearGradient>

            {/* Glow Area Under Graph */}
            <linearGradient id="stockAreaGrad" x1="50" y1="30" x2="50" y2="85" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>

            {/* Bezel Metallic Gradient */}
            <linearGradient id="bezelGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#374151" />
              <stop offset="50%" stopColor="#1f2937" />
              <stop offset="100%" stopColor="#111827" />
            </linearGradient>
          </defs>

          {/* Retro CRT Outer Monitor Housing */}
          <rect
            x="8"
            y="12"
            width="84"
            height="68"
            rx="14"
            fill="url(#bezelGrad)"
            stroke="#4b5563"
            strokeWidth="3.5"
          />

          {/* Monitor Stand Base */}
          <path
            d="M36 80 L32 90 L68 90 L64 80 Z"
            fill="#1f2937"
            stroke="#374151"
            strokeWidth="2.5"
          />
          <line x1="26" y1="92" x2="74" y2="92" stroke="#4b5563" strokeWidth="3" strokeLinecap="round" />

          {/* CRT Curved Screen Inset */}
          <rect
            x="16"
            y="18"
            width="68"
            height="52"
            rx="8"
            fill="url(#crtScreenGrad)"
            stroke="#059669"
            strokeWidth="1.5"
          />

          {/* Horizontal CRT Scanlines */}
          <line x1="18" y1="26" x2="82" y2="26" stroke="#10b981" strokeOpacity="0.18" strokeWidth="1" />
          <line x1="18" y1="34" x2="82" y2="34" stroke="#10b981" strokeOpacity="0.18" strokeWidth="1" />
          <line x1="18" y1="42" x2="82" y2="42" stroke="#10b981" strokeOpacity="0.18" strokeWidth="1" />
          <line x1="18" y1="50" x2="82" y2="50" stroke="#10b981" strokeOpacity="0.18" strokeWidth="1" />
          <line x1="18" y1="58" x2="82" y2="58" stroke="#10b981" strokeOpacity="0.18" strokeWidth="1" />

          {/* Financial Stock Chart Filled Area */}
          <path
            d="M20 62 L32 54 L44 58 L58 40 L70 44 L82 24 L82 66 L20 66 Z"
            fill="url(#stockAreaGrad)"
          />

          {/* Rising Bullish Financial Stock Graph Line */}
          <path
            d="M20 62 L32 54 L44 58 L58 40 L70 44 L82 24"
            fill="none"
            stroke="url(#stockLineGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Financial Candlestick / Graph Data Nodes */}
          <circle cx="32" cy="54" r="2.5" fill="#34d399" />
          <circle cx="44" cy="58" r="2.5" fill="#34d399" />
          <circle cx="58" cy="40" r="2.5" fill="#34d399" />
          <circle cx="70" cy="44" r="2.5" fill="#34d399" />

          {/* Breakthrough Arrow Peak (Emerging into the future) */}
          <circle
            cx="82"
            cy="24"
            r="4.5"
            fill="#10b981"
            stroke="#ecfdf5"
            strokeWidth="1.5"
            className={animated ? 'animate-ping origin-center' : ''}
          />
          <circle cx="82" cy="24" r="3.5" fill="#6ee7b7" />

          {/* Front Panel Power LED */}
          <circle cx="76" cy="74" r="2" fill="#10b981" className="animate-pulse" />
          {/* Tuning / Contrast Knobs */}
          <circle cx="68" cy="74" r="2" fill="#6b7280" />
          <circle cx="60" cy="74" r="2" fill="#6b7280" />
        </svg>
      </div>

      {/* Typography Label */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black tracking-wider uppercase bg-gradient-to-r from-emerald-400 via-teal-200 to-white bg-clip-text text-transparent font-mono ${dimensions.text}`}
            >
              SILICON DYNASTY
            </span>
          </div>
          <span
            className={`font-semibold tracking-widest uppercase text-emerald-500/80 font-mono ${dimensions.sub}`}
          >
            THE EVOLUTION OF COMPUTING
          </span>
        </div>
      )}
    </div>
  );
};
