/**
 * statusHelpers.js — Presentation helpers for certificate verification statuses.
 *
 * Supported statuses: 'authentic' | 'forged' | 'pending' | 'error'
 */

/**
 * Returns a Tailwind CSS class string for the status badge/card background.
 *
 * The classes combine background colour, text colour, and border colour so
 * the consumer only needs to spread a single string.
 *
 * @param {string} status
 * @returns {string}
 */
export function getStatusColor(status) {
  switch (status) {
    case 'authentic':
      return 'bg-green-50 text-success border-green-200';

    case 'forged':
      return 'bg-red-50 text-danger border-red-200';

    case 'pending':
      return 'bg-amber-50 text-warning border-amber-200';

    case 'error':
    default:
      return 'bg-gray-50 text-gray-600 border-gray-200';
  }
}

/**
 * Returns a human-readable label for a verification status.
 *
 * @param {string} status
 * @returns {string}
 */
export function getStatusLabel(status) {
  switch (status) {
    case 'authentic':
      return 'Certificate Verified — Authentic';

    case 'forged':
      return 'Certificate Flagged — Possible Forgery';

    case 'pending':
      return 'Verification Pending — Manual Review Required';

    case 'error':
      return 'Certificate Not Found';

    default:
      return 'Unknown Status';
  }
}

/**
 * Returns a semantic icon identifier for a verification status.
 * Consumers map this string to the actual icon component of their choice
 * (e.g. Heroicons, Lucide, etc.).
 *
 * @param {string} status
 * @returns {'check' | 'x' | 'clock' | 'question'}
 */
export function getStatusIcon(status) {
  switch (status) {
    case 'authentic':
      return 'check';

    case 'forged':
      return 'x';

    case 'pending':
      return 'clock';

    default:
      return 'question';
  }
}

/**
 * Convenience object: maps each status to all its presentation attributes at once.
 * Useful for destructuring in components that need all three values.
 *
 * @example
 * const { color, label, icon } = STATUS_MAP['authentic'];
 */
export const STATUS_MAP = {
  authentic: {
    color: getStatusColor('authentic'),
    label: getStatusLabel('authentic'),
    icon:  getStatusIcon('authentic'),
  },
  forged: {
    color: getStatusColor('forged'),
    label: getStatusLabel('forged'),
    icon:  getStatusIcon('forged'),
  },
  pending: {
    color: getStatusColor('pending'),
    label: getStatusLabel('pending'),
    icon:  getStatusIcon('pending'),
  },
  error: {
    color: getStatusColor('error'),
    label: getStatusLabel('error'),
    icon:  getStatusIcon('error'),
  },
};
