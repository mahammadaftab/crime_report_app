"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignInRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.push("/auth");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-neutral-900 to-black">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-neutral-400">Redirecting...</p>
      </div>
    </div>
  );
}
