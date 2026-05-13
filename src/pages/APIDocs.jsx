/**
 * APIDocs.jsx — TrueCred API Documentation page.
 *
 * Sections: Base URL, Endpoints, Authentication, Rate Limiting
 * Features: Language selector tabs (cURL / JavaScript / Python)
 */

import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Code2, Shield, Zap, Key, BookOpen, ChevronRight, Copy, Check } from 'lucide-react';

// ── Constants ─────────────────────────────────────────────────────────────────

const BASE_URL = 'https://api.truecred.in/v1';

// ── Code examples per endpoint + language ────────────────────────────────────

const CODE_EXAMPLES = {
  'GET /verify/{certId}': {
    curl: `curl -X GET "${BASE_URL}/verify/TC-2024-IIT-0042" \\
  -H "Authorization: Bearer YOUR_API_TOKEN" \\
  -H "Accept: application/json"`,
    javascript: `const response = await fetch(
  '${BASE_URL}/verify/TC-2024-IIT-0042',
  {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer YOUR_API_TOKEN',
      'Accept': 'application/json',
    },
  }
);

const data = await response.json();
console.log(data);`,
    python: `import requests

url = f"${BASE_URL}/verify/TC-2024-IIT-0042"
headers = {
    "Authorization": "Bearer YOUR_API_TOKEN",
    "Accept": "application/json",
}

response = requests.get(url, headers=headers)
data = response.json()
print(data)`,
  },
  'POST /verify/bulk': {
    curl: `curl -X POST "${BASE_URL}/verify/bulk" \\
  -H "Authorization: Bearer YOUR_API_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"certIds":["TC-2024-0001","FG-2023-0874","PD-2024-0102"]}'`,
    javascript: `const response = await fetch(
  '${BASE_URL}/verify/bulk',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_TOKEN',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      certIds: [
        'TC-2024-0001',
        'FG-2023-0874',
        'PD-2024-0102',
      ],
    }),
  }
);

const data = await response.json();
console.log(data);`,
    python: `import requests

url = "${BASE_URL}/verify/bulk"
headers = {
    "Authorization": "Bearer YOUR_API_TOKEN",
    "Content-Type": "application/json",
}
payload = {
    "certIds": [
        "TC-2024-0001",
        "FG-2023-0874",
        "PD-2024-0102",
    ]
}

response = requests.post(url, json=payload, headers=headers)
data = response.json()
print(data)`,
  },
  'POST /employer/auth': {
    curl: `curl -X POST "${BASE_URL}/employer/auth" \\
  -H "Content-Type: application/json" \\
  -d '{"email":"admin@company.com","password":"yourpassword"}'`,
    javascript: `const response = await fetch(
  '${BASE_URL}/employer/auth',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@company.com',
      password: 'yourpassword',
    }),
  }
);

const { token, employer } = await response.json();
// Store token for subsequent requests
localStorage.setItem('truecred_token', token);`,
    python: `import requests

url = "${BASE_URL}/employer/auth"
payload = {
    "email": "admin@company.com",
    "password": "yourpassword",
}

response = requests.post(url, json=payload)
data = response.json()

token = data["token"]
employer = data["employer"]
print(f"Authenticated as: {employer['name']}")`,
  },
};

// ── Endpoints meta ────────────────────────────────────────────────────────────

