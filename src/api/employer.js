/**
 * employer.js — Mock Employer Portal API
 * Simulates authentication and employer-side analytics with realistic delays.
 */

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Authenticates an employer. Any valid email/password pair is accepted
 * (mock environment — no real credential check).
 *
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ token: string, employer: { name: string, company: string, email: string } }>}
 * @throws {Error} When email or password fields are missing.
 */
export async function loginEmployer({ email, password }) {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  await delay(1000);

  // Derive a display name from the email's local-part for a realistic feel.
  const localPart = email.split('@')[0] ?? 'User';
  const displayName = localPart
    .replace(/[._-]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    token: `mock-jwt-${Math.random().toString(36).substring(2)}`,
    employer: {
      name: displayName,
      company: 'Acme Technologies Pvt. Ltd.',
      email,
    },
  };
}

/**
 * Returns aggregate verification statistics for the authenticated employer.
 *
 * @returns {Promise<Object>}
 */
export async function getEmployerStats() {
  await delay(800);

  return {
    totalVerifications: 1247,
    thisMonth: 89,
    authentic: 1156,
    forged: 67,
    pending: 24,
  };
}

/**
 * Returns a paginated list of the 10 most recent verifications performed
 * by the authenticated employer.
 *
 * @returns {Promise<Array<Object>>}
 */
export async function getVerificationHistory() {
  await delay(1000);

  const statuses = ['authentic', 'forged', 'pending'];
  const names = [
    'Priya Singh',
    'Rahul Verma',
    'Sneha Patel',
    'Arjun Sharma',
    'Kavya Nair',
    'Rohan Gupta',
    'Divya Reddy',
    'Amit Joshi',
    'Pooja Iyer',
    'Nikhil Mehta',
  ];
  const certIds = [
    'TC-2024-0112',
    'FG-2023-0874',
    'TC-2024-0993',
    'PD-2024-0561',
    'TC-2023-1450',
    'FG-2024-0231',
    'TC-2024-0887',
    'TC-2023-0774',
    'PD-2024-0102',
    'TC-2024-1201',
  ];

  const now = Date.now();
  const ONE_DAY_MS = 86_400_000;

  return names.map((studentName, i) => ({
    certId: certIds[i],
    studentName,
    status: statuses[i % statuses.length],
    verifiedAt: new Date(now - i * ONE_DAY_MS * 0.4).toISOString(),
    company: 'Acme Technologies Pvt. Ltd.',
  }));
}
