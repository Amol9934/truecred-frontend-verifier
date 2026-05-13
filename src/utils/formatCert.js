/**
 * formatCert.js — Certificate display utility functions.
 */

/**
 * Formats an ISO date string into a human-readable long date.
 *
 * @param {string|null|undefined} isoString — e.g. '2024-05-15' or '2024-05-15T10:30:00.000Z'
 * @returns {string} — e.g. 'May 15, 2024', or '—' for null/undefined/invalid values.
 *
 * @example
 * formatDate('2024-05-15') // → 'May 15, 2024'
 */
export function formatDate(isoString) {
  if (!isoString) return '—';

  try {
    // Append time component if bare date string is given to avoid timezone shifts.
    const normalized = /^\d{4}-\d{2}-\d{2}$/.test(isoString)
      ? `${isoString}T00:00:00`
      : isoString;

    const date = new Date(normalized);
    if (isNaN(date.getTime())) return '—';

    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return '—';
  }
}

/**
 * Truncates a hash string to a readable preview while preserving the prefix
 * and suffix for verification at a glance.
 *
 * The result always follows the pattern:  <prefix>:<head>...<tail>
 * where head + tail total `length` characters (excluding the prefix and colon).
 *
 * @param {string|null|undefined} hash — e.g. 'sha256:a3f8c9d4…d4e7b2'
 * @param {number} [length=20] — total visible hex characters (split evenly around '...')
 * @returns {string}
 *
 * @example
 * truncateHash('sha256:a3f8c9d4e7b21234567890abcdef', 12) // → 'sha256:a3f8c9...ef'
 */
export function truncateHash(hash, length = 20) {
  if (!hash) return '—';

  // Detect algorithm prefix (e.g. "sha256:") vs plain hex.
  const colonIdx = hash.indexOf(':');
  const prefix = colonIdx !== -1 ? hash.substring(0, colonIdx + 1) : '';
  const body   = colonIdx !== -1 ? hash.substring(colonIdx + 1) : hash;

  if (body.length <= length) return hash;

  const headLen = Math.ceil(length / 2);
  const tailLen = Math.floor(length / 2);

  return `${prefix}${body.substring(0, headLen)}...${body.substring(body.length - tailLen)}`;
}

/**
 * Normalises and formats a raw certificate ID into the canonical TrueCred display format.
 *
 * Rules:
 *   - Already-formatted IDs (e.g. 'TC-2024-0112') are returned as-is.
 *   - Raw IDs like 'TC20240112' are formatted as 'TC-2024-0112'.
 *   - Unknown / short IDs are uppercased and returned unchanged.
 *
 * @param {string|null|undefined} id
 * @returns {string}
 *
 * @example
 * formatCertId('TC20240112') // → 'TC-2024-0112'
 * formatCertId('TC-2024-0112') // → 'TC-2024-0112'
 */
export function formatCertId(id) {
  if (!id) return '—';

  const cleaned = id.trim().toUpperCase();

  // Already formatted with dashes — return directly.
  if (/^[A-Z]{2}-\d{4}-\d+$/.test(cleaned)) return cleaned;

  // Pattern: two-letter prefix + 4-digit year + remaining digits.
  const match = cleaned.match(/^([A-Z]{2})(\d{4})(\d+)$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }

  // Fallback: return the uppercased ID as received.
  return cleaned;
}

/**
 * Generates the canonical public verification URL for a certificate.
 * This URL can be embedded in a QR code so scanners land on the result page.
 *
 * @param {string} certId
 * @returns {string}
 *
 * @example
 * generateQRData('TC-2024-0112') // → 'https://truecred.in/result/TC-2024-0112'
 */
export function generateQRData(certId) {
  if (!certId) return 'https://truecred.in/verify';
  const encoded = encodeURIComponent(certId.trim());
  return `https://truecred.in/result/${encoded}`;
}
