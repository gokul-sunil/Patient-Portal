// src/app/hooks/useLocation.ts
"use client";

import { useState, useEffect } from 'react';

export const useLocation = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  // Check stored location on mount
  useEffect(() => {
    console.log('📍 useLocation hook mounted');
    const stored = localStorage.getItem('userLocation');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        console.log('📍 Found stored location:', parsed);
        setUserLocation(parsed);
      } catch (e) {
        console.error('Error parsing stored location:', e);
      }
    }
  }, []);

  const requestLocation = () => {
    console.log('📍 requestLocation called');
    setIsLoading(true);
    setLocationError(null);
    setPermissionDenied(false);

    // Check if geolocation is available
    if (!navigator?.geolocation) {
      console.error('❌ Geolocation not available');
      setLocationError('Geolocation is not supported by your browser');
      setIsLoading(false);
      return;
    }

    console.log('✅ Geolocation is available, making request...');

    // Try with different options
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('✅ Location obtained:', position.coords);
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        localStorage.setItem('userLocation', JSON.stringify(location));
        setUserLocation(location);
        setIsLoading(false);
      },
      (error) => {
        console.error('❌ Geolocation error:', {
          code: error.code,
          message: error.message,
          PERMISSION_DENIED: error.PERMISSION_DENIED,
          POSITION_UNAVAILABLE: error.POSITION_UNAVAILABLE,
          TIMEOUT: error.TIMEOUT
        });

        let errorMessage = '';
        if (error.code === 1) {
          errorMessage = 'Please allow location access to find nearby clinics';
          setPermissionDenied(true);
        } else if (error.code === 2) {
          errorMessage = 'Location information is unavailable. Please check your device settings.';
        } else if (error.code === 3) {
          errorMessage = 'Location request timed out. Please try again.';
        } else {
          errorMessage = 'Failed to get your location. Please try again.';
        }
        
        setLocationError(errorMessage);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const clearLocation = () => {
    console.log('📍 Clearing location');
    localStorage.removeItem('userLocation');
    setUserLocation(null);
    setPermissionDenied(false);
    setLocationError(null);
  };

  return {
    userLocation,
    locationError,
    isLoading,
    permissionDenied,
    requestLocation,
    clearLocation
  };
};