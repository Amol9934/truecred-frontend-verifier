/**
 * Spinner.jsx — Animated loading spinner using Framer Motion.
 *
 * Sizes: 'sm' | 'md' | 'lg'
 * Color: TrueCred Primary Teal (#0F6E56)
 */

import React from 'react';
import { motion } from 'framer-motion';

const SIZE_MAP = {
  sm: { outer: 16, stroke: 2 },
  md: { outer: 24, stroke: 2.5 },
  lg: { outer: 40, stroke: 3.5 },
};

const spinTransition = {
  repeat: Infinity,
  ease: 'linear',
  duration: 0.85,
};

/**
 * @param {{ size?: 'sm'|'md'|'lg', color?: string, className?: string }} props
 */
export default function Spinner({ size = 'md', color = '#0F6E56', className = '' }) {
  const { outer, stroke } = SIZE_MAP[size] ?? SIZE_MAP.md;
  const radius = (outer - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  // Show roughly 75 % of the circle as the visible arc.
  const dashArray  = circumference;
  const dashOffset = circumference * 0.25;

  return (
    <motion.svg
      width={outer}
      height={outer}
      viewBox={`0 0 ${outer} ${outer}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      animate={{ rotate: 360 }}
      transition={spinTransition}
      className={className}
      aria-label="Loading"
      role="status"
    >
      {/* Track ring */}
      <circle
        cx={outer / 2}
        cy={outer / 2}
        r={radius}
        stroke={color}
        strokeOpacity={0.2}
        strokeWidth={stroke}
      />
      {/* Spinning arc */}
      <circle
        cx={outer / 2}
        cy={outer / 2}
        r={radius}
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={dashArray}
        strokeDashoffset={dashOffset}
        // Start at the top of the circle
        transform={`rotate(-90 ${outer / 2} ${outer / 2})`}
      />
    </motion.svg>
  );
}
