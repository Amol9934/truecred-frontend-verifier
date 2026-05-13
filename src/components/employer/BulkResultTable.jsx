/**
 * BulkResultTable.jsx — Results table for bulk certificate verification.
 *
 * Props:
 *   results : Array<Object>  — array of verification result objects
 *   loading : boolean        — shows skeleton while loading
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// ── Constants ─────────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

const STATUS_CONFIG = {
  authentic: {
    label: 'Authentic',
    icon: CheckCircle,
    badge: 'bg-green-100 text-[#166534] border-green-200',
  },
  forged: {
    label: 'Forged',
    icon: XCircle,
    badge: 'bg-red-100 text-[#991B1B] border-red-200',
  },
  pending: {
    label: 'Pending',
    icon: Clock,
    badge: 'bg-amber-100 text-[#92400E] border-amber-200',
  },
  error: {
    label: 'Error',
    icon: AlertCircle,
    badge: 'bg-gray-100 text-gray-600 border-gray-200',
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function getVerifiedAt(result) {
  return result.verificationTimestamp ?? result.detectedAt ?? result.verifiedAt ?? null;
}

function buildCSV(results) {
  const header = ['#', 'Certificate ID', 'Student Name', 'Status', 'Verified At'];
  const rows = results.map((r, i) => [
    i + 1,
    `"${r.certId ?? ''}"`,
    `"${r.studentName ?? ''}"`,
    r.status ?? '',
    `"${formatDate(getVerifiedAt(r))}"`,
  ]);
  return [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

function downloadCSV(results) {
  const csv = buildCSV(results);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `truecred-bulk-results-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.error;
  const Icon   = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.badge}`}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}

function SkeletonRow({ index }) {
  return (
    <tr className="border-b border-gray-100">
      {[...Array(6)].map((_, j) => (
        <td key={j} className="px-4 py-3">
          <div
            className="h-4 bg-gray-200 rounded animate-pulse"
            style={{ width: j === 5 ? '64px' : j === 0 ? '24px' : `${60 + Math.random() * 40}%` }}
          />
        </td>
      ))}
    </tr>
  );
}

function EmptyState() {
  return (
    <tr>
      <td colSpan={6} className="px-4 py-16 text-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <AlertCircle className="w-10 h-10" />
          <p className="text-sm font-medium text-gray-500">No verification results yet.</p>
          <p className="text-xs text-gray-400">
            Upload a CSV file and start bulk verification to see results here.
          </p>
        </div>
      </td>
    </tr>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function BulkResultTable({ results = [], loading = false }) {
  const navigate           = useNavigate();
  const [page, setPage]    = useState(1);
  const [filter, setFilter] = useState('all');

  // ── Derived data ─────────────────────────────────────────────────────────

  const stats = useMemo(() => {
    const authentic = results.filter((r) => r.status === 'authentic').length;
    const forged    = results.filter((r) => r.status === 'forged').length;
    const pending   = results.filter((r) => r.status === 'pending').length;
    return { total: results.length, authentic, forged, pending };
  }, [results]);

  const filtered = useMemo(
    () => (filter === 'all' ? results : results.filter((r) => r.status === filter)),
    [results, filter],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const pageItems  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // Reset to page 1 when filter changes
  const handleFilterChange = (value) => {
    setFilter(value);
    setPage(1);
  };

  return (
    <div className="w-full space-y-4">
      {/* ── Stats Summary ── */}
      {results.length > 0 && (
        <div className="flex flex-wrap gap-3 text-sm">
          {[
            { label: 'Total', value: stats.total, color: 'text-[#1B3A5C]' },
            { label: 'Authentic', value: stats.authentic, color: 'text-[#166534]' },
            { label: 'Forged', value: stats.forged, color: 'text-[#991B1B]' },
            { label: 'Pending', value: stats.pending, color: 'text-[#92400E]' },
          ].map(({ label, value, color }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 shadow-sm font-medium text-gray-500"
            >
              {label}:
              <span className={`font-bold ${color}`}>{value}</span>
            </span>
          ))}
        </div>
      )}

      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F6E56] focus:border-transparent"
            aria-label="Filter by status"
          >
            <option value="all">All Statuses</option>
            <option value="authentic">Authentic</option>
            <option value="forged">Forged</option>
            <option value="pending">Pending</option>
            <option value="error">Error</option>
          </select>
        </div>

        {/* Export */}
        {results.length > 0 && (
          <button
            type="button"
            onClick={() => downloadCSV(results)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#0F6E56] text-[#0F6E56] text-sm font-semibold hover:bg-[#E1F5EE] active:bg-[#c3ead9] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F6E56] focus-visible:ring-offset-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        )}
      </div>

      {/* ── Table ── */}
      <div className="w-full overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm" aria-label="Bulk verification results">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {['#', 'Certificate ID', 'Student Name', 'Status', 'Verified At', 'Actions'].map(
                (col) => (
                  <th
                    key={col}
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {col}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              [...Array(5)].map((_, i) => <SkeletonRow key={i} index={i} />)
            ) : pageItems.length === 0 ? (
              <EmptyState />
            ) : (
              <AnimatePresence initial={false}>
                {pageItems.map((result, i) => {
                  const rowIndex = (safePage - 1) * PAGE_SIZE + i + 1;
                  const verifiedAt = getVerifiedAt(result);
                  return (
                    <motion.tr
                      key={result.certId ?? i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15, delay: i * 0.03 }}
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      <td className="px-4 py-3 text-gray-400 font-medium">{rowIndex}</td>
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-[#1B3A5C] whitespace-nowrap">
                        {result.certId ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                        {result.studentName ?? '—'}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={result.status} />
                      </td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">
                        {formatDate(verifiedAt)}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => navigate(`/result/${encodeURIComponent(result.certId)}`)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#E1F5EE] text-[#0F6E56] text-xs font-semibold hover:bg-[#c3ead9] active:bg-[#a8dfc8] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F6E56]"
                          aria-label={`View details for ${result.certId}`}
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            Showing {(safePage - 1) * PAGE_SIZE + 1}–
            {Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              aria-label="Previous page"
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {[...Array(totalPages)].map((_, i) => {
              const pg = i + 1;
              // Show limited range of pages
              if (
                pg === 1 ||
                pg === totalPages ||
                (pg >= safePage - 1 && pg <= safePage + 1)
              ) {
                return (
                  <button
                    key={pg}
                    type="button"
                    onClick={() => setPage(pg)}
                    className={[
                      'w-8 h-8 rounded-lg text-xs font-semibold transition-colors',
                      pg === safePage
                        ? 'bg-[#0F6E56] text-white'
                        : 'border border-gray-200 hover:bg-gray-50 text-gray-600',
                    ].join(' ')}
                  >
                    {pg}
                  </button>
                );
              }
              if (pg === safePage - 2 || pg === safePage + 2) {
                return (
                  <span key={pg} className="px-1 text-gray-400">
                    &hellip;
                  </span>
                );
              }
              return null;
            })}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              aria-label="Next page"
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
