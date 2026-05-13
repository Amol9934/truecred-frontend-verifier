/**
 * BulkVerify.jsx — Standalone bulk certificate verification page.
 *
 * Accessible without login (demo mode).
 * Uses BulkVerifyUpload + BulkResultTable + bulkVerifyCertificates API.
 */

import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Upload, FileText, Hash, Info } from 'lucide-react';
import BulkVerifyUpload from '../components/employer/BulkVerifyUpload.jsx';
import BulkResultTable from '../components/employer/BulkResultTable.jsx';
import { bulkVerifyCertificates } from '../api/verify.js';

// ── Animation ─────────────────────────────────────────────────────────────────

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

// ── Instructions data ─────────────────────────────────────────────────────────

const INSTRUCTIONS = [
  {
    Icon: FileText,
    heading: 'Prepare Your CSV',
    body: 'Create a plain .csv file with certificate IDs — one per line, or comma-separated. No headers required.',
  },
  {
    Icon: Upload,
    heading: 'Upload & Verify',
    body: 'Drag-and-drop or click to upload your CSV. TrueCred parses the IDs and verifies each one against the registry.',
  },
  {
    Icon: Hash,
    heading: 'Review Results',
    body: 'Each certificate is individually verified. Results show status, student name, and verification timestamp. Export as CSV.',
  },
];

// ── Page Component ────────────────────────────────────────────────────────────

export default function BulkVerify() {
  const [results, setResults]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  const handleSubmit = async (certIds) => {
    setError(null);
    setLoading(true);
    try {
      const data = await bulkVerifyCertificates(certIds);
      setResults(data);
    } catch (err) {
      setError(err?.message ?? 'Bulk verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Bulk Verify — TrueCred</title>
        <meta
          name="description"
          content="Verify multiple academic certificates at once by uploading a CSV file. Free and instant — no account required."
        />
      </Helmet>

      <main>
        {/* ── Hero ── */}
        <section
          className="relative overflow-hidden py-14 sm:py-20"
          style={{ background: 'linear-gradient(135deg, #0F6E56 0%, #1B3A5C 100%)' }}
        >
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full opacity-10 bg-white" />
            <div className="absolute -bottom-12 -right-12 w-56 h-56 rounded-full opacity-10 bg-white" />
          </div>
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-semibold tracking-wide mb-4">
                <Upload className="w-3.5 h-3.5" />
                CSV Upload Supported
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="text-4xl sm:text-5xl font-extrabold text-white mb-4"
            >
              Bulk Certificate Verification
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="text-lg text-white/70 max-w-xl mx-auto"
            >
              Upload a CSV of certificate IDs to verify hundreds of records simultaneously.
              No account required.
            </motion.p>
          </div>
        </section>

        {/* ── Main Content ── */}
        <section className="py-12 bg-[#F9FAFB]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

              {/* ── Left: Instructions + Upload ── */}
              <div className="lg:col-span-2 space-y-6">
                {/* How to format CSV */}
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={stagger}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5"
                >
                  <div className="flex items-center gap-2">
                    <Info className="w-5 h-5 text-[#0F6E56]" />
                    <h2 className="text-sm font-bold text-[#111827]">How to Format Your CSV</h2>
                  </div>
                  <div className="space-y-4">
                    {INSTRUCTIONS.map(({ Icon, heading, body }) => (
                      <motion.div
                        key={heading}
                        variants={fadeUp}
                        transition={{ duration: 0.35 }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#E1F5EE] flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4 text-[#0F6E56]" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#111827]">{heading}</p>
                          <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">{body}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Sample CSV */}
                  <div className="rounded-xl bg-gray-900 text-green-400 px-4 py-3 text-xs font-mono leading-relaxed">
                    <p className="text-gray-500 mb-1"># Sample CSV content</p>
                    <p>TC-2024-0001</p>
                    <p>TC-2024-0002</p>
                    <p>FG-2023-0874</p>
                    <p>PD-2024-0102, TC-2024-0993</p>
                  </div>
                </motion.div>

                {/* Upload Component */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
                >
                  <h2 className="text-sm font-bold text-[#111827] mb-4">Upload CSV File</h2>
                  <BulkVerifyUpload onSubmit={handleSubmit} />
                </motion.div>
              </div>

              {/* ── Right: Results Table ── */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.3 }}
                className="lg:col-span-3 bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
              >
                <h2 className="text-sm font-bold text-[#111827] mb-4">
                  Verification Results
                  {results.length > 0 && (
                    <span className="ml-2 text-xs text-[#6B7280] font-medium">
                      ({results.length} records)
                    </span>
                  )}
                </h2>

                {/* Error */}
                {error && (
                  <div
                    className="mb-4 flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
                    role="alert"
                  >
                    {error}
                  </div>
                )}

                <BulkResultTable results={results} loading={loading} />
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
