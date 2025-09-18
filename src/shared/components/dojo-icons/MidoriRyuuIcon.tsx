import React from "react";

interface Props {
  className?: string;
}

export const MidoriRyuuIcon: React.FC<Props> = ({ className }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden
  >
    <defs>
      <radialGradient
        id="ryuu_bg"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(32 32) rotate(90) scale(30)"
      >
        <stop stopColor="#ffffff" stopOpacity="0.1" />
        <stop offset="1" stopColor="#10b981" stopOpacity="0.2" />
      </radialGradient>
      <linearGradient
        id="ryuu_body"
        x1="14"
        y1="24"
        x2="50"
        y2="44"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#6ee7b7" />
        <stop offset="1" stopColor="#34d399" />
      </linearGradient>
      <filter id="ryuu_shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feOffset dy="1" />
        <feGaussianBlur stdDeviation="1.1" result="b" />
        <feColorMatrix
          in="b"
          type="matrix"
          values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 0.22 0"
        />
        <feBlend in2="SourceGraphic" mode="normal" />
      </filter>
    </defs>

    <circle cx="32" cy="32" r="30" fill="url(#ryuu_bg)" />

    {/* Serpentine body */}
    <g filter="url(#ryuu_shadow)">
      <path
        d="M14 40c10-8 16-14 18-20 2 8 8 12 18 20"
        stroke="url(#ryuu_body)"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      {/* belly highlights */}
      <path
        d="M18 38l3 2M22 35l3 2M26 32l3 2"
        stroke="#10b981"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </g>

    {/* Head detail */}
    <circle cx="30" cy="26" r="2.2" fill="#065f46" />
    {/* Horns */}
    <path
      d="M28 22l-2-3M36 22l2-3"
      stroke="#065f46"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Flame */}
    <path
      d="M42 30c3 1 4 2 6 4-3-1-6 0-8 1"
      stroke="#f59e0b"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  </svg>
);
