import React from 'react';
import { motion } from 'framer-motion';

export default function PageSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col items-center gap-4"
      >
        {/* Spinner ring */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-teal-bg" />
          <div className="absolute inset-0 rounded-full border-4 border-teal border-t-transparent animate-spin" />
        </div>
        <p className="text-sm text-text-muted font-medium">Loading...</p>
      </motion.div>
    </div>
  );
}
