"use client";

import { useState, useCallback } from "react";
import { LocationInput } from "./LocationInput";
import crypto from "crypto";
import Image from "next/image";

const REPORT_TYPES = [
  "Theft",
  "Fire Outbreak",
  "Medical Emergency",
  "Natural Disaster",
  "Violence",
  "Other",
] as const;

type ReportType = "EMERGENCY" | "NON_EMERGENCY";

interface ReportFormProps {
  onComplete: (data: unknown) => void;
}

export function ReportForm({ onComplete }: ReportFormProps) {
  const [formData, setFormData] = useState({
    incidentType: "" as ReportType,
    specificType: "",
    location: "",
    description: "",
    title: "",
    reporterName: "",
    reporterPhone: "",
  });
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setImageError("Please upload a valid image file (jpg, jpeg, png, or gif)");
      return;
    }

    // Clear any previous error
    setImageError(null);
    setIsAnalyzing(true);

    try {
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });

      const response = await fetch("/api/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });

      const data = await response.json();

      if (data.title && data.description && data.reportType) {
        setFormData((prev) => ({
          ...prev,
          title: data.title,
          description: data.description,
          specificType: data.reportType,
        }));
        setImage(base64 as string);
        // Clear any previous error when image is successfully uploaded
        setImageError(null);
      }
    } catch (error) {
      console.error("Error analyzing image:", error);
      setImageError("Failed to analyze image. Please try another image.");
      // Clear the image state when there's an error
      setImage(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateReportId = useCallback(() => {
    const timestamp = Date.now().toString();
    const randomBytes = crypto.randomBytes(16).toString("hex");
    const combinedString = `${timestamp}-${randomBytes}`;
    return crypto
      .createHash("sha256")
      .update(combinedString)
      .digest("hex")
      .slice(0, 16);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that an image is required
    if (!image) {
      // Show popup alert
      alert("Image is required to submit the report");
      
      // Also show inline error and scroll to image section
      setImageError("Image upload is required to submit the report");
      document.getElementById("image-upload")?.closest(".relative")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    
    // Validate that location is required
    if (!formData.location.trim()) {
      setLocationError("Please fill in the location");
      // Scroll to location section
      document.querySelector('[for="location"]')?.closest(".space-y-2")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    
    setIsSubmitting(true);

    try {
      const reportData = {
        reportId: generateReportId(),
        type: formData.incidentType,
        specificType: formData.specificType,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        image: image,
        status: "PENDING",
        reporterName: formData.reporterName,
        reporterPhone: formData.reporterPhone,
      };

      const response = await fetch("/api/reports/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reportData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit report");
      }

      onComplete(result);
    } catch (error) {
      console.error("Error submitting report:", error);
      // Show error to user
      alert(`Failed to submit report: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
      {/* Emergency Type Selection */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <button
          type="button"
          onClick={() =>
            setFormData((prev) => ({ ...prev, incidentType: "EMERGENCY" }))
          }
          className={`p-4 rounded-xl border-2 transition-all duration-200 sm:p-6 ${
            formData.incidentType === "EMERGENCY"
              ? "bg-red-500/20 border-red-500 shadow-lg shadow-red-500/20"
              : "bg-zinc-900/50 border-zinc-800 hover:bg-red-500/10 hover:border-red-500/50"
          }`}
        >
          <div className="flex flex-col items-center space-y-2">
            <svg
              className="w-6 h-6 text-red-500 sm:w-8 sm:h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span className="font-medium text-red-500 text-sm sm:text-base">Emergency</span>
            <span className="text-xs text-zinc-400 text-center">
              Immediate Response Required
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() =>
            setFormData((prev) => ({ ...prev, incidentType: "NON_EMERGENCY" }))
          }
          className={`p-4 rounded-xl border-2 transition-all duration-200 sm:p-6 ${
            formData.incidentType === "NON_EMERGENCY"
              ? "bg-orange-500/20 border-orange-500 shadow-lg shadow-orange-500/20"
              : "bg-zinc-900/50 border-zinc-800 hover:bg-orange-500/10 hover:border-orange-500/50"
          }`}
        >
          <div className="flex flex-col items-center space-y-2">
            <svg
              className="w-6 h-6 text-orange-500 sm:w-8 sm:h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium text-orange-500 text-sm sm:text-base">Non-Emergency</span>
            <span className="text-xs text-zinc-400 text-center">General Report</span>
          </div>
        </button>
      </div>

      {/* Image Upload */}
      <div className="relative group">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="image-upload"
          required
        />
        <label
          htmlFor="image-upload"
          className="block w-full p-4 border-2 border-dashed border-zinc-700 rounded-xl 
                   hover:border-sky-500/50 hover:bg-sky-500/5 transition-all duration-200
                   cursor-pointer text-center sm:p-6"
        >
          {image ? (
            <div className="space-y-3">
              <div className="w-full h-32 relative rounded-lg overflow-hidden sm:h-48">
                <Image
                  src={image}
                  alt="Preview"
                  fill
                  className="object-cover"
                  loading="lazy"
                  quality={80}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <p className="text-xs text-zinc-400 sm:text-sm">Tap to change image</p>
            </div>
          ) : (
            <div className="space-y-3">
              <svg
                className="mx-auto h-8 w-8 text-zinc-500 sm:h-12 sm:w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-xs text-zinc-400 sm:text-sm">
                Tap to upload image
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Required: JPG, JPEG, PNG, or GIF
              </p>
            </div>
          )}
        </label>
        {isAnalyzing && (
          <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <svg
                className="animate-spin h-4 w-4 text-sky-500 sm:h-5 sm:w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="text-sky-500 font-medium text-xs sm:text-sm">
                Analyzing...
              </span>
            </div>
          </div>
        )}
        {imageError && (
          <p className="text-xs text-red-400 flex items-center gap-1 mt-2 sm:text-sm">
            <svg
              className="h-3 w-3 sm:h-4 sm:w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {imageError}
          </p>
        )}
      </div>

      {/* Report Details */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium mb-2 text-zinc-300 sm:text-sm">
            Report Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            className="w-full px-3 py-2.5 bg-black/50 border border-white/5 rounded-lg
                     text-white placeholder-zinc-500 focus:outline-none focus:ring-2 
                     focus:ring-sky-500/50 focus:border-transparent transition-all sm:px-4 sm:py-3 sm:text-base"
            placeholder="Brief title of the incident"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium mb-2 text-zinc-300 sm:text-sm">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            rows={4}
            className="w-full px-3 py-2.5 bg-black/50 border border-white/5 rounded-lg
                     text-white placeholder-zinc-500 focus:outline-none focus:ring-2 
                     focus:ring-sky-500/50 focus:border-transparent transition-all resize-none sm:px-4 sm:py-3 sm:text-base"
            placeholder="Detailed description of the incident..."
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-zinc-300 sm:text-sm">
            Location
          </label>
          <LocationInput
            value={formData.location}
            onChange={(location) =>
              setFormData((prev) => ({ ...prev, location }))
            }
          />
          {locationError && (
            <p className="text-xs text-red-400 flex items-center gap-1 sm:text-sm">
              <svg
                className="h-3 w-3 sm:h-4 sm:w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {locationError}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium mb-2 text-zinc-300 sm:text-sm">
            Report Type
          </label>
          <select
            value={formData.specificType}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, specificType: e.target.value }))
            }
            className="w-full px-3 py-2.5 bg-black/50 border border-white/5 rounded-lg
                     text-white focus:outline-none focus:ring-2 
                     focus:ring-sky-500/50 focus:border-transparent transition-all appearance-none sm:px-4 sm:py-3 sm:text-base"
            required
          >
            <option value="" className="bg-zinc-900 text-zinc-300">
              Select report type
            </option>
            {REPORT_TYPES.map((type) => (
              <option
                key={type}
                value={type}
                className="bg-zinc-900 text-white"
              >
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reporter Info (Optional) */}
      <div className="space-y-4 p-4 bg-zinc-900/30 rounded-xl border border-white/5 sm:p-5">
        <h3 className="text-base font-semibold text-white flex items-center gap-2 sm:text-lg">
          <svg
            className="w-4 h-4 text-sky-500 sm:w-5 sm:h-5"
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
          Your Information (Optional)
        </h3>
        <p className="text-xs text-zinc-400 sm:text-sm">
          Provide your contact details if you wish to receive updates. Your
          information will remain confidential.
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <div>
            <label className="block text-xs font-medium mb-2 text-zinc-300 sm:text-sm">
              Full Name
            </label>
            <input
              type="text"
              value={formData.reporterName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, reporterName: e.target.value }))
              }
              className="w-full px-3 py-2.5 bg-black/50 border border-white/5 rounded-lg
                       text-white placeholder-zinc-500 focus:outline-none focus:ring-2 
                       focus:ring-sky-500/50 focus:border-transparent transition-all sm:px-4 sm:py-3 sm:text-base"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-2 text-zinc-300 sm:text-sm">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.reporterPhone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, reporterPhone: e.target.value }))
              }
              className="w-full px-3 py-2.5 bg-black/50 border border-white/5 rounded-lg
                       text-white placeholder-zinc-500 focus:outline-none focus:ring-2 
                       focus:ring-sky-500/50 focus:border-transparent transition-all sm:px-4 sm:py-3 sm:text-base"
              placeholder="Your phone number"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-sky-500 to-blue-600 
                 text-white py-3 px-4 rounded-xl hover:from-sky-400 
                 hover:to-blue-500 transition-all duration-200 
                 disabled:opacity-50 disabled:cursor-not-allowed
                 flex items-center justify-center space-x-2 font-medium
                 shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 sm:py-4 sm:px-6 sm:rounded-2xl sm:space-x-3"
      >
        {isSubmitting ? (
          <>
            <svg
              className="animate-spin h-4 w-4 text-white sm:h-5 sm:w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="text-sm sm:text-base">Submitting Report...</span>
          </>
        ) : (
          <>
            <svg
              className="h-4 w-4 sm:h-5 sm:w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span className="text-sm sm:text-base">Submit Anonymous Report</span>
          </>
        )}
      </button>
    </form>
  );
}