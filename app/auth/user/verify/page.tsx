"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, Info } from "lucide-react";

export default function UserVerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    // Get email from URL params
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Verification failed");

      setSuccess(true);
      
      // Redirect to sign in after a short delay
      setTimeout(() => {
        router.push("/auth/user/login");
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed. Please check your OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResending(true);
    setError("");

    try {
      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Failed to resend OTP");

      alert("OTP has been resent to your email. Please check your inbox and spam folder.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-neutral-900 to-black px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-sky-600 bg-clip-text text-transparent"
          >
            Verify Your Email
          </motion.h1>
          <p className="text-neutral-400 mt-2">
            Enter the verification code sent to{" "}
            <span className="text-blue-500 font-medium">{email || "your email"}</span>
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
          {success ? (
            <div className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="text-emerald-500" size={32} />
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2">Email Verified!</h2>
              <p className="text-neutral-400 mb-6">
                Your email has been successfully verified. Redirecting to sign in...
              </p>
              <div className="w-full bg-neutral-800 rounded-full h-1">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3, ease: "linear" }}
                  className="bg-emerald-500 h-1 rounded-full"
                />
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email */}
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="peer w-full rounded-lg bg-black/40 border border-neutral-800 px-3 pt-5 pb-2 text-neutral-100 placeholder-transparent focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 outline-none"
                  placeholder="Email"
                />
                <label
                  htmlFor="email"
                  className="absolute left-3 top-2.5 text-sm text-neutral-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-neutral-500 peer-placeholder-shown:text-base peer-focus:top-2.5 peer-focus:text-sm peer-focus:text-blue-400"
                >
                  Email Address
                </label>
              </div>

              {/* OTP */}
              <div className="relative">
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="peer w-full rounded-lg bg-black/40 border border-neutral-800 px-3 pt-5 pb-2 text-neutral-100 placeholder-transparent focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 outline-none"
                  placeholder="OTP"
                />
                <label
                  htmlFor="otp"
                  className="absolute left-3 top-2.5 text-sm text-neutral-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-neutral-500 peer-placeholder-shown:text-base peer-focus:top-2.5 peer-focus:text-sm peer-focus:text-blue-400"
                >
                  Verification Code
                </label>
              </div>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-red-500 text-sm bg-red-500/10 border border-red-500/30 rounded-lg p-3"
                >
                  <AlertCircle size={16} />
                  {error}
                </motion.div>
              )}

              {/* Info about email */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 text-blue-400 text-sm bg-blue-500/10 border border-blue-500/30 rounded-lg p-3"
              >
                <Info size={16} className="mt-0.5 flex-shrink-0" />
                <div>
                  <p>Didn't receive the email? Check your spam folder.</p>
                  <p className="mt-1">If you're still having issues, contact support.</p>
                </div>
              </motion.div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isLoading || !email || otp.length !== 6}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex justify-center py-2.5 px-4 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-sky-500 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Verify Email"
                )}
              </motion.button>

              {/* Resend OTP */}
              <div className="text-center text-sm text-neutral-400">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resending}
                  className="text-blue-500 hover:text-blue-400 font-medium disabled:opacity-50"
                >
                  {resending ? "Sending..." : "Resend OTP"}
                </button>
              </div>
              
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => router.push("/auth/user/login")}
                  className="text-neutral-500 hover:text-neutral-300 text-sm transition-colors"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}