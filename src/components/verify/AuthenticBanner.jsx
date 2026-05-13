/**
 * AuthenticBanner.jsx — Full-width success banner shown when a certificate is authentic.
 *
 * Props:
 *   certId     : string  — the verified certificate ID
 *   verifiedAt : string  — ISO timestamp of verification
 */

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export default function AuthenticBanner({ certId, verifiedAt }) {
  const formattedDate = verifiedAt
    ? new Date(verifiedAt).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : null;

  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full rounded-2xl overflow-hidden"
      style={{
        background: '#E1F5EE',
        borderLeft: '4px solid #166534',
      }}
    >
      <div className="px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Animated checkmark */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 350,
            damping: 20,
            delay: 0.1,
          }}
          className="shrink-0"
          aria-hidden="true"
        >
          <div className="w-14 h-14 rounded-full bg-[#166534] flex items-center justify-center shadow-md">
            <CheckCircle2 className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
        </motion.div>

        {/* Text content */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.18, duration: 0.28 }}
          className="flex-1 min-w-0"
        >
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <h2 className="text-xl font-bold text-[#166534] leading-tight">
              Certificate Verified — Authentic
            </h2>
            {/* VERIFIED badge */}
            <span
              aria-label="Status: Verified"
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-widest bg-[#166534] text-white uppercase shadow-sm"
            >
              VERIFIED
            </span>
          </div>

          <p className="text-sm text-[#166534]/90 leading-relaxed">
            This certificate has been cryptographically verified and is authentic.
          </p>

          {/* Meta info */}
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-[#166534]/75 font-medium">
            {certId && (
              <span>
                ID:{' '}
                <span className="font-mono font-semibold text-[#0F6E56]">{certId}</span>
              </span>
            )}
            {formattedDate && <span>Verified at {formattedDate}</span>}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
