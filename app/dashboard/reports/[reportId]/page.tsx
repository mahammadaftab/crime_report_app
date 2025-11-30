"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Report, ReportStatus } from "@prisma/client";
import Image from "next/image";

export default function ReportDetails({ params }: { params: { reportId: string } }) {
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`/api/reports/${params.reportId}/details`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch report");
        }
        
        setReport(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (params.reportId) {
      fetchReport();
    }
  }, [params.reportId]);

  const getStatusColor = (status: ReportStatus) => {
    const colors = {
      PENDING: "bg-amber-500/10 text-amber-400 border border-amber-500/30",
      IN_PROGRESS: "bg-sky-500/10 text-sky-400 border border-sky-500/30",
      RESOLVED: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
      DISMISSED: "bg-neutral-500/10 text-neutral-400 border border-neutral-500/30",
    };
    return colors[status];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="rounded-full h-12 w-12 border-b-2 border-sky-500"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white">
        <nav className="border-b border-white/10 bg-black/50 backdrop-blur-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent">
              Report Details
            </h1>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
            >
              Back
            </button>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
            <h2 className="text-xl font-bold text-red-400 mb-2">Error</h2>
            <p className="text-neutral-300">{error}</p>
          </div>
        </main>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-black text-white">
        <nav className="border-b border-white/10 bg-black/50 backdrop-blur-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent">
              Report Details
            </h1>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
            >
              Back
            </button>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-neutral-900/50 rounded-xl p-6 text-center">
            <h2 className="text-xl font-bold text-neutral-300 mb-2">Report Not Found</h2>
            <p className="text-neutral-500">The requested report could not be found.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent">
            Report Details
          </h1>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
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
                <h1 className="text-2xl font-bold text-white">{report.title}</h1>
                <p className="text-neutral-400 mt-1">{report.reportType}</p>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                  report.status
                )}`}
              >
                {report.status}
              </span>
            </div>
          </div>

          {/* Report Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div>
                <h2 className="text-lg font-semibold text-white mb-2">Description</h2>
                <p className="text-neutral-300 bg-neutral-800/50 p-4 rounded-lg">
                  {report.description}
                </p>
              </div>

              {/* Location */}
              {report.location && (
                <div>
                  <h2 className="text-lg font-semibold text-white mb-2">Location</h2>
                  <p className="text-neutral-300 bg-neutral-800/50 p-4 rounded-lg">
                    {report.location}
                  </p>
                </div>
              )}

              {/* Reporter Information */}
              {(report.reporterName || report.reporterPhone) && (
                <div>
                  <h2 className="text-lg font-semibold text-white mb-2">Reporter Information</h2>
                  <div className="bg-neutral-800/50 p-4 rounded-lg space-y-2">
                    {report.reporterName && (
                      <p className="text-neutral-300">
                        <span className="font-medium">Name:</span> {report.reporterName}
                      </p>
                    )}
                    {report.reporterPhone && (
                      <p className="text-neutral-300">
                        <span className="font-medium">Phone:</span> {report.reporterPhone}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Report Metadata */}
              <div className="bg-neutral-800/50 p-4 rounded-lg">
                <h3 className="font-semibold text-white mb-3">Report Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Report ID:</span>
                    <span className="text-neutral-200 font-mono">{report.reportId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Type:</span>
                    <span className="text-neutral-200">{report.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Created:</span>
                    <span className="text-neutral-200">
                      {new Date(report.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Last Updated:</span>
                    <span className="text-neutral-200">
                      {new Date(report.updatedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Image */}
              {report.image && (
                <div>
                  <h3 className="font-semibold text-white mb-3">Incident Image</h3>
                  <div className="bg-neutral-800/50 p-4 rounded-lg">
                    <Image
                      src={report.image}
                      alt="Incident"
                      width={600}
                      height={400}
                      className="w-full rounded-lg border border-neutral-700 cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setIsImageZoomed(true)}
                    />
                    <p className="text-xs text-neutral-500 mt-2 text-center">Click to zoom</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </main>

      {/* Image Zoom Modal - Full Screen */}
      <AnimatePresence>
        {isImageZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[100] flex items-center justify-center p-0"
            onClick={() => setIsImageZoomed(false)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="relative w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={report.image || ""}
                alt="Incident"
                fill
                className="object-contain"
              />
              <button
                onClick={() => setIsImageZoomed(false)}
                className="absolute top-6 right-6 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-colors z-[101]"
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}