"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { HeroSection } from "@/components/HeroSection";
import { SearchFilters } from "@/components/SearchFilters";
import { FacilityCard } from "@/components/FacilityCard";
import { facilities as staticFacilities, Facility } from "@/data/facilities";
import { Button } from "@/components/ui/button";
import { ChevronDown, Navigation, AlertCircle, Locate, HelpCircle, ExternalLink } from "lucide-react";

// Helper function to transform API clinic to Facility type
const transformClinicToFacility = (clinic: any, index?: number): Facility => {
  // Extract location from address
  const location = clinic.address?.city || 
                   clinic.address?.state || 
                   clinic.address?.formattedAddress?.split(',').map((s: string) => s.trim())[1] || 
                   "Unknown Location";
  
  // Generate a consistent ID
  const id = clinic._id || `clinic-${Date.now()}-${index || Math.random()}`;
  
  // Default images for fallback
  const DEFAULT_IMAGES = {
    hospital: "https://images.unsplash.com/photo-1769147555720-71fc71bfc216?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3NwaXRhbCUyMGJ1aWxkaW5nJTIwZXh0ZXJpb3J8ZW58MXx8fHwxNzcxNTUyNzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    clinic: "https://images.unsplash.com/photo-1762625570087-6d98fca29531?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkZW50YWwlMjBjbGluaWMlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NzE1MTkxMDJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
  };
  
  return {
    id: id,
    _id: clinic._id,
    name: clinic.name || "Unnamed Clinic",
    type: clinic.type === "hospital" ? "hospital" : "clinic",
    location: location,
    address: clinic.address?.formattedAddress || 
             `${clinic.address?.street || ''}, ${clinic.address?.city || ''}, ${clinic.address?.state || ''}`.replace(/^, |, $/g, '') || 
             "Address not available",
    rating: clinic.ratingAvg || 4.5,
    reviewCount: clinic.totalReviews || 0,
    openHours: clinic.openHours || "Mon - Fri: 9:00 AM - 6:00 PM",
    phone: clinic.phoneNumber?.toString() || "Contact for details",
    image: clinic.image || (clinic.type === "hospital" ? DEFAULT_IMAGES.hospital : DEFAULT_IMAGES.clinic),
    services: clinic.services || ["General Dentistry", "Consultation", "Dental Checkup"],
    acceptingPatients: clinic.acceptingPatients !== undefined ? clinic.acceptingPatients : true,
    distanceKm: clinic.distance || clinic.distanceKm
  };
};

// Batch transform multiple clinics
const transformClinicsToFacilities = (clinics: any[]): Facility[] => {
  return clinics.map((clinic, index) => transformClinicToFacility(clinic, index));
};

