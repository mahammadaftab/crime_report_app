"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ContactMessage } from "@prisma/client";

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch("/api/contact");
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch messages");
        }
        
        setMessages(data.messages || []);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        setError(err instanceof Error ? err.message : "Failed to load messages. Please try again later.");
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  // Skeleton loading component
  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white p-8">
        <h1 className="text-2xl font-semibold mb-6">Contact Messages</h1>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border border-neutral-800 rounded-xl p-4 bg-neutral-900/50 animate-pulse">
              <div className="flex items-center justify-between mb-2">
                <div className="h-4 bg-neutral-800 rounded w-1/3"></div>
                <div className="h-3 bg-neutral-800 rounded w-24"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-neutral-800 rounded w-full"></div>
                <div className="h-3 bg-neutral-800 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-semibold mb-6">Contact Messages</h1>
      {error ? (
        <div className="border border-red-500/30 rounded-xl p-4 bg-red-900/10">
          <p className="text-red-300">{error}</p>
          <p className="text-red-400 text-sm mt-2">The application is running but cannot connect to the database at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.length > 0 ? (
            messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="border border-neutral-800 rounded-xl p-4 bg-neutral-900/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">{m.name} • {m.email}</p>
                  <span className="text-xs text-neutral-400">
                    {new Date(m.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-neutral-300 whitespace-pre-wrap">{m.message}</p>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-neutral-500">No messages found</p>
            </div>
          )}
        </div>
      )}
    </main>
  );
}