"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [reportCount, setReportCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch report count on client side
    const fetchReportCount = async () => {
      try {
        const response = await fetch("/api/reports/count");
        if (response.ok) {
          const data = await response.json();
          setReportCount(data.count);
        } else {
          setReportCount(0);
        }
      } catch (error) {
        console.error("Error fetching report count:", error);
        setReportCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchReportCount();
  }, []);

  return (
    <main className="relative px-4 pt-20 pb-12 sm:px-6 sm:pt-24 md:pt-32 md:pb-16">
      <div className="mx-auto max-w-6xl">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center">
          <div className="relative inline-flex h-7 items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 text-xs text-sky-400 backdrop-blur-sm shadow-md sm:h-8 sm:px-3 sm:text-sm">
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
            Accident And Crime Report App
          </div>

          <h1 className="mt-6 bg-gradient-to-r from-white via-sky-200 to-white bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
            Report Incident.
            <span className="block animate-gradient bg-gradient-to-r from-sky-400 via-blue-500 to-sky-600 bg-clip-text text-transparent">
              Protect Identity.
            </span>
          </h1>

          <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-400 sm:max-w-2xl sm:text-base sm:mt-4 md:text-lg">
            Make your community safer without compromising your safety. Our
            advanced encryption ensures your identity remains completely
            anonymous.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link href={"/submit-report"}>
              <button className="group relative flex h-10 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 px-5 text-sm font-medium text-white shadow-lg shadow-sky-500/30 transition-all hover:scale-105 hover:shadow-sky-500/50 sm:h-11 sm:px-6">
                Make Incident Report
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 12h14M12 5l7 7-7 7"
                  />
                </svg>
              </button>
            </Link>
            <Link href={"/how-it-works"}>
              <button className="flex h-10 items-center justify-center gap-2 rounded-lg bg-white/5 px-5 text-sm font-medium text-white ring-1 ring-inset ring-white/10 transition-all hover:bg-white/10 hover:scale-105 sm:h-11 sm:px-6">
                How it Works
              </button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-12 grid gap-3 sm:gap-5 sm:grid-cols-3 md:mt-16">
          {[
            {
              title: "Military-Grade Encryption",
              description:
                "Your identity is protected with state-of-the-art encryption protocols",
              icon: (
                <svg
                  className="h-5 w-5 text-sky-400"
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
              ),
            },
            {
              title: "Real-time Processing",
              description:
                "Instant verification and secure routing of all reports",
              icon: (
                <svg
                  className="h-5 w-5 text-sky-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              ),
            },
            {
              title: "Secure Communication",
              description: "Two-way anonymous channel with law enforcement",
              icon: (
                <svg
                  className="h-5 w-5 text-sky-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              ),
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-xl bg-zinc-900/80 p-5 sm:p-6 md:p-7 backdrop-blur-sm transition-all hover:scale-[1.02] hover:bg-zinc-800/90 hover:shadow-lg hover:shadow-sky-500/20"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-sky-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-3 inline-flex rounded-lg bg-sky-500/10 p-2 group-hover:bg-sky-500/20 transition sm:mb-4">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-base font-semibold text-white sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-xs leading-relaxed text-zinc-400 sm:text-sm">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-12 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-800 p-5 sm:p-6 md:p-8 md:mt-16 shadow-lg ring-1 ring-white/10">
          <div className="grid gap-y-5 sm:grid-cols-3">
            {[
              { 
                value: loading ? "..." : (reportCount !== null ? reportCount.toLocaleString() : "0"), 
                label: "Reports Filed" 
              },
              { value: "100%", label: "Anonymity Rate" },
              { value: "24/7", label: "Support Available" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-extrabold text-white sm:text-3xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs text-zinc-400 sm:text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Badge */}
        <div className="mt-12 mb-10 flex justify-center md:mt-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-zinc-900/80 px-3 py-2 text-xs text-zinc-400 ring-1 ring-white/10 shadow-lg backdrop-blur-sm sm:px-5 sm:py-2.5 sm:text-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Trusted by Law Enforcement Nationwide
          </div>
        </div>
      </div>
    </main>
  );
}