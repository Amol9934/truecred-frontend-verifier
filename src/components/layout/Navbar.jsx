import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Menu, X, ChevronRight } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'How It Works', to: '/how-it-works' },
  { label: 'For Institutions', to: '/employer/login' },
  { label: 'API Docs', to: '/api-docs' },
];

export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Add shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname.startsWith(to);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 h-[60px]"
        style={{
          background: '#0F6E56',
          boxShadow: scrolled
            ? '0 2px 12px rgba(0,0,0,0.18)'
            : '0 1px 4px rgba(0,0,0,0.10)',
        }}
        aria-label="Primary navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* ── Logo ── */}
          <Link
            to="/"
            className="flex items-center gap-2.5 flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F6E56] rounded"
            aria-label="TrueCred home"
          >
            <div
              className="flex items-center justify-center w-8 h-8 rounded-md"
              style={{ background: 'rgba(255,255,255,0.15)' }}
            >
              <Shield size={18} className="text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-none">
              <span
                className="text-white font-bold tracking-wider text-[15px]"
                style={{ letterSpacing: '0.12em' }}
              >
                TRUECRED
              </span>
              <span className="text-white/60 text-[9px] font-medium tracking-widest uppercase mt-0.5">
                Verify Certificates
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={[
                  'relative px-3.5 py-1.5 text-sm font-medium rounded transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70',
                  isActive(link.to)
                    ? 'text-white'
                    : 'text-white/75 hover:text-white hover:bg-white/10',
                ].join(' ')}
              >
                {link.label}
                {isActive(link.to) && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-white"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
              </Link>
            ))}

            {/* Verify Now CTA */}
            <Link
              to="/verify"
              className="ml-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              style={{
                background: '#1D9E75',
                color: '#fff',
                boxShadow: '0 1px 6px rgba(29,158,117,0.35)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#16B87F';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(29,158,117,0.50)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#1D9E75';
                e.currentTarget.style.boxShadow = '0 1px 6px rgba(29,158,117,0.35)';
              }}
            >
              Verify Now
              <ChevronRight size={14} strokeWidth={2.5} />
            </Link>

            {/* Login */}
            <Link
              to="/login"
              className="ml-1.5 inline-flex items-center px-4 py-1.5 rounded-md text-sm font-medium border transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              style={{ borderColor: 'rgba(255,255,255,0.35)', color: '#fff' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              Login
            </Link>
          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <AnimatePresence mode="wait" initial={false}>
              {menuOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <X size={20} />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <Menu size={20} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* ── Mobile Dropdown ── */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="md:hidden overflow-hidden"
              style={{
                background: '#0B5C47',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              }}
            >
              <motion.div
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -8, opacity: 0 }}
                transition={{ duration: 0.2, delay: 0.05 }}
                className="px-4 py-3 flex flex-col gap-1"
              >
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ x: -12, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.04 * i, duration: 0.2 }}
                  >
                    <Link
                      to={link.to}
                      className={[
                        'flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-150',
                        isActive(link.to)
                          ? 'bg-white/15 text-white'
                          : 'text-white/75 hover:text-white hover:bg-white/10',
                      ].join(' ')}
                    >
                      {isActive(link.to) && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1D9E75] mr-2.5 flex-shrink-0" />
                      )}
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                <div className="mt-2 pt-2 border-t border-white/10 flex flex-col gap-2">
                  <Link
                    to="/verify"
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-semibold text-white"
                    style={{ background: '#1D9E75' }}
                  >
                    Verify Now
                    <ChevronRight size={14} strokeWidth={2.5} />
                  </Link>
                  <Link
                    to="/login"
                    className="flex items-center justify-center px-4 py-2.5 rounded-md text-sm font-medium text-white border"
                    style={{ borderColor: 'rgba(255,255,255,0.3)' }}
                  >
                    Login
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
