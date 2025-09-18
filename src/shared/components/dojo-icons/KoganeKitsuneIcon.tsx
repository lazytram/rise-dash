import React from "react";

interface Props {
  className?: string;
}

export const KoganeKitsuneIcon: React.FC<Props> = ({ className }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden
  >
    <defs>
      <radialGradient
        id="kitsune_bg"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(32 32) rotate(90) scale(30)"
      >
        <stop stopColor="#ffffff" stopOpacity="0.1" />
        <stop offset="1" stopColor="#f59e0b" stopOpacity="0.2" />
      </radialGradient>
      <linearGradient
        id="kitsune_face"
        x1="20"
        y1="28"
        x2="44"
        y2="52"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#fffbeb" />
        <stop offset="1" stopColor="#fde68a" />
      </linearGradient>
      <filter id="kitsune_shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feOffset dy="1" />
        <feGaussianBlur stdDeviation="1.2" result="b" />
        <feColorMatrix
          in="b"
          type="matrix"
          values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 0.22 0"
        />
        <feBlend in2="SourceGraphic" mode="normal" />
      </filter>
    </defs>

    <circle cx="32" cy="32" r="30" fill="url(#kitsune_bg)" />

    {/* Ears */}
    <path
      d="M22 22l4-4 3 4"
      fill="#fde68a"
      stroke="#f59e0b"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M42 22l-4-4-3 4"
      fill="#fde68a"
      stroke="#f59e0b"
      strokeWidth="2"
      strokeLinejoin="round"
    />

    {/* Face */}
    <g filter="url(#kitsune_shadow)">
      <path
        d="M20 40c0-8 6-12 12-12s12 4 12 12c0 6-8 8-12 8s-12-2-12-8z"
        fill="url(#kitsune_face)"
        stroke="#b45309"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </g>

    {/* Eyes and nose */}
    <path
      d="M28 38h2M34 38h2"
      stroke="#b45309"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="32" cy="42" r="1.5" fill="#b45309" />

    {/* Tail silhouette */}
    <path
      d="M16 44c6 0 10 6 16 6s10-6 16-6"
      stroke="#f59e0b"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);
