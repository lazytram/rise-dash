import React from "react";

interface Props {
  className?: string;
}

export const AkaToraIcon: React.FC<Props> = ({ className }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden
  >
    <defs>
      <radialGradient
        id="akatora_bg"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(32 32) rotate(90) scale(30)"
      >
        <stop stopColor="#ffffff" stopOpacity="0.1" />
        <stop offset="1" stopColor="#ef4444" stopOpacity="0.2" />
      </radialGradient>
      <linearGradient
        id="akatora_fur"
        x1="18"
        y1="22"
        x2="46"
        y2="46"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#ffe4e6" />
        <stop offset="1" stopColor="#fecaca" />
      </linearGradient>
      <linearGradient id="akatora_stripe" x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#7f1d1d" />
        <stop offset="1" stopColor="#ef4444" />
      </linearGradient>
      <filter id="akatora_shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feOffset dy="1" />
        <feGaussianBlur stdDeviation="1.2" result="b" />
        <feColorMatrix
          in="b"
          type="matrix"
          values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 0.25 0"
        />
        <feBlend in2="SourceGraphic" mode="normal" />
      </filter>
    </defs>
    <circle cx="32" cy="32" r="30" fill="url(#akatora_bg)" />
    {/* Head base with slight drop shadow */}
    <g filter="url(#akatora_shadow)">
      <path
        d="M22 42c-3-2-4-6-3-9l2-5c1-3 4-5 7-6l6-1c3 1 6 3 7 6l2 5c1 3 0 7-3 9-3 2-6 3-10 3s-7-1-10-3z"
        fill="url(#akatora_fur)"
        stroke="#b91c1c"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </g>
    {/* Ears */}
    <path
      d="M20 26l4-4 3 4"
      fill="#fecaca"
      stroke="#ef4444"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M44 26l-4-4-3 4"
      fill="#fecaca"
      stroke="#ef4444"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Eyes with highlight */}
    <g>
      <circle cx="27.5" cy="32.2" r="1.8" fill="#111827" />
      <circle cx="26.9" cy="31.8" r="0.5" fill="#fff" />
      <circle cx="36.5" cy="32.2" r="1.8" fill="#111827" />
      <circle cx="35.9" cy="31.8" r="0.5" fill="#fff" />
    </g>
    {/* Nose */}
    <path d="M31 36h2l-1 2-1-2z" fill="#b91c1c" />
    {/* Whiskers */}
    <path
      d="M18 36h6M18 38h7M46 36h-6M46 38h-7"
      stroke="#ef4444"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Stripes */}
    <path
      d="M24 28l-3 3M22 32l-2 2"
      stroke="url(#akatora_stripe)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M40 28l3 3M42 32l2 2"
      stroke="url(#akatora_stripe)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Jaw shading */}
    <path
      d="M26 40c2 2 4 3 6 3s4-1 6-3"
      stroke="#ef4444"
      strokeOpacity="0.6"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
