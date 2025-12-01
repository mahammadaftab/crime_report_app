import prisma from "@/lib/prisma";
import { ContactMessage } from "@prisma/client";

export default async function MessagesPage() {
  let messages: ContactMessage[] = [];
  let error: string | null = null;

  try {
    // Add a timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database connection timeout')), 5000)
    );
    
    // Try to fetch messages with timeout
    const fetchPromise = prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
    
    messages = await Promise.race([fetchPromise, timeoutPromise]) as ContactMessage[];
  } catch (err) {
    console.error("Failed to fetch messages:", err);
    // Check if it's a database connection error
    if (err instanceof Error && (err.message.includes('Can\'t reach database server') || err.message.includes('timeout'))) {
      error = "Database connection unavailable. Please try again later.";
    } else {
      error = "Failed to load messages. Please try again later.";
    }
    // Return empty array to prevent crashing
    messages = [];
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
              <div
                key={m.id}
                className="border border-neutral-800 rounded-xl p-4 bg-neutral-900/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">{m.name} • {m.email}</p>
                  <span className="text-xs text-neutral-400">
                    {new Date(m.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-neutral-300 whitespace-pre-wrap">{m.message}</p>
              </div>
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