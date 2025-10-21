"use client";

import { useState } from "react";
import { sendOTPEmail } from "@/lib/email";

export default function TestEmailPage() {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSendTestEmail = async () => {
    if (!email) {
      setResult({ success: false, message: "Please enter an email address" });
      return;
    }

    setIsSending(true);
    setResult(null);

    try {
      // Generate a test OTP
      const testOTP = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Send the email
      await sendOTPEmail(email, testOTP);
      
      setResult({ 
        success: true, 
        message: `Test email sent successfully to ${email} with OTP: ${testOTP}` 
      });
    } catch (error: any) {
      console.error("Email sending error:", error);
      setResult({ 
        success: false, 
        message: `Failed to send email: ${error.message || "Unknown error"}` 
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 to-sky-600 bg-clip-text text-transparent mb-6">
          Email Test
        </h1>
        
        <p className="text-neutral-400 text-center mb-6">
          Test the email configuration by sending a test OTP to your email address
        </p>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-black/40 border border-neutral-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Enter your email"
            />
          </div>
          
          <button
            onClick={handleSendTestEmail}
            disabled={isSending}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-sky-500 text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isSending ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Sending...
              </div>
            ) : (
              "Send Test Email"
            )}
          </button>
        </div>
        
        {result && (
          <div className={`mt-6 p-4 rounded-lg ${result.success ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
            <p className={result.success ? 'text-green-400' : 'text-red-400'}>
              {result.message}
            </p>
          </div>
        )}
        
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <h3 className="text-blue-400 font-medium mb-2">Email Configuration Help</h3>
          <p className="text-sm text-neutral-400">
            If emails are not being received:
          </p>
          <ul className="mt-2 text-sm text-neutral-400 list-disc list-inside space-y-1">
            <li>Check your spam/junk folder</li>
            <li>Ensure Gmail App Password is configured correctly</li>
            <li>Verify EMAIL_USER and EMAIL_PASS in your .env file</li>
          </ul>
        </div>
      </div>
    </div>
  );
}