/**
 * Button.jsx — Reusable button component with variant + size support.
 *
 * Variants : 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
 * Sizes    : 'sm' | 'md' | 'lg'
 * Features : loading spinner, disabled state, Framer Motion tap animation
 *
 * Brand colours:
 *   Primary Teal  #0F6E56   hover #1D9E75
 *   Teal BG       #E1F5EE
 *   Danger Red    #991B1B
 *   Trust Blue    #1B3A5C
 */

import React from 'react';
import { motion } from 'framer-motion';
import Spinner from './Spinner';

// ─── Variant style maps ───────────────────────────────────────────────────────

const BASE =
  'inline-flex items-center justify-center gap-2 font-semibold rounded-lg ' +
  'transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 ' +
  'focus-visible:ring-offset-2 focus-visible:ring-[#0F6E56] disabled:opacity-50 ' +
  'disabled:pointer-events-none select-none';

const VARIANT_STYLES = {
  primary: {
    className:
      'text-white bg-[#0F6E56] hover:bg-[#1D9E75] active:bg-[#0a5240]',
    spinnerColor: '#ffffff',
  },
  secondary: {
    className:
      'text-[#0F6E56] bg-[#E1F5EE] hover:bg-[#c3ead9] active:bg-[#a8dfc8]',
    spinnerColor: '#0F6E56',
  },
  outline: {
    className:
      'text-[#0F6E56] bg-transparent border border-[#0F6E56] ' +
      'hover:bg-[#E1F5EE] active:bg-[#c3ead9]',
    spinnerColor: '#0F6E56',
  },
  danger: {
    className:
      'text-white bg-[#991B1B] hover:bg-[#b91c1c] active:bg-[#7f1d1d]',
    spinnerColor: '#ffffff',
  },
  ghost: {
    className:
      'text-[#1B3A5C] bg-transparent hover:bg-gray-100 active:bg-gray-200',
    spinnerColor: '#1B3A5C',
  },
};

const SIZE_STYLES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

const SPINNER_SIZE = {
  sm: 'sm',
  md: 'sm',
  lg: 'md',
};

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * @param {{
 *   variant?: 'primary'|'secondary'|'outline'|'danger'|'ghost',
 *   size?: 'sm'|'md'|'lg',
 *   loading?: boolean,
 *   disabled?: boolean,
 *   children: React.ReactNode,
 *   className?: string,
 *   type?: string,
 *   onClick?: React.MouseEventHandler<HTMLButtonElement>,
 * }} props
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  children,
  className = '',
  type = 'button',
  ...rest
}) {
  const variantStyle = VARIANT_STYLES[variant] ?? VARIANT_STYLES.primary;
  const sizeStyle    = SIZE_STYLES[size] ?? SIZE_STYLES.md;
  const spinnerSize  = SPINNER_SIZE[size] ?? 'sm';

  const isDisabled = disabled || loading;

  return (
    <motion.button
      type={type}
      disabled={isDisabled}
      whileTap={isDisabled ? {} : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={[BASE, variantStyle.className, sizeStyle, className]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {loading && (
        <Spinner
          size={spinnerSize}
          color={variantStyle.spinnerColor}
          className="shrink-0"
        />
      )}
      {children}
    </motion.button>
  );
}
