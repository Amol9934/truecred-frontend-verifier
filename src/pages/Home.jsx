/**
 * Home.jsx — TrueCred homepage.
 *
 * Sections:
 *  1. Hero with VerifyInput
 *  2. How It Works (3-step cards)
 *  3. Institution Partners
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QrCode, Shield, CheckCircle, ShieldCheck, Building2, ArrowRight } from 'lucide-react';
import VerifyInput from '../components/verify/VerifyInput.jsx';
import useVerifyStore from '../store/verifyStore.js';

// ── Animation variants ────────────────────────────────────────────────────────

const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

// ── Trust Indicators data ─────────────────────────────────────────────────────

const TRUST_INDICATORS = [
  { value: '1,247+', label: 'Certificates Verified' },
  { value: '48',     label: 'Partner Institutions' },
  { value: '99.9%',  label: 'Accuracy Rate' },
];

// ── How It Works data ─────────────────────────────────────────────────────────

const HOW_STEPS = [
  {
    num: '01',
    Icon: QrCode,
    heading: 'Enter or Scan',
    desc:
      'Enter the certificate ID manually or scan the QR code embedded in the physical or digital certificate.',
  },
  {
    num: '02',
    Icon: Shield,
    heading: 'Cryptographic Check',
    desc:
      'Our backend verifies the cryptographic hash and threshold signature across distributed nodes to ensure authenticity.',
  },
  {
    num: '03',
    Icon: CheckCircle,
    heading: 'Instant Result',
    desc:
      'Receive an authenticated or forged status in seconds, complete with full certificate details and blockchain proof.',
  },
];

// ── Institution Partners data ─────────────────────────────────────────────────

const INSTITUTIONS = [
  { initials: 'IIT D',  name: 'IIT Delhi',       color: '#1B3A5C' },
  { initials: 'IIT B',  name: 'IIT Bombay',      color: '#0F6E56' },
  { initials: 'IIT M',  name: 'IIT Madras',      color: '#166534' },
  { initials: 'IIM A',  name: 'IIM Ahmedabad',   color: '#991B1B' },
  { initials: 'BITS',   name: 'BITS Pilani',     color: '#92400E' },
  { initials: 'NIT T',  name: 'NIT Trichy',      color: '#5B21B6' },
];

// ── Hero Section ─────────────────────────────────────────────────────────────

function HeroSection({ onVerify, loading }) {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0F6E56 0%, #1B3A5C 100%)',
      }}
      aria-label="Hero: Certificate Verification"
    >
      {/* Decorative blobs */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-10 bg-white" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full opacity-10 bg-white" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-5 bg-white" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 flex flex-col items-center text-center gap-8">
        {/* Eyebrow badge */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs font-semibold tracking-wide backdrop-blur-sm">
            <ShieldCheck className="w-3.5 h-3.5" />
            Cryptographically Secure Verification
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight"
        >
          Verify Any Academic Certificate{' '}
          <span className="text-[#1D9E75]">in Seconds</span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg sm:text-xl text-white/75 max-w-2xl leading-relaxed"
        >
          Powered by cryptographic hash verification + threshold cryptography.
          Instant, tamper-proof, and trusted by leading institutions.
        </motion.p>

        {/* Verify Input */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full max-w-xl"
        >
          <VerifyInput onVerify={onVerify} loading={loading} />
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="flex flex-wrap justify-center gap-8"
        >
          {TRUST_INDICATORS.map(({ value, label }) => (
            <motion.div
              key={label}
              variants={fadeUp}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center"
            >
              <span className="text-2xl font-extrabold text-white">{value}</span>
              <span className="text-xs text-white/60 font-medium mt-0.5">{label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── How It Works Section ──────────────────────────────────────────────────────

function HowItWorksSection() {
  return (
    <section className="py-20 bg-[#F9FAFB]" aria-labelledby="how-it-works-heading">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-sm font-semibold text-[#1D9E75] uppercase tracking-widest mb-2">
            Simple Process
          </p>
          <h2
            id="how-it-works-heading"
            className="text-3xl sm:text-4xl font-extrabold text-[#111827]"
          >
            How It Works
          </h2>
        </motion.div>

        {/* Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {HOW_STEPS.map(({ num, Icon, heading, desc }) => (
            <motion.div
              key={num}
              variants={fadeUp}
              transition={{ duration: 0.4 }}
              className="relative bg-white rounded-2xl border border-gray-200 shadow-sm p-7 flex flex-col gap-4 hover:shadow-md transition-shadow group"
            >
              {/* Step number */}
              <span className="text-5xl font-black text-gray-100 absolute top-5 right-6 select-none group-hover:text-[#E1F5EE] transition-colors">
                {num}
              </span>

              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-[#E1F5EE] flex items-center justify-center shadow-sm">
                <Icon className="w-6 h-6 text-[#0F6E56]" />
              </div>

              {/* Text */}
              <div>
                <h3 className="text-lg font-bold text-[#111827] mb-2">{heading}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── Institution Partners Section ──────────────────────────────────────────────

function InstitutionPartnersSection() {
  const navigate = useNavigate();

  return (
    <section
      className="py-20 bg-white border-t border-gray-100"
      aria-labelledby="partners-heading"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Heading */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-sm font-semibold text-[#1D9E75] uppercase tracking-widest mb-2">
            Partner Network
          </p>
          <h2
            id="partners-heading"
            className="text-3xl sm:text-4xl font-extrabold text-[#111827]"
          >
            Trusted by Leading Institutions
          </h2>
        </motion.div>

        {/* Logos grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="grid grid-cols-3 sm:grid-cols-6 gap-6 mb-12"
        >
          {INSTITUTIONS.map(({ initials, name, color }) => (
            <motion.div
              key={name}
              variants={fadeIn}
              transition={{ duration: 0.4 }}
              title={name}
              className="flex flex-col items-center gap-2 group"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center shadow-md text-white text-xs font-extrabold tracking-tight transition-transform group-hover:scale-105"
                style={{ backgroundColor: color }}
                aria-label={name}
              >
                {initials}
              </div>
              <span className="text-[11px] text-gray-500 font-medium leading-tight text-center">
                {name}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <p className="text-sm text-[#6B7280]">
            Is your institution not listed?
          </p>
          <button
            type="button"
            onClick={() => navigate('/employer/login')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F6E56] hover:text-[#1D9E75] transition-colors"
          >
            Register Now
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

// ── Page Component ────────────────────────────────────────────────────────────

export default function Home() {
  const navigate    = useNavigate();
  const verifyCert  = useVerifyStore((s) => s.verifyCert);
  const loading     = useVerifyStore((s) => s.loading);

  const handleVerify = async (certId) => {
    await verifyCert(certId);
    navigate(`/result/${encodeURIComponent(certId)}`);
  };

  return (
    <>
      <Helmet>
        <title>TrueCred — Verify Academic Certificates | Cryptographically Secure</title>
        <meta
          name="description"
          content="Instantly verify academic certificates using cryptographic hash verification and threshold cryptography. Trusted by 48+ institutions across India."
        />
      </Helmet>

      <main>
        <HeroSection onVerify={handleVerify} loading={loading} />
        <HowItWorksSection />
        <InstitutionPartnersSection />
      </main>
    </>
  );
}
