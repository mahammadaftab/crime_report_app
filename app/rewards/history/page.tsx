"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Calendar, 
  FileText, 
  Award,
  TrendingUp
} from "lucide-react";
import Link from "next/link";
import { UserWithRelations } from '@/lib/types';

export default function RewardsHistory() {
  const { status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<UserWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // all, earned, redeemed

  useEffect(() => {
    const fetchUserData = async () => {
      if (status === "loading") return;
      
      if (status === "unauthenticated") {
        router.push("/auth");
        return;
      }

      try {
        setLoading(true);
        const response = await fetch("/api/profile");
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch user data");
        }
        
        setUser(data.user);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [status, router]);

  const filteredHistory = user?.rewards?.rewardHistory?.filter((reward) => {
    if (filter === "earned") return reward.pointsEarned > 0;
    if (filter === "redeemed") return reward.pointsEarned < 0;
    return true;
  }) || [];

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-400">Loading rewards history...</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Rewards History</h1>
              <p className="text-neutral-400 mt-2">
                Detailed history of your reward transactions
              </p>
            </div>
            <Link 
              href="/rewards" 
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors text-sm"
            >
              Back to Rewards
            </Link>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300">
              {error}
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-800/30 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-300 text-sm font-medium">Total Points</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {user?.rewards?.points || 0}
                  </p>
                </div>
                <Award className="w-8 h-8 text-blue-400" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-800/30 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-300 text-sm font-medium">Points Earned</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {user?.rewards?.rewardHistory?.reduce((sum, reward) => 
                      reward.pointsEarned > 0 ? sum + reward.pointsEarned : sum, 0) || 0}
                  </p>
                </div>
                <ArrowUpCircle className="w-8 h-8 text-green-400" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-900/30 to-amber-800/20 border border-amber-800/30 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-300 text-sm font-medium">Points Redeemed</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {Math.abs(user?.rewards?.rewardHistory?.reduce((sum, reward) => 
                      reward.pointsEarned < 0 ? sum + reward.pointsEarned : sum, 0) || 0)}
                  </p>
                </div>
                <ArrowDownCircle className="w-8 h-8 text-amber-400" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
              }`}
            >
              All Transactions
            </button>
            <button
              onClick={() => setFilter("earned")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                filter === "earned"
                  ? "bg-green-600 text-white"
                  : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
              }`}
            >
              <ArrowUpCircle className="w-4 h-4 mr-2" />
              Points Earned
            </button>
            <button
              onClick={() => setFilter("redeemed")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                filter === "redeemed"
                  ? "bg-amber-600 text-white"
                  : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
              }`}
            >
              <ArrowDownCircle className="w-4 h-4 mr-2" />
              Points Redeemed
            </button>
          </div>

          {/* History List */}
          <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">Transaction History</h2>
              <p className="text-neutral-400 mt-1">
                {filteredHistory.length} transactions found
              </p>
            </div>

            {filteredHistory.length > 0 ? (
              <div className="divide-y divide-white/10">
                {filteredHistory.map((reward) => (
                  <motion.div
                    key={reward.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 hover:bg-neutral-800/30 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          reward.pointsEarned > 0 
                            ? "bg-green-900/30 text-green-400" 
                            : "bg-amber-900/30 text-amber-400"
                        }`}>
                          {reward.pointsEarned > 0 ? (
                            <ArrowUpCircle className="w-6 h-6" />
                          ) : (
                            <ArrowDownCircle className="w-6 h-6" />
                          )}
                        </div>
                        <div className="ml-4">
                          <h3 className="font-bold text-white">
                            {reward.description}
                          </h3>
                          <div className="flex items-center mt-1 text-sm text-neutral-400">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>
                              {new Date(reward.createdAt).toLocaleDateString()} at{" "}
                              {new Date(reward.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          {reward.report && (
                            <div className="flex items-center mt-1 text-sm text-blue-400">
                              <FileText className="w-4 h-4 mr-1" />
                              <span>Report #{reward.report.reportId.substring(0, 8)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${
                          reward.pointsEarned > 0 ? "text-green-400" : "text-amber-400"
                        }`}>
                          {reward.pointsEarned > 0 ? "+" : ""}{reward.pointsEarned} points
                        </p>
                        <p className="text-neutral-400 text-sm">
                          ₹{reward.amountEarned.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <TrendingUp className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No transactions found</h3>
                <p className="text-neutral-400">
                  {filter === "all" 
                    ? "You don't have any reward transactions yet." 
                    : filter === "earned"
                      ? "You haven't earned any points yet. Submit reports to earn points!"
                      : "You haven't redeemed any points yet."}
                </p>
                {filter === "earned" && (
                  <Link 
                    href="/submit-report" 
                    className="mt-4 inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Submit a Report
                  </Link>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}