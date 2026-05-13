import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield,
  Lock,
  CheckCircle,
  Mail,
  ExternalLink,
  Github,
} from 'lucide-react';

const QUICK_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'How It Works', to: '/how-it-works' },
  { label: 'API Docs', to: '/api-docs' },
  { label: 'For Institutions', to: '/employer/login' },
];

const EMPLOYER_LINKS = [
  { label: 'Login', to: '/employer/login' },
  { label: 'Bulk Verify', to: '/employer/bulk-verify' },
  { label: 'Dashboard', to: '/employer/dashboard' },
  { label: 'Pricing', to: '/pricing' },
];

const TRUST_BADGES = [
  {
    icon: Lock,
    title: '256-bit Encryption',
    desc: 'AES-256 end-to-end security',
  },
  {
    icon: Shield,
    title: 'Blockchain Secured',
    desc: 'Immutable record ledger',
  },
  {
    icon: CheckCircle,
    title: '99.9% Uptime',
    desc: 'Enterprise-grade reliability',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const colVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

export default function Footer() {
  return (
    <footer style={{ background: '#1B3A5C', color: '#fff' }} aria-label="Site footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        {/* ── Main grid ── */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-10 border-b"
          style={{ borderColor: 'rgba(255,255,255,0.1)' }}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {/* Column 1 – Brand */}
          <motion.div variants={colVariants} className="lg:col-span-1">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 mb-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded"
            >
              <div
                className="flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.12)' }}
              >
                <Shield size={20} className="text-white" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col leading-none">
                <span
                  className="text-white font-bold text-[14px]"
                  style={{ letterSpacing: '0.12em' }}
                >
                  TRUECRED
                </span>
                <span className="text-white/50 text-[9px] tracking-widest uppercase mt-0.5">
                  Verify Certificates
                </span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Cryptographically secure certificate verification powered by threshold
              cryptography. Trusted by institutions across India.
            </p>

            {/* Social / contact row */}
            <div className="mt-5 flex items-center gap-3">
              <a
                href="mailto:support@truecred.in"
                className="flex items-center justify-center w-8 h-8 rounded-md transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                style={{ background: 'rgba(255,255,255,0.08)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.16)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                aria-label="Email support"
              >
                <Mail size={15} className="text-white/70" />
              </a>
              <a
                href="https://github.com/truecred"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 rounded-md transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                style={{ background: 'rgba(255,255,255,0.08)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.16)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                aria-label="GitHub"
              >
                <Github size={15} className="text-white/70" />
              </a>
              <a
                href="/api-docs"
                className="flex items-center justify-center w-8 h-8 rounded-md transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                style={{ background: 'rgba(255,255,255,0.08)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.16)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                aria-label="API Docs"
              >
                <ExternalLink size={15} className="text-white/70" />
              </a>
            </div>
          </motion.div>

          {/* Column 2 – Quick Links */}
          <motion.div variants={colVariants}>
            <h3
              className="text-xs font-semibold uppercase tracking-widest mb-5"
              style={{ color: 'rgba(255,255,255,0.45)' }}
            >
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm transition-colors duration-150 hover:text-white focus:outline-none focus-visible:underline"
                    style={{ color: 'rgba(255,255,255,0.65)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3 – For Employers */}
          <motion.div variants={colVariants}>
            <h3
              className="text-xs font-semibold uppercase tracking-widest mb-5"
              style={{ color: 'rgba(255,255,255,0.45)' }}
            >
              For Employers
            </h3>
            <ul className="flex flex-col gap-2.5">
              {EMPLOYER_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm transition-colors duration-150 focus:outline-none focus-visible:underline"
                    style={{ color: 'rgba(255,255,255,0.65)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4 – Trust Indicators */}
          <motion.div variants={colVariants}>
            <h3
              className="text-xs font-semibold uppercase tracking-widest mb-5"
              style={{ color: 'rgba(255,255,255,0.45)' }}
            >
              Security & Trust
            </h3>
            <ul className="flex flex-col gap-4">
              {TRUST_BADGES.map(({ icon: Icon, title, desc }) => (
                <li key={title} className="flex items-start gap-3">
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-md flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(29,158,117,0.18)' }}
                  >
                    <Icon size={15} style={{ color: '#1D9E75' }} strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white leading-tight">{title}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      {desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* ── Bottom bar ── */}
        <motion.div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-xs text-center sm:text-left" style={{ color: 'rgba(255,255,255,0.4)' }}>
            &copy; 2025 TrueCred. &nbsp;
            <span style={{ color: 'rgba(255,255,255,0.55)' }}>SIH 2025</span>
            {' '}|{' '}
            <span style={{ color: 'rgba(255,255,255,0.55)' }}>Team ID: 67239</span>
            {'  '}. All rights reserved.
          </p>

          {/* Trust badge pills */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {[
              { icon: Lock, label: 'Encrypted' },
              { icon: Shield, label: 'Verified' },
              { icon: CheckCircle, label: 'Trusted' },
            ].map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium"
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  color: 'rgba(255,255,255,0.55)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <Icon size={10} strokeWidth={2} />
                {label}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
