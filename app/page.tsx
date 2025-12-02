"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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

  // Reward tiers data
  const rewardTiers = [
    {
      points: 100,
      reward: "₹10 Cashback",
      description: "Earn for your first verified report"
    },
    {
      points: 500,
      reward: "₹50 Cashback + Gift Card",
      description: "For active community contributors"
    },
    {
      points: 1000,
      reward: "₹100 Cashback + Recognition",
      description: "Top contributors get special recognition"
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      name: "Community Hero",
      role: "Active Contributor",
      content: "I've earned ₹500+ just by reporting incidents in my neighborhood. It feels great to make a difference!",
      points: "500+ pts"
    },
    {
      name: "Safety Advocate",
      role: "Monthly Leader",
      content: "The reward system motivates me to stay vigilant. I've helped solve 3 cases in my area!",
      points: "1.2K pts"
    }
  ];

  return (
    <main className="relative px-4 pt-20 pb-12 sm:px-6 sm:pt-24 md:pt-32 md:pb-16">
      <div className="mx-auto max-w-6xl">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative inline-flex h-7 items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 text-xs text-sky-400 backdrop-blur-sm shadow-md sm:h-8 sm:px-3 sm:text-sm"
          >
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
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 bg-gradient-to-r from-white via-sky-200 to-white bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl md:text-5xl lg:text-6xl leading-tight"
          >
            Report Incident.
            <span className="block animate-gradient bg-gradient-to-r from-sky-400 via-blue-500 to-sky-600 bg-clip-text text-transparent">
              Earn Rewards. Protect Identity.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-3 max-w-md text-sm leading-relaxed text-zinc-400 sm:max-w-2xl sm:text-base sm:mt-4 md:text-lg"
          >
            Make your community safer without compromising your safety. Our
            advanced encryption ensures your identity remains completely
            anonymous. Get rewarded for your civic contribution!
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-4"
          >
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
          </motion.div>
        </div>

        {/* Reward Advertisement Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 rounded-2xl bg-gradient-to-br from-amber-900/20 to-amber-800/10 p-6 border border-amber-800/30 backdrop-blur-xl shadow-2xl sm:p-8 md:mt-20"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="md:w-2/3">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400 border border-amber-500/30">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                EARN WHILE YOU PROTECT
              </div>
              
              <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
                Get Rewarded for Making Your Community Safer
              </h2>
              
              <p className="mt-2 text-zinc-300 max-w-2xl">
                Every verified report you submit earns you points that convert to real cash rewards. 
                Help solve cases and get recognized for your contribution to public safety.
              </p>
              
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/rewards">
                  <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-amber-500/30 hover:scale-105 transition-all">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    View Rewards
                  </button>
                </Link>
                <Link href="/leaderboard">
                  <button className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white ring-1 ring-inset ring-white/20 hover:bg-white/20 transition-all">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Leaderboard
                  </button>
                </Link>
              </div>
            </div>
            
            <div className="mt-8 md:mt-0 md:w-1/3 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-amber-500/10 blur-lg"></div>
                <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">₹1000+</div>
                    <div className="text-xs text-amber-100">Potential Earnings</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Reward Tiers */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16"
        >
          <h3 className="text-xl font-bold text-white text-center mb-8">How Our Reward System Works</h3>
          
          <div className="grid gap-6 sm:grid-cols-3">
            {rewardTiers.map((tier, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="rounded-xl bg-zinc-900/80 p-6 border border-white/10 backdrop-blur-sm hover:border-amber-500/30 transition-all"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 mb-4">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  
                  <div className="text-2xl font-bold text-white">{tier.points} pts</div>
                  <div className="mt-2 text-lg font-semibold text-amber-400">{tier.reward}</div>
                  <div className="mt-2 text-sm text-zinc-400">{tier.description}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 grid gap-3 sm:gap-5 sm:grid-cols-3 md:mt-20"
        >
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
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 + i * 0.1 }}
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
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-16"
        >
          <h3 className="text-xl font-bold text-white text-center mb-8">What Our Contributors Say</h3>
          
          <div className="grid gap-6 sm:grid-cols-2">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.3 + index * 0.1 }}
                className="rounded-xl bg-zinc-900/80 p-6 border border-white/10 backdrop-blur-sm"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-white">{testimonial.name}</h4>
                        <p className="text-sm text-zinc-400">{testimonial.role}</p>
                      </div>
                      <div className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-400">
                        {testimonial.points}
                      </div>
                    </div>
                    <p className="mt-3 text-zinc-300 italic">&quot;{testimonial.content}&quot;</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="mt-16 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-800 p-5 sm:p-6 md:p-8 md:mt-20 shadow-lg ring-1 ring-white/10"
        >
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
        </motion.div>

        {/* Trust Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.7 }}
          className="mt-16 mb-10 flex justify-center md:mt-20"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-zinc-900/80 px-3 py-2 text-xs text-zinc-400 ring-1 ring-white/10 shadow-lg backdrop-blur-sm sm:px-5 sm:py-2.5 sm:text-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Trusted by Law Enforcement Nationwide
          </div>
        </motion.div>
      </div>
    </main>
  );
}