"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="container mx-auto px-4 py-20 min-h-[600px] flex items-center justify-center">
      <div className="text-center max-w-lg">
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl shadow-blue-500/10 p-12">
          <div className="text-8xl mb-6">🦷</div>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            404 - Page Not Found
          </h1>

          <p className="text-gray-600 mb-8">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>

          <Button
            onClick={() => router.push("/")}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl shadow-blue-500/40 rounded-xl px-8 py-6"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </main>
  );
}
