"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Report, ReportStatus, ReportType } from "@prisma/client";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Dashboard() {
  const { status } = useSession();
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [filter, setFilter] = useState<ReportStatus | "ALL">("ALL");
  const [typeFilter, setTypeFilter] = useState<ReportType | "ALL">("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);


  // Redirect unauthenticated users to sign in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  // Fetch reports when user is authenticated
  useEffect(() => {
    if (status === "authenticated") {
      fetchReports();
    }
  }, [status]);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/reports");
      const data = await response.json();
      
      if (response.ok) {
        // Handle new response format
        if (data.reports) {
          setReports(data.reports);
        } else {
          // Handle old format (backward compatibility)
          setReports(Array.isArray(data) ? data : []);
        }
      } else {
        console.error("Error fetching reports:", data.error);
        setReports([]);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      setReports([]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateReportStatus = async (
    reportId: string,
    newStatus: ReportStatus
  ) => {
    try {
      // Optimistically update the UI
      setReports(prevReports => 
        prevReports.map(report => 
          report.id === reportId ? { ...report, status: newStatus } : report
        )
      );

      const response = await fetch(`/api/reports/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        // If the update failed, revert the optimistic update
        fetchReports();
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to update report status");
      } else {
        // Show success message based on status
        if (newStatus === "RESOLVED") {
          toast.success("Report resolved! Reward points awarded to user.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        } else if (newStatus === "DISMISSED" || newStatus === "REJECTED") {
          toast.info(`Report ${newStatus.toLowerCase()}. No reward points awarded.`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        } else {
          toast.info(`Report status updated to ${newStatus}`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      }
    } catch (error) {
      console.error("Error updating report:", error);
      // If there was an error, revert to the previous state
      fetchReports();
      toast.error("Error updating report status");
    }
  };

  const filteredReports = Array.isArray(reports)
    ? reports.filter((report) => {
        const statusMatch = filter === "ALL" || report.status === filter;
        const typeMatch = typeFilter === "ALL" || report.type === typeFilter;
        return statusMatch && typeMatch;
      })
    : [];

  const getStatusColor = (status: ReportStatus) => {
    const colors = {
      PENDING: "bg-amber-500/10 text-amber-400 border border-amber-500/30",
      IN_PROGRESS: "bg-sky-500/10 text-sky-400 border border-sky-500/30",
      RESOLVED: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
      DISMISSED: "bg-neutral-500/10 text-neutral-400 border border-neutral-500/30",
      REJECTED: "bg-red-500/10 text-red-400 border border-red-500/30",
    };
    return colors[status] || "bg-neutral-500/10 text-neutral-400 border border-neutral-500/30";
  };

  // Simple stats
  const safeReports = Array.isArray(reports) ? reports : [];

  const stats = [
    {
      label: "Pending",
      value: safeReports.filter((r) => r.status === "PENDING").length,
    },
    {
      label: "In Progress",
      value: safeReports.filter((r) => r.status === "IN_PROGRESS").length,
    },
    {
      label: "Resolved",
      value: safeReports.filter((r) => r.status === "RESOLVED").length,
    },
  ];

  // Show loading state
  if (status === "loading") {
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

  // Show nothing if not authenticated
  if (status !== "authenticated") {
    return null;
  }

  // Show simplified loading state while fetching reports
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        {/* Navbar */}
        <nav className="border-b border-white/10 bg-black/50 backdrop-blur-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
          </div>
        </nav>

        {/* Main */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-neutral-900/50 border border-white/10 rounded-xl p-4"
              >
                <div className="h-4 bg-neutral-800 rounded w-1/2 mb-3"></div>
                <div className="h-6 bg-neutral-800 rounded w-3/4"></div>
              </motion.div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="h-10 bg-neutral-800 rounded-lg w-24"></div>
            <div className="h-10 bg-neutral-800 rounded-lg w-24"></div>
          </div>

          {/* Reports List Skeleton */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className="bg-neutral-900/50 border border-white/10 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="h-5 bg-neutral-800 rounded w-1/3"></div>
                  <div className="h-6 bg-neutral-800 rounded w-20"></div>
                </div>
                <div className="h-4 bg-neutral-800 rounded w-full mb-2"></div>
                <div className="h-4 bg-neutral-800 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <ToastContainer />
      {/* Navbar */}
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
         
        </div>
      </nav>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl bg-neutral-900/60 p-6 text-center border border-white/10 backdrop-blur-sm hover:border-sky-500/30 transition-all"
            >
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-sm text-neutral-400">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-4">
            <select
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value as ReportStatus | "ALL")
              }
              className="bg-neutral-900 border border-neutral-800 text-neutral-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/20"
            >
              <option value="ALL">All Statuses</option>
              {Object.values(ReportStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value as ReportType | "ALL")
              }
              className="bg-neutral-900 border border-neutral-800 text-neutral-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/20"
            >
              <option value="ALL">All Types</option>
              {Object.values(ReportType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="text-neutral-400">
            {filteredReports.length} Reports
          </div>
        </div>

        {/* Reports */}
        <div className="grid gap-6">
          <AnimatePresence>
            {filteredReports.map((report) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-neutral-900/60 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-sky-500/30 transition-all cursor-pointer"
                onClick={() => router.push(`/dashboard/reports/${report.reportId}`)}
              >
                <div className="flex justify-between items-start gap-6">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-3">
                      <h2 className="text-lg font-semibold text-neutral-100">
                        {report.title}
                      </h2>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          report.status
                        )}`}
                      >
                        {report.status}
                      </span>
                    </div>

                    <p className="text-neutral-400 text-sm">
                      {report.description}
                    </p>

                    <div className="flex flex-wrap gap-6 text-sm text-neutral-500">
                      <span>{report.type}</span>
                      <span>{report.location || "N/A"}</span>
                      <span>
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {report.image && (
                      <div className="relative">
                        <Image
                          src={report.image}
                          alt="Report"
                          width={400}
                          height={160}
                          className="mt-4 rounded-lg border border-neutral-800 max-h-40 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            setZoomedImage(report.image || "");
                          }}
                        />
                        <p className="text-xs text-neutral-500 mt-1 text-center">Click Here Report Details</p>
                      </div>
                    )}
                  </div>

                  <select
                    value={report.status}
                    onChange={(e) => {
                      e.stopPropagation();
                      updateReportStatus(
                        report.id,
                        e.target.value as ReportStatus
                      );
                    }}
                    className="bg-neutral-900 border border-neutral-800 text-neutral-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/20"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {Object.values(ReportStatus).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredReports.length === 0 && (
            <div className="text-center py-16 text-neutral-500 bg-neutral-900/50 rounded-xl border border-white/10">
              No reports found matching the selected filters.
            </div>
          )}
        </div>
      </main>

      {/* Image Zoom Modal - Full Screen */}
      <AnimatePresence>
        {zoomedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[100] flex items-center justify-center p-0"
            onClick={() => setZoomedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="relative w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={zoomedImage}
                alt="Incident"
                fill
                className="object-contain"
              />
              <button
                onClick={() => setZoomedImage(null)}
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