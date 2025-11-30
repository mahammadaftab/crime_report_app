import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Define types for Mapbox components
interface MapboxFeature {
  place_name?: string;
  text?: string;
}

interface MapboxRetrieveEvent {
  features: MapboxFeature[];
}

// Dynamically import the Mapbox component with ssr disabled
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AddressAutofill = dynamic(() => import("@mapbox/search-js-react").then((mod) => mod.AddressAutofill as any), {
  ssr: false,
  loading: () => <div className="text-xs text-zinc-500">Loading map...</div>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as any;

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function LocationInput({
  value,
  onChange,
}: LocationInputProps) {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getLocation = async () => {
    setIsGettingLocation(true);
    setLocationError(null);

    try {
      if (typeof window === "undefined" || !navigator.geolocation) {
        throw new Error("Geolocation is not supported by your browser");
      }

      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve,
            (error) => {
              switch (error.code) {
                case error.PERMISSION_DENIED:
                  reject(
                    new Error(
                      "Please allow location access in your browser settings"
                    )
                  );
                  break;
                case error.POSITION_UNAVAILABLE:
                  reject(new Error("Location information is unavailable"));
                  break;
                case error.TIMEOUT:
                  reject(new Error("Location request timed out"));
                  break;
                default:
                  reject(new Error("An unknown error occurred"));
              }
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0,
            }
          );
        }
      );

      const { latitude, longitude } = position.coords;
      // Instead of converting to coordinates, we'll use a readable address format
      onChange(`Current Location (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`);
    } catch (error) {
      console.error("Location error:", error);
      setLocationError(
        error instanceof Error ? error.message : "Unable to get your location"
      );
    } finally {
      setIsGettingLocation(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-zinc-400 sm:text-sm">
        Location (Area/Street) *
      </label>
      <div className="relative">
        {isClient ? (
          <AddressAutofill
            accessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ""}
            options={{
              language: 'en',
            }}
            onRetrieve={(e: MapboxRetrieveEvent) => {
              const feature = e.features[0];
              if (feature) {
                // Create a more detailed location string with area information
                const placeName = feature.place_name || feature.text || '';
                onChange(placeName);
              }
            }}
          >
            <input
              id="location"
              type="text"
              autoComplete="street-address"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Enter specific area/street name or use pin"
              className="w-full rounded-lg bg-zinc-900/50 border border-zinc-800 pl-3 pr-10 py-2.5
                       text-white transition-colors duration-200 text-sm
                       focus:outline-none focus:ring-2 focus:ring-sky-500/40 sm:pl-4 sm:pr-12 sm:py-3 sm:text-base"
            />
          </AddressAutofill>
        ) : (
          <input
            id="location"
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter specific area/street name"
            className="w-full rounded-lg bg-zinc-900/50 border border-zinc-800 pl-3 pr-10 py-2.5
                     text-white transition-colors duration-200 text-sm
                     focus:outline-none focus:ring-2 focus:ring-sky-500/40 sm:pl-4 sm:pr-12 sm:py-3 sm:text-base"
          />
        )}
        <button
          type="button"
          onClick={getLocation}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1
                   rounded-md bg-sky-500/10 text-sky-400 
                   hover:bg-sky-500/20 transition-colors duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed sm:right-3 sm:p-1.5"
          disabled={isGettingLocation}
          title="Get current location"
        >
          {isGettingLocation ? (
            <svg
              className="animate-spin h-4 w-4 sm:h-5 sm:w-5"
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
          ) : (
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
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          )}
        </button>
      </div>
      {locationError && (
        <p className="text-xs text-red-400 flex items-center sm:text-sm">
          <svg
            className="w-3 h-3 mr-1 sm:w-4 sm:h-4"
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
  );
}