import React from "react";

interface RiceLogoProps {
  className?: string;
  size?: number;
}

export const RiceLogo: React.FC<RiceLogoProps> = ({
  className = "",
  size = 48,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="riceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#4C1D95", stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: "#7C3AED", stopOpacity: 1 }} />
          <stop
            offset="100%"
            style={{ stopColor: "#C7D2FE", stopOpacity: 1 }}
          />
        </linearGradient>

        <linearGradient
          id="riceGrainGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" style={{ stopColor: "#FFFFFF", stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: "#F3F4F6", stopOpacity: 1 }} />
          <stop
            offset="100%"
            style={{ stopColor: "#E5E7EB", stopOpacity: 1 }}
          />
        </linearGradient>

        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow
            dx="2"
            dy="2"
            stdDeviation="3"
            floodColor="#000000"
            floodOpacity="0.3"
          />
        </filter>
      </defs>

      {/* Background circle with red gradient */}
      <circle
        cx="100"
        cy="100"
        r="95"
        fill="url(#riceGradient)"
        filter="url(#shadow)"
      />

      {/* Decorative dots at cardinal points */}
      <circle cx="100" cy="30" r="2" fill="#FFFFFF" opacity="0.8" />
      <circle cx="170" cy="100" r="2" fill="#FFFFFF" opacity="0.8" />
      <circle cx="100" cy="170" r="2" fill="#FFFFFF" opacity="0.8" />
      <circle cx="30" cy="100" r="2" fill="#FFFFFF" opacity="0.8" />

      {/* Inclined rice grain like 🌾 */}
      <g transform="translate(100, 100) rotate(-15)">
        {/* Main rice grain body */}
        <ellipse
          cx="0"
          cy="0"
          rx="18"
          ry="28"
          fill="#FFFFFF"
          stroke="#E5E7EB"
          strokeWidth="1.5"
        />

        {/* Rice grain highlight for 3D effect */}
        <ellipse cx="0" cy="0" rx="12" ry="20" fill="#F9FAFB" stroke="none" />

        {/* Rice grain texture lines */}
        <line
          x1="-12"
          y1="-8"
          x2="12"
          y2="-8"
          stroke="#E5E7EB"
          strokeWidth="0.5"
          opacity="0.6"
        />
        <line
          x1="-10"
          y1="0"
          x2="10"
          y2="0"
          stroke="#E5E7EB"
          strokeWidth="0.5"
          opacity="0.6"
        />
        <line
          x1="-12"
          y1="8"
          x2="12"
          y2="8"
          stroke="#E5E7EB"
          strokeWidth="0.5"
          opacity="0.6"
        />
      </g>

      {/* Decorative elements around the edge */}
      <circle cx="30" cy="100" r="2" fill="#FFFFFF" opacity="0.8" />
      <circle cx="170" cy="100" r="2" fill="#FFFFFF" opacity="0.8" />
      <circle cx="100" cy="30" r="2" fill="#FFFFFF" opacity="0.8" />
      <circle cx="100" cy="170" r="2" fill="#FFFFFF" opacity="0.8" />

      {/* Corner accents */}
      <circle cx="40" cy="40" r="1.5" fill="#FEF3C7" opacity="0.9" />
      <circle cx="160" cy="40" r="1.5" fill="#FEF3C7" opacity="0.9" />
      <circle cx="40" cy="160" r="1.5" fill="#FEF3C7" opacity="0.9" />
      <circle cx="160" cy="160" r="1.5" fill="#FEF3C7" opacity="0.9" />
    </svg>
  );
};
