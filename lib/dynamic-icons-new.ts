import dynamic from "next/dynamic";

// Dynamically import Lucide React icons to reduce bundle size
export const DynamicEye = dynamic(() => import("lucide-react").then((mod) => mod.Eye));
export const DynamicEyeOff = dynamic(() => import("lucide-react").then((mod) => mod.EyeOff));
export const DynamicCalendar = dynamic(() => import("lucide-react").then((mod) => mod.Calendar));
export const DynamicMail = dynamic(() => import("lucide-react").then((mod) => mod.Mail));
export const DynamicUser = dynamic(() => import("lucide-react").then((mod) => mod.User));
export const DynamicPhone = dynamic(() => import("lucide-react").then((mod) => mod.Phone));
export const DynamicMapPin = dynamic(() => import("lucide-react").then((mod) => mod.MapPin));
export const DynamicLock = dynamic(() => import("lucide-react").then((mod) => mod.Lock));
export const DynamicSave = dynamic(() => import("lucide-react").then((mod) => mod.Save));
export const DynamicX = dynamic(() => import("lucide-react").then((mod) => mod.X));
export const DynamicStar = dynamic(() => import("lucide-react").then((mod) => mod.Star));
export const DynamicAward = dynamic(() => import("lucide-react").then((mod) => mod.Award));
export const DynamicFileText = dynamic(() => import("lucide-react").then((mod) => mod.FileText));
export const DynamicTrophy = dynamic(() => import("lucide-react").then((mod) => mod.Trophy));
export const DynamicPlusCircle = dynamic(() => import("lucide-react").then((mod) => mod.PlusCircle));
export const DynamicMinusCircle = dynamic(() => import("lucide-react").then((mod) => mod.MinusCircle));
export const DynamicGift = dynamic(() => import("lucide-react").then((mod) => mod.Gift));
export const DynamicRefreshCw = dynamic(() => import("lucide-react").then((mod) => mod.RefreshCw));
export const DynamicClock = dynamic(() => import("lucide-react").then((mod) => mod.Clock));
export const DynamicTarget = dynamic(() => import("lucide-react").then((mod) => mod.Target));
export const DynamicCoins = dynamic(() => import("lucide-react").then((mod) => mod.Coins));
export const DynamicTrendingUp = dynamic(() => import("lucide-react").then((mod) => mod.TrendingUp));

// Loading component for icons
export const IconLoading = () => (
  <div className="w-4 h-4 bg-neutral-700 rounded-full animate-pulse" />
);