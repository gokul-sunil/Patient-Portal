import { Outlet } from "react-router";
import { Header } from "./Header";
import { Link } from "react-router";

export function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10">
        <Header />
        <Outlet />
        
        <footer className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white mt-20 py-16 overflow-hidden">
          {/* Footer background effects */}
          <div className="absolute inset-0 overflow-hidden opacity-30">
            <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg shadow-blue-500/30">
                    <span className="text-white text-2xl">🦷</span>
                  </div>
                  <span className="text-2xl font-bold">DentalCare</span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Find the best dental care providers in your area. Quality care, trusted professionals, modern facilities.
                </p>
              </div>
              
              <div>
                <h4 className="font-bold text-lg mb-5 text-blue-300">Quick Links</h4>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li><Link to="/" className="hover:text-white transition-colors hover:translate-x-1 inline-block">→ Home</Link></li>
                  <li><Link to="/" className="hover:text-white transition-colors hover:translate-x-1 inline-block">→ Find Hospitals</Link></li>
                  <li><Link to="/" className="hover:text-white transition-colors hover:translate-x-1 inline-block">→ Find Clinics</Link></li>
                  <li><Link to="/about" className="hover:text-white transition-colors hover:translate-x-1 inline-block">→ About Us</Link></li>
                  <li><Link to="/contact" className="hover:text-white transition-colors hover:translate-x-1 inline-block">→ Contact Us</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold text-lg mb-5 text-purple-300">Services</h4>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li><Link to="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">→ General Dentistry</Link></li>
                  <li><Link to="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">→ Orthodontics</Link></li>
                  <li><Link to="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">→ Cosmetic Dentistry</Link></li>
                  <li><Link to="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">→ Emergency Care</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold text-lg mb-5 text-pink-300">Contact</h4>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400">✉</span>
                    <span>info@dentalcare.com</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">📞</span>
                    <span>(555) 000-0000</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-400">🕐</span>
                    <span>Mon-Fri 9AM-6PM</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-white/20 mt-12 pt-8 text-center">
              <p className="text-sm text-gray-400">
                &copy; 2026 DentalCare. All rights reserved. | Designed with 💙 for better healthcare
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}