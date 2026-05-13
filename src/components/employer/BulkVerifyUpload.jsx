/**
 * BulkVerifyUpload.jsx — CSV drag-and-drop bulk certificate upload component.
 *
 * Props:
 *   onSubmit(certIds: string[]) — called when the user starts bulk verification
 */

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, CheckCircle, Loader2 } from 'lucide-react';

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function parseCSV(text) {
  return text
    .split(/[\r\n,]+/)
    .map((id) => id.trim())
    .filter((id) => id.length > 0);
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function BulkVerifyUpload({ onSubmit }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [file, setFile]             = useState(null);
  const [certIds, setCertIds]       = useState([]);
  const [parseError, setParseError] = useState(null);
  const [loading, setLoading]       = useState(false);
  const inputRef                    = useRef(null);

  // ── File processing ──────────────────────────────────────────────────────

  const processFile = useCallback((selectedFile) => {
    if (!selectedFile) return;

    if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
      setParseError('Only .csv files are accepted. Please upload a valid CSV file.');
      setFile(null);
      setCertIds([]);
      return;
    }

    setParseError(null);
    setFile(selectedFile);
    setCertIds([]);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result ?? '';
      const ids = parseCSV(text);
      if (ids.length === 0) {
        setParseError('No certificate IDs found in the file. Ensure the CSV is not empty.');
      } else {
        setCertIds(ids);
      }
    };
    reader.onerror = () => {
      setParseError('Failed to read the file. Please try again.');
    };
    reader.readAsText(selectedFile);
  }, []);

  // ── Drag & drop handlers ─────────────────────────────────────────────────

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) processFile(droppedFile);
  };

  const handleFileInput = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) processFile(selectedFile);
    e.target.value = '';
  };

  const handleRemove = () => {
    setFile(null);
    setCertIds([]);
    setParseError(null);
  };

  // ── Submit ───────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (certIds.length === 0 || loading) return;
    setLoading(true);
    try {
      await onSubmit(certIds);
    } finally {
      setLoading(false);
    }
  };

  const previewIds = certIds.slice(0, 5);
  const hasMore    = certIds.length > 5;

  return (
    <div className="w-full space-y-5">
      {/* ── Drop Zone ── */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload CSV file — click or drop file here"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !file && inputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !file) inputRef.current?.click();
        }}
        className={[
          'relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-8 py-12 transition-all duration-200 select-none',
          isDragOver
            ? 'border-[#0F6E56] bg-[#E1F5EE] scale-[1.01] cursor-copy'
            : file
              ? 'border-[#1D9E75] bg-[#f0fdf4] cursor-default'
              : 'border-gray-300 bg-gray-50 hover:border-[#1D9E75] hover:bg-[#E1F5EE]/40 cursor-pointer',
        ].join(' ')}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          className="sr-only"
          onChange={handleFileInput}
          aria-hidden="true"
          tabIndex={-1}
        />

        {/* Icon */}
        <motion.div
          animate={isDragOver ? { scale: 1.15, rotate: -5 } : { scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
          className={[
            'w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm',
            file ? 'bg-[#0F6E56]' : 'bg-white border border-gray-200',
          ].join(' ')}
        >
          {file ? (
            <CheckCircle className="w-8 h-8 text-white" />
          ) : (
            <Upload className={`w-8 h-8 ${isDragOver ? 'text-[#0F6E56]' : 'text-gray-400'}`} />
          )}
        </motion.div>

        {/* Descriptive text */}
        <AnimatePresence mode="wait">
          {file ? (
            <motion.div
              key="file-info"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-[#0F6E56]" />
                <span className="text-sm font-semibold text-[#0F6E56] max-w-xs truncate">
                  {file.name}
                </span>
              </div>
              <p className="text-xs text-gray-500">{formatBytes(file.size)}</p>
            </motion.div>
          ) : (
            <motion.div
              key="drop-hint"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="text-center"
            >
              <p className="text-sm font-semibold text-gray-700">
                {isDragOver
                  ? 'Release to upload'
                  : 'Drop your CSV file here or click to browse'}
              </p>
              <p className="text-xs text-gray-400 mt-1">Accepts .csv files only</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Remove button */}
        {file && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleRemove();
            }}
            aria-label="Remove uploaded file"
            className="absolute top-3 right-3 p-1.5 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-300 transition-colors shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Format Hint ── */}
      <div className="rounded-xl bg-[#F9FAFB] border border-gray-200 px-4 py-3 space-y-1.5">
        <p className="font-semibold text-gray-700 text-sm">CSV Format</p>
        <p className="text-xs text-gray-500">
          One certificate ID per line, or comma-separated. Empty lines are ignored.
        </p>
        <pre className="text-[11px] font-mono text-[#0F6E56] leading-relaxed bg-white border border-gray-100 rounded-lg px-3 py-2">
{`TC-2024-0001
FG-2023-0874, TC-2024-0993
PD-2024-0102`}
        </pre>
      </div>

      {/* ── Parse Error ── */}
      <AnimatePresence>
        {parseError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            <X className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
            <span>{parseError}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Preview ── */}
      <AnimatePresence>
        {certIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-xl border border-[#1D9E75]/30 bg-[#E1F5EE]/50 overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-[#1D9E75]/20 flex items-center justify-between">
              <p className="text-sm font-semibold text-[#0F6E56]">
                Preview &mdash;{' '}
                {certIds.length} certificate ID{certIds.length !== 1 ? 's' : ''} parsed
              </p>
              <CheckCircle className="w-4 h-4 text-[#0F6E56]" />
            </div>
            <ul className="px-4 py-3 space-y-1">
              {previewIds.map((id, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-sm font-mono text-gray-700"
                >
                  <span className="text-xs text-gray-400 w-4 text-right select-none">
                    {i + 1}.
                  </span>
                  <span className="text-[#0F6E56] font-semibold">{id}</span>
                </li>
              ))}
              {hasMore && (
                <li className="text-xs text-gray-500 pl-6 pt-1">
                  + {certIds.length - 5} more certificate ID
                  {certIds.length - 5 !== 1 ? 's' : ''}&hellip;
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Submit Button ── */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={certIds.length === 0 || loading}
        aria-busy={loading}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#0F6E56] hover:bg-[#1D9E75] active:bg-[#0a5240] text-white font-semibold text-base shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F6E56] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Running Verification&hellip;</span>
          </>
        ) : (
          <>
            <Upload className="w-5 h-5" />
            <span>
              Start Bulk Verification
              {certIds.length > 0 && ` (${certIds.length})`}
            </span>
          </>
        )}
      </button>
    </div>
  );
}
