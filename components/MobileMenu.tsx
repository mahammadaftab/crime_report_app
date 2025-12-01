import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { data: session } = useSession();
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const emergencyRef = useRef<HTMLDivElement>(null);
  const authRef = useRef<HTMLDivElement>(null);

  const emergencyContacts = [
    { name: "Ambulance", number: "101" },
    { name: "Emergency Police", number: "108" },
    { name: "Police", number: "100" },
    { name: "Fire Station", number: "101" },
    { name: "Cyber Crime", number: "1930" },
    { name: "Women Helpline", number: "100" },
    { name: "Child Helpline", number: "1930" },
  ];

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emergencyRef.current && !emergencyRef.current.contains(event.target as Node)) {
        setIsEmergencyOpen(false);
      }
      if (authRef.current && !authRef.current.contains(event.target as Node)) {
        setIsAuthOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEmergencyOpen, isAuthOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Menu content */}
      <div className="fixed right-0 top-0 h-full w-64 bg-zinc-900 p-6 shadow-xl">
        <div className="flex flex-col space-y-6">
          {/* App Logo and Name in Mobile Menu */}
          <div className="flex justify-between items-center pt-2">
            <Link href="/" className="flex items-center space-x-2 group" onClick={onClose}>
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-md">
                <svg
                  className="h-4 w-4 text-white"
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
              </div>
              <span className="text-base font-semibold text-white tracking-wide">
                PublicSafe App
              </span>
            </Link>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Profile section for mobile when logged in */}
          {session && (
            <div className="border-t border-zinc-800 pt-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-white font-medium">
                    {session.user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {session.user?.name || "User"}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {session.user?.email}
                    </p>
                  </div>
                </div>
              </div>
              
              <nav className="flex flex-col space-y-2">
                <Link
                  href="/profile"
                  className="flex items-center px-3 py-2 text-sm text-zinc-300 hover:bg-sky-500/10 hover:text-sky-400 rounded-lg transition-colors"
                  onClick={onClose}
                >
                  <svg
                    className="w-5 h-5 mr-3"
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
                  Profile
                </Link>
                
                {session.user?.role === "ADMIN" && (
                  <Link
                    href="/dashboard"
                    className="flex items-center px-3 py-2 text-sm text-zinc-300 hover:bg-sky-500/10 hover:text-sky-400 rounded-lg transition-colors"
                    onClick={onClose}
                  >
                    <svg
                      className="w-5 h-5 mr-3"
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
                    onClose();
                  }}
                  className="flex items-center px-3 py-2 text-sm text-zinc-300 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors w-full text-left"
                >
                  <svg
                    className="w-5 h-5 mr-3"
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
              </nav>
            </div>
          )}

          <nav className="flex flex-col space-y-4">
            {/* Auth Dropdown for mobile */}
            {!session && (
              <div className="border-b border-zinc-800 pb-4" ref={authRef}>
                <button
                  onClick={() => setIsAuthOpen(!isAuthOpen)}
                  className="flex items-center justify-between w-full text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  <span>Account</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isAuthOpen ? "rotate-180" : ""
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
                </button>

                {isAuthOpen && (
                  <div className="mt-3 space-y-2 pl-2">
                    <Link
                      href="/auth"
                      className="block text-sm text-zinc-400 hover:text-sky-400 transition-colors"
                      onClick={() => {
                        onClose();
                        setIsAuthOpen(false);
                      }}
                    >
                      Sign In / Sign Up
                    </Link>
                  </div>
                )}
              </div>
            )}
            
            <Link
              href="/submit-report"
              className="text-sm text-zinc-400 hover:text-sky-400 transition-colors"
              onClick={onClose}
            >
              Submit Report
            </Link>
            <Link
              href="/track-report"
              className="text-sm text-zinc-400 hover:text-sky-400 transition-colors"
              onClick={onClose}
            >
              Track Report
            </Link>
            <Link
              href="/how-it-works"
              className="text-sm text-zinc-400 hover:text-sky-400 transition-colors"
              onClick={onClose}
            >
              How It Works
            </Link>
            <Link
              href="/resources"
              className="text-sm text-zinc-400 hover:text-sky-400 transition-colors"
              onClick={onClose}
            >
              Resources
            </Link>
            <Link
              href="/contact"
              className="text-sm text-zinc-400 hover:text-sky-400 transition-colors"
              onClick={onClose}
            >
              Contact
            </Link>

            {/* Emergency Dropdown for Mobile */}
            <div className="border-t border-zinc-800 pt-4" ref={emergencyRef}>
              <button
                onClick={() => setIsEmergencyOpen(!isEmergencyOpen)}
                className="flex items-center justify-between w-full text-sm text-zinc-400 hover:text-white transition-colors"
              >
                <span>Emergency Contacts</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isEmergencyOpen ? "rotate-180" : ""
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
              </button>

              {isEmergencyOpen && (
                <div className="mt-3 space-y-2 pl-2">
                  {emergencyContacts.map((contact, index) => (
                    <a
                      key={index}
                      href={`tel:${contact.number}`}
                      className="flex items-center justify-between text-xs text-zinc-500 hover:text-red-400 transition-colors"
                      onClick={() => {
                        onClose();
                        setIsEmergencyOpen(false);
                      }}
                    >
                      <span>{contact.name}</span>
                      <span className="font-medium text-red-500">
                        {contact.number}
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}