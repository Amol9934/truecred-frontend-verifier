/**
 * EmployerStats.jsx — Animated stats dashboard cards for the employer portal.
 *
 * Props:
 *   stats   : { totalVerifications, thisMonth, authentic, forged, pending }
 *   loading : boolean
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, ShieldCheck, ShieldAlert } from 'lucide-react';

// ── Animated counter hook ─────────────────────────────────────────────────────

function useCountUp(target, duration = 1200, enabled = true) {
  const [count, setCount] = useState(0);
  const rafRef            = useRef(null);
  const startRef          = useRef(null);

  useEffect(() => {
    if (!enabled || target === 0) {
      setCount(target);
      return;
    }

    startRef.current = null;

    const animate = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed  = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration, enabled]);

  return count;
}

// ── Skeleton Card ─────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4 overflow-hidden relative">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl bg-gray-200 animate-pulse" />
        <div className="w-16 h-4 rounded bg-gray-200 animate-pulse" />
      </div>
      <div className="space-y-2">
        <div className="w-24 h-8 rounded bg-gray-200 animate-pulse" />
        <div className="w-32 h-3 rounded bg-gray-200 animate-pulse" />
      </div>
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, subtitle, accent, trend, index }) {
  const animated = useCountUp(value, 1000 + index * 150);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col gap-4 hover:shadow-md transition-shadow"
    >
      {/* Top row: icon + trend */}
      <div className="flex items-center justify-between">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm"
          style={{ backgroundColor: accent.bg }}
        >
          <Icon className="w-5 h-5" style={{ color: accent.icon }} />
        </div>
        {trend && (
          <span
            className="text-xs font-semibold px-2 py-1 rounded-full"
            style={{ backgroundColor: accent.bg, color: accent.icon }}
          >
            {trend}
          </span>
        )}
      </div>

      {/* Main number */}
      <div>
        <p
          className="text-3xl font-extrabold tabular-nums leading-none"
          style={{ color: accent.text }}
        >
          {animated.toLocaleString('en-IN')}
        </p>
        <p className="text-sm font-medium text-gray-500 mt-1">{label}</p>
        {subtitle && (
          <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
        )}
      </div>

      {/* Bottom accent bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, delay: 0.3 + index * 0.08, ease: 'easeOut' }}
        className="h-1 rounded-full origin-left"
        style={{ backgroundColor: accent.bar }}
      />
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function EmployerStats({ stats, loading = false }) {
  const safeStats = stats ?? {
    totalVerifications: 0,
    thisMonth: 0,
    authentic: 0,
    forged: 0,
    pending: 0,
  };

  const total     = safeStats.totalVerifications;
  const authentic = safeStats.authentic;
  const forged    = safeStats.forged;

  const authenticPct = total > 0 ? ((authentic / total) * 100).toFixed(1) : '0.0';
  const forgedPct    = total > 0 ? ((forged / total) * 100).toFixed(1) : '0.0';

  const cards = [
    {
      icon: BarChart3,
      label: 'Total Verifications',
      value: total,
      subtitle: 'All time',
      trend: null,
      accent: {
        bg: '#EFF6FF',
        icon: '#1B3A5C',
        text: '#1B3A5C',
        bar: '#1B3A5C',
      },
    },
    {
      icon: TrendingUp,
      label: 'This Month',
      value: safeStats.thisMonth,
      subtitle: 'Current month',
      trend: '+this month',
      accent: {
        bg: '#E1F5EE',
        icon: '#0F6E56',
        text: '#0F6E56',
        bar: '#1D9E75',
      },
    },
    {
      icon: ShieldCheck,
      label: 'Authentic',
      value: authentic,
      subtitle: `${authenticPct}% of total`,
      trend: `${authenticPct}%`,
      accent: {
        bg: '#F0FDF4',
        icon: '#166534',
        text: '#166534',
        bar: '#166534',
      },
    },
    {
      icon: ShieldAlert,
      label: 'Forged / Suspicious',
      value: forged,
      subtitle: `${forgedPct}% of total`,
      trend: `${forgedPct}%`,
      accent: {
        bg: '#FEF2F2',
        icon: '#991B1B',
        text: '#991B1B',
        bar: '#991B1B',
      },
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <StatCard key={card.label} {...card} index={i} />
      ))}
    </div>
  );
}
