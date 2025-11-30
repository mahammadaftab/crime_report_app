"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import MobileMenu from "./MobileMenu";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isAuthDropdownOpen, setIsAuthDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const authDropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const navLinks = [
    { href: "/submit-report", label: "Submit Report" },
    { href: "/track-report", label: "Track Report" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/resources", label: "Resources" },
    { href: "/contact", label: "Support" },
  ];

  const emergencyContacts = [
    { name: "Ambulance", number: "108" },
    { name: "Emergency Police", number: "112" },
    { name: "Police", number: "100" },
    { name: "Fire Station", number: "101" },
    { name: "Cyber Crime", number: "1930" },
    { name: "Women Helpline", number: "100" },
    { name: "Child Helpline", number: "1930" },
  ];

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
      if (authDropdownRef.current && !authDropdownRef.current.contains(event.target as Node)) {
        setIsAuthDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-black/70 backdrop-blur-xl shadow-lg border-b border-white/10"
            : "bg-black/40 backdrop-blur-md border-b border-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="h-9 w-9 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-md"
              >
                <svg
                  className="h-5 w-5 text-white"
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
              </motion.div>
              <span className="text-lg font-semibold text-white tracking-wide">
                PublicSafe App
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map(({ href, label }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`relative text-sm font-medium transition-colors duration-200 ${
                      isActive ? "text-white" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {label}
                    {/* Animated underline */}
                    {isActive && (
                      <motion.span
                        layoutId="active-underline"
                        className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-sky-400 to-blue-500 rounded-full"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right side actions - reordered to put profile on the rightmost side */}
            <div className="flex items-center space-x-4">
              {/* Emergency Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="group flex h-9 items-center gap-2 rounded-full bg-red-500/10 pl-4 pr-5 text-sm font-medium text-red-500 
                             ring-1 ring-inset ring-red-500/20 hover:bg-red-500/20 hover:shadow-lg hover:shadow-red-500/30 transition-all"
                >
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-ping absolute" />
                  <span className="h-2 w-2 rounded-full bg-red-500 relative" />
                  Emergency
                  <svg
                    className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </motion.button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl z-50 overflow-hidden"
                    >
                      <div className="py-2">
                        {emergencyContacts.map((contact, index) => (
                          <a
                            key={index}
                            href={`tel:${contact.number}`}
                            className="flex items-center justify-between px-4 py-3 text-sm text-zinc-300 hover:bg-red-500/10 hover:text-white transition-colors"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            <span>{contact.name}</span>
                            <span className="font-medium text-red-500">
                              {contact.number}
                            </span>
                          </a>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Auth Dropdown for logged out users */}
              {!session && (
                <div className="relative" ref={authDropdownRef}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setIsAuthDropdownOpen(!isAuthDropdownOpen)}
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 text-white font-medium"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </motion.button>

                  {/* Auth Dropdown Menu */}
                  <AnimatePresence>
                    {isAuthDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl z-50 overflow-hidden"
                      >
                        <div className="py-2">
                          <Link
                            href="/auth"
                            className="block px-4 py-2 text-sm text-zinc-300 hover:bg-sky-500/10 hover:text-sky-400 transition-colors"
                            onClick={() => setIsAuthDropdownOpen(false)}
                          >
                            Sign In / Sign Up
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Profile Dropdown for logged in users */}
              {session && (
                <div className="relative" ref={profileDropdownRef}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-white font-medium"
                  >
                    {session.user?.name?.charAt(0).toUpperCase() || "U"}
                  </motion.button>

                  {/* Profile Dropdown Menu */}
                  <AnimatePresence>
                    {isProfileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl z-50 overflow-hidden"
                      >
                        <div className="p-4 border-b border-zinc-800">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-white font-medium">
                              {session.user?.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">
                                {session.user?.name || "User"}
                              </p>
                              <p className="text-xs text-zinc-400 truncate">
                                {session.user?.email}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="py-2">
                          {/* Dashboard link for admin users */}
                          {session.user?.role === "ADMIN" && (
                            <Link
                              href="/dashboard"
                              className="flex items-center w-full px-4 py-2 text-sm text-zinc-300 hover:bg-sky-500/10 hover:text-sky-400 transition-colors"
                              onClick={() => setIsProfileDropdownOpen(false)}
                            >
                              <svg
                                className="w-4 h-4 mr-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                              </svg>
                              Dashboard
                            </Link>
                          )}
                          <button
                            onClick={() => {
                              signOut();
                              setIsProfileDropdownOpen(false);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-zinc-300 hover:bg-sky-500/10 hover:text-sky-400 transition-colors"
                          >
                            <svg
                              className="w-4 h-4 mr-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                              />
                            </svg>
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                className="md:hidden relative z-50"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <motion.div
                  initial={false}
                  animate={isMobileMenuOpen ? "open" : "closed"}
                  className="flex flex-col space-y-1.5"
                >
                  <motion.span
                    variants={{
                      closed: { rotate: 0, y: 0 },
                      open: { rotate: 45, y: 6 },
                    }}
                    className="h-0.5 w-6 bg-white rounded"
                  />
                  <motion.span
                    variants={{
                      closed: { opacity: 1 },
                      open: { opacity: 0 },
                    }}
                    className="h-0.5 w-6 bg-white rounded"
                  />
                  <motion.span
                    variants={{
                      closed: { rotate: 0, y: 0 },
                      open: { rotate: -45, y: -6 },
                    }}
                    className="h-0.5 w-6 bg-white rounded"
                  />
                </motion.div>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}