export default function Home() {
  console.log("🏠 Home component rendering");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [visibleCount, setVisibleCount] = useState(6);
  
  // State for location and API data
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyClinics, setNearbyClinics] = useState<Facility[]>([]);
  const [isLoadingClinics, setIsLoadingClinics] = useState(false);
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationPermission, setLocationPermission] = useState<PermissionState | null>(null);
  const [hasRequestedLocation, setHasRequestedLocation] = useState(false);
  
  // Add a ref to track if we've already attempted location request
  const locationRequestAttempted = useRef(false);

  // Check if geolocation is supported
  const isGeolocationSupported = typeof window !== 'undefined' && 'geolocation' in navigator;
  console.log("🔍 Geolocation supported:", isGeolocationSupported);

  // Check permission status on mount
  useEffect(() => {
    console.log("🔍 Checking permission status...");
    
    if (!isGeolocationSupported) {
      console.log("❌ Geolocation not supported");
      return;
    }

    // Check if we have permission status API
    if (navigator.permissions && navigator.permissions.query) {
      console.log("🔍 Permissions API available");
      
      navigator.permissions.query({ name: 'geolocation' })
        .then((result) => {
          console.log("📍 Current permission state:", result.state);
          setLocationPermission(result.state);
          
          // If permission already granted, automatically get location
          if (result.state === 'granted' && !locationRequestAttempted.current) {
            console.log("📍 Permission already granted, getting location...");
            locationRequestAttempted.current = true;
            requestUserLocation();
          }
          
          // Listen for permission changes
          result.addEventListener('change', () => {
            console.log("📍 Permission state changed to:", result.state);
            setLocationPermission(result.state);
          });
        })
        .catch((err) => {
          console.error("❌ Error checking permission:", err);
        });
    }
  }, [isGeolocationSupported]);

  // Function to request user location
  const requestUserLocation = useCallback(() => {
    console.log("📍 requestUserLocation called");
    
    if (!isGeolocationSupported) {
      console.log("❌ Geolocation not supported");
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    console.log("📍 Requesting location permission...");
    setIsRequestingLocation(true);
    setHasRequestedLocation(true);
    setLocationError(null);
    
    // Use a timeout to handle cases where the browser doesn't respond
    const timeoutId = setTimeout(() => {
      if (isRequestingLocation) {
        console.log("📍 Location request timeout");
        setIsRequestingLocation(false);
        setLocationError("Location request timed out. Please try again.");
      }
    }, 15000);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeoutId);
        console.log("📍 Location obtained successfully:", position.coords);
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setLocationError(null);
        setIsRequestingLocation(false);
      },
      (error) => {
        clearTimeout(timeoutId);
        console.error("❌ Geolocation error:", error);
        
        // Log more details about the error
        if (error.code) {
          console.error("Error code:", error.code);
        }
        if (error.message) {
          console.error("Error message:", error.message);
        }
        
        setIsRequestingLocation(false);
        
        // Set appropriate error message based on error code
        if (error.code === 1) { // PERMISSION_DENIED
          setLocationError("Location access denied. Please enable location access to see nearby clinics.");
        } else if (error.code === 2) { // POSITION_UNAVAILABLE
          setLocationError("Location information is unavailable. Please try again.");
        } else if (error.code === 3) { // TIMEOUT
          setLocationError("Location request timed out. Please try again.");
        } else {
          setLocationError("An unknown error occurred while getting your location.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, [isGeolocationSupported]);

  // Fetch nearby clinics when user location is available
  useEffect(() => {
    const fetchNearbyClinics = async () => {
      if (!userLocation) {
        console.log("📍 No user location, skipping API fetch");
        return;
      }
      
      console.log("📍 Fetching nearby clinics for location:", userLocation);
      setIsLoadingClinics(true);
      setLocationError(null);
      
      try {
        const { lat, lng } = userLocation;
        const radius = 50; // Default radius in km
        
        const url = `http://localhost:8001/api/v1/auth/clinic/location-based-clinics?lat=${lat}&lng=${lng}&radius=${radius}`;
        console.log("📍 API URL:", url);
        
        const response = await fetch(url);
        console.log("📍 API Response status:", response.status);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const result = await response.json();
        console.log("📍 API Response data:", result);
        
        if (result.success && result.data) {
          // Transform API data to Facility type
          const transformedClinics = transformClinicsToFacilities(result.data);
          console.log("📍 Transformed clinics:", transformedClinics.length);
          
          // Calculate distance if not provided by API
          // const clinicsWithDistance = transformedClinics.map(clinic => ({
          //   ...clinic,
          //   distanceKm: clinic.distanceKm || Math.round((Math.random() * 19 + 1) * 10) / 10
          // }));
          
      console.log("📍 Setting nearby clinics:", transformedClinics.length);
setNearbyClinics(transformedClinics);
        } else {
          console.log("📍 No clinics found in API response");
          setNearbyClinics([]);
        }
      } catch (error) {
        console.error("❌ Error fetching nearby clinics:", error);
        setLocationError("Failed to fetch nearby clinics. Please try again later.");
        setNearbyClinics([]);
      } finally {
        setIsLoadingClinics(false);
      }
    };
    
    fetchNearbyClinics();
  }, [userLocation]);

  // Use nearbyClinics if available, otherwise use static facilities
  const displayFacilities = nearbyClinics.length > 0 ? nearbyClinics : staticFacilities;
  console.log("📍 Display facilities:", displayFacilities.length);

  // Get unique locations from facilities for filter dropdown
  const locations = useMemo(() => {
    const uniqueLocations = new Set(displayFacilities.map(c => c.location));
    return Array.from(uniqueLocations);
  }, [displayFacilities]);

  // Filter facilities based on search, type, and location
  const filteredFacilities = useMemo(() => {
    return displayFacilities.filter((facility) => {
      const facilityName = facility.name || "";
      const facilityServices = facility.services || [];
      const facilityType = facility.type || "";
      const facilityLocation = facility.location || "";

      const matchesSearch = searchQuery === "" ||
        facilityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        facilityServices.some((service: string) =>
          service?.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesType = selectedType === "all" || facilityType === selectedType;

      const matchesLocation = selectedLocation === "all" ||
        facilityLocation.toLowerCase().replace(/\s+/g, "") ===
        selectedLocation.toLowerCase().replace(/\s+/g, "");

      return matchesSearch && matchesType && matchesLocation;
    });
  }, [searchQuery, selectedType, selectedLocation, displayFacilities]);

  // Sort facilities by distance if user location exists
  const sortedFacilities = useMemo(() => {
    if (userLocation && nearbyClinics.length > 0) {
      return [...filteredFacilities].sort(
        (a, b) => (a.distanceKm || Infinity) - (b.distanceKm || Infinity)
      );
    }
    return filteredFacilities;
  }, [filteredFacilities, userLocation, nearbyClinics.length]);

  const visibleFacilities = sortedFacilities.slice(0, visibleCount);
  const hasMore = visibleCount < sortedFacilities.length;

  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const handleReset = () => {
    setSearchQuery("");
    setSelectedType("all");
    setSelectedLocation("all");
    setVisibleCount(6);
  };

  const handleEnableLocation = () => {
    console.log("📍 Enable Location button clicked");
    // Reset any previous errors
    setLocationError(null);
    // Reset the attempted flag to allow new request
    locationRequestAttempted.current = true;
    requestUserLocation();
  };

  const handleHowToEnable = () => {
    console.log("📍 How to enable button clicked");
    window.open('https://support.google.com/chrome/answer/142065?hl=en', '_blank');
  };

  const handleOpenSettings = () => {
    console.log("📍 Open settings button clicked");
    window.open('chrome://settings/content/location', '_blank');
  };

  const handleRefreshAfterSettings = () => {
    console.log("📍 Refresh after settings button clicked");
    window.location.reload();
  };

  // Determine which banner to show
  const showPermissionBanner = !userLocation && !locationError && locationPermission !== 'granted' && !hasRequestedLocation;
  const showErrorBanner = locationError && !isRequestingLocation;
  const showSuccessBanner = userLocation && !locationError && nearbyClinics.length > 0;

  // Show loader only when actively requesting location or fetching clinics
  const showLoader = isRequestingLocation || isLoadingClinics;

  return (
    <>
      <HeroSection />

      {/* Location status banner - Success */}
      {showSuccessBanner && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200 py-3 sticky top-0 z-40 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-green-700">
                <Navigation className="w-4 h-4" />
                <span>
                  Showing clinics near your location
                </span>
                <span className="bg-green-200 px-2 py-0.5 rounded-full text-xs font-medium">
                  {nearbyClinics.length} found
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Location permission request banner - Show when user hasn't interacted yet */}
      {showPermissionBanner && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200 py-4 sticky top-0 z-40 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-blue-700">
                <Locate className="w-5 h-5" />
                <span className="text-sm font-medium">Find clinics near you with location access</span>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleEnableLocation}
                  disabled={isRequestingLocation}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isRequestingLocation ? "Requesting..." : "Enable Location"}
                </Button>
                <Button
                  onClick={handleHowToEnable}
                  size="sm"
                  variant="outline"
                  className="bg-white/50 hover:bg-white border-blue-300 text-blue-700"
                >
                  <HelpCircle className="w-4 h-4 mr-1" />
                  How to enable
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Location error/permission denied banner */}
      {showErrorBanner && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200 py-4 sticky top-0 z-40 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-amber-700">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{locationError}</span>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    onClick={handleEnableLocation}
                    disabled={isRequestingLocation}
                    size="sm"
                    className="bg-amber-600 hover:bg-amber-700 text-white flex-1 sm:flex-none"
                  >
                    {isRequestingLocation ? "Requesting..." : "Try Again"}
                  </Button>
                  <Button
                    onClick={handleOpenSettings}
                    size="sm"
                    variant="outline"
                    className="bg-white/50 hover:bg-white border-amber-300 text-amber-700 flex-1 sm:flex-none"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Fix in Settings
                  </Button>
                </div>
              </div>
              
              {/* Detailed instructions for Chrome */}
              <div className="bg-amber-100/50 rounded-lg p-4 text-sm text-amber-800">
                <p className="font-semibold mb-2">📍 How to reset location permissions in Chrome:</p>
                <div className="grid gap-2">
                  <div className="flex items-start gap-2">
                    <span className="bg-amber-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                    <span>Click the <strong>lock icon</strong> (🔒) in your address bar (left side of the URL)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="bg-amber-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                    <span>Click <strong>"Site settings"</strong></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="bg-amber-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                    <span>Find <strong>"Location"</strong> and change it to <strong>"Ask" or "Allow"</strong></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="bg-amber-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                    <span><strong>Refresh</strong> this page and click "Enable Location" again</span>
                  </div>
                </div>
                
                {/* Alternative method */}
                <p className="font-semibold mt-3 mb-2">🔄 Alternative method:</p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-start gap-2">
                    <span className="bg-amber-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">•</span>
                    <span>Click the <strong>"Open Settings"</strong> button above, find this site in the list, and reset its permission</span>
                  </div>
                  <Button
                    onClick={handleRefreshAfterSettings}
                    size="sm"
                    variant="outline"
                    className="bg-white hover:bg-amber-50 border-amber-300 text-amber-700 mt-2"
                  >
                    Refresh Page After Changing Settings
                  </Button>
                </div>
              </div>

              {/* Browser detection note */}
              <p className="text-xs text-amber-600 mt-1">
                ℹ️ These instructions are for Google Chrome. If you're using a different browser, the steps may vary.
              </p>
            </div>
          </div>
        </div>
      )}

      <SearchFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
        locations={locations}
      />

      <main className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl px-6 py-4 shadow-xl shadow-blue-500/10">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {sortedFacilities.length}{" "}
              {sortedFacilities.length === 1 ? "Facility" : "Facilities"} Found
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Showing {visibleFacilities.length} of {sortedFacilities.length} results
              {userLocation && nearbyClinics.length > 0 && " • Sorted by distance"}
            </p>
          </div>
        </div>

        {showLoader && (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">
                {isRequestingLocation ? "Getting your location..." : "Finding clinics near you..."}
              </p>
            </div>
          </div>
        )}

        {!showLoader && sortedFacilities.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visibleFacilities.map((facility) => (
                <div
                  key={facility.id || facility._id}
                  className="relative"
                >
                {facility.distanceKm && (
  <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-blue-600 shadow-lg border border-blue-200">
    {typeof facility.distanceKm === 'number' 
      ? facility.distanceKm.toFixed(1) 
      : facility.distanceKm} km
  </div>
)}
                  <FacilityCard facility={facility} />
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-12">
                <Button
                  onClick={handleSeeMore}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl shadow-blue-500/40 rounded-2xl px-10 py-6 text-lg font-semibold group"
                >
                  See More Hospitals & Clinics
                  <ChevronDown className="ml-2 w-5 h-5 group-hover:animate-bounce" />
                </Button>
              </div>
            )}

            {!hasMore && sortedFacilities.length > 6 && (
              <div className="flex justify-center mt-12">
                <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl px-8 py-4 shadow-xl shadow-blue-500/10">
                  <p className="text-gray-700 font-medium">
                    ✓ All {sortedFacilities.length} facilities displayed
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {!showLoader && sortedFacilities.length === 0 && (
          <div className="text-center py-20 bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl shadow-blue-500/10">
            <div className="text-7xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No facilities found
            </h3>
            <p className="text-gray-600 mb-6">
              {locationError 
                ? "Unable to find facilities near you. Please enable location access to see nearby clinics."
                : "Try adjusting your search filters or search query"}
            </p>
            <Button
              onClick={handleReset}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/30 rounded-xl"
            >
              Reset Filters
            </Button>
          </div>
        )}
      </main>
    </>
  );
}