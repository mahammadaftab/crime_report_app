"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Loader } from "lucide-react";

interface ReportDetails {
  id: string;
  reportId: string;
  status: string;
  createdAt: string;
  title: string;
  description: string;
  location: string;
}

export function ClientReportTracker() {
  const searchParams = useSearchParams();
  const [reportId, setReportId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportDetails, setReportDetails] = useState<ReportDetails | null>(
    null
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Populate report ID from URL parameters on component mount
  useEffect(() => {
    const reportIdFromUrl = searchParams.get("reportId");
    if (reportIdFromUrl) {
      setReportId(reportIdFromUrl);
      // Auto-submit the form after a short delay to allow state to update
      setTimeout(() => {
        const form = document.querySelector('form');
        if (form) {
          const event = new Event('submit', { cancelable: true, bubbles: true });
          form.dispatchEvent(event);
        }
      }, 100);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setReportDetails(null);
    setLoading(true);

    if (!reportId.trim()) {
      setError("Please enter a report ID");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/reports/${reportId}/details`);
      if (!response.ok) {
        throw new Error("Report not found");
      }
      const data = await response.json();
      setReportDetails(data);
    } catch (error) {
      console.error("Error fetching report:", error);
      setError("Unable to find report. Please check the ID and try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyReportId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000); // Reset after 2 seconds
  };

  const pasteReportId = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setReportId(text);
      setError(""); // Clear any previous errors
    } catch (error) {
      console.error("Error reading clipboard:", error);
      setError("Failed to read clipboard contents");
    }
  };
  
  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="text-center mb-5 sm:mb-6 md:mb-8">
        <div className="inline-flex h-7 items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 text-xs text-sky-400 sm:h-8 sm:px-3 sm:text-sm">
          <Search className="w-3 h-3 sm:w-4 sm:h-4" />
          Track Your Report Status
        </div>
        <h1 className="mt-3 bg-gradient-to-b from-white to-white/80 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl md:text-4xl lg:text-5xl">
          Track Your Report
          <span className="block bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent text-base sm:text-xl md:text-2xl">
            Stay Informed
          </span>
        </h1>
        <p className="mt-2 text-zinc-400 max-w-md mx-auto text-xs sm:text-sm sm:mt-3 sm:max-w-xl md:text-base">
          Enter your report ID to check the current status and updates
        </p>
      </div>

      {/* Dynamic Layout Container */}
      <div className="flex justify-center">
        <div
          className={`transition-all duration-300 ease-in-out 
          ${
            reportDetails
              ? "w-full grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6"
              : "max-w-lg w-full"
          }`}
        >
          {/* Form Section */}
          <div
            className={`bg-zinc-900/50 backdrop-blur-xl rounded-xl border 
            border-white/5 p-4 w-full transition-all duration-300 sm:p-5 md:p-6
            ${reportDetails ? "" : "mx-auto"}`}
          >
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div className="relative">
                <label
                  htmlFor="reportId"
                  className="block text-xs font-medium mb-2 text-zinc-400 sm:text-sm"
                >
                  Report ID
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="reportId"
                    value={reportId}
                    onChange={(e) => setReportId(e.target.value)}
                    className="flex-1 px-3 py-2.5 bg-black/50 border border-white/5 rounded-lg
                             text-white placeholder-zinc-500 focus:outline-none focus:ring-2 
                             focus:ring-sky-500/50 focus:border-transparent transition-all text-sm sm:px-4 sm:py-3"
                    placeholder="Enter your report ID"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={pasteReportId}
                    className="px-2.5 py-2.5 bg-sky-500 hover:bg-sky-600 rounded-lg text-white flex items-center justify-center transition-colors text-xs sm:px-3 sm:py-3 sm:text-sm"
                    title="Paste Report ID"
                  >
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002-2h2a2 2 0 002 2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span className="hidden sm:inline sm:ml-1">Paste</span>
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 p-3 rounded-lg border border-red-500/20 sm:text-sm sm:p-4">
                  <svg
                    className="h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-sky-500 to-blue-600 
                         text-white py-2.5 px-4 rounded-lg hover:from-sky-400 
                         hover:to-blue-500 transition-all duration-200 
                         disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center space-x-2 text-sm sm:py-3 sm:text-base"
              >
                {loading ? (
                  <Loader className="w-4 h-4 animate-spin sm:w-5 sm:h-5" />
                ) : (
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
                <span>{loading ? "Searching..." : "Track Report"}</span>
              </button>
            </form>
          </div>

          {/* Results Section */}
          <div
            className={`transition-all duration-300 
            ${
              reportDetails
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-8 absolute"
            }`}
          >
            {reportDetails && (
              <div className="rounded-xl border border-white/5 bg-black/30 backdrop-blur-xl p-4 h-full sm:p-5 md:p-6">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4 sm:mb-5 md:text-xl">
                  <div className="h-2 w-2 rounded-full bg-sky-400" />
                  Report Details
                </h2>

                <div className="grid gap-3 sm:gap-4">
                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-white/5 sm:p-3">
                    <span className="text-zinc-400 text-xs sm:text-sm">Status</span>
                    <span
                      className={`font-medium ${getStatusColor(
                        reportDetails.status
                      )} 
                        px-2.5 py-1 rounded-full bg-white/5 text-xs`}
                    >
                      {reportDetails.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-white/5 sm:p-3">
                    <span className="text-zinc-400 text-xs sm:text-sm">Report ID</span>
                    <div className="flex items-center">
                      <span className="text-white font-mono mr-2 text-xs">
                        {reportDetails.reportId || reportDetails.id}
                      </span>
                      <button
                        onClick={() => copyReportId(reportDetails.reportId || reportDetails.id)}
                        className="text-sky-400 hover:text-sky-300"
                        title="Copy Report ID"
                      >
                        {copiedId === (reportDetails.reportId || reportDetails.id) ? (
                          <svg className="w-3.5 h-3.5 text-green-400 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-white/5 sm:p-3">
                    <span className="text-zinc-400 text-xs sm:text-sm">Submitted On</span>
                    <span className="text-white text-xs sm:text-sm">
                      {new Date(reportDetails.createdAt).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white/5 space-y-1.5 sm:p-3">
                    <span className="text-zinc-400 text-xs sm:text-sm">Title</span>
                    <span className="text-white block font-medium text-xs sm:text-sm">
                      {reportDetails.title}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white/5 space-y-1.5 sm:p-3">
                    <span className="text-zinc-400 text-xs sm:text-sm">Location</span>
                    <span className="text-white block font-medium text-xs sm:text-sm">
                      {reportDetails.location}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white/5 space-y-1.5 sm:p-3">
                    <span className="text-zinc-400 text-xs sm:text-sm">Description</span>
                    <p className="text-white text-xs leading-relaxed sm:text-sm">
                      {reportDetails.description}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    pending: "text-yellow-400",
    processing: "text-sky-400",
    completed: "text-emerald-400",
    failed: "text-red-400",
  };
  return statusColors[status.toLowerCase()] || "text-white";
}