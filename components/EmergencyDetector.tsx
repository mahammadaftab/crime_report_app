"use client";

import { useEmergencyDetection, callEmergencyService } from '@/lib/useEmergencyDetection';

interface EmergencyDetectorProps {
  enabled?: boolean;
}

export function EmergencyDetector({ enabled = true }: EmergencyDetectorProps) {
  useEmergencyDetection({
    enabled,
    onCarAccident: () => {
      // Show notification using browser API
      if (typeof window !== 'undefined' && 'Notification' in window) {
        new Notification('Emergency Detected', {
          body: 'Car accident detected! Calling police...',
          icon: '/favicon.ico'
        });
      }
      
      // Call police for car accident
      callEmergencyService('POLICE');
    },
    onFire: () => {
      // Show notification using browser API
      if (typeof window !== 'undefined' && 'Notification' in window) {
        new Notification('Emergency Detected', {
          body: 'Fire detected! Calling fire department...',
          icon: '/favicon.ico'
        });
      }
      
      // Call fire department
      callEmergencyService('FIRE');
    },
    onMedicalEmergency: () => {
      // Show notification using browser API
      if (typeof window !== 'undefined' && 'Notification' in window) {
        new Notification('Emergency Detected', {
          body: 'Medical emergency detected! Calling ambulance...',
          icon: '/favicon.ico'
        });
      }
      
      // Call ambulance
      callEmergencyService('AMBULANCE');
    }
  });

  // This component doesn't render anything visible
  return null;
}