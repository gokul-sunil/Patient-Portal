export interface Doctor {
  id: string;
  name: string;
  department: string;
  experience: string;
  rating: number;
  availability: {
    days: string[];
    timeSlots: string[];
  };
  image: string;
}

export const doctors: Doctor[] = [
  // General Dentistry
  {
    id: "d1",
    name: "Dr. Sarah Mitchell",
    department: "General Dentistry",
    experience: "12 years",
    rating: 4.9,
    availability: {
      days: ["Monday", "Tuesday", "Wednesday", "Friday"],
      timeSlots: ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"]
    },
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400"
  },
  {
    id: "d2",
    name: "Dr. James Peterson",
    department: "General Dentistry",
    experience: "8 years",
    rating: 4.7,
    availability: {
      days: ["Monday", "Wednesday", "Thursday", "Saturday"],
      timeSlots: ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"]
    },
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400"
  },
  
  // Orthodontics
  {
    id: "d3",
    name: "Dr. Emily Chen",
    department: "Orthodontics",
    experience: "15 years",
    rating: 4.9,
    availability: {
      days: ["Tuesday", "Wednesday", "Thursday", "Friday"],
      timeSlots: ["10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"]
    },
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400"
  },
  {
    id: "d4",
    name: "Dr. Michael Brown",
    department: "Orthodontics",
    experience: "10 years",
    rating: 4.8,
    availability: {
      days: ["Monday", "Tuesday", "Friday", "Saturday"],
      timeSlots: ["9:00 AM", "10:00 AM", "1:00 PM", "2:00 PM", "4:00 PM"]
    },
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400"
  },
  
  // Oral Surgery
  {
    id: "d5",
    name: "Dr. Robert Thompson",
    department: "Oral Surgery",
    experience: "18 years",
    rating: 5.0,
    availability: {
      days: ["Monday", "Wednesday", "Thursday"],
      timeSlots: ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM"]
    },
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400"
  },
  
  // Emergency Care
  {
    id: "d6",
    name: "Dr. Lisa Martinez",
    department: "Emergency Care",
    experience: "9 years",
    rating: 4.8,
    availability: {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      timeSlots: ["8:00 AM", "12:00 PM", "4:00 PM", "8:00 PM"]
    },
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400"
  },
  
  // Teeth Whitening & Cosmetic
  {
    id: "d7",
    name: "Dr. Amanda Foster",
    department: "Teeth Whitening",
    experience: "7 years",
    rating: 4.6,
    availability: {
      days: ["Tuesday", "Wednesday", "Thursday", "Saturday"],
      timeSlots: ["10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM"]
    },
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400"
  },
  {
    id: "d8",
    name: "Dr. David Kim",
    department: "Cosmetic Dentistry",
    experience: "14 years",
    rating: 4.9,
    availability: {
      days: ["Monday", "Wednesday", "Friday"],
      timeSlots: ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM"]
    },
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400"
  },
  
  // Cleanings
  {
    id: "d9",
    name: "Dr. Rachel Green",
    department: "Cleanings",
    experience: "6 years",
    rating: 4.7,
    availability: {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      timeSlots: ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"]
    },
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400"
  },
  
  // Fillings & Checkups
  {
    id: "d10",
    name: "Dr. William Harris",
    department: "Fillings",
    experience: "11 years",
    rating: 4.8,
    availability: {
      days: ["Monday", "Tuesday", "Thursday", "Friday"],
      timeSlots: ["9:00 AM", "10:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"]
    },
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400"
  },
  {
    id: "d11",
    name: "Dr. Jennifer White",
    department: "Checkups",
    experience: "9 years",
    rating: 4.7,
    availability: {
      days: ["Monday", "Wednesday", "Thursday", "Friday", "Saturday"],
      timeSlots: ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM"]
    },
    image: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400"
  },
  
  // Implants
  {
    id: "d12",
    name: "Dr. Christopher Lee",
    department: "Implants",
    experience: "16 years",
    rating: 4.9,
    availability: {
      days: ["Tuesday", "Wednesday", "Thursday"],
      timeSlots: ["9:00 AM", "10:00 AM", "2:00 PM", "3:00 PM"]
    },
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400"
  },
  {
    id: "d13",
    name: "Dr. Patricia Adams",
    department: "Dental Implants",
    experience: "13 years",
    rating: 4.8,
    availability: {
      days: ["Monday", "Wednesday", "Friday"],
      timeSlots: ["10:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"]
    },
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400"
  },
  
  // Root Canal
  {
    id: "d14",
    name: "Dr. Thomas Wilson",
    department: "Root Canal",
    experience: "17 years",
    rating: 4.9,
    availability: {
      days: ["Monday", "Tuesday", "Thursday"],
      timeSlots: ["9:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"]
    },
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400"
  },
  
  // Pediatric Dentistry
  {
    id: "d15",
    name: "Dr. Maria Rodriguez",
    department: "Pediatric Dentistry",
    experience: "11 years",
    rating: 5.0,
    availability: {
      days: ["Monday", "Tuesday", "Wednesday", "Friday", "Saturday"],
      timeSlots: ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"]
    },
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400"
  },
  
  // Family Dentistry
  {
    id: "d16",
    name: "Dr. Kevin Anderson",
    department: "Family Dentistry",
    experience: "14 years",
    rating: 4.8,
    availability: {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      timeSlots: ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"]
    },
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
  },
  
  // Preventive Care & Fluoride Treatment
  {
    id: "d17",
    name: "Dr. Nicole Taylor",
    department: "Preventive Care",
    experience: "8 years",
    rating: 4.7,
    availability: {
      days: ["Monday", "Wednesday", "Thursday", "Friday"],
      timeSlots: ["9:00 AM", "10:00 AM", "1:00 PM", "2:00 PM", "3:00 PM"]
    },
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400"
  },
  {
    id: "d18",
    name: "Dr. Daniel Moore",
    department: "Fluoride Treatment",
    experience: "7 years",
    rating: 4.6,
    availability: {
      days: ["Tuesday", "Thursday", "Friday", "Saturday"],
      timeSlots: ["10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"]
    },
    image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400"
  },
  
  // Invisalign & Veneers
  {
    id: "d19",
    name: "Dr. Jessica Parker",
    department: "Invisalign",
    experience: "10 years",
    rating: 4.9,
    availability: {
      days: ["Monday", "Tuesday", "Wednesday", "Saturday"],
      timeSlots: ["10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"]
    },
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400"
  },
  {
    id: "d20",
    name: "Dr. Matthew Clark",
    department: "Veneers",
    experience: "12 years",
    rating: 4.8,
    availability: {
      days: ["Tuesday", "Wednesday", "Thursday", "Friday"],
      timeSlots: ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM"]
    },
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400"
  },
  
  // Dental Crowns
  {
    id: "d21",
    name: "Dr. Samantha Lewis",
    department: "Dental Crowns",
    experience: "13 years",
    rating: 4.8,
    availability: {
      days: ["Monday", "Wednesday", "Thursday", "Friday"],
      timeSlots: ["9:00 AM", "10:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"]
    },
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400"
  },
  
  // Periodontics
  {
    id: "d22",
    name: "Dr. Anthony Hill",
    department: "Periodontics",
    experience: "15 years",
    rating: 4.9,
    availability: {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday"],
      timeSlots: ["9:00 AM", "10:00 AM", "2:00 PM", "3:00 PM"]
    },
    image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400"
  },
  
  // Endodontics
  {
    id: "d23",
    name: "Dr. Laura Scott",
    department: "Endodontics",
    experience: "14 years",
    rating: 4.9,
    availability: {
      days: ["Tuesday", "Wednesday", "Thursday", "Friday"],
      timeSlots: ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"]
    },
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400"
  },
  
  // Prosthodontics
  {
    id: "d24",
    name: "Dr. Brian Young",
    department: "Prosthodontics",
    experience: "16 years",
    rating: 4.8,
    availability: {
      days: ["Monday", "Wednesday", "Friday"],
      timeSlots: ["9:00 AM", "10:00 AM", "1:00 PM", "2:00 PM", "3:00 PM"]
    },
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400"
  },
  
  // Oral Pathology
  {
    id: "d25",
    name: "Dr. Stephanie King",
    department: "Oral Pathology",
    experience: "18 years",
    rating: 5.0,
    availability: {
      days: ["Monday", "Tuesday", "Thursday"],
      timeSlots: ["9:00 AM", "10:00 AM", "2:00 PM", "3:00 PM"]
    },
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"
  },
  
  // Cosmetic Procedures & Dental Hygiene
  {
    id: "d26",
    name: "Dr. Gregory Wright",
    department: "Cosmetic Procedures",
    experience: "12 years",
    rating: 4.7,
    availability: {
      days: ["Tuesday", "Wednesday", "Friday", "Saturday"],
      timeSlots: ["10:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "4:00 PM"]
    },
    image: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=400"
  },
  {
    id: "d27",
    name: "Dr. Melissa Turner",
    department: "Dental Hygiene",
    experience: "9 years",
    rating: 4.6,
    availability: {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      timeSlots: ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM"]
    },
    image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400"
  },
  
  // Maxillofacial Surgery & Trauma Care
  {
    id: "d28",
    name: "Dr. Charles Baker",
    department: "Maxillofacial Surgery",
    experience: "20 years",
    rating: 5.0,
    availability: {
      days: ["Monday", "Wednesday", "Thursday"],
      timeSlots: ["9:00 AM", "10:00 AM", "2:00 PM"]
    },
    image: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400"
  },
  {
    id: "d29",
    name: "Dr. Angela Nelson",
    department: "Trauma Care",
    experience: "11 years",
    rating: 4.9,
    availability: {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      timeSlots: ["8:00 AM", "12:00 PM", "4:00 PM", "8:00 PM"]
    },
    image: "https://images.unsplash.com/photo-1464863979621-258859e62245?w=400"
  },
  
  // Reconstructive Surgery
  {
    id: "d30",
    name: "Dr. Steven Campbell",
    department: "Reconstructive Surgery",
    experience: "19 years",
    rating: 5.0,
    availability: {
      days: ["Tuesday", "Wednesday", "Thursday"],
      timeSlots: ["9:00 AM", "10:00 AM", "2:00 PM", "3:00 PM"]
    },
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400"
  },
];
