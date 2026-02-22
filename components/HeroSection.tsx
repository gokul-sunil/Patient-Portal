import { ImageWithFallback } from "./figma/ImageWithFallback";

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1766338390573-ec092d69cdcb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW50YWwlMjBjbGluaWMlMjBwcm9mZXNzaW9uYWwlMjBoZWFsdGhjYXJlfGVufDF8fHx8MTc3MTU4MjYxNHww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Dental care background"
          className="w-full h-full object-cover opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/60 via-purple-600/50 to-pink-500/60"></div>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden z-[1]">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-2xl">
            Find Top Dental Care <br />
            <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent drop-shadow-none">
              Near You
            </span>
          </h2>
          <p className="text-xl text-white mb-8 leading-relaxed drop-shadow-lg">
            Discover trusted hospitals and clinics for all your dental needs. <br />
            Quality care, experienced professionals, modern facilities.
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-12">
            <div className="bg-white/25 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/40 shadow-2xl">
              <div className="text-3xl font-bold drop-shadow-lg">500+</div>
              <div className="text-sm text-white drop-shadow-md">Dental Providers</div>
            </div>
            <div className="bg-white/25 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/40 shadow-2xl">
              <div className="text-3xl font-bold drop-shadow-lg">50k+</div>
              <div className="text-sm text-white drop-shadow-md">Happy Patients</div>
            </div>
            <div className="bg-white/25 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/40 shadow-2xl">
              <div className="text-3xl font-bold drop-shadow-lg">4.8★</div>
              <div className="text-sm text-white drop-shadow-md">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}