import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/layout/Layout.jsx';
import PageSpinner from './components/ui/PageSpinner.jsx';

// Lazy-loaded page components
const Home = lazy(() => import('./pages/Home.jsx'));
const VerifyResult = lazy(() => import('./pages/VerifyResult.jsx'));
const HowItWorks = lazy(() => import('./pages/HowItWorks.jsx'));
const EmployerLogin = lazy(() => import('./pages/EmployerLogin.jsx'));
const EmployerDashboard = lazy(() => import('./pages/EmployerDashboard.jsx'));
const BulkVerify = lazy(() => import('./pages/BulkVerify.jsx'));
const APIDocs = lazy(() => import('./pages/APIDocs.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

// Protected Route wrapper - checks for employer session
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('truecred_employer_token');
  if (!token) {
    return <Navigate to="/employer/login" replace />;
  }
  return children;
}

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        {/* All routes wrapped with Layout (Navbar + Outlet + Footer) */}
        <Route element={<Layout />}>
          {/* Public routes */}
          <Route
            index
            path="/"
            element={
              <Suspense fallback={<PageSpinner />}>
                <Home />
              </Suspense>
            }
          />
          <Route
            path="/result/:certId"
            element={
              <Suspense fallback={<PageSpinner />}>
                <VerifyResult />
              </Suspense>
            }
          />
          <Route
            path="/how-it-works"
            element={
              <Suspense fallback={<PageSpinner />}>
                <HowItWorks />
              </Suspense>
            }
          />
          <Route
            path="/employer/login"
            element={
              <Suspense fallback={<PageSpinner />}>
                <EmployerLogin />
              </Suspense>
            }
          />
          <Route
            path="/docs/api"
            element={
              <Suspense fallback={<PageSpinner />}>
                <APIDocs />
              </Suspense>
            }
          />

          {/* Protected employer routes */}
          <Route
            path="/employer/dashboard"
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageSpinner />}>
                  <EmployerDashboard />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/bulk"
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageSpinner />}>
                  <BulkVerify />
                </Suspense>
              </ProtectedRoute>
            }
          />

          {/* 404 fallback */}
          <Route
            path="*"
            element={
              <Suspense fallback={<PageSpinner />}>
                <NotFound />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}
