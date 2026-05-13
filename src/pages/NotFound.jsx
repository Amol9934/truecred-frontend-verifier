import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | TrueCred</title>
        <meta name="description" content="The page you are looking for does not exist." />
      </Helmet>

      <div className="min-h-[80vh] flex items-center justify-center bg-background px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="text-center max-w-md"
        >
          {/* 404 visual */}
          <div className="relative mb-8">
            <div className="text-[8rem] font-black text-teal-bg leading-none select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="w-16 h-16 text-teal opacity-60" strokeWidth={1.5} />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-text-primary mb-3">
            Page Not Found
          </h1>
          <p className="text-text-muted mb-8 leading-relaxed">
            The page you're looking for doesn't exist or may have been moved.
            Try going back to the homepage to verify a credential.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="btn-primary text-sm px-6 py-2.5 rounded-lg"
            >
              <Home className="w-4 h-4" />
              Go to Homepage
            </Link>
            <button
              onClick={() => window.history.back()}
              className="btn-outline text-sm px-6 py-2.5 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
