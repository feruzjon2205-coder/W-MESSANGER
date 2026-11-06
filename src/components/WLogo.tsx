import React from 'react';

interface WLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const WLogo: React.FC<WLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const sizeMap = {
    xs: { icon: 20, text: 'text-sm' },
    sm: { icon: 26, text: 'text-base' },
    md: { icon: 34, text: 'text-lg' },
    lg: { icon: 46, text: 'text-2xl' },
    xl: { icon: 64, text: 'text-3xl' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 font-bold tracking-tight select-none ${className}`}>
      {/* Original W Messenger Vector Mark */}
      <div 
        className="relative flex items-center justify-center shrink-0 drop-shadow-[0_4px_16px_rgba(37,99,235,0.35)]"
        style={{ width: currentSize.icon, height: currentSize.icon }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            {/* Deep Navy/Cobalt base background */}
            <linearGradient id="wBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E3A8A" />
              <stop offset="50%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#0A0F1D" />
            </linearGradient>

            {/* Left Wing Facet */}
            <linearGradient id="wWingLeft" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="50%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>

            {/* Right Wing Facet */}
            <linearGradient id="wWingRight" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="60%" stopColor="#1D4ED8" />
              <stop offset="100%" stopColor="#172554" />
            </linearGradient>

            {/* Central Chevron Crest */}
            <linearGradient id="wCenterCrest" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#93C5FD" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>

            {/* Subtle glow filter */}
            <filter id="wSoftGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Rounded Hexagon / Shield Base */}
          <rect
            x="4"
            y="4"
            width="92"
            height="92"
            rx="24"
            fill="url(#wBgGrad)"
            stroke="rgba(96, 165, 250, 0.25)"
            strokeWidth="1.5"
          />

          {/* Outer faceted geometric W */}
          <g filter="url(#wSoftGlow)">
            {/* Left Vertex Down-Up */}
            <path
              d="M22 30 L36 74 L48 50 L36 30 Z"
              fill="url(#wWingLeft)"
              opacity="0.95"
            />

            {/* Right Vertex Down-Up */}
            <path
              d="M78 30 L64 74 L52 50 L64 30 Z"
              fill="url(#wWingRight)"
              opacity="0.95"
            />

            {/* Center Dynamic V Bridge forming the W */}
            <path
              d="M36 74 L50 42 L64 74 L50 63 Z"
              fill="url(#wCenterCrest)"
            />

            {/* Pulse Signal Dot at center top apex */}
            <circle
              cx="50"
              cy="28"
              r="4.5"
              fill="#60A5FA"
              className="animate-pulse"
            />
          </g>
        </svg>
      </div>

      {showText && (
        <div className="flex items-baseline">
          <span className={`${currentSize.text} tracking-tight font-extrabold text-white dark:text-white`}>
            W
          </span>
          <span className={`${currentSize.text} ml-1.5 font-medium text-blue-400`}>
            Messenger
          </span>
        </div>
      )}
    </div>
  );
};
