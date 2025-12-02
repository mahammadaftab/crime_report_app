"use client";

import { useEffect, useRef } from "react";
import { performanceMonitor } from '@/lib/performance-monitor';

interface PerformanceWrapperProps {
  pageName: string;
  children: React.ReactNode;
}

export function PerformanceWrapper({ pageName, children }: PerformanceWrapperProps) {
  const startTimeRef = useRef<number>(0);
  
  useEffect(() => {
    // Record start time when component mounts
    startTimeRef.current = performance.now();
    
    // Measure page load time when component unmounts
    return () => {
      performanceMonitor.measurePageLoad(pageName, startTimeRef.current);
    };
  }, [pageName]);
  
  return <>{children}</>;
}