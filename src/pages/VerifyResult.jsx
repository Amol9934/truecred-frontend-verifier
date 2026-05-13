/**
 * VerifyResult.jsx — Certificate verification result page at /result/:certId.
 *
 * Reads certId from URL params, fetches (or reuses cached) result from
 * the Zustand store, then renders the appropriate ResultCard or error state.
 */

import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, AlertTriangle, ArrowLeft } from 'lucide-react';
import ResultCard from '../components/verify/ResultCard.jsx';
import useVerifyStore from '../store/verifyStore.js';

// ── Helpers ───────────────────────────────────────────────────────────────────

function statusLabel(status) {
  if (status === 'authentic') return 'Authentic Certificate';
  if (status === 'forged')    return 'Forged Certificate';
  if (status === 'pending')   return 'Verification Pending';
  return 'Verification Result';
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function SkeletonBanner() {
  return (
    <div className="space-y-5 animate-pulse" aria-busy="true" aria-label="Loading verification result">
      {/* Banner */}
      <div className="h-24 rounded-2xl bg-gray-200" />
      {/* Card body */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <div className="h-5 w-1/3 rounded bg-gray-200" />
        <div className="grid grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-3 w-1/2 rounded bg-gray-200" />
              <div className="h-4 w-3/4 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Error State ───────────────────────────────────────────────────────────────

function ErrorCard({ certId, message, onBack }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      role="alert"
      className="w-full rounded-2xl overflow-hidden"
      style={{ background: '#FEF2F2', borderLeft: '4px solid #991B1B' }}
    >
      <div className="px-6 py-6 flex flex-col sm:flex-row items-start gap-4">
        <div className="shrink-0 w-12 h-12 rounded-full bg-[#991B1B] flex items-center justify-center shadow-md">
          <AlertTriangle className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-[#991B1B] mb-1">Certificate Not Found</h2>
          {certId && (
            <p className="text-sm text-[#991B1B]/70 font-mono mb-2">
              Certificate ID: <span className="font-semibold">{certId}</span>
            </p>
          )}
          <p className="text-sm text-[#991B1B]/80 mb-4">
            {message ||
              'This certificate ID could not be found in the TrueCred registry. ' +
              'Please double-check the ID and try again.'}
          </p>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#991B1B] text-white text-sm font-semibold hover:bg-[#b91c1c] active:bg-[#7f1d1d] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#991B1B] focus-visible:ring-offset-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Verify
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Breadcrumb ────────────────────────────────────────────────────────────────

function Breadcrumb({ certId }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-1 text-xs text-[#6B7280]">
        <li>
          <Link
            to="/"
            className="hover:text-[#0F6E56] transition-colors font-medium"
          >
            Home
          </Link>
        </li>
        <li aria-hidden="true">
          <ChevronRight className="w-3 h-3" />
        </li>
        <li>
          <Link
            to="/"
            className="hover:text-[#0F6E56] transition-colors font-medium"
          >
            Verify
          </Link>
        </li>
        <li aria-hidden="true">
          <ChevronRight className="w-3 h-3" />
        </li>
        <li
          aria-current="page"
          className="font-semibold text-[#111827] truncate max-w-[140px]"
        >
          {certId}
        </li>
      </ol>
    </nav>
  );
}

// ── Page Component ────────────────────────────────────────────────────────────

export default function VerifyResult() {
  const { certId }  = useParams();
  const navigate    = useNavigate();

  const result      = useVerifyStore((s) => s.result);
  const loading     = useVerifyStore((s) => s.loading);
  const error       = useVerifyStore((s) => s.error);
  const verifyCert  = useVerifyStore((s) => s.verifyCert);

  // Fetch on mount if stored result doesn't match current certId
  useEffect(() => {
    if (!certId) return;
    const decoded = decodeURIComponent(certId);
    if (!result || result.certId !== decoded) {
      verifyCert(decoded);
    }
  }, [certId]); // eslint-disable-line react-hooks/exhaustive-deps

  const decodedId = certId ? decodeURIComponent(certId) : '';

  // Dynamic SEO title
  const pageTitle = error
    ? `Certificate Not Found — TrueCred`
    : result
      ? `${statusLabel(result.status)} — ${decodedId} | TrueCred`
      : `Verifying ${decodedId} — TrueCred`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={`Verification result for certificate ${decodedId} on TrueCred.`}
        />
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-[60vh] bg-[#F9FAFB] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Breadcrumb certId={decodedId} />

          {loading ? (
            <SkeletonBanner />
          ) : error ? (
            <ErrorCard
              certId={decodedId}
              message={error}
              onBack={() => navigate('/')}
            />
          ) : result ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <ResultCard result={result} />
            </motion.div>
          ) : null}
        </div>
      </div>
    </>
  );
}
