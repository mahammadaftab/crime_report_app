"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ReportForm } from "./ReportForm";
import { ReportSubmitted } from "./ReportFormCompleted";

const steps = [
  { id: 1, title: "Report Details" },
  { id: 2, title: "Confirmation" },
];

export function ReportWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [reportData, setReportData] = useState<unknown>(null);

  const handleStepComplete = async (data: unknown) => {
    setReportData({ ...(reportData as object), ...(data as object) });
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  return (
    <div className="rounded-xl bg-neutral-900/60 backdrop-blur-xl border border-white/10 p-4 shadow-xl sm:rounded-2xl sm:p-6 md:p-8">
      {/* Stepper Progress */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        {steps.map((step, idx) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <div key={step.id} className="flex items-center w-full">
              {/* Step Circle */}
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-medium transition-all sm:h-10 sm:w-10 sm:text-sm ${
                  isActive
                    ? "border-sky-500 bg-sky-500/20 text-sky-400"
                    : isCompleted
                    ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                    : "border-neutral-700 bg-neutral-800 text-neutral-500"
                }`}
              >
                {step.id}
              </div>

              {/* Step Title - Hidden on mobile for first step to save space */}
              {step.id === 1 ? (
                <div className="ml-2 sm:ml-3">
                  <p
                    className={`text-xs font-medium sm:text-sm ${
                      isActive
                        ? "text-white"
                        : isCompleted
                        ? "text-emerald-400"
                        : "text-neutral-500"
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
              ) : (
                <div className="ml-2 sm:ml-3">
                  <p
                    className={`text-xs font-medium sm:text-sm ${
                      isActive
                        ? "text-white"
                        : isCompleted
                        ? "text-emerald-400"
                        : "text-neutral-500"
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
              )}

              {/* Connector Line */}
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 sm:mx-4 ${
                    isCompleted ? "bg-emerald-500" : "bg-neutral-800"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {currentStep === 1 && <ReportForm onComplete={handleStepComplete} />}
          {currentStep === 2 && (
            <ReportSubmitted data={reportData} onComplete={handleStepComplete} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}