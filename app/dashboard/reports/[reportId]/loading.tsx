"use client";

import { motion } from "framer-motion";

export default function ReportDetailsLoading() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent">
            Report Details
          </h1>
          <div className="w-32 h-10 bg-neutral-800 rounded-lg animate-pulse"></div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-neutral-900/60 backdrop-blur-md rounded-xl p-6 border border-white/10"
        >
          {/* Report Header */}
          <div className="border-b border-white/10 pb-6 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="h-8 w-64 bg-neutral-800 rounded-lg animate-pulse mb-2"></div>
                <div className="h-4 w-32 bg-neutral-800 rounded-lg animate-pulse"></div>
              </div>
              <div className="h-8 w-24 bg-neutral-800 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Report Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div>
                <div className="h-6 w-32 bg-neutral-800 rounded-lg animate-pulse mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-neutral-800 rounded-lg animate-pulse"></div>
                  <div className="h-4 bg-neutral-800 rounded-lg animate-pulse w-5/6"></div>
                  <div className="h-4 bg-neutral-800 rounded-lg animate-pulse w-4/6"></div>
                </div>
              </div>

              {/* Location */}
              <div>
                <div className="h-6 w-24 bg-neutral-800 rounded-lg animate-pulse mb-4"></div>
                <div className="h-12 bg-neutral-800 rounded-lg animate-pulse"></div>
              </div>

              {/* Reporter Information */}
              <div>
                <div className="h-6 w-48 bg-neutral-800 rounded-lg animate-pulse mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-neutral-800 rounded-lg animate-pulse"></div>
                  <div className="h-4 bg-neutral-800 rounded-lg animate-pulse w-3/4"></div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Report Metadata */}
              <div className="bg-neutral-800/50 p-4 rounded-lg">
                <div className="h-6 w-40 bg-neutral-800 rounded-lg animate-pulse mb-4"></div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <div className="h-4 w-20 bg-neutral-800 rounded-lg animate-pulse"></div>
                    <div className="h-4 w-32 bg-neutral-800 rounded-lg animate-pulse"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-4 w-16 bg-neutral-800 rounded-lg animate-pulse"></div>
                    <div className="h-4 w-24 bg-neutral-800 rounded-lg animate-pulse"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-4 w-20 bg-neutral-800 rounded-lg animate-pulse"></div>
                    <div className="h-4 w-40 bg-neutral-800 rounded-lg animate-pulse"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-4 w-24 bg-neutral-800 rounded-lg animate-pulse"></div>
                    <div className="h-4 w-40 bg-neutral-800 rounded-lg animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Image */}
              <div>
                <div className="h-6 w-32 bg-neutral-800 rounded-lg animate-pulse mb-4"></div>
                <div className="h-48 bg-neutral-800 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}