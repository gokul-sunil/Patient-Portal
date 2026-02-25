"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { HeroSection } from "@/components/HeroSection";
import { SearchFilters } from "@/components/SearchFilters";
import { FacilityCard } from "@/components/FacilityCard";
import { facilities as staticFacilities, Facility } from "@/data/facilities";
import { Button } from "@/components/ui/button";
import { ChevronDown, Navigation, Locate, HelpCircle } from "lucide-react";

// Define proper types instead of 'any'
interface ClinicAddress {
  city?: string;
  state?: string;
  formattedAddress?: string;
  street?: string;
}

interface ClinicData {
  _id?: string;
  name?: string;
  type?: string;
  address?: ClinicAddress;
  ratingAvg?: number;
  totalReviews?: number;
  openHours?: string;
  phoneNumber?: string | number;
  image?: string;
  services?: string[];
  acceptingPatients?: boolean;
  distance?: number;
  distanceKm?: number;
}

// Helper function to transform API clinic to Facility type
const transformClinicToFacility = (clinic: ClinicData, index?: number): Facility => {
  // Extract location from address
  const location = clinic.address?.city || 
                   clinic.address?.state || 
                   clinic.address?.formattedAddress?.split(',').map((s: string) => s.trim())[1] || 
                   "Unknown Location";
  
  // Generate a consistent ID
  const id = clinic._id || `clinic-${index}`;
  
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
const transformClinicsToFacilities = (clinics: ClinicData[]): Facility[] => {
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
  const [apiDebugInfo, setApiDebugInfo] = useState<string>("");
  
  // Add refs to track if we've already attempted location request and fetched clinics
  const locationRequestAttempted = useRef(false);
  const clinicsFetchedForLocation = useRef<string | null>(null);

  // Check if geolocation is supported
  const [isGeolocationSupported, setIsGeolocationSupported] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      setIsGeolocationSupported(true);
    } else {
      setIsGeolocationSupported(false);
    }
  }, []);

  // Check permission status on mount
  useEffect(() => {
    console.log("🔍 Checking permission status...");
    
    if (isGeolocationSupported !== true) return;

    // Check if we have permission status API
    if (navigator.permissions && navigator.permissions.query) {
      console.log("🔍 Permissions API available");
      
      navigator.permissions.query({ name: 'geolocation' as PermissionName })
        .then((result) => {
          console.log("📍 Current permission state:", result.state);
          setLocationPermission(result.state);
          
          // If permission already granted, automatically get location
          if (result.state === 'granted' && !locationRequestAttempted.current && !userLocation) {
            console.log("📍 Permission already granted, getting location...");
            locationRequestAttempted.current = true;
            requestUserLocation();
          }
          
          // Listen for permission changes
          result.addEventListener('change', () => {
            console.log("📍 Permission state changed to:", result.state);
            setLocationPermission(result.state);
            
            // If permission becomes granted, request location
            if (result.state === 'granted' && !userLocation) {
              locationRequestAttempted.current = true;
              requestUserLocation();
            }
          });
        })
        .catch((err) => {
          console.error("❌ Error checking permission:", err);
        });
    }
  }, [isGeolocationSupported, userLocation]);

  // Function to request user location
  const requestUserLocation = useCallback(() => {
    console.log("📍 requestUserLocation called");
    
    if (isGeolocationSupported !== true) {
      console.log("❌ Geolocation not supported");
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    // Don't request if already requesting or already have location
    if (isRequestingLocation || userLocation) {
      console.log("📍 Already requesting location or location already exists");
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
        locationRequestAttempted.current = false; // Allow retry
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
        console.error("❌ Geolocation error occurred");
        
        // Log more details about the error
        if (error.code !== undefined) {
          console.error("Error code:", error.code);
          console.error("Error message:", error.message);
        }
        
        setIsRequestingLocation(false);
        locationRequestAttempted.current = false; // Allow retry on error
        
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
  }, [isGeolocationSupported, isRequestingLocation, userLocation]);

  // Fetch nearby clinics when user location is available
  useEffect(() => {
    const fetchNearbyClinics = async () => {
      if (!userLocation) {
        console.log("📍 No user location, skipping API fetch");
        return;
      }

      // Create a location key to check if we've already fetched for this location
      const locationKey = `${userLocation.lat.toFixed(4)},${userLocation.lng.toFixed(4)}`;
      
      // Skip if we've already fetched clinics for this exact location
      if (clinicsFetchedForLocation.current === locationKey) {
        console.log("📍 Already fetched clinics for this location, skipping");
        return;
      }
      
      console.log("📍 Fetching nearby clinics for location:", userLocation);
      setIsLoadingClinics(true);
      setLocationError(null);
      setApiDebugInfo("Fetching clinics...");
      
      try {
        const { lat, lng } = userLocation;
        const radius = 50; // Default radius in km
        
        // Single API endpoint
        const endpoint = `http://localhost:8001/api/v1/auth/clinic/location-based-clinics/?lat=${lat}&lng=${lng}&radius=${radius}`;
        
        console.log("📍 Calling API endpoint:", endpoint);
        
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`API responded with status ${response.status}`);
        }
        
        console.log("📍 API Response status:", response.status);
        
        const result = await response.json();
        console.log("📍 API Response data:", result);
        
        setApiDebugInfo(`API Success: Found ${result.data?.length || 0} clinics`);
        
        if (result.success && result.data) {
          // Transform API data to Facility type
          const transformedClinics = transformClinicsToFacilities(result.data);
          console.log("📍 Transformed clinics:", transformedClinics.length);
          
          console.log("📍 Setting nearby clinics:", transformedClinics.length);
          setNearbyClinics(transformedClinics);
          clinicsFetchedForLocation.current = locationKey; // Mark as fetched
        } else {
          console.log("📍 No clinics found in API response");
          setApiDebugInfo("No clinics found in API response");
          setNearbyClinics([]);
          clinicsFetchedForLocation.current = locationKey; // Still mark as fetched (no clinics found)
        }
      } catch (error) {
        console.error("❌ Error fetching nearby clinics:", error);
        setApiDebugInfo(`API Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setLocationError("Failed to fetch nearby clinics. Please try again later.");
        setNearbyClinics([]);
      } finally {
        setIsLoadingClinics(false);
      }
    };
    
    fetchNearbyClinics();
  }, [userLocation]); // Only depend on userLocation

  // Use nearbyClinics if available, otherwise use static facilities
  const displayFacilities = nearbyClinics.length > 0 ? nearbyClinics : staticFacilities;

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
    locationRequestAttempted.current = false;
    requestUserLocation();
  };

  const handleHowToEnable = () => {
    console.log("📍 How to enable button clicked");
    window.open('https://support.google.com/chrome/answer/142065?hl=en', '_blank');
  };

  // Determine which banner to show
  const showPermissionBanner = !userLocation && !locationError && locationPermission !== 'granted' && !hasRequestedLocation && !isRequestingLocation;
  const showSuccessBanner = userLocation && !locationError && nearbyClinics.length > 0;

  // Show loader only when actively requesting location or fetching clinics
  const showLoader = isRequestingLocation || isLoadingClinics;

  return (
    <>
      <HeroSection />

      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === 'development' && apiDebugInfo && (
        <div className="bg-gray-100 border-b border-gray-200 py-2 px-4 text-xs font-mono">
          <strong>API Debug:</strong> {apiDebugInfo}
        </div>
      )}

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