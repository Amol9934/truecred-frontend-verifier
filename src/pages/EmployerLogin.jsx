/**
 * EmployerLogin.jsx — B2B employer login page.
 *
 * On successful login, navigates to /employer/dashboard.
 * Demo: any email + any password is accepted (mock API).
 */

import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Lock, Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import useVerifyStore from '../store/verifyStore.js';

// ── Form field component ──────────────────────────────────────────────────────

function InputField({ id, label, type, value, onChange, placeholder, autoComplete, icon: Icon, disabled, rightSlot }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold text-[#111827]">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 pointer-events-none w-4 h-4" />
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-300 text-sm text-[#111827] placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#0F6E56] focus:border-transparent hover:border-[#1D9E75] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        />
        {rightSlot && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</div>
        )}
      </div>
    </div>
  );
}

// ── Page Component ────────────────────────────────────────────────────────────

export default function EmployerLogin() {
  const navigate       = useNavigate();
  const loginEmployer  = useVerifyStore((s) => s.loginEmployer);

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await loginEmployer({ email: email.trim(), password });
      navigate('/employer/dashboard', { replace: true });
    } catch (err) {
      setError(err?.message ?? 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Employer Login — TrueCred</title>
        <meta
          name="description"
          content="Sign in to the TrueCred Employer Portal to verify certificates in bulk and access verification analytics."
        />
      </Helmet>

      {/* Full-page background */}
      <div
        className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12"
        style={{ background: 'linear-gradient(135deg, #0F6E56 0%, #1B3A5C 100%)' }}
      >
        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Card header */}
          <div className="px-8 pt-8 pb-6 text-center">
            {/* Logo */}
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#E1F5EE] mb-4 shadow-sm">
              <ShieldCheck className="w-8 h-8 text-[#0F6E56]" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#111827] mb-1">
              <span className="text-[#0F6E56]">True</span>Cred
            </h1>
            <p className="text-sm text-[#6B7280]">Employer Portal</p>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100 mx-6" />

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="px-8 py-7 space-y-5">
            <div>
              <h2 className="text-lg font-bold text-[#111827] mb-1">Sign In</h2>
              <p className="text-xs text-[#6B7280]">Access your verification dashboard</p>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
                role="alert"
              >
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Email */}
            <InputField
              id="employer-email"
              label="Work Email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(null); }}
              placeholder="you@company.com"
              autoComplete="email"
              icon={Mail}
              disabled={loading}
            />

            {/* Password */}
            <InputField
              id="employer-password"
              label="Password"
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(null); }}
              placeholder="Your password"
              autoComplete="current-password"
              icon={Lock}
              disabled={loading}
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                  className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            {/* Forgot password */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-xs text-[#0F6E56] hover:text-[#1D9E75] font-medium transition-colors focus:outline-none focus-visible:underline"
                onClick={() => {/* non-functional */ }}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#0F6E56] hover:bg-[#1D9E75] active:bg-[#0a5240] text-white font-semibold text-sm shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F6E56] focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing In&hellip;
                </>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Demo hint */}
            <div className="rounded-xl bg-[#E1F5EE] border border-[#1D9E75]/30 px-4 py-3 text-xs text-[#0F6E56]">
              <span className="font-semibold">Demo credentials:</span> any email + any password
            </div>
          </form>

          {/* Card footer */}
          <div className="px-8 pb-7 text-center space-y-2">
            <p className="text-xs text-[#6B7280]">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                className="text-[#0F6E56] font-semibold hover:text-[#1D9E75] transition-colors focus:outline-none focus-visible:underline"
                onClick={() => {/* non-functional */ }}
              >
                Register your institution
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
