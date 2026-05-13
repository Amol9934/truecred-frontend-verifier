/**
 * ForgedBanner.jsx — Full-width danger banner shown when a certificate fails verification.
 *
 * Props:
 *   reason   : string — the reason the certificate failed (e.g. "Hash mismatch detected")
 *   certId   : string — the certificate ID that was checked
 *   reportId : string — pre-assigned report ID from the API
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XCircle, AlertTriangle, X, Send, Loader2 } from 'lucide-react';

export default function ForgedBanner({ reason, certId, reportId }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!formName.trim()) return;
    setSubmitting(true);
    // Simulate async submission
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitting(false);
    setSubmitted(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    // Reset form after close animation
    setTimeout(() => {
      setSubmitted(false);
      setFormName('');
      setFormNotes('');
    }, 300);
  };

  return (
    <>
      {/* ── Main danger banner ── */}
      <motion.div
        role="alert"
        aria-live="assertive"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full rounded-2xl overflow-hidden"
        style={{
          background: '#FEF2F2',
          borderLeft: '4px solid #991B1B',
        }}
      >
        <div className="px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Animated X icon */}
          <motion.div
            initial={{ scale: 0, rotate: 20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: 'spring',
              stiffness: 350,
              damping: 20,
              delay: 0.08,
            }}
            className="shrink-0"
            aria-hidden="true"
          >
            <div className="w-14 h-14 rounded-full bg-[#991B1B] flex items-center justify-center shadow-md">
              <XCircle className="w-8 h-8 text-white" strokeWidth={2.5} />
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
              <h2 className="text-xl font-bold text-[#991B1B] leading-tight">
                Verification Failed — Certificate Not Authentic
              </h2>
              {/* INVALID badge */}
              <span
                aria-label="Status: Invalid"
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-widest bg-[#991B1B] text-white uppercase shadow-sm"
              >
                INVALID
              </span>
            </div>

            {/* Reason */}
            {reason && (
              <p className="text-sm font-semibold text-[#991B1B] mt-1">
                Reason:{' '}
                <span className="font-medium">{reason}</span>
              </p>
            )}

            {/* Warning */}
            <div className="mt-2 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-[#991B1B] shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm text-[#991B1B]/85 leading-relaxed">
                Do not accept this document. Report to your institution.
              </p>
            </div>

            {/* Meta info */}
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-[#991B1B]/65 font-medium">
              {certId && (
                <span>
                  ID:{' '}
                  <span className="font-mono font-semibold text-[#991B1B]">{certId}</span>
                </span>
              )}
              {reportId && (
                <span>
                  Report ID:{' '}
                  <span className="font-mono font-semibold">{reportId}</span>
                </span>
              )}
            </div>

            {/* Report button */}
            <div className="mt-4">
              <button
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#991B1B] hover:bg-[#7f1d1d] active:bg-[#6b0f0f] text-white text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#991B1B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FEF2F2] shadow-sm"
              >
                <AlertTriangle className="w-4 h-4" />
                Report Forgery
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ── Report Forgery modal ── */}
      <AnimatePresence>
        {modalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              onClick={handleClose}
              aria-hidden="true"
            />

            {/* Modal panel */}
            <motion.div
              key="modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="report-modal-title"
              initial={{ opacity: 0, scale: 0.93, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 20 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-[#991B1B]" aria-hidden="true" />
                  <h3
                    id="report-modal-title"
                    className="text-base font-bold text-gray-900"
                  >
                    Report Certificate Forgery
                  </h3>
                </div>
                <button
                  onClick={handleClose}
                  aria-label="Close report dialog"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal body */}
              <div className="px-6 py-5">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-4"
                  >
                    <div className="w-14 h-14 rounded-full bg-[#166534]/10 flex items-center justify-center mx-auto mb-3">
                      <Send className="w-7 h-7 text-[#166534]" />
                    </div>
                    <h4 className="text-base font-bold text-gray-900 mb-1">
                      Report Submitted
                    </h4>
                    <p className="text-sm text-gray-600">
                      Thank you. Our team will review the report and follow up with your institution.
                    </p>
                    {reportId && (
                      <p className="mt-3 text-xs text-gray-500">
                        Reference:{' '}
                        <span className="font-mono font-semibold text-gray-700">
                          {reportId}
                        </span>
                      </p>
                    )}
                    <button
                      onClick={handleClose}
                      className="mt-5 px-6 py-2.5 rounded-lg bg-[#166534] text-white text-sm font-semibold hover:bg-[#14532d] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#166534] focus-visible:ring-offset-2"
                    >
                      Close
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleReportSubmit} noValidate>
                    {/* Context info */}
                    <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-xs text-[#991B1B]">
                      Reporting certificate{' '}
                      <span className="font-mono font-semibold">{certId || '—'}</span>
                      {reason && (
                        <>
                          {' '}for: <span className="font-semibold">{reason}</span>
                        </>
                      )}
                    </div>

                    {/* Name field */}
                    <div className="mb-4">
                      <label
                        htmlFor="report-name"
                        className="block text-sm font-semibold text-gray-700 mb-1.5"
                      >
                        Your Name <span aria-hidden="true" className="text-red-500">*</span>
                      </label>
                      <input
                        id="report-name"
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Full name"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#991B1B] focus:border-transparent transition-colors"
                      />
                    </div>

                    {/* Notes field */}
                    <div className="mb-6">
                      <label
                        htmlFor="report-notes"
                        className="block text-sm font-semibold text-gray-700 mb-1.5"
                      >
                        Additional Notes
                      </label>
                      <textarea
                        id="report-notes"
                        rows={3}
                        value={formNotes}
                        onChange={(e) => setFormNotes(e.target.value)}
                        placeholder="Describe where you obtained this certificate and any other relevant details…"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#991B1B] focus:border-transparent transition-colors"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={handleClose}
                        className="flex-1 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting || !formName.trim()}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#991B1B] hover:bg-[#7f1d1d] text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[#991B1B] focus-visible:ring-offset-2"
                        aria-busy={submitting}
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Submitting…
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Submit Report
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
