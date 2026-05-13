/**
 * verify.js — Mock Certificate Verification API
 * Simulates TrueCred blockchain-backed certificate verification with realistic delays.
 */

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Generates a realistic-looking SHA-256 hex digest string. */
function generateFakeHash() {
  const chars = '0123456789abcdef';
  let hex = '';
  for (let i = 0; i < 64; i++) {
    hex += chars[Math.floor(Math.random() * chars.length)];
  }
  return `sha256:${hex}`;
}

/** Generates a realistic-looking Ethereum-style transaction hash. */
function generateTxHash() {
  const chars = '0123456789abcdef';
  let hex = '';
  for (let i = 0; i < 64; i++) {
    hex += chars[Math.floor(Math.random() * chars.length)];
  }
  return `0x${hex}`;
}

/** Generates a random report ID for flagged certificates. */
function generateReportId() {
  return 'RPT-' + Math.random().toString(36).substring(2, 10).toUpperCase();
}

function buildAuthenticResult(certId) {
  return {
    status: 'authentic',
    certId,
    studentName: 'Arjun Sharma',
    degree: 'Bachelor of Technology - Computer Science',
    institution: 'Indian Institute of Technology, Delhi',
    issueDate: '2024-05-15',
    expiryDate: null,
    institutionLogo: null,
    institutionContact: 'registrar@iitd.ac.in',
    grade: 'First Class with Distinction',
    rollNumber: 'MT21CS047',
    digitalFingerprint: generateFakeHash(),
    verificationTimestamp: new Date().toISOString(),
    blockchainTxHash: generateTxHash(),
    signatories: [
      'Prof. V.K. Tiwari - Dean',
      'Dr. S. Mehta - HOD CS',
    ],
  };
}

function buildForgedResult(certId) {
  return {
    status: 'forged',
    certId,
    reason: 'Hash mismatch detected',
    detectedAt: new Date().toISOString(),
    reportId: generateReportId(),
  };
}

function buildPendingResult(certId) {
  return {
    status: 'pending',
    certId,
    message: 'Verification Pending — Manual Review Required',
    contactEmail: 'verify@truecred.in',
    estimatedTime: '24-48 hours',
  };
}

/**
 * Verifies a single certificate by its ID.
 *
 * Routing:
 *   - Prefix 'TC' → authentic
 *   - Prefix 'FG' → forged
 *   - Prefix 'PD' → pending
 *   - Anything else → throws 'Certificate not found in registry'
 *
 * @param {string} certId
 * @returns {Promise<Object>}
 * @throws {Error} When the certificate ID is not found in the registry.
 */
export async function verifyCertificate(certId) {
  if (!certId || typeof certId !== 'string' || !certId.trim()) {
    throw new Error('Certificate not found in registry');
  }

  await delay(1500);

  const normalized = certId.trim().toUpperCase();

  if (normalized.startsWith('TC')) return buildAuthenticResult(certId.trim());
  if (normalized.startsWith('FG')) return buildForgedResult(certId.trim());
  if (normalized.startsWith('PD')) return buildPendingResult(certId.trim());

  throw new Error('Certificate not found in registry');
}

/**
 * Verifies multiple certificates in a single batch call.
 * Individual lookup failures are captured as error-status entries rather
 * than rejecting the entire promise, so callers always receive a full array.
 *
 * @param {string[]} certIds
 * @returns {Promise<Array<Object>>}
 * @throws {Error} When certIds is not a non-empty array.
 */
export async function bulkVerifyCertificates(certIds) {
  if (!Array.isArray(certIds) || certIds.length === 0) {
    throw new Error('certIds must be a non-empty array');
  }

  await delay(3000);

  return certIds.map((certId) => {
    const normalized = (certId ?? '').trim().toUpperCase();

    if (!normalized) {
      return { status: 'error', certId, message: 'Certificate not found in registry' };
    }

    if (normalized.startsWith('TC')) return buildAuthenticResult(certId.trim());
    if (normalized.startsWith('FG')) return buildForgedResult(certId.trim());
    if (normalized.startsWith('PD')) return buildPendingResult(certId.trim());

    return { status: 'error', certId, message: 'Certificate not found in registry' };
  });
}
