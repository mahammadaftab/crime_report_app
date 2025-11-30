import { ClientReportTracker } from "@/components/report/ClientReportTracker";
import { Suspense } from "react";

export default function TrackReportPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
        <div className="w-full max-w-5xl">
          <Suspense fallback={<div className="flex justify-center items-center h-64">Loading...</div>}>
            <ClientReportTracker />
          </Suspense>
        </div>
      </div>
    </div>
  );
}