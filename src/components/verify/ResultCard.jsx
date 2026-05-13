/**
 * ResultCard.jsx — Wrapper component that renders the correct result UI based on status.
 *
 * Delegates to:
 *   AuthenticBanner + CertificateDetails  (status === 'authentic')
 *   ForgedBanner                          (status === 'forged')
 *   Pending section                       (status === 'pending')
 *
 * Props:
 *   result : object — the full result object from the verify store
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RotateCcw, Clock, Mail, AlertTriangle } from 'lucide-react';
import AuthenticBanner from './AuthenticBanner.jsx';
import ForgedBanner from './ForgedBanner.jsx';
import CertificateDetails from './CertificateDetails.jsx';

// ── Pending status section ────────────────────────────────────────────────────

function PendingSection({ result }) {
  const { message, contactEmail, estimatedTime, certId } = result;

  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full rounded-2xl overflow-hidden"
      style={{
        background: '#FFFBEB',
        borderLeft: '4px solid #92400E',
      }}
    >
      <div className="px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 350, damping: 22, delay: 0.1 }}
          className="shrink-0"
          aria-hidden="true"
        >
          <div className="w-14 h-14 rounded-full bg-[#92400E] flex items-center justify-center shadow-md">
            <Clock className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.18, duration: 0.28 }}
          className="flex-1 min-w-0"
        >
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <h2 className="text-xl font-bold text-[#92400E] leading-tight">
              {message || 'Verification Pending — Manual Review Required'}
            </h2>
            <span
              aria-label="Status: Pending"
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-widest bg-[#92400E] text-white uppercase shadow-sm"
            >
              PENDING
            </span>
          </div>

          <p className="text-sm text-[#92400E]/85 leading-relaxed mt-1">
            This certificate requires manual review by our team. You will be notified once
            verification is complete.
          </p>

          {/* Meta details */}
          <div className="mt-3 flex flex-col gap-1.5">
            {estimatedTime && (
              <div className="flex items-center gap-2 text-sm text-[#92400E]/80">
                <Clock className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>
                  Estimated review time:{' '}
                  <span className="font-semibold">{estimatedTime}</span>
                </span>
              </div>
            )}
            {contactEmail && (
              <div className="flex items-center gap-2 text-sm text-[#92400E]/80">
                <Mail className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>
                  Contact:{' '}
                  <a
                    href={`mailto:${contactEmail}`}
                    className="font-semibold underline hover:text-[#92400E] transition-colors"
                  >
                    {contactEmail}
                  </a>
                </span>
              </div>
            )}
            {certId && (
              <p className="text-xs text-[#92400E]/65 font-medium mt-0.5">
                Certificate ID:{' '}
                <span className="font-mono font-semibold text-[#92400E]">{certId}</span>
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ── Unknown / error fallback ──────────────────────────────────────────────────

function UnknownResult({ result }) {
  return (
    <div
      role="alert"
      className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-6 py-5 flex items-start gap-3"
    >
      <AlertTriangle className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" aria-hidden="true" />
      <div>
        <p className="text-sm font-semibold text-gray-700">Unknown verification status</p>
        <p className="text-xs text-gray-500 mt-0.5">
          Status received: <span className="font-mono">{result?.status ?? 'none'}</span>
        </p>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ResultCard({ result }) {
  const navigate = useNavigate();

  if (!result) return null;

  const { status } = result;

  return (
    <div className="w-full space-y-5">
      {/* Status-specific content */}
      {status === 'authentic' && (
        <>
          <AuthenticBanner
            certId={result.certId}
            verifiedAt={result.verificationTimestamp}
          />
          <CertificateDetails certificate={result} />
        </>
      )}

      {status === 'forged' && (
        <ForgedBanner
          reason={result.reason}
          certId={result.certId}
          reportId={result.reportId}
        />
      )}

      {status === 'pending' && <PendingSection result={result} />}

      {status !== 'authentic' && status !== 'forged' && status !== 'pending' && (
        <UnknownResult result={result} />
      )}

      {/* Verify another certificate */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
        className="flex justify-center pt-2"
      >
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#0F6E56] text-[#0F6E56] text-sm font-semibold hover:bg-[#E1F5EE] active:bg-[#c8eddf] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F6E56] focus-visible:ring-offset-2"
        >
          <RotateCcw className="w-4 h-4" />
          Verify Another Certificate
        </button>
      </motion.div>
    </div>
  );
}
