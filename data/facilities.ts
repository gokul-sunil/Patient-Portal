// types/facility.ts (create this file for shared types)
export interface Facility {
  id: string;
  _id?: string; // For API data
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
  distanceKm?: number; // Optional distance from user
}

// Default images for fallback
const DEFAULT_IMAGES = {
  hospital: "https://images.unsplash.com/photo-1769147555720-71fc71bfc216?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3NwaXRhbCUyMGJ1aWxkaW5nJTIwZXh0ZXJpb3J8ZW58MXx8fHwxNzcxNTUyNzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  clinic: "https://images.unsplash.com/photo-1762625570087-6d98fca29531?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkZW50YWwlMjBjbGluaWMlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NzE1MTkxMDJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
};

// Helper function to transform API clinic to Facility type
export const transformClinicToFacility = (clinic: any, index?: number): Facility => {
  // Extract location from address
  const location = clinic.address?.city || 
                   clinic.address?.state || 
                   clinic.address?.formattedAddress?.split(',').map((s: string) => s.trim())[1] || 
                   "Unknown Location";
  
  // Generate a consistent ID
  const id = clinic._id || `clinic-${Date.now()}-${index || Math.random()}`;
  
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
    openHours: clinic.openHours || "Mon - Fri: 9:00 AM - 6:00 PM", // Default if not provided
    phone: clinic.phoneNumber?.toString() || "Contact for details",
    image: clinic.image || (clinic.type === "hospital" ? DEFAULT_IMAGES.hospital : DEFAULT_IMAGES.clinic),
    services: clinic.services || ["General Dentistry", "Consultation", "Dental Checkup"],
    acceptingPatients: clinic.acceptingPatients !== undefined ? clinic.acceptingPatients : true,
    distanceKm: clinic.distanceKm
  };
};

// Batch transform multiple clinics
export const transformClinicsToFacilities = (clinics: any[]): Facility[] => {
  return clinics.map((clinic, index) => transformClinicToFacility(clinic, index));
};

// Static mock data (keeping for fallback/development)
export const mockFacilities: Facility[] = [
  {
    id: "1",
    name: "Bright Smile Dental Hospital",
    type: "hospital",
    location: "Downtown",
    address: "123 Medical Center Blvd, Downtown",
    rating: 4.8,
    reviewCount: 342,
    openHours: "Mon-Fri: 8AM-8PM, Sat: 9AM-5PM",
    phone: "(555) 123-4567",
    image: DEFAULT_IMAGES.hospital,
    services: ["General Dentistry", "Orthodontics", "Oral Surgery", "Emergency Care"],
    acceptingPatients: true,
  },
  {
    id: "2",
    name: "City Dental Care Clinic",
    type: "clinic",
    location: "West Side",
    address: "456 Oak Street, West Side",
    rating: 4.6,
    reviewCount: 198,
    openHours: "Mon-Sat: 9AM-6PM",
    phone: "(555) 234-5678",
    image: DEFAULT_IMAGES.clinic,
    services: ["Teeth Whitening", "Cleanings", "Fillings", "Checkups"],
    acceptingPatients: true,
  },
  {
    id: "3",
    name: "Premier Dental Hospital",
    type: "hospital",
    location: "East Side",
    address: "789 Healthcare Ave, East Side",
    rating: 4.9,
    reviewCount: 521,
    openHours: "24/7 Emergency Services",
    phone: "(555) 345-6789",
    image: DEFAULT_IMAGES.hospital,
    services: ["Cosmetic Dentistry", "Implants", "Root Canal", "Pediatric Dentistry"],
    acceptingPatients: true,
  },
  {
    id: "4",
    name: "Family Dental Clinic",
    type: "clinic",
    location: "North Side",
    address: "321 Elm Road, North Side",
    rating: 4.5,
    reviewCount: 167,
    openHours: "Mon-Fri: 8AM-5PM",
    phone: "(555) 456-7890",
    image: DEFAULT_IMAGES.clinic,
    services: ["Family Dentistry", "Preventive Care", "Fluoride Treatment"],
    acceptingPatients: false,
  },
  {
    id: "5",
    name: "Advanced Dental Solutions",
    type: "clinic",
    location: "Downtown",
    address: "654 Main Street, Downtown",
    rating: 4.7,
    reviewCount: 289,
    openHours: "Mon-Sat: 9AM-7PM",
    phone: "(555) 567-8901",
    image: DEFAULT_IMAGES.clinic,
    services: ["Invisalign", "Veneers", "Teeth Whitening", "Dental Crowns"],
    acceptingPatients: true,
  },
  {
    id: "6",
    name: "Sunset Dental Hospital",
    type: "hospital",
    location: "Suburbs",
    address: "987 Park Lane, Suburbs",
    rating: 4.8,
    reviewCount: 412,
    openHours: "Mon-Sun: 7AM-9PM",
    phone: "(555) 678-9012",
    image: DEFAULT_IMAGES.hospital,
    services: ["Periodontics", "Endodontics", "Prosthodontics", "Oral Pathology"],
    acceptingPatients: true,
  },
  {
    id: "7",
    name: "SmileCare Dental Clinic",
    type: "clinic",
    location: "West Side",
    address: "147 Maple Avenue, West Side",
    rating: 4.4,
    reviewCount: 134,
    openHours: "Tue-Sat: 10AM-6PM",
    phone: "(555) 789-0123",
    image: DEFAULT_IMAGES.clinic,
    services: ["General Dentistry", "Cosmetic Procedures", "Dental Hygiene"],
    acceptingPatients: true,
  },
  {
    id: "8",
    name: "Metro Dental Hospital",
    type: "hospital",
    location: "East Side",
    address: "258 Health Plaza, East Side",
    rating: 4.9,
    reviewCount: 598,
    openHours: "Mon-Sun: 6AM-10PM",
    phone: "(555) 890-1234",
    image: DEFAULT_IMAGES.hospital,
    services: ["Maxillofacial Surgery", "Dental Implants", "Trauma Care", "Reconstructive Surgery"],
    acceptingPatients: true,
  },
];

// Export both mock facilities and the transformer
export const facilities = mockFacilities; // For backward compatibility