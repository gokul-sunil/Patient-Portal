"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { facilities as staticFacilities, Facility } from "@/data/facilities";
import { doctors } from "@/data/doctors";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  MapPin,
  Star,
  Clock,
  Phone,
  CheckCircle2,
  Building2,
  Stethoscope,
  Navigation,
} from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

interface PageProps {
  params: Promise<{ id: string }>; // Change this to Promise
}

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
    distanceKm: clinic.distanceKm
  };
};

export default function FacilityDetails({ params }: PageProps) {
  const router = useRouter();
  const [facility, setFacility] = useState<Facility | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [facilityId, setFacilityId] = useState<string | null>(null);

  // Unwrap params first
  useEffect(() => {
    const unwrapParams = async () => {
      try {
        const { id } = await params;
        setFacilityId(id);
      } catch (error) {
        console.error("Error unwrapping params:", error);
        setError("Failed to load facility ID");
        setIsLoading(false);
      }
    };
    
    unwrapParams();
  }, [params]);

  // Fetch facility details when we have the ID
  useEffect(() => {
    if (!facilityId) return;

    const fetchFacilityDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        console.log("Fetching facility with ID:", facilityId);
        
        // First check if it's a static facility (from our mock data)
        const staticFacility = staticFacilities.find((f) => f.id === facilityId);
        
        if (staticFacility) {
          console.log("Found static facility:", staticFacility);
          setFacility(staticFacility);
          setIsLoading(false);
          return;
        }

        // If not static, try to fetch from API
        const response = await fetch(`http://localhost:8001/api/v1/auth/clinic/view-clinic/${facilityId}`);
        
        console.log("API Response status:", response.status);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const result = await response.json();
        console.log("API Response data:", result);
        
        if (result.success && result.data) {
          const transformedFacility = transformClinicToFacility(result.data);
          console.log("Transformed facility:", transformedFacility);
          setFacility(transformedFacility);
        } else {
          throw new Error("Facility not found");
        }
      } catch (error) {
        console.error("Error fetching facility details:", error);
        setError("Failed to load facility details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFacilityDetails();
  }, [facilityId]); // Now depends on facilityId instead of params.id

  // Rest of your component remains exactly the same from here...
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading facility details...</p>
        </div>
      </div>
    );
  }

  if (error || !facility) {
    return (
      <main className="container mx-auto px-4 py-12">
        <div className="text-center py-20 bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl shadow-blue-500/10">
          <div className="text-7xl mb-6">😕</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            {error || "Facility not found"}
          </h3>
          <Button
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/30 rounded-xl"
          >
            Back to Home
          </Button>
        </div>
      </main>
    );
  }

  const facilityDoctors = doctors.filter((doctor) =>
    facility.services.includes(doctor.department)
  );

  const handleBookNow = () => {
    router.push(`/booking/${facility.id}`);
  };

  return (
    <main className="container mx-auto px-4 py-12">
      <Button
        onClick={() => router.push("/")}
        variant="ghost"
        className="mb-6 bg-white/80 backdrop-blur-md border border-white/50 hover:bg-white/90 rounded-xl"
      >
        <ArrowLeft className="mr-2 w-4 h-4" />
        Back to Home
      </Button>

      {/* Hero Section */}
      <div className="relative h-96 rounded-3xl overflow-hidden mb-8 shadow-2xl shadow-blue-500/20">
        <ImageWithFallback
          src={facility.image}
          alt={facility.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

        <div className="absolute bottom-8 left-8 right-8">
          <Badge className="bg-white/95 backdrop-blur-md text-gray-900 border-0 shadow-lg px-4 py-2 rounded-full mb-4">
            {facility.type === "hospital" ? "🏥 Hospital" : "🏪 Clinic"}
          </Badge>
          <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-2xl">
            {facility.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-white/90">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span className="font-medium">{facility.location}</span>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 px-4 py-2 rounded-full shadow-lg shadow-yellow-500/40">
              <Star className="w-5 h-5 fill-white text-white" />
              <span className="font-bold">{facility.rating}</span>
              <span className="text-sm">
                ({facility.reviewCount} reviews)
              </span>
            </div>
            {facility.distanceKm && (
              <div className="flex items-center gap-2 bg-blue-500/80 backdrop-blur-sm px-4 py-2 rounded-full">
                <Navigation className="w-4 h-4" />
                <span className="text-sm font-medium">{facility.distanceKm} km away</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Overview */}
          <Card className="bg-white/80 backdrop-blur-xl border-white/50 shadow-2xl shadow-blue-500/10 rounded-3xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200/50">
                <Building2 className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                  <p className="text-sm text-gray-600">{facility.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200/50">
                <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Operating Hours
                  </h3>
                  <p className="text-sm text-gray-600">
                    {facility.openHours}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200/50">
                <Phone className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Contact
                  </h3>
                  <p className="text-sm text-gray-600">{facility.phone}</p>
                </div>
              </div>

              {facility.acceptingPatients && (
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl border border-green-200/50">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <p className="font-medium text-green-800">
                    Currently accepting new patients
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Services */}
          <Card className="bg-white/80 backdrop-blur-xl border-white/50 shadow-2xl shadow-purple-500/10 rounded-3xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Available Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-3">
                {facility.services.map((service: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200/50"
                  >
                    <Stethoscope className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-800">
                      {service}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="bg-white/80 backdrop-blur-xl border-white/50 shadow-2xl shadow-purple-500/10 rounded-3xl sticky top-24">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">
                Book an Appointment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleBookNow}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl shadow-blue-500/40 rounded-xl py-6 text-lg font-semibold"
              >
                Book Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}