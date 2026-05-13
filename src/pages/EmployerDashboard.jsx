/**
 * EmployerDashboard.jsx — Protected employer dashboard.
 *
 * Tabs: Overview | Verification History | Bulk Verify | Settings
 * Redirects to /employer/login if no session found.
 */

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  History,
  Upload,
  Settings,
  Building2,
  LogOut,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Eye,
} from 'lucide-react';
import EmployerStats from '../components/employer/EmployerStats.jsx';
import BulkVerifyUpload from '../components/employer/BulkVerifyUpload.jsx';
import BulkResultTable from '../components/employer/BulkResultTable.jsx';
import useVerifyStore from '../store/verifyStore.js';
import { getEmployerStats, getVerificationHistory } from '../api/employer.js';
import { bulkVerifyCertificates } from '../api/verify.js';

// ── Constants ─────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'overview',  label: 'Overview',             Icon: LayoutDashboard },
  { id: 'history',   label: 'Verification History', Icon: History },
  { id: 'bulk',      label: 'Bulk Verify',           Icon: Upload },
  { id: 'settings',  label: 'Settings',              Icon: Settings },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function statusConfig(status) {
  const map = {
    authentic: { label: 'Authentic', Icon: CheckCircle, badge: 'bg-green-100 text-[#166534] border-green-200' },
    forged:    { label: 'Forged',    Icon: XCircle,     badge: 'bg-red-100 text-[#991B1B] border-red-200' },
    pending:   { label: 'Pending',   Icon: Clock,       badge: 'bg-amber-100 text-[#92400E] border-amber-200' },
  };
  return map[status] ?? { label: 'Unknown', Icon: AlertCircle, badge: 'bg-gray-100 text-gray-600 border-gray-200' };
}

function formatDate(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return iso; }
}

// ── Small History Table ───────────────────────────────────────────────────────

