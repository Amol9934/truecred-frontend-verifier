/**
 * CertificateDetails.jsx — Full certificate details card shown after authentic verification.
 *
 * Props:
 *   certificate : object — the full authentic result from the API/store
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  GraduationCap,
  Calendar,
  Building2,
  Hash,
  Star,
  Copy,
  Check,
  Link,
  FileText,
  QrCode,
  Download,
  Users,
} from 'lucide-react';

// ── Animation helpers ─────────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: 'easeOut' },
  },
};

// ── Sub-components ────────────────────────────────────────────────────────────

function DetailItem({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <motion.div
      variants={itemVariants}
      className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 hover:bg-[#E1F5EE]/60 transition-colors"
    >
      <div className="mt-0.5 w-8 h-8 rounded-lg bg-[#E1F5EE] flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-[#0F6E56]" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide leading-none mb-0.5">
          {label}
        </p>
        <p className="text-sm font-semibold text-gray-900 break-words leading-snug">{value}</p>
      </div>
    </motion.div>
  );
}

function CopyableHash({ label, hash, icon: Icon = Hash }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API may be unavailable in some environments
    }
  };

  const truncated = hash.length > 20 ? `${hash.slice(0, 10)}…${hash.slice(-10)}` : hash;

  return (
    <motion.div variants={itemVariants} className="flex flex-col gap-1">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </p>
      <div className="flex items-center gap-2 bg-gray-900 rounded-xl px-4 py-3">
        <code className="flex-1 text-xs font-mono text-green-400 truncate" title={hash}>
          {truncated}
        </code>
        <button
          onClick={handleCopy}
          aria-label={copied ? 'Copied!' : `Copy ${label}`}
          className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>
      <span className="sr-only">{hash}</span>
    </motion.div>
  );
}

function InstitutionAvatar({ name }) {
  const initials = name
    ? name
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join('')
    : '?';

  return (
    <div
      aria-hidden="true"
      className="w-14 h-14 rounded-2xl bg-[#0F6E56] flex items-center justify-center text-white text-xl font-bold shadow-md shrink-0 select-none"
    >
      {initials}
    </div>
  );
}

function DisabledDownloadButton() {
  const [showTip, setShowTip] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        disabled
        aria-disabled="true"
        aria-describedby="pdf-tooltip"
        onMouseEnter={() => setShowTip(true)}
        onMouseLeave={() => setShowTip(false)}
        onFocus={() => setShowTip(true)}
        onBlur={() => setShowTip(false)}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-400 bg-gray-50 cursor-not-allowed select-none"
      >
        <Download className="w-4 h-4" />
        Download Verification Report
      </button>
      {showTip && (
        <div
          role="tooltip"
          id="pdf-tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-medium whitespace-nowrap shadow-lg z-10 pointer-events-none"
        >
          PDF export coming soon
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function CertificateDetails({ certificate }) {
  if (!certificate) return null;

  const {
    studentName,
    degree,
    issueDate,
    institution,
    rollNumber,
    grade,
    digitalFingerprint,
    blockchainTxHash,
    signatories,
    certId,
    verificationTimestamp,
  } = certificate;

  const formattedIssueDate = issueDate
    ? new Date(issueDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  const formattedVerifiedAt = verificationTimestamp
    ? new Date(verificationTimestamp).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut', delay: 0.15 }}
      className="w-full bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden"
    >
      {/* Card header */}
      <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-[#E1F5EE]/70 to-white">
        <div className="flex items-center gap-4">
          <InstitutionAvatar name={institution} />
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-gray-900 leading-tight truncate">
              {institution || 'Institution'}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              Certificate ID:{' '}
              <span className="font-mono font-semibold text-[#0F6E56]">{certId}</span>
            </p>
            {formattedVerifiedAt && (
              <p className="text-xs text-gray-400 mt-0.5">Verified: {formattedVerifiedAt}</p>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Details grid */}
        <section aria-labelledby="cert-details-heading">
          <h4
            id="cert-details-heading"
            className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"
          >
            <FileText className="w-3.5 h-3.5" />
            Certificate Details
          </h4>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            <DetailItem icon={User} label="Student Name" value={studentName} />
            <DetailItem icon={GraduationCap} label="Degree / Programme" value={degree} />
            <DetailItem icon={Calendar} label="Issue Date" value={formattedIssueDate} />
            <DetailItem icon={Building2} label="Institution" value={institution} />
            <DetailItem icon={Hash} label="Roll Number" value={rollNumber} />
            <DetailItem icon={Star} label="Grade" value={grade} />
          </motion.div>
        </section>

        {/* Digital fingerprint */}
        {digitalFingerprint && (
          <motion.section
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            aria-labelledby="fingerprint-heading"
            className="space-y-2"
          >
            <h4
              id="fingerprint-heading"
              className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2"
            >
              <Hash className="w-3.5 h-3.5" />
              Digital Fingerprint
            </h4>
            <CopyableHash label="SHA-256 Hash" hash={digitalFingerprint} icon={Hash} />
          </motion.section>
        )}

        {/* Blockchain transaction */}
        {blockchainTxHash && (
          <motion.section
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            aria-labelledby="tx-heading"
            className="space-y-2"
          >
            <h4
              id="tx-heading"
              className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2"
            >
              <Link className="w-3.5 h-3.5" />
              Blockchain Transaction
            </h4>
            <CopyableHash label="Tx Hash" hash={blockchainTxHash} icon={Link} />
          </motion.section>
        )}

        {/* Signatories */}
        {signatories && signatories.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.28 }}
            aria-labelledby="signatories-heading"
          >
            <h4
              id="signatories-heading"
              className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"
            >
              <Users className="w-3.5 h-3.5" />
              Signatories
            </h4>
            <ul className="space-y-2">
              {signatories.map((sig, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gray-50 text-sm text-gray-700 font-medium"
                >
                  <div className="w-6 h-6 rounded-full bg-[#0F6E56] flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {i + 1}
                  </div>
                  {sig}
                </li>
              ))}
            </ul>
          </motion.section>
        )}

        {/* QR Code placeholder */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.28 }}
          aria-label="QR Code placeholder"
        >
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <QrCode className="w-3.5 h-3.5" />
            QR Code
          </h4>
          <div className="flex items-center justify-center w-full h-36 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50">
            <div className="text-center">
              <QrCode className="w-10 h-10 text-gray-300 mx-auto mb-2" aria-hidden="true" />
              <p className="text-xs text-gray-400 font-medium">QR Code</p>
              <p className="text-xs text-gray-300 mt-0.5">Generation coming soon</p>
            </div>
          </div>
        </motion.section>

        {/* Download button */}
        <div className="pt-2 border-t border-gray-100">
          <DisabledDownloadButton />
        </div>
      </div>
    </motion.div>
  );
}
