// components/Footer.tsx
'use client' // Add this directive to use client-side functionality

import Link from "next/link"

export function Footer() {
  const handleWhatsAppContact = () => {
    const phoneNumber = "1234567890" // Make sure this matches your number
    const message = encodeURIComponent("Hello! I would like to inquire about dental services.")
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
  }

  return (
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
              <li>
                <Link href="/" className="hover:text-white transition-colors hover:translate-x-1 inline-block">
                  → Home
                </Link>
              </li>
              <li>
                <Link href="/hospitals" className="hover:text-white transition-colors hover:translate-x-1 inline-block">
                  → Find Hospitals
                </Link>
              </li>
              <li>
                <Link href="/clinics" className="hover:text-white transition-colors hover:translate-x-1 inline-block">
                  → Find Clinics
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors hover:translate-x-1 inline-block">
                  → About Us
                </Link>
              </li>
              {/* FIXED: Changed from Link to button for Contact Us */}
              <li>
                <button
                  onClick={handleWhatsAppContact}
                  className="hover:text-white transition-colors hover:translate-x-1 inline-block text-left"
                >
                  → Contact Us
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-5 text-purple-300">Services</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>
                <Link href="/services/general-dentistry" className="hover:text-white transition-colors hover:translate-x-1 inline-block">
                  → General Dentistry
                </Link>
              </li>
              <li>
                <Link href="/services/orthodontics" className="hover:text-white transition-colors hover:translate-x-1 inline-block">
                  → Orthodontics
                </Link>
              </li>
              <li>
                <Link href="/services/cosmetic-dentistry" className="hover:text-white transition-colors hover:translate-x-1 inline-block">
                  → Cosmetic Dentistry
                </Link>
              </li>
              <li>
                <Link href="/services/emergency-care" className="hover:text-white transition-colors hover:translate-x-1 inline-block">
                  → Emergency Care
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-5 text-pink-300">Contact</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-400">✉</span>
                {/* FIXED: Make email clickable with WhatsApp */}
                <button
                  onClick={handleWhatsAppContact}
                  className="hover:text-white transition-colors text-left"
                >
                  info@dentalcare.com
                </button>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">📞</span>
                {/* FIXED: Make phone clickable with WhatsApp */}
                <button
                  onClick={handleWhatsAppContact}
                  className="hover:text-white transition-colors text-left"
                >
                  (555) 000-0000
                </button>
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
            &copy; {new Date().getFullYear()} DentalCare. All rights reserved. | Designed with 💙 for better healthcare
          </p>
        </div>
      </div>
    </footer>
  )
}