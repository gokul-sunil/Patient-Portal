"use client";

import { MapPin, Star, Clock, Phone, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export interface Facility {
  id: string;
  name: string;
  type: "hospital" | "clinic";
  location: string;
  address: string;
  rating: number;
  reviewCount: number;
  openHours: string;
  phone: string;
  image: string;
  services: string[];
  acceptingPatients: boolean;
}

interface FacilityCardProps {
  facility: Facility;
}

export function FacilityCard({ facility }: FacilityCardProps) {
const router = useRouter();


  const handleBookNow = () => {
    router.push(`/facility/${facility.id}`);

  };

  const handleViewDetails = () => {
    // Navigate to facility details or show modal
    router.push(`/facility/${facility.id}`);
  };

  return (
    <Card className="group overflow-hidden hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 border-white/50 bg-white/80 backdrop-blur-xl rounded-3xl hover:-translate-y-2">
      <div className="relative h-56 overflow-hidden">
        <ImageWithFallback
          src={facility.image}
          alt={facility.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        <Badge className="absolute top-4 right-4 bg-white/95 backdrop-blur-md text-gray-900 border-0 shadow-lg px-4 py-1.5 rounded-full">
          {facility.type === "hospital" ? "🏥 Hospital" : "🏪 Clinic"}
        </Badge>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white mb-1 drop-shadow-lg">
            {facility.name}
          </h3>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="font-medium">{facility.location}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-400 to-orange-400 px-3 py-1.5 rounded-full shadow-lg shadow-yellow-500/30">
            <Star className="w-4 h-4 fill-white text-white" />
            <span className="font-bold text-sm text-white">{facility.rating}</span>
            <span className="text-xs text-white/90">({facility.reviewCount})</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-1">{facility.address}</p>

        <div className="flex flex-wrap gap-2 mb-5">
          {facility.services.slice(0, 3).map((service, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="text-xs bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200/50 rounded-full px-3 py-1"
            >
              {service}
            </Badge>
          ))}
        </div>

        <div className="space-y-2.5 mb-5 text-sm">
          <div className="flex items-center gap-2.5 text-gray-700 bg-gray-50/80 rounded-xl px-3 py-2">
            <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span className="text-xs">{facility.openHours}</span>
          </div>
          <div className="flex items-center gap-2.5 text-gray-700 bg-gray-50/80 rounded-xl px-3 py-2">
            <Phone className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span className="text-xs font-medium">{facility.phone}</span>
          </div>
          {facility.acceptingPatients && (
            <div className="flex items-center gap-2.5 text-green-700 bg-green-50 rounded-xl px-3 py-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span className="text-xs font-medium">Accepting new patients</span>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button 
            onClick={handleBookNow}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/30 rounded-xl"
          >
            Book Now
          </Button>
          <Button 
            onClick={handleViewDetails}
            variant="outline" 
            className="flex-1 border-blue-200 hover:bg-blue-50 rounded-xl"
          >
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}