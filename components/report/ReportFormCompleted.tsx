"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ReportSubmittedProps {
  data: unknown;
  onComplete: (data: unknown) => void;
}

export function ReportSubmitted({ data }: ReportSubmittedProps) {
  const router = useRouter();
  const reportId = (data as { reportId?: string })?.reportId || "ERROR-ID-NOT-FOUND";
  const [copied, setCopied] = useState(false);
  const [pasted, setPasted] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(reportId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    });
  };

  const pasteReportId = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setPasted(true);
      setTimeout(() => setPasted(false), 2000); // Reset after 2 seconds
      // Navigate to track report page with the pasted ID
      router.push(`/track-report?reportId=${encodeURIComponent(text)}`);
    } catch (error) {
      console.error("Error reading clipboard:", error);
      alert("Failed to read clipboard contents");
    }
  };

  const trackReport = () => {
    router.push(`/track-report?reportId=${encodeURIComponent(reportId)}`);
  };

  return (
    <div className="text-center space-y-5 sm:space-y-6">
      <div className="flex flex-col items-center">
        <div className="bg-green-500/10 rounded-full p-2 sm:p-3">
          <svg
            className="w-12 h-12 text-green-500 sm:w-16 sm:h-16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="mt-3 text-lg font-medium text-white sm:mt-4 sm:text-xl">
          Report Successfully Submitted
        </h3>
        <p className="mt-1 text-xs text-zinc-400 sm:mt-2 sm:text-sm">
          Your report has been securely transmitted to law enforcement
        </p>
      </div>

      <div className="bg-zinc-800/50 rounded-lg p-4 max-w-md mx-auto sm:p-6">
        <h4 className="text-white font-medium mb-2 text-sm sm:text-base">Your Report ID</h4>
        <div className="bg-zinc-900 rounded p-2 flex items-center justify-between sm:p-3">
          <code className="text-sky-400 text-xs sm:text-sm truncate max-w-[180px] sm:max-w-none">{reportId}</code>
          <button
            onClick={copyToClipboard}
            className="ml-2 bg-sky-500 hover:bg-sky-600 text-white px-2 py-1 rounded text-xs flex items-center sm:px-3 sm:py-1 sm:text-sm"
          >
            {copied ? (
              <>
                <svg className="w-3 h-3 mr-1 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="hidden xs:inline">Copied!</span>
                <span className="xs:hidden">✓</span>
              </>
            ) : (
              <>
                <svg className="w-3 h-3 mr-1 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span className="hidden xs:inline">Copy</span>
                <span className="xs:hidden">⧉</span>
              </>
            )}
          </button>
        </div>
        <div className="mt-2 flex justify-center sm:mt-3">
          <button
            onClick={pasteReportId}
            className="bg-sky-500 hover:bg-sky-600 text-white px-2 py-1 rounded text-xs flex items-center sm:px-3 sm:py-1 sm:text-sm"
          >
            {pasted ? (
              <>
                <svg className="w-3 h-3 mr-1 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="hidden xs:inline">Pasted!</span>
                <span className="xs:hidden">✓</span>
              </>
            ) : (
              <>
                <svg className="w-3 h-3 mr-1 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002-2h2a2 2 0 002 2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="hidden xs:inline">Paste Report ID</span>
                <span className="xs:hidden">📋</span>
              </>
            )}
          </button>
        </div>
        <p className="mt-2 text-xs text-zinc-400 sm:text-sm">
          Save this ID to check your report status or communicate securely with
          law enforcement
        </p>
      </div>

      <div className="flex flex-col gap-2 justify-center pt-2 sm:pt-4 sm:flex-row sm:gap-3">
        <button
          onClick={trackReport}
          className="inline-flex items-center justify-center rounded-lg bg-sky-500 px-3 py-2 text-xs font-medium text-white hover:bg-sky-400 sm:px-4 sm:py-2 sm:text-sm"
        >
          <svg className="w-3 h-3 mr-1 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Track This Report
        </button>
        
        <button
          onClick={pasteReportId}
          className="inline-flex items-center justify-center rounded-lg bg-zinc-700 px-3 py-2 text-xs font-medium text-white hover:bg-zinc-600 sm:px-4 sm:py-2 sm:text-sm"
        >
          <svg className="w-3 h-3 mr-1 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002-2h2a2 2 0 002 2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Paste & Track
        </button>
      </div>

      <div className="pt-3 sm:pt-4">
        <button
          onClick={() => (window.location.href = "/")}
          className="inline-flex items-center justify-center rounded-lg bg-gray-700 px-3 py-2 text-xs font-medium text-white hover:bg-gray-600 sm:px-4 sm:py-2 sm:text-sm"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}