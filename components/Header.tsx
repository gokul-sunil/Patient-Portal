import { Search, MapPin, Phone, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Button } from "./ui/button";
import { useState } from "react";

export function Header() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleBookNow = () => {
    // Navigate to home page
    navigate('/');
    
    // Scroll to facilities section after a brief delay
    setTimeout(() => {
      const facilitiesSection = document.querySelector('main');
      if (facilitiesSection) {
        facilitiesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
    setMobileMenuOpen(false);
  };

  const handleWhatsAppContact = () => {
    // WhatsApp business number (format: country code + number without +)
    const phoneNumber = "1234567890"; // Replace with actual business number
    const message = encodeURIComponent("Hello! I would like to inquire about dental services.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    setMobileMenuOpen(false);
  };

  return (
    <header className="border-b border-white/20 bg-white/60 backdrop-blur-2xl sticky top-0 z-50 shadow-xl shadow-blue-500/10">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 rounded-2xl shadow-xl shadow-blue-500/40 transition-all group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-blue-500/50">
              <span className="text-white text-3xl">🦷</span>
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                DentalCare
              </h1>
              <p className="text-xs text-gray-600">Premium Dental Services</p>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link 
              to="/" 
              className="relative text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              to="/about" 
              className="relative text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium group"
            >
              About Us
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              to="/contact" 
              className="relative text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium group"
            >
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Button 
              variant="outline" 
              className="relative border-2 border-green-200 hover:border-green-400 text-green-700 hover:text-green-800 bg-white/50 backdrop-blur-sm hover:bg-green-50/80 transition-all duration-300 px-6 py-2.5 rounded-xl font-medium overflow-hidden group"
              onClick={handleWhatsAppContact}
            >
              <span className="relative z-10">Contact Us</span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-green-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
            <Button 
              className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 hover:from-blue-700 hover:via-purple-700 hover:to-blue-700 shadow-xl shadow-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 px-8 py-2.5 rounded-xl font-medium overflow-hidden group"
              onClick={handleBookNow}
            >
              <span className="relative z-10">Book Now</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/20 bg-white/40 backdrop-blur-xl rounded-b-2xl shadow-lg animate-in slide-in-from-top duration-300">
            <nav className="flex flex-col gap-3 mb-4">
              <Link 
                to="/" 
                className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link 
                to="/contact" 
                className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
            <div className="flex flex-col gap-2 px-4">
              <Button 
                variant="outline" 
                className="w-full border-2 border-green-200 text-green-700 bg-white/50 backdrop-blur-sm hover:bg-green-50 rounded-xl"
                onClick={handleWhatsAppContact}
              >
                Contact Us
              </Button>
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/30 rounded-xl"
                onClick={handleBookNow}
              >
                Book Now
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}