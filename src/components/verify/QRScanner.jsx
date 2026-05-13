/**
 * QRScanner.jsx — QR Code scanner component for TrueCred Verifier Portal.
 *
 * Supports two modes:
 *   - Live camera scan via Html5Qrcode
 *   - Image file upload scan via Html5Qrcode.scanFile()
 */

import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, Upload, X, AlertCircle, Loader2, ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MODE = { CAMERA: 'camera', UPLOAD: 'upload' };

const QR_READER_ID = 'truecred-qr-reader';

export default function QRScanner({ onScan }) {
  const [mode, setMode] = useState(MODE.CAMERA);
  const [cameraError, setCameraError] = useState(null);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [scanning, setScanning] = useState(false);

  // Upload-mode state
  const [uploadPreview, setUploadPreview] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(null);

  const html5QrcodeRef = useRef(null);
  const fileInputRef = useRef(null);

  // ─── Camera mode ─────────────────────────────────────────────────────────

  const startCamera = async () => {
    setCameraError(null);
    setCameraLoading(true);

    try {
      const html5Qrcode = new Html5Qrcode(QR_READER_ID);
      html5QrcodeRef.current = html5Qrcode;

      await html5Qrcode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          // Success callback — decodedText is the QR content
          const certId = decodedText.trim();
          setScanning(false);
          stopCamera();
          if (onScan) onScan(certId);
        },
        () => {
          // Error callback (scan frame error) — not a fatal error, ignore per-frame failures
        }
      );

      setScanning(true);
    } catch (err) {
      const msg = err?.message ?? String(err);
      if (msg.toLowerCase().includes('permission') || msg.toLowerCase().includes('notallowed')) {
        setCameraError(
          'Camera access was denied. Please allow camera permissions in your browser settings and try again.'
        );
      } else if (msg.toLowerCase().includes('notfound') || msg.toLowerCase().includes('no camera')) {
        setCameraError('No camera was found on this device. Try uploading an image instead.');
      } else {
        setCameraError(`Unable to start camera: ${msg}`);
      }
    } finally {
      setCameraLoading(false);
    }
  };

  const stopCamera = async () => {
    if (html5QrcodeRef.current) {
      try {
        await html5QrcodeRef.current.stop();
      } catch {
        // Ignore stop errors (camera may already be stopped)
      }
      html5QrcodeRef.current = null;
    }
    setScanning(false);
  };

  // Start camera automatically when camera mode is active
  useEffect(() => {
    if (mode === MODE.CAMERA) {
      startCamera();
    }

    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (html5QrcodeRef.current) {
        html5QrcodeRef.current.stop().catch(() => {});
        html5QrcodeRef.current = null;
      }
    };
  }, []);

  // ─── Upload mode ──────────────────────────────────────────────────────────

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset previous state
    setUploadError(null);
    setUploadSuccess(null);
    setUploadPreview(URL.createObjectURL(file));
    setUploadLoading(true);

    try {
      const scanner = new Html5Qrcode('__truecred_file_scanner__');
      const result = await scanner.scanFile(file, /* showImage */ false);
      const certId = result.trim();
      setUploadSuccess(certId);
      setUploadLoading(false);
      if (onScan) onScan(certId);
    } catch (err) {
      setUploadLoading(false);
      const msg = err?.message ?? String(err);
      if (msg.toLowerCase().includes('no qr code found') || msg.toLowerCase().includes('no multi')) {
        setUploadError('No QR code was detected in this image. Please upload a clear image of the QR code.');
      } else {
        setUploadError(`Scan failed: ${msg}`);
      }
    }
  };

  // ─── Mode switch ──────────────────────────────────────────────────────────

  const switchMode = (newMode) => {
    if (newMode === mode) return;
    setUploadPreview(null);
    setUploadError(null);
    setUploadSuccess(null);
    setCameraError(null);
    setMode(newMode);
  };

  const tabs = [
    { id: MODE.CAMERA, label: 'Live Camera', Icon: Camera },
    { id: MODE.UPLOAD, label: 'Upload Image', Icon: Upload },
  ];

  return (
    <div className="w-full">
      {/* Hidden div required by Html5Qrcode for file scanning */}
      <div id="__truecred_file_scanner__" className="hidden" />

      {/* Mode tab switcher */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-4">
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => switchMode(id)}
            className={`relative flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F6E56] ${
              mode === id
                ? 'bg-white text-[#0F6E56] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* ── Camera mode ── */}
      <AnimatePresence mode="wait">
        {mode === MODE.CAMERA && (
          <motion.div
            key="camera"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {/* Loading state */}
            {cameraLoading && (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-gray-500">
                <Loader2 className="w-8 h-8 animate-spin text-[#0F6E56]" />
                <p className="text-sm">Initializing camera…</p>
              </div>
            )}

            {/* Camera error state */}
            {cameraError && !cameraLoading && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-red-800">Camera unavailable</p>
                  <p className="text-sm text-red-700 mt-0.5">{cameraError}</p>
                  <button
                    onClick={startCamera}
                    className="mt-3 text-sm font-medium text-red-700 underline hover:text-red-900"
                  >
                    Try again
                  </button>
                </div>
              </div>
            )}

            {/* QR Reader container */}
            {!cameraError && (
              <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-black">
                <div id={QR_READER_ID} className="w-full" />

                {/* Scanning overlay hint */}
                {scanning && (
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                    <p className="text-white text-xs text-center">
                      Point your camera at a TrueCred QR code
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Stop button */}
            {scanning && (
              <button
                onClick={stopCamera}
                className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4" />
                Stop Camera
              </button>
            )}
          </motion.div>
        )}

        {/* ── Upload mode ── */}
        {mode === MODE.UPLOAD && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-4"
          >
            {/* Drop zone / file picker */}
            <label
              htmlFor="qr-file-upload"
              className="flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed border-gray-300 hover:border-[#1D9E75] hover:bg-[#E1F5EE]/30 cursor-pointer transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-[#E1F5EE] flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-[#0F6E56]" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700">Click to upload QR image</p>
                <p className="text-xs text-gray-500 mt-0.5">PNG, JPG, GIF, WebP supported</p>
              </div>
              <input
                id="qr-file-upload"
                type="file"
                accept="image/*"
                className="sr-only"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </label>

            {/* Preview */}
            {uploadPreview && (
              <div className="rounded-xl overflow-hidden border border-gray-200 relative">
                <img
                  src={uploadPreview}
                  alt="Uploaded QR code"
                  className="w-full max-h-56 object-contain bg-gray-50"
                />
                {uploadLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                    <Loader2 className="w-8 h-8 animate-spin text-[#0F6E56]" />
                  </div>
                )}
              </div>
            )}

            {/* Upload error */}
            {uploadError && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{uploadError}</p>
              </div>
            )}

            {/* Upload success */}
            {uploadSuccess && (
              <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                <p className="text-sm font-medium text-green-800">
                  QR code detected: <span className="font-mono">{uploadSuccess}</span>
                </p>
                <p className="text-xs text-green-700 mt-0.5">Redirecting to verification…</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
