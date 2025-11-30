import ClientVerifyForm from "./ClientVerifyForm";
import { Suspense } from "react";

export default function AdminVerifyEmail() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black">Loading...</div>}>
      <ClientVerifyForm />
    </Suspense>
  );
}
