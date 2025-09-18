import React from "react";

interface Props {
  className?: string;
}

export const AoiTsuruIcon: React.FC<Props> = ({ className }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden
  >
    <defs>
      <radialGradient
        id="tsuru_bg"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(32 32) rotate(90) scale(30)"
      >
        <stop stopColor="#ffffff" stopOpacity="0.1" />
        <stop offset="1" stopColor="#3b82f6" stopOpacity="0.2" />
      </radialGradient>
      <linearGradient
        id="tsuru_wing"
        x1="10"
        y1="30"
        x2="54"
        y2="38"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#e0f2fe" />
        <stop offset="1" stopColor="#93c5fd" />
      </linearGradient>
      <linearGradient
        id="tsuru_body"
        x1="24"
        y1="20"
        x2="44"
        y2="44"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#bfdbfe" />
        <stop offset="1" stopColor="#60a5fa" />
      </linearGradient>
      <filter id="tsuru_shadow" x="-20%" y="-20%" width="140%" height="140%">
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

    <circle cx="32" cy="32" r="30" fill="url(#tsuru_bg)" />

    {/* Wings */}
    <g filter="url(#tsuru_shadow)">
      <path
        d="M10 36c8-6 14-8 22-8s14 2 22 8"
        stroke="url(#tsuru_wing)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M14 38c7-5 13-7 18-7s11 2 18 7"
        stroke="#3b82f6"
        strokeOpacity="0.5"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </g>

    {/* Neck and body */}
    <path
      d="M28 44c5-4 8-9 8-16 0-3 2-6 6-8"
      stroke="#1d4ed8"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M26 44c4 2 8 2 12 0 1-2 1-4-1-6-2-1-6-1-10 0-2 2-2 4-1 6z"
      fill="url(#tsuru_body)"
    />

    {/* Head */}
    <circle cx="43" cy="20" r="3" fill="#1d4ed8" />
    {/* Eye highlight */}
    <circle cx="42.4" cy="19.6" r="0.6" fill="#ffffff" />
    {/* Beak */}
    <path
      d="M46 20l6 1-6 1"
      stroke="#f59e0b"
      strokeWidth="2"
      strokeLinecap="round"
    />

    {/* Tail feathers */}
    <path
      d="M24 46l-6 4"
      stroke="#60a5fa"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
