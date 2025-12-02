"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { PerformanceWrapper } from '@/components/PerformanceWrapper';

const ReportWizard = dynamic(() => import("@/components/report/ReportWizard").then(mod => ({ default: mod.ReportWizard })), {
  loading: () => (
    <div className="flex items-center justify-center p-8">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent"></div>
    </div>
  ),
  ssr: false,
});

export default function SubmitReport() {
  return (
    <PerformanceWrapper pageName="submit-report">
      <div className="relative min-h-screen bg-black selection:bg-sky-500/20 overflow-hidden">
        {/* Gradient Background */}
        <div className="fixed inset-0 -z-10 min-h-screen">
          <div className="absolute inset-0 h-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.05),transparent_50%)]" />
          <div className="absolute inset-0 h-full bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.06),transparent_70%)]" />
          {/* Floating orbs */}
          <div className="absolute top-40 left-20 w-72 h-72 bg-sky-500/20 rounded-full blur-3xl animate-pulse hidden md:block" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000 hidden md:block" />
        
          {/* Mobile orbs */}
          <div className="absolute top-32 left-1/4 w-40 h-40 bg-sky-500/15 rounded-full blur-2xl animate-pulse md:hidden" />
          <div className="absolute bottom-32 right-1/4 w-48 h-48 bg-blue-600/15 rounded-full blur-2xl animate-pulse delay-700 md:hidden" />
        </div>

        <main className="relative px-4 pt-20 pb-12 sm:px-6 sm:pt-24 md:pt-32 md:pb-16">
          <div className="mx-auto max-w-3xl">
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center text-center"
            >
              <div className="inline-flex h-7 items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 text-xs text-sky-400 sm:h-8 sm:px-3 sm:text-sm">
                <svg
                  className="h-3 w-3 sm:h-4 sm:w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Accident and Crime Reporting
              </div>

              <h1 className="mt-4 bg-gradient-to-b from-white to-white/80 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl md:text-4xl lg:text-5xl">
                Submit Incident Report
              </h1>

              <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-400 sm:mt-4 sm:max-w-2xl sm:text-base md:text-lg">
                Your safety is our priority. All submissions are encrypted,
                anonymized, and reviewed by the appropriate authorities.
              </p>
            </motion.div>

            {/* Trust Badges */}
            <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs text-zinc-400 sm:gap-4 sm:text-sm md:mt-8">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                End-to-End Encryption
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-sky-500 animate-pulse" />
                Anonymous Submission
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-yellow-500 animate-pulse" />
                Secure Database
              </div>
            </div>

            {/* Report Form */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mt-8 bg-neutral-900/60 rounded-xl border border-white/10 p-3 shadow-xl backdrop-blur-md sm:p-5 sm:rounded-2xl md:mt-12 md:p-6"
            >
              <ReportWizard />
            </motion.div>
          </div>
        </main>
      </div>
    </PerformanceWrapper>
  );
}