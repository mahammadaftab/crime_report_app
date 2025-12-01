"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Trophy, Award, Star, FileText } from "lucide-react";
import { TopReporter } from '@/lib/types';

export default function LeaderboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<TopReporter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      // Redirect admin users away from leaderboard page
      if (session?.user?.role === "ADMIN") {
        router.push("/dashboard");
        return;
      }

      try {
        setLoading(true);
        const response = await fetch("/api/leaderboard");
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || "Failed to load leaderboard");
        }
        
        setLeaderboard(data.leaderboard);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [session, router]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Trophy className="w-6 h-6 text-gray-300" />;
    if (rank === 3) return <Trophy className="w-6 h-6 text-amber-600" />;
    return <span className="text-lg font-bold text-neutral-400">#{rank}</span>;
  };

  const getTierBadge = (points: number) => {
    if (points >= 2000) return "Platinum";
    if (points >= 1500) return "Gold";
    if (points >= 1000) return "Silver";
    return "Bronze";
  };

  const getTierColor = (points: number) => {
    if (points >= 2000) return "text-purple-400 bg-purple-900/30 border-purple-800";
    if (points >= 1500) return "text-yellow-400 bg-yellow-900/30 border-yellow-800";
    if (points >= 1000) return "text-gray-300 bg-gray-700/30 border-gray-600";
    return "text-amber-600 bg-amber-900/30 border-amber-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-400">Loading leaderboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Reporter Leaderboard</h1>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              Recognizing our top contributors who help keep our community safe by reporting incidents
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300">
              {error}
            </div>
          )}

          <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Top Reporters</h2>
                <div className="flex items-center space-x-2 text-sm text-neutral-400">
                  <Star className="w-4 h-4" />
                  <span>Updated daily</span>
                </div>
              </div>
            </div>

            <div className="divide-y divide-white/10">
              {leaderboard.map((reporter, index) => (
                <motion.div
                  key={reporter.userId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-6 hover:bg-neutral-800/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 flex items-center justify-center">
                        {getRankIcon(index + 1)}
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <h3 className="text-lg font-bold text-white">{reporter.name}</h3>
                          <span className={`ml-3 text-xs px-2 py-1 rounded-full border ${getTierColor(reporter.points)}`}>
                            {getTierBadge(reporter.points)}
                          </span>
                        </div>
                        <div className="flex items-center mt-1 space-x-4">
                          <div className="flex items-center text-sm text-neutral-400">
                            <FileText className="w-4 h-4 mr-1" />
                            <span>{reporter.totalReports} reports</span>
                          </div>
                          <div className="flex items-center text-sm text-neutral-400">
                            <Award className="w-4 h-4 mr-1" />
                            <span>{reporter.points} points</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-400">₹{reporter.totalEarnings.toFixed(2)}</p>
                      <p className="text-sm text-neutral-400">earned</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-6 border-t border-white/10 bg-neutral-900/30">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div>
                  <h3 className="text-lg font-bold text-white">How It Works</h3>
                  <p className="text-neutral-400 mt-1">
                    Earn points for every report you submit to help our community
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-3">
                    <div className="text-2xl font-bold text-blue-400">50</div>
                    <div className="text-xs text-neutral-400">Points per report</div>
                  </div>
                  <div className="bg-green-900/20 border border-green-800/30 rounded-lg p-3">
                    <div className="text-2xl font-bold text-green-400">100</div>
                    <div className="text-xs text-neutral-400">Points = ₹10</div>
                  </div>
                  <div className="bg-purple-900/20 border border-purple-800/30 rounded-lg p-3">
                    <div className="text-2xl font-bold text-purple-400">4</div>
                    <div className="text-xs text-neutral-400">Reward tiers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-neutral-500 text-sm">
            <p>Rewards are updated daily. Points can be redeemed for cash at any time.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}