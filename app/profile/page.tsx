"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Eye, 
  EyeOff, 
  Calendar, 
  Mail, 
  User, 
  Phone, 
  MapPin, 
  Lock, 
  Save, 
  X,
  Star,
  Award,
  FileText,
  Trophy,
  PlusCircle,
  MinusCircle,
  Gift,
  RefreshCw,
  Clock
} from "lucide-react";
import { UserWithRelations } from '@/lib/types';

// Currency icon as a custom component since it's not in lucide-react
const Currency = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<UserWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [rewardCheckInterval, setRewardCheckInterval] = useState<NodeJS.Timeout | null>(null); // Add interval state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch user profile data
  const fetchProfile = useCallback(async () => {
    if (status === "loading") return;
    
    try {
      const response = await fetch("/api/profile");
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch profile");
      }
      
      setUser(data.user);
      
      // Initialize form data with user info
      setFormData({
        name: data.user?.name || "",
        email: data.user?.email || "",
        phone: data.user?.profile?.phone || data.user?.profile?.department || "",
        address: data.user?.profile?.address || data.user?.profile?.department || "",
        dateOfBirth: data.user?.profile?.dateOfBirth 
          ? new Date(data.user.profile.dateOfBirth).toISOString().split("T")[0] 
          : "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [status]);

  // Check for reward updates
  const checkForRewardUpdates = useCallback(async () => {
    if (!user) return;
    
    try {
      // Check if there are any resolved reports without reward history
      const hasPendingRewards = user?.reports?.some((report) => 
        report.status === 'RESOLVED' && 
        (!report.rewardHistories || report.rewardHistories.length === 0)
      );
      
      if (hasPendingRewards) {
        // Check for reward updates
        const response = await fetch("/api/rewards/check");
        const data = await response.json();
        
        if (response.ok && data.rewards) {
          // Update user rewards if they've changed
          if (JSON.stringify(data.rewards) !== JSON.stringify(user.rewards)) {
            // Refresh the entire profile to get updated data
            await fetchProfile();
            setSuccess("Reward points have been updated!");
            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(""), 3000);
          }
        }
      } else if (rewardCheckInterval) {
        // Clear interval if no pending rewards
        clearInterval(rewardCheckInterval);
        setRewardCheckInterval(null);
      }
    } catch (err) {
      console.error("Error checking for reward updates:", err);
    }
  }, [user, rewardCheckInterval, fetchProfile, setSuccess]);

  useEffect(() => {
    if (status === "loading") return;
    
    if (status === "unauthenticated") {
      router.push("/auth");
      return;
    }

    fetchProfile();
  }, [status, router, fetchProfile]);

  // Set up interval to check for reward updates when there are resolved reports
  useEffect(() => {
    if (user && user.reports) {
      // Check if there are any resolved reports without reward history
      const hasPendingRewards = user.reports.some((report) => 
        report.status === 'RESOLVED' && 
        (!report.rewardHistories || report.rewardHistories.length === 0)
      );
      
      if (hasPendingRewards && !rewardCheckInterval) {
        // Set up interval to check for reward updates every 5 seconds
        const interval = setInterval(checkForRewardUpdates, 5000);
        setRewardCheckInterval(interval);
      }
    }
    
    // Clean up interval on unmount
    return () => {
      if (rewardCheckInterval) {
        clearInterval(rewardCheckInterval);
      }
    };
  }, [user, rewardCheckInterval, checkForRewardUpdates]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    // Validate password confirmation if changing password
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          dateOfBirth: formData.dateOfBirth,
          currentPassword: formData.currentPassword || undefined,
          newPassword: formData.newPassword || undefined,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }
      
      // Update session with new user data
      await update({
        ...session,
        user: {
          ...session?.user,
          name: data.user.name,
          email: data.user.email,
        }
      });
      
      setUser(data.user);
      setSuccess("Profile updated successfully");
      setIsEditing(false);
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleCancel = () => {
    // Reset form to original user data
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.profile?.phone || user?.profile?.department || "",
      address: user?.profile?.address || user?.profile?.department || "",
      dateOfBirth: user?.profile?.dateOfBirth 
        ? new Date(user.profile.dateOfBirth).toISOString().split("T")[0] 
        : "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsEditing(false);
    setError("");
    setSuccess("");
  };

  const handleRedeemPoints = async (points: number) => {
    if (!user) return;
    
    setIsRedeeming(true);
    setError("");
    setSuccess("");
    
    try {
      const response = await fetch("/api/redeem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ points }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to redeem points");
      }
      
      setSuccess(data.message);
      
      // Refresh user data to show updated rewards
      await fetchProfile();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsRedeeming(false);
    }
  };

  // Add function to manually refresh rewards
  const handleRefreshRewards = async () => {
    if (!user) return;
    
    setIsRefreshing(true);
    setError("");
    
    try {
      await fetchProfile();
      setSuccess("Rewards data refreshed successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while refreshing rewards");
    } finally {
      setIsRefreshing(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-neutral-900 to-black">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // Router will redirect
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
            <h1 className="text-3xl font-bold text-white">Profile</h1>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
              >
                <User className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors flex items-center"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </div>
            )}
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300 flex items-start"
            >
              <div className="flex-1">
                <p>{error}</p>
              </div>
              <button onClick={() => setError("")} className="text-red-400 hover:text-red-300">
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-900/30 border border-green-700 rounded-lg text-green-300 flex items-start"
            >
              <div className="flex-1">
                <p>{success}</p>
              </div>
              <button onClick={() => setSuccess("")} className="text-green-400 hover:text-green-300">
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden mb-8">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{user?.name || "User"}</h2>
                  <p className="text-neutral-400">{user?.email || "user@example.com"}</p>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user?.role === 'ADMIN' 
                        ? "bg-purple-900/30 text-purple-400 border border-purple-800" 
                        : "bg-blue-900/30 text-blue-400 border border-blue-800"
                    }`}>
                      {user?.role || "USER"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-neutral-300 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-neutral-500" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`block w-full pl-10 pr-3 py-3 bg-neutral-800/50 border ${
                          isEditing 
                            ? "border-neutral-700 focus:border-blue-500 focus:ring-blue-500" 
                            : "border-neutral-800"
                        } rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-1 transition-colors ${
                          isEditing ? "" : "cursor-not-allowed"
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-neutral-500" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`block w-full pl-10 pr-3 py-3 bg-neutral-800/50 border ${
                          isEditing 
                            ? "border-neutral-700 focus:border-blue-500 focus:ring-blue-500" 
                            : "border-neutral-800"
                        } rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-1 transition-colors ${
                          isEditing ? "" : "cursor-not-allowed"
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-neutral-300 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-neutral-500" />
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`block w-full pl-10 pr-3 py-3 bg-neutral-800/50 border ${
                          isEditing 
                            ? "border-neutral-700 focus:border-blue-500 focus:ring-blue-500" 
                            : "border-neutral-800"
                        } rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-1 transition-colors ${
                          isEditing ? "" : "cursor-not-allowed"
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-neutral-300 mb-2">
                      Date of Birth
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-neutral-500" />
                      </div>
                      <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`block w-full pl-10 pr-3 py-3 bg-neutral-800/50 border ${
                          isEditing 
                            ? "border-neutral-700 focus:border-blue-500 focus:ring-blue-500" 
                            : "border-neutral-800"
                        } rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-1 transition-colors ${
                          isEditing ? "" : "cursor-not-allowed"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-neutral-300 mb-2">
                      Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                        <MapPin className="h-5 w-5 text-neutral-500" />
                      </div>
                      <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        rows={3}
                        className={`block w-full pl-10 pr-3 py-3 bg-neutral-800/50 border ${
                          isEditing 
                            ? "border-neutral-700 focus:border-blue-500 focus:ring-blue-500" 
                            : "border-neutral-800"
                        } rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-1 transition-colors resize-none ${
                          isEditing ? "" : "cursor-not-allowed"
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <>
                    <div className="border-t border-white/10 pt-6">
                      <h3 className="text-lg font-medium text-white mb-4">Change Password</h3>
                      <p className="text-sm text-neutral-400 mb-6">
                        Leave these fields blank if you don&apos;t want to change your password.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="currentPassword" className="block text-sm font-medium text-neutral-300 mb-2">
                            Current Password
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Lock className="h-5 w-5 text-neutral-500" />
                            </div>
                            <input
                              type={showCurrentPassword ? "text" : "password"}
                              id="currentPassword"
                              name="currentPassword"
                              value={formData.currentPassword}
                              onChange={handleInputChange}
                              className="block w-full pl-10 pr-10 py-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                              type="button"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                              {showCurrentPassword ? (
                                <EyeOff className="h-5 w-5 text-neutral-500 hover:text-neutral-300" />
                              ) : (
                                <Eye className="h-5 w-5 text-neutral-500 hover:text-neutral-300" />
                              )}
                            </button>
                          </div>
                        </div>
                        
                        <div></div> {/* Empty div for spacing */}
                        
                        <div>
                          <label htmlFor="newPassword" className="block text-sm font-medium text-neutral-300 mb-2">
                            New Password
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Lock className="h-5 w-5 text-neutral-500" />
                            </div>
                            <input
                              type={showNewPassword ? "text" : "password"}
                              id="newPassword"
                              name="newPassword"
                              value={formData.newPassword}
                              onChange={handleInputChange}
                              className="block w-full pl-10 pr-10 py-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                              {showNewPassword ? (
                                <EyeOff className="h-5 w-5 text-neutral-500 hover:text-neutral-300" />
                              ) : (
                                <Eye className="h-5 w-5 text-neutral-500 hover:text-neutral-300" />
                              )}
                            </button>
                          </div>
                          <p className="mt-1 text-xs text-neutral-500">
                            Must be at least 8 characters long
                          </p>
                        </div>
                        
                        <div>
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-300 mb-2">
                            Confirm New Password
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Lock className="h-5 w-5 text-neutral-500" />
                            </div>
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              id="confirmPassword"
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              className="block w-full pl-10 pr-10 py-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-5 w-5 text-neutral-500 hover:text-neutral-300" />
                              ) : (
                                <Eye className="h-5 w-5 text-neutral-500 hover:text-neutral-300" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end pt-4">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="mr-3 px-5 py-2.5 text-sm font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-600 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex items-center"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </button>
                    </div>
                  </>
                )}
              </form>
            </div>
          </div>

          {/* Rewards Section - only show for non-admin users */}
          {user && user.role !== "ADMIN" && (
            <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Rewards Program</h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleRefreshRewards}
                      disabled={isRefreshing}
                      className="flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50"
                    >
                      {isRefreshing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-1"></div>
                          Refreshing...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4 mr-1" />
                          Refresh
                        </>
                      )}
                    </button>
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span className="text-yellow-400 font-bold">Premium Member</span>
                  </div>
                </div>
                <p className="text-neutral-400 mt-2">
                  Earn points for submitting reports and redeem them for rewards
                </p>
                <div className="mt-4 flex space-x-4">
                  <Link 
                    href="/leaderboard" 
                    className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <Trophy className="w-4 h-4 mr-1" />
                    View Leaderboard
                  </Link>
                  <Link 
                    href="/rewards" 
                    className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <Award className="w-4 h-4 mr-1" />
                    Rewards Dashboard
                  </Link>
                </div>
              </div>

              <div className="p-6">
                {/* Rewards Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-800/30 rounded-xl p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-neutral-300 text-sm font-medium">Total Points</h3>
                      <Award className="w-5 h-5 text-blue-400" />
                    </div>
                    <p className="text-2xl font-bold text-white mt-2">
                      {user?.rewards?.points || 0}
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">
                      +{Math.floor((user?.rewards?.points || 0) / 50)} reports submitted
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-800/30 rounded-xl p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-neutral-300 text-sm font-medium">Total Earnings</h3>
                      <Currency className="w-5 h-5 text-green-400" />
                    </div>
                    <p className="text-2xl font-bold text-white mt-2">
                      ₹{(user?.rewards?.totalEarnings || 0).toFixed(2)}
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">
                      Based on 100 pts = ₹10
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-800/30 rounded-xl p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-neutral-300 text-sm font-medium">Reports Submitted</h3>
                      <FileText className="w-5 h-5 text-purple-400" />
                    </div>
                    <p className="text-2xl font-bold text-white mt-2">
                      {user?.rewards?.totalReports || 0}
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">
                      Keep contributing!
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-amber-900/30 to-amber-800/20 border border-amber-800/30 rounded-xl p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-neutral-300 text-sm font-medium">Next Milestone</h3>
                      <Trophy className="w-5 h-5 text-amber-400" />
                    </div>
                    <p className="text-2xl font-bold text-white mt-2">
                      {(1000 - (user?.rewards?.points || 0)) > 0 
                        ? (1000 - (user?.rewards?.points || 0)) 
                        : "Achieved!"}
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">
                      Points to Platinum Tier
                    </p>
                  </div>
                </div>

                {/* Rewards Progress */}
                <div className="mb-8">
                  <div className="flex justify-between mb-2">
                    <h3 className="text-lg font-medium text-white">Progress to Next Tier</h3>
                    <span className="text-neutral-400">
                      {user?.rewards?.points || 0} / 1000 points
                    </span>
                  </div>
                  <div className="w-full bg-neutral-800 rounded-full h-2.5">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full" 
                      style={{ width: `${Math.min(((user?.rewards?.points || 0) / 1000) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-neutral-400">
                    <span>Bronze</span>
                    <span>Silver</span>
                    <span>Gold</span>
                    <span>Platinum</span>
                  </div>
                </div>

                {/* Recent Rewards */}
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Recent Activity</h3>
                  {user?.rewards?.rewardHistory && user.rewards.rewardHistory.length > 0 ? (
                    <div className="space-y-3">
                      {user?.rewards?.rewardHistory?.map((reward) => (
                        <div 
                          key={reward.id} 
                          className="flex items-center justify-between p-4 bg-neutral-800/50 border border-neutral-700 rounded-lg hover:bg-neutral-800 transition-colors"
                        >
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              reward.pointsEarned > 0 
                                ? "bg-green-900/30 text-green-400" 
                                : "bg-amber-900/30 text-amber-400"
                            }`}>
                              {reward.pointsEarned > 0 ? (
                                <PlusCircle className="w-5 h-5" />
                              ) : (
                                <MinusCircle className="w-5 h-5" />
                              )}
                            </div>
                            <div className="ml-4">
                              <p className="text-white font-medium">
                                {reward.description}
                              </p>
                              <p className="text-neutral-400 text-sm">
                                {new Date(reward.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold ${
                              reward.pointsEarned > 0 ? "text-green-400" : "text-amber-400"
                            }`}>
                              {reward.pointsEarned > 0 ? "+" : ""}{reward.pointsEarned} points
                            </p>
                            <p className="text-neutral-400 text-sm">
                              ₹{reward.amountEarned.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-neutral-800/30 border border-neutral-700 rounded-lg">
                      <Gift className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                      <p className="text-neutral-400">No reward activity yet</p>
                      <p className="text-neutral-500 text-sm mt-1">
                        Submit reports to earn points and rewards
                      </p>
                    </div>
                  )}
                </div>

                {/* Redeem Points */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <h3 className="text-lg font-medium text-white mb-4">Redeem Points</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[100, 500, 1000].map((points) => (
                      <div 
                        key={points} 
                        className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4 hover:border-blue-500/50 transition-colors cursor-pointer"
                        onClick={() => handleRedeemPoints(points)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-white font-bold">{points} Points</p>
                            <p className="text-neutral-400 text-sm">₹{(points / 10).toFixed(2)}</p>
                          </div>
                          <div className="bg-blue-900/30 text-blue-400 text-xs px-2 py-1 rounded">
                            {isRedeeming ? "Redeeming..." : "Redeem"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <button 
                      disabled={(user?.rewards?.points || 0) < 100 || isRedeeming}
                      onClick={() => handleRedeemPoints(100)}
                      className={`px-6 py-2 rounded-lg font-medium ${
                        (user?.rewards?.points || 0) < 100
                          ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                      }`}
                    >
                      {(user?.rewards?.points || 0) < 100 
                        ? `Need ${(100 - (user?.rewards?.points || 0))} more points` 
                        : "Redeem 100 Points (₹10)"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* User Reports Section - only show for non-admin users */}
          {user && user.role !== "ADMIN" && (
            <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">My Reports</h2>
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-blue-400" />
                    <span className="text-blue-400 font-bold">{user?.reports?.length || 0} Reports</span>
                  </div>
                </div>
                <p className="text-neutral-400 mt-2">
                  View and track all reports you&apos;ve submitted
                </p>
              </div>

              <div className="p-6">
                {user?.reports && user.reports.length > 0 ? (
                  <div className="space-y-4">
                    {user?.reports?.map((report) => (
                      <div 
                        key={report.id} 
                        className="p-4 bg-neutral-800/50 border border-neutral-700 rounded-lg hover:bg-neutral-800 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center">
                              <h3 className="text-white font-medium">{report.title}</h3>
                              <span className={`ml-3 text-xs px-2 py-1 rounded-full ${
                                report.status === 'RESOLVED' ? 'bg-green-900/30 text-green-400' :
                                report.status === 'IN_PROGRESS' ? 'bg-blue-900/30 text-blue-400' :
                                report.status === 'PENDING' ? 'bg-amber-900/30 text-amber-400' :
                                'bg-red-900/30 text-red-400'
                              }`}>
                                {report.status.replace('_', ' ')}
                              </span>
                            </div>
                            <p className="text-neutral-400 text-sm mt-1 line-clamp-2">
                              {report.description}
                            </p>
                            <div className="flex items-center text-xs text-neutral-500 mt-2">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(report.createdAt).toLocaleDateString()}
                              {report.location && (
                                <>
                                  <span className="mx-2">•</span>
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {report.location}
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-xs text-neutral-500">ID: {report.reportId}</span>
                            <Link 
                              href={`/track-report?reportId=${report.reportId}`}
                              className="mt-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                        
                        {/* Reward Status */}
                        {report.status === 'PENDING' || report.status === 'IN_PROGRESS' ? (
                          <div className="mt-3 pt-3 border-t border-neutral-700/50">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-neutral-400">Reward Status</span>
                              <div className="flex items-center">
                                <span className="text-xs text-amber-400">Report in progress</span>
                              </div>
                            </div>
                          </div>
                        ) : report.status === 'RESOLVED' ? (
                          report.rewardHistories && report.rewardHistories.length > 0 && 
                          report.rewardHistories.some((rh) => rh.pointsEarned > 0) ? (
                            <div className="mt-3 pt-3 border-t border-neutral-700/50">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-neutral-400">Reward Status</span>
                                <div className="flex items-center">
                                  <span className="text-xs text-green-400 flex items-center">
                                    <PlusCircle className="w-3 h-3 mr-1" />
                                    {report.rewardHistories.filter((rh) => rh.pointsEarned > 0)[0]?.pointsEarned || 0} points awarded
                                  </span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="mt-3 pt-3 border-t border-neutral-700/50">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-neutral-400">Reward Status</span>
                                <div className="flex items-center">
                                  <span className="text-xs text-amber-400 flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    Pending reward processing
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        ) : (
                          <div className="mt-3 pt-3 border-t border-neutral-700/50">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-neutral-400">Reward Status</span>
                              <div className="flex items-center">
                                <span className="text-xs text-red-400">
                                  Report {report.status.toLowerCase()}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-neutral-800/30 border border-neutral-700 rounded-lg">
                    <FileText className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                    <p className="text-neutral-400">You haven&apos;t submitted any reports yet</p>
                    <p className="text-neutral-500 text-sm mt-1">
                      Submit your first report to help keep your community safe
                    </p>
                    <Link 
                      href="/submit-report"
                      className="mt-4 inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                    >
                      Submit Report
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}