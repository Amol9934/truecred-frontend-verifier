/**
 * VerifyInput.jsx — Two-tab certificate verification input.
 *
 * Tab 1: Manual Certificate ID entry
 * Tab 2: QR Code scanner
 *
 * Props:
 *   onVerify(certId: string) — called when the user submits a certificate ID
 *   loading: boolean          — shows spinner in the button while a verification is in flight
 */

import React, { useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  QrCode,
  Lock,
  Award,
  Building2,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import QRScanner from './QRScanner.jsx';

const TABS = [
  { id: 'manual', label: 'Enter Certificate ID', Icon: Search },
  { id: 'qr', label: 'Scan QR Code', Icon: QrCode },
];

const TRUST_INDICATORS = [
  { Icon: Lock, text: '256-bit Encrypted' },
  { Icon: Award, text: '1,247 Verified' },
  { Icon: Building2, text: '48 Institutions' },
];

export default function VerifyInput({ onVerify, loading }) {
  const [activeTab, setActiveTab] = useState('manual');
  const [certId, setCertId] = useState('');
  const [touched, setTouched] = useState(false);

  const inputId = useId();

  const isValid = certId.trim().length >= 3;
  const showError = touched && !isValid && certId.length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid || loading) return;
    onVerify(certId.trim());
  };

  const handleQRScan = (scannedId) => {
    setCertId(scannedId);
    setActiveTab('manual');
    onVerify(scannedId);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* ── Tab Switcher ── */}
      <div
        role="tablist"
        aria-label="Verification method"
        className="relative flex gap-1 bg-gray-100 rounded-2xl p-1 mb-6"
      >
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            role="tab"
            aria-selected={activeTab === id}
            aria-controls={`panel-${id}`}
            id={`tab-${id}`}
            onClick={() => setActiveTab(id)}
            className={`relative flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold z-10 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F6E56] focus-visible:ring-offset-1 ${
              activeTab === id ? 'text-[#0F6E56]' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {activeTab === id && (
              <motion.span
                layoutId="verify-tab-pill"
                className="absolute inset-0 bg-white rounded-xl shadow-sm"
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              />
            )}
            <Icon className="w-4 h-4 relative z-10" />
            <span className="relative z-10 hidden sm:inline">{label}</span>
            <span className="relative z-10 sm:hidden">
              {id === 'manual' ? 'Certificate ID' : 'Scan QR'}
            </span>
          </button>
        ))}
      </div>

      {/* ── Tab Panels ── */}
      <AnimatePresence mode="wait">
        {activeTab === 'manual' && (
          <motion.div
            key="manual"
            role="tabpanel"
            id="panel-manual"
            aria-labelledby="tab-manual"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
          >
            <form onSubmit={handleSubmit} noValidate>
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Input */}
                <div className="flex-1 relative">
                  <label htmlFor={inputId} className="sr-only">
                    Certificate ID
                  </label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <input
                      id={inputId}
                      type="text"
                      value={certId}
                      onChange={(e) => {
                        setCertId(e.target.value);
                        if (touched) setTouched(false);
                      }}
                      onBlur={() => setTouched(true)}
                      placeholder="e.g. TC-2024-IIT-0042"
                      autoComplete="off"
                      spellCheck={false}
                      aria-invalid={showError}
                      aria-describedby={showError ? `${inputId}-error` : undefined}
                      disabled={loading}
                      className={`w-full pl-11 pr-4 py-4 rounded-xl border text-base font-medium placeholder-gray-400 bg-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#0F6E56] disabled:opacity-60 disabled:cursor-not-allowed ${
                        showError
                          ? 'border-red-400 focus:ring-red-400'
                          : 'border-gray-300 hover:border-[#1D9E75]'
                      }`}
                    />
                  </div>
                  {showError && (
                    <p
                      id={`${inputId}-error`}
                      role="alert"
                      className="mt-1.5 text-xs text-red-600 font-medium"
                    >
                      Certificate ID must be at least 3 characters.
                    </p>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading || !isValid}
                  className="sm:w-auto w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#166534] hover:bg-[#14532d] active:bg-[#0f3d22] text-white font-semibold text-base shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#166534] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-busy={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Verifying…</span>
                    </>
                  ) : (
                    <>
                      <span>Verify Now</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              {/* Hint text */}
              <p className="mt-2 text-xs text-gray-500 px-1">
                Try: <span className="font-mono text-[#0F6E56]">TC-2024-IIT-0042</span> (authentic) ·{' '}
                <span className="font-mono text-red-600">FG-001</span> (forged) ·{' '}
                <span className="font-mono text-amber-700">PD-001</span> (pending)
              </p>
            </form>
          </motion.div>
        )}

        {activeTab === 'qr' && (
          <motion.div
            key="qr"
            role="tabpanel"
            id="panel-qr"
            aria-labelledby="tab-qr"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
          >
            <QRScanner onScan={handleQRScan} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Trust Indicators ── */}
      <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2">
        {TRUST_INDICATORS.map(({ Icon, text }) => (
          <div
            key={text}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-500"
          >
            <Icon className="w-3.5 h-3.5 text-[#0F6E56]" />
            <span>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
