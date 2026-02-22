"use client";

import { useLocation } from '../hooks/useLocation';

export const LocationPermission = () => {
  const { 
    userLocation, 
    locationError, 
    isLoading, 
    permissionDenied,
    requestLocation 
  } = useLocation();

  // Don't show if we already have location or user denied
  if (userLocation || permissionDenied) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm z-50">
      <h3 className="text-lg font-semibold mb-2">📍 Find Nearby Clinics</h3>
      <p className="text-gray-600 mb-4">
        Allow location access to see clinics near you
      </p>
      
      {locationError && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-3 text-sm">
          {locationError}
        </div>
      )}

      <button
        onClick={requestLocation}
        disabled={isLoading}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Getting location...' : 'Allow Location Access'}
      </button>
    </div>
  );
};