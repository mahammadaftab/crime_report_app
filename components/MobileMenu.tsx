import Link from "next/link";
import { useState, useEffect, useRef } from "react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const emergencyRef = useRef<HTMLDivElement>(null);

  const emergencyContacts = [
    { name: "Ambulance", number: "101" },
    { name: "Emergency Police", number: "108" },
    { name: "Police", number: "100" },
    { name: "Cyber Crime", number: "1930" },
    { name: "Women Helpline", number: "100" },
    { name: "Child Helpline", number: "1930" },
  ];

  // Handle click outside to close emergency dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emergencyRef.current && !emergencyRef.current.contains(event.target as Node)) {
        setIsEmergencyOpen(false);
      }
    };

    if (isEmergencyOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEmergencyOpen]);

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
          <div className="flex justify-end">
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

          <nav className="flex flex-col space-y-4">
            <Link
              href="/submit-report"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
              onClick={onClose}
            >
              Submit Report
            </Link>
            <Link
              href="/track-report"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
              onClick={onClose}
            >
              Track Report
            </Link>
            <Link
              href="/how-it-works"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
              onClick={onClose}
            >
              How It Works
            </Link>
            <Link
              href="/resources"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
              onClick={onClose}
            >
              Resources
            </Link>
            <Link
              href="/contact"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
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