const ENDPOINTS = [
  {
    method: 'GET',
    path: '/verify/{certId}',
    summary: 'Verify a single certificate',
    description:
      'Looks up a certificate by its unique ID, verifies the cryptographic hash and threshold signature, and returns the verification result.',
    request: {
      params: [
        { name: 'certId', type: 'string', required: true, desc: 'The unique certificate identifier (e.g. TC-2024-IIT-0042)' },
      ],
      headers: [
        { name: 'Authorization', value: 'Bearer <token>', desc: 'Required for authenticated requests' },
      ],
    },
    response: `{
  "status": "authentic",
  "certId": "TC-2024-IIT-0042",
  "studentName": "Arjun Sharma",
  "degree": "B.Tech Computer Science",
  "institution": "IIT Delhi",
  "issueDate": "2024-05-15",
  "grade": "First Class with Distinction",
  "digitalFingerprint": "sha256:a3f1...",
  "blockchainTxHash": "0x7e3b...",
  "verificationTimestamp": "2026-05-14T10:30:00Z"
}`,
    methodColor: 'bg-[#E1F5EE] text-[#0F6E56]',
  },
  {
    method: 'POST',
    path: '/verify/bulk',
    summary: 'Bulk verify certificates',
    description:
      'Accepts an array of certificate IDs and returns a verification result for each. Individual failures are returned as error-status entries rather than rejecting the entire request.',
    request: {
      params: [],
      body: `{
  "certIds": ["TC-2024-0001", "FG-2023-0874", "PD-2024-0102"]
}`,
    },
    response: `[
  {
    "status": "authentic",
    "certId": "TC-2024-0001",
    "studentName": "Priya Singh",
    ...
  },
  {
    "status": "forged",
    "certId": "FG-2023-0874",
    "reason": "Hash mismatch detected",
    "reportId": "RPT-A4B8C2"
  },
  {
    "status": "pending",
    "certId": "PD-2024-0102",
    "estimatedTime": "24-48 hours"
  }
]`,
    methodColor: 'bg-blue-100 text-blue-700',
  },
  {
    method: 'POST',
    path: '/employer/auth',
    summary: 'Authenticate as employer',
    description:
      'Authenticates an employer with email and password. Returns a bearer token valid for 24 hours. Use this token in the Authorization header for all protected endpoints.',
    request: {
      params: [],
      body: `{
  "email": "admin@company.com",
  "password": "yourpassword"
}`,
    },
    response: `{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "employer": {
    "name": "Admin User",
    "company": "Acme Technologies Pvt. Ltd.",
    "email": "admin@company.com"
  }
}`,
    methodColor: 'bg-blue-100 text-blue-700',
  },
];

// ── Language tabs ─────────────────────────────────────────────────────────────

const LANG_TABS = ['curl', 'javascript', 'python'];

// ── CopyButton ────────────────────────────────────────────────────────────────

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Copy to clipboard"
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

// ── Code Block ────────────────────────────────────────────────────────────────

function CodeBlock({ code, label }) {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-700/50">
      {label && (
        <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-gray-700/50">
          <span className="text-xs text-gray-400 font-medium">{label}</span>
          <CopyButton text={code} />
        </div>
      )}
      <pre
        className="bg-[#1e1e1e] text-gray-200 text-xs font-mono p-4 overflow-x-auto leading-relaxed"
      >
        {code}
      </pre>
    </div>
  );
}

// ── Method Badge ──────────────────────────────────────────────────────────────

