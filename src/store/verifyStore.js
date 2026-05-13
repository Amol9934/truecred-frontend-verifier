/**
 * verifyStore.js — Global Zustand store for the TrueCred Verifier Portal.
 *
 * Handles:
 *   - Certificate verification state (result, loading, error)
 *   - Employer authentication (with localStorage persistence)
 *   - Verification history
 */

import { create } from 'zustand';
import { verifyCertificate } from '../api/verify';
import { loginEmployer as apiLoginEmployer, getVerificationHistory } from '../api/employer';

const STORAGE_KEY = 'truecred_employer';

/** Safely read employer data from localStorage. */
function readEmployerFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Persist employer data to localStorage. */
function writeEmployerToStorage(employer) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employer));
  } catch {
    // localStorage may be unavailable in some environments; fail silently.
  }
}

/** Remove employer data from localStorage. */
function clearEmployerFromStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Fail silently.
  }
}

const useVerifyStore = create((set, get) => ({
  // ─── Certificate verification state ──────────────────────────────────────
  result: null,
  loading: false,
  error: null,

  // ─── Employer auth state ──────────────────────────────────────────────────
  employer: readEmployerFromStorage(),

  // ─── Verification history ─────────────────────────────────────────────────
  verificationHistory: [],

  // ─── Actions ─────────────────────────────────────────────────────────────

  /**
   * Verify a certificate by ID.
   * Sets loading → true while the request is in flight, then
   * populates `result` on success or `error` on failure.
   *
   * @param {string} certId
   */
  verifyCert: async (certId) => {
    set({ loading: true, error: null, result: null });
    try {
      const result = await verifyCertificate(certId);
      set({ result, loading: false });
    } catch (err) {
      set({
        error: err?.message ?? 'An unexpected error occurred. Please try again.',
        loading: false,
        result: null,
      });
    }
  },

  /**
   * Clears the current verification result and any error.
   */
  clearResult: () => set({ result: null, error: null }),

  /**
   * Authenticate an employer.
   * On success the employer object is persisted to localStorage.
   *
   * @param {{ email: string, password: string }} credentials
   * @throws Will re-throw API errors so the calling component can display them.
   */
  loginEmployer: async (credentials) => {
    const { token, employer } = await apiLoginEmployer(credentials);
    const employerWithToken = { ...employer, token };
    writeEmployerToStorage(employerWithToken);
    set({ employer: employerWithToken });
  },

  /**
   * Log out the current employer, clearing both in-memory and persisted state.
   */
  logoutEmployer: () => {
    clearEmployerFromStorage();
    set({ employer: null, verificationHistory: [] });
  },

  /**
   * Re-hydrate employer from localStorage (call on app mount to restore sessions).
   */
  loadEmployerFromStorage: () => {
    const employer = readEmployerFromStorage();
    set({ employer });
  },

  /**
   * Fetch and cache the employer's verification history.
   */
  fetchVerificationHistory: async () => {
    try {
      const history = await getVerificationHistory();
      set({ verificationHistory: history });
    } catch {
      // History is supplementary; do not surface errors to the user.
    }
  },
}));

export default useVerifyStore;
