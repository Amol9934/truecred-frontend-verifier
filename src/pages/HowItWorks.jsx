/**
 * HowItWorks.jsx — Dedicated How TrueCred Works page.
 *
 * Sections:
 *  1. Hero
 *  2. Step-by-step (expanded)
 *  3. Technology cards
 *  4. FAQ accordion
 *  5. CTA
 */

import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  QrCode,
  Shield,
  CheckCircle,
  Hash,
  Network,
  Link2,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';

// ── Data ──────────────────────────────────────────────────────────────────────

const STEPS = [
  {
    num: '01',
    Icon: QrCode,
    heading: 'Enter or Scan the Certificate',
    shortDesc: 'Enter the certificate ID or scan the embedded QR code.',
    detail:
      'Every TrueCred-issued certificate contains a unique identifier that can be entered manually or scanned via our built-in QR reader. The QR code encodes the certificate ID and links directly to its verification record. Students can find this ID printed on their physical certificate or in their digital document.',
  },
  {
    num: '02',
    Icon: Shield,
    heading: 'Cryptographic Hash Verification',
    shortDesc: 'Backend verifies hash + threshold signature across nodes.',
    detail:
      'Once the certificate ID is submitted, TrueCred queries its distributed ledger. The system computes a SHA-256 hash of the certificate data and compares it against the hash stored at issuance. Threshold cryptography requires a quorum of signing nodes to validate the signature, making single-point forgery mathematically infeasible.',
  },
  {
    num: '03',
    Icon: CheckCircle,
    heading: 'Instant Verification Result',
    shortDesc: 'Get authenticated/forged status with full certificate details.',
    detail:
      'Results are delivered within seconds. An Authentic status includes the student\'s name, degree, institution, issue date, grade, signatory details, and a blockchain transaction hash. A Forged status provides the detection reason and a report ID. All results are logged for employer audit trails.',
  },
];

const TECH_CARDS = [
  {
    Icon: Hash,
    heading: 'Cryptographic Hashing',
    body:
      'Certificate data is serialised and passed through SHA-256 at the time of issuance. Any tampering—even a single character change—produces a completely different hash, making forgery immediately detectable.',
    color: '#0F6E56',
    bg: '#E1F5EE',
  },
  {
    Icon: Network,
    heading: 'Threshold Cryptography',
    body:
      'No single authority can forge or revoke a certificate alone. Using (t, n) threshold signatures, a quorum of t-out-of-n institutions must co-sign for a certificate to be valid. This eliminates insider threats and central points of failure.',
    color: '#1B3A5C',
    bg: '#EFF6FF',
  },
  {
    Icon: Link2,
    heading: 'Blockchain Anchoring',
    body:
      'Each certificate record is anchored to a public blockchain via a Merkle root. This provides an immutable, publicly auditable trail. Even if TrueCred servers go offline, the blockchain record persists indefinitely.',
    color: '#166534',
    bg: '#F0FDF4',
  },
];

const FAQS = [
  {
    q: 'How does certificate verification work?',
    a: 'When a certificate is issued, its data is hashed using SHA-256 and signed by multiple institutional nodes via threshold cryptography. The hash and signatures are anchored to the blockchain. During verification, TrueCred re-hashes the submitted data and compares it against the stored record. A match confirms authenticity; any discrepancy triggers a Forged flag.',
  },
  {
    q: 'What is threshold cryptography?',
    a: 'Threshold cryptography is a technique where a secret (in this case, the signing key) is distributed across multiple parties so that a minimum number (the threshold) must cooperate to produce a valid signature. TrueCred uses a (3-of-5) scheme: at least 3 of 5 institutional nodes must co-sign a certificate for it to be considered valid. This prevents any single compromised node from forging credentials.',
  },
  {
    q: 'Can I verify without an account?',
    a: 'Yes. Public certificate verification at truecred.in is completely free and requires no account. Simply enter the certificate ID or scan the QR code. Employer accounts unlock additional features such as bulk verification, verification history dashboards, and API access.',
  },
  {
    q: 'How accurate is the verification?',
    a: 'TrueCred achieves 99.9% accuracy because verification is purely mathematical — it either matches the hash and threshold signature, or it does not. The only edge cases are certificates currently under manual review (Pending status), which represent less than 0.1% of submissions.',
  },
  {
    q: 'What happens if verification fails?',
    a: 'A failed verification results in a Forged or Pending status. For Forged certificates, a report is automatically generated and flagged for investigation by our trust team. For Pending certificates, our team manually reviews the record within 24–48 hours and updates the status. You can contact verify@truecred.in for urgent queries.',
  },
];

// ── Animation variants ────────────────────────────────────────────────────────

const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

// ── FAQ Item ──────────────────────────────────────────────────────────────────