function MethodBadge({ method, colorClass }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold tracking-widest uppercase ${colorClass}`}
    >
      {method}
    </span>
  );
}

// ── Endpoint Card ─────────────────────────────────────────────────────────────

function EndpointCard({ endpoint }) {
  const [lang, setLang] = useState('curl');
  const key = `${endpoint.method} ${endpoint.path}`;
  const code = CODE_EXAMPLES[key]?.[lang] ?? '';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <MethodBadge method={endpoint.method} colorClass={endpoint.methodColor} />
          <code className="text-sm font-mono font-bold text-[#111827]">
            {BASE_URL}{endpoint.path}
          </code>
        </div>
        <p className="text-sm text-[#6B7280]">{endpoint.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
        {/* Request section */}
        <div className="px-6 py-5 space-y-4">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Request</h4>

          {endpoint.request.params && endpoint.request.params.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">Path Parameters</p>
              <div className="space-y-2">
                {endpoint.request.params.map((p) => (
                  <div key={p.name} className="flex flex-col gap-0.5 text-xs">
                    <div className="flex items-center gap-2">
                      <code className="font-mono font-semibold text-[#0F6E56]">{p.name}</code>
                      <span className="text-gray-400">{p.type}</span>
                      {p.required && (
                        <span className="text-red-500 font-semibold">required</span>
                      )}
                    </div>
                    <p className="text-[#6B7280] pl-0">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {endpoint.request.headers && endpoint.request.headers.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">Headers</p>
              {endpoint.request.headers.map((h) => (
                <div key={h.name} className="text-xs flex flex-col gap-0.5">
                  <code className="font-mono font-semibold text-[#0F6E56]">
                    {h.name}: {h.value}
                  </code>
                  <p className="text-[#6B7280]">{h.desc}</p>
                </div>
              ))}
            </div>
          )}

          {endpoint.request.body && (
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">Request Body</p>
              <CodeBlock code={endpoint.request.body} />
            </div>
          )}
        </div>

        {/* Response + Code examples */}
        <div className="px-6 py-5 space-y-4">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Response</h4>
          <CodeBlock code={endpoint.response} />

          {/* Language tabs */}
          <div>
            <div className="flex items-center gap-1 mb-3">
              {LANG_TABS.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={[
                    'px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors',
                    lang === l
                      ? 'bg-[#0F6E56] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                  ].join(' ')}
                >
                  {l === 'curl' ? 'cURL' : l === 'javascript' ? 'JavaScript' : 'Python'}
                </button>
              ))}
            </div>
            <CodeBlock code={code} label={lang === 'curl' ? 'cURL' : lang === 'javascript' ? 'JavaScript' : 'Python'} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page Component ────────────────────────────────────────────────────────────

export default function APIDocs() {
  return (
    <>
      <Helmet>
        <title>API Docs — TrueCred</title>
        <meta
          name="description"
          content="TrueCred REST API documentation. Verify certificates programmatically, perform bulk checks, and integrate with your HR systems."
        />
      </Helmet>

      <main>
        {/* ── Hero ── */}
        <section
          className="relative overflow-hidden py-16 sm:py-24"
          style={{ background: 'linear-gradient(135deg, #0F6E56 0%, #1B3A5C 100%)' }}
        >
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full opacity-10 bg-white" />
            <div className="absolute -bottom-12 -right-12 w-64 h-64 rounded-full opacity-10 bg-white" />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-semibold tracking-wide mb-4">
                <Code2 className="w-3.5 h-3.5" />
                REST API v1
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="text-4xl sm:text-5xl font-extrabold text-white mb-4"
            >
              TrueCred API Documentation
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="text-lg text-white/70 max-w-2xl mx-auto mb-6"
            >
              Integrate certificate verification directly into your HR platform, ATS, or
              internal systems with our simple REST API.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-mono text-sm backdrop-blur-sm"
            >
              <span className="text-white/50">Base URL:</span>
              <span className="font-bold">{BASE_URL}</span>
            </motion.div>
          </div>
        </section>

        {/* ── Docs Content ── */}
        <section className="py-12 bg-[#F9FAFB]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

            {/* Quick facts */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { Icon: Shield, label: 'Authentication', body: 'Bearer token in Authorization header' },
                { Icon: Zap,    label: 'Response Format', body: 'JSON — all requests and responses' },
                { Icon: BookOpen, label: 'Versioning',   body: 'Current version: v1 — stable' },
              ].map(({ Icon, label, body }) => (
                <div key={label} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#E1F5EE] flex items-center justify-center shrink-0">
                    <Icon className="w-4.5 h-4.5 text-[#0F6E56] w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#111827]">{label}</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">{body}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Authentication */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7 space-y-4">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-[#0F6E56]" />
                <h2 className="text-lg font-bold text-[#111827]">Authentication</h2>
              </div>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                TrueCred uses Bearer token authentication. Obtain a token by calling{' '}
                <code className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded text-[#0F6E56] font-semibold">
                  POST /employer/auth
                </code>{' '}
                with your credentials. Include the token in all subsequent requests.
              </p>
              <CodeBlock
                code={`Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`}
                label="Request Header"
              />
              <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-[#92400E]">
                <strong>Security Note:</strong> Never expose your API token in client-side code.
                Use server-side requests or environment variables to protect your credentials.
              </div>
            </div>

            {/* Endpoints */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-[#0F6E56]" />
                <h2 className="text-xl font-bold text-[#111827]">Endpoints</h2>
              </div>

              {/* Endpoint nav */}
              <div className="flex flex-wrap gap-2">
                {ENDPOINTS.map((ep) => (
                  <a
                    key={ep.path}
                    href={`#endpoint-${ep.path.replace(/[{}\/]/g, '-').replace(/^-/, '')}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-mono text-gray-600 hover:text-[#0F6E56] hover:border-[#0F6E56] transition-colors"
                  >
                    <ChevronRight className="w-3 h-3" />
                    {ep.method} {ep.path}
                  </a>
                ))}
              </div>

              {ENDPOINTS.map((ep) => (
                <div
                  key={ep.path}
                  id={`endpoint-${ep.path.replace(/[{}\/]/g, '-').replace(/^-/, '')}`}
                >
                  <div className="mb-3 flex items-center gap-2">
                    <MethodBadge method={ep.method} colorClass={ep.methodColor} />
                    <h3 className="text-base font-bold text-[#111827]">{ep.summary}</h3>
                  </div>
                  <EndpointCard endpoint={ep} />
                </div>
              ))}
            </div>

            {/* Rate Limiting */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7 space-y-4">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#0F6E56]" />
                <h2 className="text-lg font-bold text-[#111827]">Rate Limiting</h2>
              </div>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                API requests are rate-limited to prevent abuse. Rate limit headers are included
                in every response.
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border border-gray-100 rounded-xl overflow-hidden">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Plan', 'Requests / Day', 'Bulk Limit', 'Support'].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      { plan: 'Free Tier',    rps: '1,000',     bulk: '100 IDs / batch', support: 'Community' },
                      { plan: 'Pro',          rps: '10,000',    bulk: '1,000 IDs / batch', support: 'Email' },
                      { plan: 'Enterprise',   rps: 'Unlimited', bulk: 'Unlimited',         support: 'Dedicated SLA' },
                    ].map(({ plan, rps, bulk, support }) => (
                      <tr key={plan} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-semibold text-[#111827]">{plan}</td>
                        <td className="px-4 py-3 text-[#6B7280]">{rps}</td>
                        <td className="px-4 py-3 text-[#6B7280]">{bulk}</td>
                        <td className="px-4 py-3 text-[#6B7280]">{support}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-2">Rate Limit Headers</p>
                <CodeBlock
                  code={`X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 847
X-RateLimit-Reset: 1715695200`}
                />
              </div>
            </div>

            {/* Error codes */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7 space-y-4">
              <h2 className="text-lg font-bold text-[#111827]">Error Codes</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border border-gray-100 rounded-xl overflow-hidden">
                  <thead className="bg-gray-50">
                    <tr>
                      {['HTTP Status', 'Code', 'Description'].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      { status: '400', code: 'INVALID_CERT_ID',   desc: 'Certificate ID is missing or malformed' },
                      { status: '401', code: 'UNAUTHORIZED',       desc: 'Missing or invalid bearer token' },
                      { status: '404', code: 'CERT_NOT_FOUND',     desc: 'Certificate not found in registry' },
                      { status: '429', code: 'RATE_LIMIT_EXCEEDED', desc: 'Daily request quota exceeded' },
                      { status: '500', code: 'INTERNAL_ERROR',     desc: 'Unexpected server error' },
                    ].map(({ status, code, desc }) => (
                      <tr key={code} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono font-bold text-[#991B1B]">{status}</td>
                        <td className="px-4 py-3 font-mono text-xs text-[#0F6E56] font-semibold">{code}</td>
                        <td className="px-4 py-3 text-[#6B7280]">{desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </section>
      </main>
    </>
  );
}
