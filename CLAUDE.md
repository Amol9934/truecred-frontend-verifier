# TrueCred Verifier Portal — CLAUDE.md

## Project Overview

**TrueCred** is a cryptographically secure academic certificate verification platform built for **SIH 2025** (Team ID: 67239, Problem Statement: 25029).

This repo (`frontend_verifier/`) is the **public-facing Verifier Portal** — used by employers, recruiters, government bodies, and the public to verify certificate authenticity.

## Stack

| Tool | Version | Purpose |
|---|---|---|
| React | 18.3.x | UI framework |
| Vite | 5.x | Build tool, dev server |
| Tailwind CSS | 3.4.x | Styling |
| Zustand | 5.x | Global state |
| Framer Motion | 11.x | Animations |
| Lucide React | 0.469.x | Icons |
| html5-qrcode | 2.3.x | QR scanning (camera + file) |
| react-helmet-async | 2.x | SEO meta tags |
| react-hot-toast | 2.x | Notifications |
| React Router DOM | 7.x | Routing |

## Commands

```bash
npm run dev       # start dev server → http://localhost:5173
npm run build     # production build → dist/
npm run preview   # preview production build
```

## Folder Structure

```
frontend_verifier/
├── public/               # Static assets (logo.svg, favicon.ico)
├── src/
│   ├── api/
│   │   ├── verify.js     # Mock certificate verification API
│   │   └── employer.js   # Mock employer auth/stats API
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Layout.jsx  # Navbar + Outlet + Footer wrapper
│   │   ├── verify/
│   │   │   ├── VerifyInput.jsx      # Tab switcher: manual ID + QR scanner
│   │   │   ├── QRScanner.jsx        # html5-qrcode camera + file upload
│   │   │   ├── ResultCard.jsx       # Routes to correct result component
│   │   │   ├── AuthenticBanner.jsx  # Green verified banner
│   │   │   ├── ForgedBanner.jsx     # Red invalid banner + report modal
│   │   │   └── CertificateDetails.jsx  # Full cert info card
│   │   ├── employer/
│   │   │   ├── BulkVerifyUpload.jsx  # Drag-drop CSV upload
│   │   │   ├── BulkResultTable.jsx   # Paginated results table + CSV export
│   │   │   └── EmployerStats.jsx     # Animated stat cards
│   │   └── ui/
│   │       ├── Button.jsx    # variants: primary|secondary|outline|danger|ghost
│   │       ├── Badge.jsx     # variants: authentic|forged|pending|default
│   │       ├── Spinner.jsx   # Framer Motion rotating SVG spinner
│   │       └── PageSpinner.jsx  # Full-page Suspense fallback
│   ├── pages/
│   │   ├── Home.jsx              # /
│   │   ├── VerifyResult.jsx      # /result/:certId
│   │   ├── HowItWorks.jsx        # /how-it-works
│   │   ├── EmployerLogin.jsx     # /employer/login
│   │   ├── EmployerDashboard.jsx # /employer/dashboard (protected)
│   │   ├── BulkVerify.jsx        # /employer/bulk (protected)
│   │   ├── APIDocs.jsx           # /docs/api
│   │   └── NotFound.jsx          # * (404)
│   ├── store/
│   │   └── verifyStore.js   # Zustand store: result, loading, error, employer
│   ├── utils/
│   │   ├── formatCert.js    # formatDate, truncateHash, formatCertId, generateQRData
│   │   └── statusHelpers.js # getStatusColor, getStatusLabel, getStatusIcon
│   ├── App.jsx      # Route definitions with AnimatePresence
│   ├── main.jsx     # React 18 createRoot + BrowserRouter + HelmetProvider
│   └── index.css    # Tailwind directives + custom scrollbar + base styles
├── index.html
├── .env
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Routing

| Route | Page | Auth Required |
|---|---|---|
| `/` | Home / Verify | No |
| `/result/:certId` | Verification Result | No |
| `/how-it-works` | How It Works | No |
| `/employer/login` | Employer Login | No |
| `/docs/api` | API Docs | No |
| `/employer/dashboard` | Employer Dashboard | Yes (localStorage token) |
| `/employer/bulk` | Bulk CSV Verify | Yes (localStorage token) |

Protected routes redirect to `/employer/login` if no `truecred_employer_token` in localStorage.

## Design System

### Color Tokens

```js
teal:       { DEFAULT: '#0F6E56', light: '#1D9E75', bg: '#E1F5EE' }
trust:      '#1B3A5C'   // navbar, secondary headings
success:    '#166534'   // authentic result
danger:     '#991B1B'   // forged result
warning:    '#92400E'   // pending result
background: '#F9FAFB'   // page background
surface:    '#FFFFFF'   // cards, panels
```

Use `text-primary` (`#111827`) for headings, `text-muted` (`#6B7280`) for captions.

### Key UI Conventions
- Navbar: fixed, 60px, `bg-teal` (`#0F6E56`), white text
- Cards: white surface, `rounded-xl shadow-md`
- Page padding: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- All pages have `pt-[60px]` to clear the fixed navbar (set in Layout.jsx)
- Framer Motion: use `whileInView` + `staggerChildren` for section cards; `AnimatePresence mode="wait"` for page transitions

## Mock API Behaviour

The API layer (`src/api/verify.js`) uses fake delays and routes on cert ID prefix:

| Prefix | Result | Delay |
|---|---|---|
| `TC-` | Authentic | 1500ms |
| `FG-` | Forged | 1500ms |
| `PD-` | Pending | 1500ms |
| anything else | Error (not found) | 1500ms |

Try: `TC-2024-IIT-0042`, `FG-9999`, `PD-001`

Employer login (`src/api/employer.js`) accepts any email + password (demo mode).

## Zustand Store

```js
// src/store/verifyStore.js
{
  result: null,           // last verification result object
  loading: false,
  error: null,
  employer: null,         // loaded from localStorage on init
  verificationHistory: [],

  // actions
  verifyCert(certId),
  clearResult(),
  loginEmployer({ email, password }),
  logoutEmployer(),
  loadEmployerFromStorage(),
}
```

Employer session is persisted under the key `truecred_employer_token` in localStorage.

## Environment Variables

```env
VITE_API_BASE_URL=http://localhost:8000/api   # proxied by Vite dev server
VITE_APP_NAME=TrueCred
VITE_APP_ENV=development
```

Vite proxies `/api/*` → `http://localhost:8000` (strips `/api` prefix). In production, point `VITE_API_BASE_URL` at the real Django backend.

## Backend Integration (when ready)

Replace mock functions in `src/api/verify.js` and `src/api/employer.js` with real `axios` calls to the Django REST API at `http://localhost:8000/api`. The Vite dev proxy is already configured.

Expected backend endpoints:
- `GET  /api/verify/{certId}/`
- `POST /api/verify/bulk/`
- `POST /api/employer/auth/`
- `GET  /api/employer/stats/`
- `GET  /api/employer/history/`

## Notes

- `html5-qrcode` requires a DOM element with id `"qr-reader"` — do not reuse that id elsewhere
- QR scanner cleanup must call `.stop().catch(() => {})` in `useEffect` return to avoid double-init errors
- `react-helmet-async` requires `<HelmetProvider>` wrapping the app in `main.jsx` — already wired
- All pages are lazy-loaded via `React.lazy` + `Suspense` for optimal bundle splitting