function FAQItem({ q, a, index }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      variants={fadeUp}
      transition={{ duration: 0.4 }}
      className="border border-gray-200 rounded-xl overflow-hidden bg-white"
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F6E56] focus-visible:ring-inset"
      >
        <span className="text-sm font-semibold text-[#111827]">
          <span className="text-[#0F6E56] font-bold mr-2">Q{index + 1}.</span>
          {q}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-[#6B7280]" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-sm text-[#6B7280] leading-relaxed border-t border-gray-100 pt-4">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Page Component ────────────────────────────────────────────────────────────

export default function HowItWorks() {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>How It Works — TrueCred Certificate Verification</title>
        <meta
          name="description"
          content="Learn how TrueCred verifies academic certificates using SHA-256 hashing, threshold cryptography, and blockchain anchoring."
        />
      </Helmet>

      <main>
        {/* ── Hero ── */}
        <section
          className="relative overflow-hidden py-20 sm:py-28"
          style={{ background: 'linear-gradient(135deg, #0F6E56 0%, #1B3A5C 100%)' }}
        >
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full opacity-10 bg-white" />
            <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full opacity-10 bg-white" />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-sm font-semibold text-[#1D9E75] uppercase tracking-widest mb-3"
            >
              Transparency &amp; Trust
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="text-4xl sm:text-5xl font-extrabold text-white mb-5"
            >
              How TrueCred Works
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="text-lg text-white/75 max-w-2xl mx-auto"
            >
              A transparent walkthrough of our cryptographic verification pipeline —
              from certificate issuance to instant result.
            </motion.p>
          </div>
        </section>

        {/* ── 3-Step Process (expanded) ── */}
        <section className="py-20 bg-[#F9FAFB]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="text-center mb-14"
            >
              <h2 className="text-3xl font-extrabold text-[#111827]">
                The Verification Process
              </h2>
            </motion.div>

            <div className="space-y-8">
              {STEPS.map(({ num, Icon, heading, shortDesc, detail }, i) => (
                <motion.div
                  key={num}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-60px' }}
                  variants={fadeUp}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7 flex flex-col sm:flex-row gap-6"
                >
                  {/* Step number + Icon */}
                  <div className="flex flex-row sm:flex-col items-center sm:items-center gap-4 sm:gap-3 sm:w-20 shrink-0">
                    <span className="text-4xl font-black text-gray-100 leading-none">{num}</span>
                    <div className="w-12 h-12 rounded-xl bg-[#E1F5EE] flex items-center justify-center shadow-sm">
                      <Icon className="w-6 h-6 text-[#0F6E56]" />
                    </div>
                  </div>
                  {/* Text */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#111827] mb-1">{heading}</h3>
                    <p className="text-sm font-medium text-[#0F6E56] mb-3">{shortDesc}</p>
                    <p className="text-sm text-[#6B7280] leading-relaxed">{detail}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Technology Section ── */}
        <section className="py-20 bg-white border-t border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="text-center mb-14"
            >
              <p className="text-sm font-semibold text-[#1D9E75] uppercase tracking-widest mb-2">
                Under the Hood
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827]">
                The Technology Behind TrueCred
              </h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {TECH_CARDS.map(({ Icon, heading, body, color, bg }) => (
                <motion.div
                  key={heading}
                  variants={fadeUp}
                  transition={{ duration: 0.4 }}
                  className="rounded-2xl border border-gray-200 p-7 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: bg }}
                  >
                    <Icon className="w-6 h-6" style={{ color }} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#111827] mb-2">{heading}</h3>
                    <p className="text-sm text-[#6B7280] leading-relaxed">{body}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── FAQ Section ── */}
        <section className="py-20 bg-[#F9FAFB] border-t border-gray-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <p className="text-sm font-semibold text-[#1D9E75] uppercase tracking-widest mb-2">
                Got Questions?
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827]">
                Frequently Asked Questions
              </h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
              className="space-y-3"
            >
              {FAQS.map((faq, i) => (
                <FAQItem key={i} q={faq.q} a={faq.a} index={i} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── CTA Section ── */}
        <section
          className="py-16 border-t border-gray-100"
          style={{ background: 'linear-gradient(135deg, #0F6E56 0%, #1B3A5C 100%)' }}
        >
          <div className="max-w-2xl mx-auto px-4 text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="space-y-5"
            >
              <h2 className="text-3xl font-extrabold text-white">Ready to verify?</h2>
              <p className="text-white/70">
                Verify any academic certificate right now — free, instant, and cryptographically
                secure.
              </p>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-[#0F6E56] font-bold text-base hover:bg-[#E1F5EE] active:bg-[#c3ead9] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 shadow-lg"
              >
                Verify a Certificate
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
