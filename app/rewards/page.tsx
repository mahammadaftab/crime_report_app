"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Award, 
  Trophy, 
  Star, 
  TrendingUp, 
  Target, 
  Gift, 
  FileText,
  Coins
} from "lucide-react";
import Link from "next/link";
import { UserWithRelations } from '@/lib/types';

export default function RewardsDashboard() {
  const { status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<UserWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (status === "loading") return;
      
      if (status === "unauthenticated") {
        router.push("/auth");
        return;
      }

      // Redirect admin users away from rewards page
      if (status === "authenticated" && user?.role === "ADMIN") {
        router.push("/dashboard");
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
  }, [status, router, user?.role]);

  const tierData = [
    { name: "Bronze", minPoints: 0, color: "text-amber-800 bg-amber-900/20 border-amber-800", icon: "🥉" },
    { name: "Silver", minPoints: 1000, color: "text-gray-300 bg-gray-700/20 border-gray-600", icon: "🥈" },
    { name: "Gold", minPoints: 1500, color: "text-yellow-400 bg-yellow-900/20 border-yellow-800", icon: "🥇" },
    { name: "Platinum", minPoints: 2000, color: "text-purple-400 bg-purple-900/20 border-purple-800", icon: "🏆" },
  ];

  const getCurrentTier = (points: number) => {
    return tierData
      .filter(tier => points >= tier.minPoints)
      .sort((a, b) => b.minPoints - a.minPoints)[0];
  };

  const getNextTier = (points: number) => {
    return tierData.find(tier => tier.minPoints > points);
  };

  const getProgressToNextTier = (points: number) => {
    const currentTier = getCurrentTier(points);
    const nextTier = getNextTier(points);
    
    if (!nextTier) return 100;
    
    const progress = ((points - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100;
    return Math.min(progress, 100);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-400">Loading rewards dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  const currentTier = getCurrentTier(user?.rewards?.points || 0);
  const nextTier = getNextTier(user?.rewards?.points || 0);
  const progress = getProgressToNextTier(user?.rewards?.points || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Rewards Dashboard</h1>
              <p className="text-neutral-400 mt-2">
                Track your contributions and rewards
              </p>
            </div>
            <Link 
              href="/profile" 
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors text-sm"
            >
              Back to Profile
            </Link>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300">
              {error}
            </div>
          )}

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-800/30 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-300 text-sm font-medium">Total Points</p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {user?.rewards?.points || 0}
                  </p>
                </div>
                <Award className="w-8 h-8 text-blue-400" />
              </div>
              <p className="text-xs text-neutral-400 mt-3">
                +{Math.floor((user?.rewards?.points || 0) / 50)} reports submitted
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-800/30 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-300 text-sm font-medium">Total Earnings</p>
                  <p className="text-3xl font-bold text-white mt-2">
                    ₹{(user?.rewards?.totalEarnings || 0).toFixed(2)}
                  </p>
                </div>
                <Coins className="w-8 h-8 text-green-400" />
              </div>
              <p className="text-xs text-neutral-400 mt-3">
                Based on 100 pts = ₹10
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-800/30 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-300 text-sm font-medium">Reports Submitted</p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {user?.rewards?.totalReports || 0}
                  </p>
                </div>
                <FileText className="w-8 h-8 text-purple-400" />
              </div>
              <p className="text-xs text-neutral-400 mt-3">
                Keep contributing!
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-900/30 to-amber-800/20 border border-amber-800/30 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-300 text-sm font-medium">Current Tier</p>
                  <p className="text-3xl font-bold text-white mt-2 flex items-center">
                    <span className="mr-2">{currentTier?.icon}</span>
                    {currentTier?.name || "Bronze"}
                  </p>
                </div>
                <Trophy className="w-8 h-8 text-amber-400" />
              </div>
              <p className="text-xs text-neutral-400 mt-3">
                {nextTier 
                  ? `${nextTier.minPoints - (user?.rewards?.points || 0)} points to ${nextTier.name}` 
                  : "Top tier achieved!"}
              </p>
            </div>
          </div>

          {/* Tier Progress */}
          <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Tier Progress</h2>
              <div className="flex items-center text-sm text-neutral-400">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>Level up for exclusive rewards</span>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-neutral-300">
                  {currentTier?.name || "Bronze"} Tier
                </span>
                <span className="text-neutral-300">
                  {nextTier ? `${nextTier.name} Tier` : "Max Tier"}
                </span>
              </div>
              <div className="w-full bg-neutral-800 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-neutral-400">
                <span>{user?.rewards?.points || 0} points</span>
                <span>
                  {nextTier 
                    ? `${nextTier.minPoints} points` 
                    : "Congratulations!"}
                </span>
              </div>
            </div>

            {/* Tier Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-4">
                <h3 className="font-bold text-white mb-2">Current Benefits</h3>
                <ul className="text-sm text-neutral-300 space-y-1">
                  <li className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-2" />
                    {currentTier?.name} badge on profile
                  </li>
                  <li className="flex items-center">
                    <Gift className="w-4 h-4 text-purple-400 mr-2" />
                    Priority report processing
                  </li>
                  <li className="flex items-center">
                    <Target className="w-4 h-4 text-green-400 mr-2" />
                    Exclusive community access
                  </li>
                </ul>
              </div>
              
              <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-4">
                <h3 className="font-bold text-white mb-2">
                  {nextTier ? `Next Tier: ${nextTier.name}` : "Max Tier Achieved!"}
                </h3>
                {nextTier ? (
                  <ul className="text-sm text-neutral-300 space-y-1">
                    <li className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-2" />
                      {nextTier.name} badge on profile
                    </li>
                    <li className="flex items-center">
                      <Gift className="w-4 h-4 text-purple-400 mr-2" />
                      Early access to new features
                    </li>
                    <li className="flex items-center">
                      <Target className="w-4 h-4 text-green-400 mr-2" />
                      Special recognition events
                    </li>
                    <li className="flex items-center">
                      <Trophy className="w-4 h-4 text-amber-400 mr-2" />
                      Exclusive merchandise
                    </li>
                  </ul>
                ) : (
                  <p className="text-sm text-neutral-300">
                    Congratulations! You&apos;ve reached the highest tier. Enjoy all premium benefits.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">How the Rewards Program Works</h2>
              <Link 
                href="/rewards/history" 
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center"
              >
                View Full History
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-neutral-800/30 border border-neutral-700 rounded-xl p-5">
                <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="font-bold text-white mb-2">Submit Reports</h3>
                <p className="text-neutral-400 text-sm">
                  Earn 50 points for every verified report you submit to help our community.
                </p>
              </div>
              
              <div className="bg-neutral-800/30 border border-neutral-700 rounded-xl p-5">
                <div className="w-12 h-12 rounded-full bg-green-900/30 flex items-center justify-center mb-4">
                  <Coins className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="font-bold text-white mb-2">Earn Rewards</h3>
                <p className="text-neutral-400 text-sm">
                  Redeem points for cash at a rate of 100 points = ₹10 anytime.
                </p>
              </div>
              
              <div className="bg-neutral-800/30 border border-neutral-700 rounded-xl p-5">
                <div className="w-12 h-12 rounded-full bg-purple-900/30 flex items-center justify-center mb-4">
                  <Trophy className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="font-bold text-white mb-2">Level Up</h3>
                <p className="text-neutral-400 text-sm">
                  Advance through tiers to unlock exclusive benefits and recognition.
                </p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-bold text-white">Ready to earn rewards?</h3>
                  <p className="text-neutral-400 text-sm mt-1">
                    Submit a report to start earning points today.
                  </p>
                </div>
                <Link 
                  href="/submit-report" 
                  className="mt-4 md:mt-0 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all flex items-center justify-center"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Submit Report
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}