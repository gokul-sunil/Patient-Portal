"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Heart,
  Award,
  Users,
  Shield,
  Clock,
  Target,
  CheckCircle2,
  TrendingUp,
  Sparkles,
} from "lucide-react";

export default function ContactPage() {
  const router = useRouter();

  const values = [
    {
      icon: Heart,
      title: "Patient-Centered Care",
      description:
        "We put our patients first, ensuring comfort and satisfaction in every visit.",
      color: "from-pink-500 to-rose-500",
    },
    {
      icon: Award,
      title: "Excellence & Quality",
      description:
        "We maintain the highest standards of dental care with state-of-the-art technology.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Shield,
      title: "Safety & Trust",
      description:
        "Your health and safety are our top priorities with strict hygiene protocols.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Users,
      title: "Expert Team",
      description:
        "Our experienced dentists and staff are dedicated to your dental health.",
      color: "from-purple-500 to-indigo-500",
    },
  ];

  const stats = [
    { icon: Users, value: "50+", label: "Expert Dentists", color: "blue" },
    { icon: Heart, value: "10,000+", label: "Happy Patients", color: "pink" },
    { icon: Award, value: "15+", label: "Years Experience", color: "purple" },
    { icon: Clock, value: "24/7", label: "Emergency Care", color: "green" },
  ];

  const achievements = [
    "ISO 9001:2015 Certified Healthcare Provider",
    "Best Dental Care Services Award 2025",
    "Recognized by National Dental Association",
    "Advanced Cosmetic Dentistry Certification",
    "Excellence in Patient Care Award",
    "Modern Technology Integration Leader",
  ];

  return (
    <main className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="relative mb-16 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-1 shadow-2xl shadow-blue-500/30">
        <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-12 md:p-16 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50 rounded-3xl"></div>

          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl shadow-xl shadow-blue-500/40 mb-6">
              <span className="text-5xl">🦷</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              About DentalCare
            </h1>

            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8">
              Your trusted partner in dental health, connecting you with the
              finest dental facilities and professionals for over 15 years.
            </p>

            <Button
              onClick={() => router.push("/")}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl shadow-blue-500/40 rounded-xl px-8 py-6 text-lg"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="bg-white/80 backdrop-blur-xl border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden group hover:-translate-y-2"
          >
            <CardContent className="p-6 text-center">
              <div
                className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${
                  stat.color === "blue"
                    ? "from-blue-500 to-cyan-500"
                    : stat.color === "pink"
                    ? "from-pink-500 to-rose-500"
                    : stat.color === "purple"
                    ? "from-purple-500 to-indigo-500"
                    : "from-green-500 to-emerald-500"
                } rounded-2xl shadow-lg mb-4`}
              >
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {stat.value}
              </p>
              <p className="text-sm text-gray-600 font-medium">
                {stat.label}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Achievements */}
      <Card className="bg-white/80 backdrop-blur-xl border-white/50 shadow-2xl shadow-green-500/10 rounded-3xl overflow-hidden mb-16">
        <CardContent className="p-8 md:p-10">
          <div className="flex items-center gap-3 mb-8 justify-center">
            <Award className="w-8 h-8 text-green-600" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Achievements & Recognition
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200/50"
              >
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-gray-800">
                  {achievement}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <Card className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-1 shadow-2xl shadow-purple-500/30">
        <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-12 text-center">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to Experience Quality Dental Care?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied patients who trust DentalCare.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push("/")}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl px-8 py-6 text-lg"
              >
                Browse Facilities
              </Button>

              <Button
                onClick={() => router.push("/contact")}
                size="lg"
                variant="outline"
                className="border-2 border-gray-300 hover:bg-gray-50 rounded-xl px-8 py-6 text-lg"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </main>
  );
}
