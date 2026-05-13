/**
 * Badge.jsx — Status badge component for certificate verification results.
 *
 * Variants: 'authentic' | 'forged' | 'pending' | 'default'
 *
 * Color palette (TrueCred brand):
 *   Authentic → bg #E1F5EE  text #166534
 *   Forged    → bg red-100  text #991B1B
 *   Pending   → bg amber-100 text #92400E
 *   Default   → bg gray-100 text gray-700
 */

import React from 'react';

const VARIANT_STYLES = {
  authentic: {
    wrapper: 'border border-green-200',
    bg: '#E1F5EE',
    color: '#166534',
  },
  forged: {
    wrapper: 'border border-red-200 bg-red-100',
    bg: '#FEE2E2',   // Tailwind red-100
    color: '#991B1B',
  },
  pending: {
    wrapper: 'border border-amber-200 bg-amber-100',
    bg: '#FEF3C7',   // Tailwind amber-100
    color: '#92400E',
  },
  default: {
    wrapper: 'border border-gray-200 bg-gray-100',
    bg: '#F3F4F6',
    color: '#374151',
  },
};

const SIZE_CLASSES = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

/**
 * @param {{
 *   variant?: 'authentic'|'forged'|'pending'|'default',
 *   size?: 'sm'|'md'|'lg',
 *   children: React.ReactNode,
 *   className?: string,
 * }} props
 */
export default function Badge({
  variant = 'default',
  size = 'md',
  children,
  className = '',
  ...rest
}) {
  const style = VARIANT_STYLES[variant] ?? VARIANT_STYLES.default;
  const sizeClass = SIZE_CLASSES[size] ?? SIZE_CLASSES.md;

  return (
    <span
      style={{ backgroundColor: style.bg, color: style.color }}
      className={[
        'inline-flex items-center gap-1 rounded-full font-medium leading-none',
        style.wrapper,
        sizeClass,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </span>
  );
}