function HistoryTable({ records, loading, navigate, compact = false }) {
  const display = compact ? records.slice(0, 5) : records;

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(compact ? 4 : 8)].map((_, i) => (
          <div key={i} className="h-10 rounded-lg bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (display.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400 text-sm">
        No verification history yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="min-w-full text-sm bg-white">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {['Certificate ID', 'Student Name', 'Status', 'Verified At', 'Actions'].map((col) => (
              <th key={col} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {display.map((record, i) => {
            const { label, Icon, badge } = statusConfig(record.status);
            return (
              <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-4 py-3 font-mono text-xs font-semibold text-[#1B3A5C] whitespace-nowrap">
                  {record.certId}
                </td>
                <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                  {record.studentName ?? '—'}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge}`}>
                    <Icon className="w-3 h-3" />
                    {label}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">
                  {formatDate(record.verifiedAt)}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => navigate(`/result/${encodeURIComponent(record.certId)}`)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#E1F5EE] text-[#0F6E56] text-xs font-semibold hover:bg-[#c3ead9] transition-colors"
                  >
                    <Eye className="w-3 h-3" />
                    View
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── Page Component ────────────────────────────────────────────────────────────

export default function EmployerDashboard() {
  const navigate       = useNavigate();
  const employer       = useVerifyStore((s) => s.employer);
  const logoutEmployer = useVerifyStore((s) => s.logoutEmployer);

  const [activeTab, setActiveTab]   = useState('overview');
  const [stats, setStats]           = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [history, setHistory]       = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [bulkResults, setBulkResults] = useState([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  // ── Auth guard ──────────────────────────────────────────────────────────

  useEffect(() => {
    if (!employer) {
      navigate('/employer/login', { replace: true });
    }
  }, [employer, navigate]);

  // ── Load data on mount ──────────────────────────────────────────────────

  useEffect(() => {
    if (!employer) return;

    (async () => {
      try {
        const s = await getEmployerStats();
        setStats(s);
      } catch { /* non-critical */ }
      finally { setStatsLoading(false); }
    })();

    (async () => {
      try {
        const h = await getVerificationHistory();
        setHistory(h);
      } catch { /* non-critical */ }
      finally { setHistoryLoading(false); }
    })();
  }, [employer]);

  // ── Bulk verify handler ─────────────────────────────────────────────────

  const handleBulkSubmit = async (certIds) => {
    setBulkLoading(true);
    try {
      const results = await bulkVerifyCertificates(certIds);
      setBulkResults(results);
    } catch (err) {
      console.error('Bulk verify failed:', err);
    } finally {
      setBulkLoading(false);
    }
  };

  const handleLogout = () => {
    logoutEmployer();
    navigate('/employer/login', { replace: true });
  };

  if (!employer) return null;

  const tabContent = {
    overview: (
      <div className="space-y-8">
        <EmployerStats stats={stats} loading={statsLoading} />
        <div>
          <h3 className="text-base font-bold text-[#111827] mb-4">Recent Verifications</h3>
          <HistoryTable
            records={history}
            loading={historyLoading}
            navigate={navigate}
            compact
          />
          {history.length > 5 && (
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className="mt-3 text-sm text-[#0F6E56] font-semibold hover:text-[#1D9E75] transition-colors"
            >
              View all history &rarr;
            </button>
          )}
        </div>
      </div>
    ),
    history: (
      <div className="space-y-4">
        <h3 className="text-base font-bold text-[#111827]">Verification History</h3>
        <HistoryTable records={history} loading={historyLoading} navigate={navigate} />
      </div>
    ),
    bulk: (
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <h3 className="text-base font-bold text-[#111827] mb-4">Upload CSV</h3>
            <BulkVerifyUpload onSubmit={handleBulkSubmit} />
          </div>
          <div className="lg:col-span-3">
            <h3 className="text-base font-bold text-[#111827] mb-4">Results</h3>
            <BulkResultTable results={bulkResults} loading={bulkLoading} />
          </div>
        </div>
      </div>
    ),
    settings: (
      <div className="max-w-lg space-y-6">
        <h3 className="text-base font-bold text-[#111827]">Account Settings</h3>

        {/* Info card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#E1F5EE] flex items-center justify-center text-[#0F6E56] font-extrabold text-lg">
              {employer.name?.[0]?.toUpperCase() ?? 'E'}
            </div>
            <div>
              <p className="font-bold text-[#111827]">{employer.name}</p>
              <p className="text-xs text-[#6B7280]">{employer.email}</p>
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          <div className="space-y-3 text-sm">
            {[
              { label: 'Full Name',    value: employer.name },
              { label: 'Company',      value: employer.company },
              { label: 'Email',        value: employer.email },
              { label: 'Account Type', value: 'Employer — Free Tier' },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col sm:flex-row sm:justify-between gap-0.5">
                <span className="text-[#6B7280] font-medium">{label}</span>
                <span className="text-[#111827] font-semibold">{value ?? '—'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Company badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E1F5EE] border border-[#1D9E75]/30 text-[#0F6E56] text-sm font-semibold">
          <Building2 className="w-4 h-4" />
          {employer.company}
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-200 text-[#991B1B] text-sm font-semibold hover:bg-red-50 active:bg-red-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    ),
  };

  return (
    <>
      <Helmet>
        <title>Dashboard — TrueCred Employer</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-screen bg-[#F9FAFB]">
        {/* ── Dashboard Header ── */}
        <div
          className="border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-8 py-5"
        >
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-extrabold text-[#111827]">
                Welcome back, {employer.name}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Building2 className="w-3.5 h-3.5 text-[#6B7280]" />
                <span className="text-sm text-[#6B7280]">{employer.company}</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#E1F5EE] text-[#0F6E56] text-xs font-semibold border border-[#1D9E75]/30">
                  Employer
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#991B1B] font-medium transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* ── Tab Navigation ── */}
        <div className="border-b border-gray-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex gap-1 overflow-x-auto" role="tablist" aria-label="Dashboard sections">
              {TABS.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  role="tab"
                  aria-selected={activeTab === id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={[
                    'relative flex items-center gap-2 px-4 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F6E56]',
                    activeTab === id
                      ? 'border-[#0F6E56] text-[#0F6E56]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  ].join(' ')}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* ── Tab Content ── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {tabContent[activeTab]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
