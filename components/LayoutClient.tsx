"use client";

import Navbar from "./Navbar";
import { SessionProvider } from "next-auth/react";
import { EmergencyDetector } from "../components/EmergencyDetector";

export function LayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="relative min-h-screen flex flex-col">
        {/* Background Effects */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          {/* Soft gradient layers */}
          <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-950 to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.07),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.06),transparent_70%)]" />

          {/* Animated gradient blob */}
          <div className="absolute top-1/3 left-1/4 h-[600px] w-[600px] rounded-full bg-sky-500/20 blur-[150px] animate-pulse hidden md:block" />
          <div className="absolute bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[180px] animate-pulse delay-700 hidden md:block" />
          
          {/* Mobile blobs */}
          <div className="absolute top-1/4 left-1/3 h-[300px] w-[300px] rounded-full bg-sky-500/15 blur-[100px] animate-pulse md:hidden" />
          <div className="absolute bottom-1/3 right-1/3 h-[250px] w-[250px] rounded-full bg-blue-600/15 blur-[120px] animate-pulse delay-700 md:hidden" />
        </div>

        {/* Emergency Detector - Always active for automatic emergency detection */}
        <EmergencyDetector />

        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-1 pt-16 pb-16 md:pb-6">
          {children}
        </main>

        {/* Footer Placeholder (future-ready) */}
        <footer className="mt-auto border-t border-white/10 py-6 text-center text-xs text-zinc-500 px-4">
          <div className="max-w-4xl mx-auto">
            © {new Date().getFullYear()} SafeReport. All rights reserved. 
            <div className="mt-1 md:mt-0 md:inline-block md:ml-2">
              Secure • Anonymous • Professional
            </div>
          </div>
        </footer>
      </div>
    </SessionProvider>
  );
}