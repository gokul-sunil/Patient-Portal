"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle2,
  Cake,
  Users,
  Stethoscope,
  Calendar,
  Clock,
  Star,
  PartyPopper,
  CalendarCheck,
  MapPin,
  Building2,
  Loader2,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { toast } from "sonner";
import axios from "axios";

// API Base URLs
const PATIENT_SERVICE_URL = process.env.NEXT_PUBLIC_PATIENT_SERVICE_URL || "http://localhost:8002";
const CLINIC_SERVICE_URL = process.env.NEXT_PUBLIC_CLINIC_SERVICE_URL || "http://localhost:8003";
const AUTH_SERVICE_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || "http://localhost:8001";

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  experience?: string;
  rating?: number;
  image?: string | null;
  availability?: {
    days: string[];
    timeSlots: string[];
  };
}

interface Facility {
  _id: string;
  name: string;
  address: string | {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zip?: string;
    formattedAddress?: string;
  };
  phone: string;
  email: string;
  image?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  services?: string[];
  openHours?: string;
  type?: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: string;
  gender: string;
  department: string;
  doctor: string;
  appointmentDate: string;
  appointmentTime: string;
  message: string;
}

export default function BookingPage() {
  const router = useRouter();
  const params = useParams();
  const facilityId = params?.facilityId as string;

  const [facility, setFacility] = useState<Facility | null>(null);
  const [loadingFacility, setLoadingFacility] = useState(true);
  const [departments, setDepartments] = useState<string[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    department: "",
    doctor: "",
    appointmentDate: "",
    appointmentTime: "",
    message: "",
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bookingResponse, setBookingResponse] = useState<any>(null);

  // Helper function to format address
  const formatAddress = (address: any): string => {
    if (!address) return "Address not available";
    if (typeof address === "string") return address;
    if (typeof address === "object") {
      if (address.formattedAddress) return address.formattedAddress;
      const parts = [];
      if (address.street) parts.push(address.street);
      if (address.city) parts.push(address.city);
      if (address.state) parts.push(address.state);
      if (address.country) parts.push(address.country);
      if (address.zip) parts.push(address.zip);
      return parts.length > 0 ? parts.join(", ") : "Address not available";
    }
    return "Address not available";
  };

  // Fetch facility details
  useEffect(() => {
    const fetchFacility = async () => {
      try {
        setLoadingFacility(true);
        const response = await axios.get(
          `${AUTH_SERVICE_URL}/api/v1/auth/clinic/view-clinic/${facilityId}`
        );
        
        const clinicData = response.data?.data || response.data;
        const address = clinicData.address || "Address not available";
        
        setFacility({
          _id: clinicData._id || facilityId,
          name: clinicData.name || "Dental Clinic",
          address: address,
          phone: clinicData.phone || clinicData.phoneNumber || "Phone not available",
          email: clinicData.email || "",
          image: clinicData.image || null,
          city: clinicData.city || (typeof address === "object" ? address.city : null) || null,
          state: clinicData.state || (typeof address === "object" ? address.state : null) || null,
          pincode: clinicData.pincode || (typeof address === "object" ? address.zip : null) || null,
          services: clinicData.services || [],
          openHours: clinicData.openHours || "Mon-Fri: 9:00 AM - 6:00 PM",
          type: clinicData.type || "clinic",
        });
      } catch (error) {
        console.error("Error fetching facility:", error);
        setFacility({
          _id: facilityId,
          name: "Dental Clinic",
          address: "Address not available",
          phone: "Phone not available",
          email: "",
          image: null,
          city: null,
          state: null,
          pincode: null,
        });
        toast.error("Could not load facility details");
      } finally {
        setLoadingFacility(false);
      }
    };

    if (facilityId) {
      fetchFacility();
    }
  }, [facilityId]);

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          `${CLINIC_SERVICE_URL}/api/v1/clinic-service/department/details/${facilityId}`
        );
        const departmentsData = response.data?.departments || [];
        setDepartments(departmentsData);
      } catch (error) {
        console.error("Error fetching departments:", error);
        setDepartments([]);
      }
    };

    if (facilityId) {
      fetchDepartments();
    }
  }, [facilityId]);

  // Fetch doctors when department changes (for UI only)
  useEffect(() => {
    const fetchDoctors = async () => {
      if (!formData.department) {
        setDoctors([]);
        return;
      }

      try {
        const response = await axios.get(
          `${CLINIC_SERVICE_URL}/api/v1/clinic-service/department-based/availability`,
          {
            params: { clinicId: facilityId, department: formData.department },
          }
        );

        const doctorsData = response.data?.doctors || [];
        
        const filteredDoctors = doctorsData
          .filter((doc: any) => {
            const specializations = doc.specialization || [];
            return specializations.some(
              (spec: string) => spec.toLowerCase() === formData.department.toLowerCase()
            );
          })
          .map((doc: any) => ({
            _id: doc.doctorId,
            name: doc.doctor?.name || "Unnamed Doctor",
            specialization: Array.isArray(doc.specialization)
              ? doc.specialization.join(", ")
              : doc.specialization || formData.department,
            experience: doc.experience || "5+ years",
            rating: doc.rating || 4.5,
            image: doc.doctor?.image || null,
            availability: {
              days: doc.availability?.filter((a: any) => a.isActive)?.map((a: any) => a.dayOfWeek) || [],
              timeSlots: doc.availability?.filter((a: any) => a.isActive)?.map((a: any) => `${a.startTime} - ${a.endTime}`) || [],
            },
          }));

        setDoctors(filteredDoctors);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setDoctors([]);
      }
    };

    fetchDoctors();
  }, [formData.department, facilityId]);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: value,
      ...(field === "department" ? { doctor: "" } : {})
    }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Validate form
  if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || 
      !formData.age || !formData.gender || !formData.department || !formData.doctor || 
      !formData.appointmentDate || !formData.appointmentTime) {
    toast.error("Please fill in all required fields");
    return;
  }

  try {
    setLoading(true);

    // Register patient first - with userRole
    const registerPayload = {
      userRole: "patient",
      userId: facilityId,
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      phone: formData.phone,
      email: formData.email,
      age: Number(formData.age),
      gender: formData.gender,
    };

    console.log("Registering patient with payload:", registerPayload);

    let patientId;
    
    try {
      const registerResponse = await axios.post(
        `${PATIENT_SERVICE_URL}/api/v1/patient-service/patient/register/${facilityId}`,
        registerPayload,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      console.log("Registration response:", registerResponse.data);

      // Get patient ID from response
      patientId = registerResponse.data?.data?._id || 
                  registerResponse.data?.patient?._id || 
                  registerResponse.data?._id;

    } catch (registerError: any) {
      // Check if it's a duplicate key error (patient already exists)
      if (registerError.response?.data?.error?.includes("duplicate key error") && 
          registerError.response?.data?.error?.includes("email")) {
        
        console.log("Patient already exists, trying to fetch existing patient...");
        
        // Try to fetch the existing patient by email
        try {
          const searchResponse = await axios.get(
            `${PATIENT_SERVICE_URL}/api/v1/patient-service/patient/search`,
            {
              params: {
                clinicId: facilityId,
                email: formData.email
              }
            }
          );
          
          // Assuming the search returns patient data
          const existingPatient = searchResponse.data?.patients?.[0] || searchResponse.data?.patient;
          
          if (existingPatient?._id) {
            patientId = existingPatient._id;
            console.log("Found existing patient with ID:", patientId);
            toast.info("Using existing patient record");
          } else {
            throw new Error("Could not find existing patient record");
          }
        } catch (searchError) {
          console.error("Error searching for existing patient:", searchError);
          toast.error("Patient already exists but could not retrieve record");
          setLoading(false);
          return;
        }
      } else {
        // Re-throw if it's a different error
        throw registerError;
      }
    }

    if (!patientId) {
      throw new Error("Failed to get patient ID");
    }

    // Book appointment
    const bookingPayload = {
      patientId: patientId,
      userRole: "patient",
      department: formData.department,
      appointmentDate: formData.appointmentDate,
      appointmentTime: formData.appointmentTime,
      doctorId: formData.doctor,
    };

    console.log("Booking appointment with payload:", bookingPayload);

    const response = await axios.post(
      `${PATIENT_SERVICE_URL}/api/v1/patient-service/appointment/public/book/${facilityId}`,
      bookingPayload,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    console.log("Booking response:", response.data);

    setBookingResponse(response.data);
    setShowConfirmModal(true);
    
    toast.success(response.data.message || "Appointment request submitted!");

  } catch (error: any) {
    console.error("Error booking appointment:", error);
    
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      
      const errorMessage = error.response.data?.message || 
                          error.response.data?.error || 
                          `Server error: ${error.response.status}`;
      toast.error(errorMessage);
    } else if (error.request) {
      console.error("Error request:", error.request);
      toast.error("No response from server. Please check your connection.");
    } else {
      console.error("Error message:", error.message);
      toast.error(error.message || "Failed to book appointment");
    }
  } finally {
    setLoading(false);
  }
};
  const handleConfirmClose = () => {
    setShowConfirmModal(false);
    setTimeout(() => {
      router.push("/");
    }, 500);
  };

  // Get selected doctor details with safe defaults
  const selectedDoctor = doctors.find(doc => doc._id === formData.doctor);

  // Default placeholder component for images
  const DoctorPlaceholder = ({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) => {
    const sizeClasses = {
      sm: "w-8 h-8 text-xs",
      md: "w-10 h-10 text-sm",
      lg: "w-16 h-16 text-lg"
    };
    
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center border border-gray-200`}>
        <span className="font-semibold text-blue-600">
          {name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
        </span>
      </div>
    );
  };

  const FacilityPlaceholder = () => (
    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
      <Building2 className="w-16 h-16 text-blue-400" />
    </div>
  );

  // Show loading state
  if (loadingFacility) {
    return (
      <main className="container mx-auto px-4 py-12">
        <div className="text-center py-20 bg-white/70 backdrop-blur-xl rounded-3xl">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Loading Facility Details...
          </h3>
          <p className="text-gray-600">Please wait while we fetch the clinic information.</p>
        </div>
      </main>
    );
  }

  if (!facility) {
    return (
      <main className="container mx-auto px-4 py-12">
        <div className="text-center py-20 bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl shadow-blue-500/10">
          <div className="text-7xl mb-6">🏥</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Facility not found
          </h3>
          <Button
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl"
          >
            Back to Home
          </Button>
        </div>
      </main>
    );
  }

  if (showConfirmModal) {
    return (
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="max-w-lg bg-white/95 backdrop-blur-2xl border-2 border-white/60 shadow-2xl rounded-3xl p-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-blue-50/50 pointer-events-none"></div>
          
          <div className="relative p-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 via-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/50 animate-in zoom-in duration-500">
                  <CheckCircle2 className="w-14 h-14 text-white animate-in zoom-in duration-700 delay-200" />
                </div>
                <div className="absolute -top-2 -right-2 animate-in zoom-in duration-500 delay-300">
                  <PartyPopper className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
            </div>

            <DialogHeader className="space-y-3 text-center mb-6">
              <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Booking {bookingResponse?.data?.status === "pending_approval" ? "Request Submitted!" : "Confirmed!"}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Your appointment has been successfully scheduled.
              </DialogDescription>
              <p className="text-gray-600 text-base">
                {bookingResponse?.data?.status === "pending_approval" 
                  ? "Your appointment request has been submitted and is waiting for approval."
                  : "Your appointment has been successfully scheduled."}
              </p>
              <p className="text-sm text-gray-500">
                We've sent a confirmation email to{" "}
                <span className="font-semibold text-gray-700">{formData.email}</span>
              </p>
            </DialogHeader>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200/50 rounded-2xl p-6 mb-6 space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <CalendarCheck className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-gray-900">Appointment Details</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/80">
                  <p className="text-xs text-gray-500 mb-1">Facility</p>
                  <p className="font-semibold text-gray-900">{facility.name}</p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/80">
                  <p className="text-xs text-gray-500 mb-1">Service</p>
                  <p className="font-semibold text-gray-900">{formData.department}</p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/80">
                  <p className="text-xs text-gray-500 mb-1">Doctor</p>
                  <p className="font-semibold text-gray-900">{selectedDoctor?.name || "Selected Doctor"}</p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/80">
                  <p className="text-xs text-gray-500 mb-1">Date</p>
                  <p className="font-semibold text-gray-900">{new Date(formData.appointmentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/80">
                <p className="text-xs text-gray-500 mb-1">Time</p>
                <p className="font-semibold text-gray-900">{formData.appointmentTime}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleConfirmClose}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl shadow-blue-500/40 rounded-xl h-12 font-semibold"
              >
                Back to Home
              </Button>
              <Button
                variant="outline"
                onClick={() => window.print()}
                className="flex-1 border-2 border-gray-300 hover:bg-gray-50 rounded-xl h-12 font-semibold"
              >
                Print Details
              </Button>
            </div>

            <p className="text-xs text-center text-gray-500 mt-4">
              📞 For any changes, please contact us at {facility.phone}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

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

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Facility Info Card */}
        <Card className="lg:col-span-1 h-fit bg-white/80 backdrop-blur-xl border-white/50 shadow-2xl shadow-blue-500/10 rounded-3xl overflow-hidden sticky top-24">
          <div className="relative h-48 overflow-hidden">
            {facility.image ? (
              <img
                src={facility.image}
                alt={facility.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    const fallback = parent.querySelector('.fallback');
                    if (fallback) {
                      fallback.classList.remove('hidden');
                    }
                  }
                }}
              />
            ) : null}
            <div className={`w-full h-full ${facility.image ? 'hidden' : ''} fallback`}>
              <FacilityPlaceholder />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-xl font-bold text-white mb-1 drop-shadow-lg">
                {facility.name}
              </h3>
              <p className="text-sm text-white/90 drop-shadow-md">
                {facility.type === "hospital" ? "🏥 Hospital" : "🏪 Clinic"}
              </p>
            </div>
          </div>
          <CardContent className="p-6 space-y-4">
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Location</p>
              <p className="text-sm text-gray-600 flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                {formatAddress(facility.address)}
                {facility.city && !facility.address && `, ${facility.city}`}
                {facility.state && !facility.address && `, ${facility.state}`}
                {facility.pincode && !facility.address && ` - ${facility.pincode}`}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Hours</p>
              <p className="text-sm text-gray-600">{facility.openHours || "Mon-Fri: 9:00 AM - 6:00 PM"}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Phone</p>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-600" />
                {facility.phone}
              </p>
            </div>
            {facility.services && facility.services.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Available Services</p>
                <div className="flex flex-wrap gap-2">
                  {facility.services.map((service, index) => (
                    <span 
                      key={index}
                      className="text-xs bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200/50 rounded-full px-3 py-1"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Booking Form */}
        <Card className="lg:col-span-2 bg-white/80 backdrop-blur-xl border-white/50 shadow-2xl shadow-purple-500/10 rounded-3xl">
          <CardHeader className="pb-6">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Book Your Appointment
            </CardTitle>
            <p className="text-gray-600 text-sm mt-2">
              Fill out the form below and we'll confirm your appointment within 24 hours.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="flex items-center gap-2 text-gray-700 font-semibold">
                    <User className="w-4 h-4 text-blue-600" />
                    First Name *
                  </Label>
                  <Input
                    id="firstName"
                    required
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    className="bg-white/90 backdrop-blur-md border-white/50 rounded-xl h-12 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="flex items-center gap-2 text-gray-700 font-semibold">
                    <User className="w-4 h-4 text-blue-600" />
                    Last Name *
                  </Label>
                  <Input
                    id="lastName"
                    required
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    className="bg-white/90 backdrop-blur-md border-white/50 rounded-xl h-12 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Contact Fields */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2 text-gray-700 font-semibold">
                    <Mail className="w-4 h-4 text-blue-600" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="john.doe@example.com"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="bg-white/90 backdrop-blur-md border-white/50 rounded-xl h-12 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2 text-gray-700 font-semibold">
                    <Phone className="w-4 h-4 text-blue-600" />
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="bg-white/90 backdrop-blur-md border-white/50 rounded-xl h-12 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age" className="flex items-center gap-2 text-gray-700 font-semibold">
                    <Cake className="w-4 h-4 text-blue-600" />
                    Age *
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    required
                    placeholder="25"
                    value={formData.age}
                    onChange={(e) => handleChange("age", e.target.value)}
                    className="bg-white/90 backdrop-blur-md border-white/50 rounded-xl h-12 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender" className="flex items-center gap-2 text-gray-700 font-semibold">
                    <Users className="w-4 h-4 text-blue-600" />
                    Gender *
                  </Label>
                  <Select value={formData.gender} onValueChange={(value) => handleChange("gender", value)} required>
                    <SelectTrigger className="bg-white/90 backdrop-blur-md border-white/50 rounded-xl h-12 focus:ring-2 focus:ring-blue-500">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 backdrop-blur-xl border-white/50 rounded-xl">
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Department Selection */}
              <div className="space-y-2">
                <Label htmlFor="department" className="flex items-center gap-2 text-gray-700 font-semibold">
                  <Stethoscope className="w-4 h-4 text-blue-600" />
                  Department *
                </Label>
                <Select 
                  value={formData.department} 
                  onValueChange={(value) => handleChange("department", value)} 
                  required
                >
                  <SelectTrigger className="bg-white/90 backdrop-blur-md border-white/50 rounded-xl h-12 focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-xl border-white/50 rounded-xl">
                    {departments.length > 0 ? (
                      departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="General Medicine">General Medicine</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Doctor Selection */}
              {formData.department && (
                <div className="space-y-2">
                  <Label htmlFor="doctor" className="flex items-center gap-2 text-gray-700 font-semibold">
                    <Stethoscope className="w-4 h-4 text-blue-600" />
                    Select Doctor *
                  </Label>
                  <Select 
                    value={formData.doctor} 
                    onValueChange={(value) => handleChange("doctor", value)} 
                    required
                    disabled={doctors.length === 0}
                  >
                    <SelectTrigger className="bg-white/90 backdrop-blur-md border-white/50 rounded-xl h-12 focus:ring-2 focus:ring-blue-500">
                      <SelectValue placeholder={doctors.length === 0 ? "No doctors available" : "Choose your doctor"} />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 backdrop-blur-xl border-white/50 rounded-xl max-h-[400px]">
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor._id} value={doctor._id}>
                          <div className="flex items-center gap-3 py-1">
                            {doctor.image ? (
                              <img
                                src={doctor.image}
                                alt={doctor.name}
                                className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  const parent = e.currentTarget.parentElement;
                                  if (parent) {
                                    const fallback = parent.querySelector('.doctor-fallback');
                                    if (fallback) {
                                      fallback.classList.remove('hidden');
                                    }
                                  }
                                }}
                              />
                            ) : null}
                            <div className={`w-10 h-10 ${doctor.image ? 'hidden' : ''} doctor-fallback`}>
                              <DoctorPlaceholder name={doctor.name} size="md" />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-sm text-gray-900">{doctor.name}</p>
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <span className="flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  {doctor.rating || 4.5}
                                </span>
                                <span>•</span>
                                <span>{doctor.experience || "5+ years"}</span>
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Doctor Availability Info */}
              {selectedDoctor && (
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200/50 rounded-2xl p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                      {selectedDoctor.image ? (
                        <img
                          src={selectedDoctor.image}
                          alt={selectedDoctor.name}
                          className="w-full h-full object-cover border-2 border-white shadow-md"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              const fallback = parent.querySelector('.doctor-detail-fallback');
                              if (fallback) {
                                fallback.classList.remove('hidden');
                              }
                            }
                          }}
                        />
                      ) : null}
                      <div className={`w-full h-full ${selectedDoctor.image ? 'hidden' : ''} doctor-detail-fallback`}>
                        <DoctorPlaceholder name={selectedDoctor.name} size="lg" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-1">{selectedDoctor.name}</h4>
                      <p className="text-sm text-gray-600 mb-3">{selectedDoctor.specialization}</p>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-blue-600" />
                            Available Days:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {selectedDoctor.availability?.days && selectedDoctor.availability.days.length > 0 ? (
                              selectedDoctor.availability.days.map((day) => (
                                <span
                                  key={day}
                                  className="text-[10px] px-2 py-1 bg-blue-100 text-blue-700 rounded-full border border-blue-200"
                                >
                                  {day.slice(0, 3)}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-gray-500">Mon-Fri</span>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-blue-600" />
                            Available Time Slots:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {selectedDoctor.availability?.timeSlots && selectedDoctor.availability.timeSlots.length > 0 ? (
                              <>
                                {selectedDoctor.availability.timeSlots.slice(0, 4).map((slot) => (
                                  <span
                                    key={slot}
                                    className="text-[10px] px-2 py-1 bg-green-100 text-green-700 rounded-full border border-green-200"
                                  >
                                    {slot}
                                  </span>
                                ))}
                                {selectedDoctor.availability.timeSlots.length > 4 && (
                                  <span className="text-[10px] px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                                    +{selectedDoctor.availability.timeSlots.length - 4} more
                                  </span>
                                )}
                              </>
                            ) : (
                              <span className="text-xs text-gray-500">9:00 AM - 5:00 PM</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {formData.department && doctors.length === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-center">
                  <p className="text-sm text-yellow-800 font-medium">
                    No doctors available for this department at the moment.
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Please select a different department or contact us directly.
                  </p>
                </div>
              )}

              {/* Appointment Date */}
              <div className="space-y-2">
                <Label htmlFor="appointmentDate" className="flex items-center gap-2 text-gray-700 font-semibold">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  Appointment Date *
                </Label>
                <Input
                  id="appointmentDate"
                  type="date"
                  required
                  value={formData.appointmentDate}
                  onChange={(e) => handleChange("appointmentDate", e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="bg-white/90 backdrop-blur-md border-white/50 rounded-xl h-12 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Appointment Time */}
              <div className="space-y-2">
                <Label htmlFor="appointmentTime" className="flex items-center gap-2 text-gray-700 font-semibold">
                  <Clock className="w-4 h-4 text-blue-600" />
                  Appointment Time *
                </Label>
                <Input
                  id="appointmentTime"
                  type="time"
                  required
                  value={formData.appointmentTime}
                  onChange={(e) => handleChange("appointmentTime", e.target.value)}
                  className="bg-white/90 backdrop-blur-md border-white/50 rounded-xl h-12 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message" className="flex items-center gap-2 text-gray-700 font-semibold">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  Additional Notes (Optional)
                </Label>
                <Textarea
                  id="message"
                  placeholder="Please share any specific concerns or requirements..."
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  className="bg-white/90 backdrop-blur-md border-white/50 rounded-xl min-h-32 focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl shadow-blue-500/40 rounded-xl py-6 text-lg font-semibold disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Booking...
                    </>
                  ) : (
                    "Confirm Booking"
                  )}
                </Button>
                <p className="text-xs text-gray-500 text-center mt-3">
                  By booking, you agree to our terms and conditions
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}