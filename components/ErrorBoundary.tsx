import { useRouteError, useNavigate } from "react-router";
import { Button } from "../components/ui/button";

export function ErrorBoundary() {
  const error = useRouteError() as any;
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <main className="container mx-auto px-4 py-20 min-h-[600px] flex items-center justify-center relative z-10">
        <div className="text-center max-w-lg">
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl shadow-blue-500/10 p-12">
            <div className="text-8xl mb-6">🦷</div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              {error?.status === 404 ? "404 - Page Not Found" : "Oops! Something went wrong"}
            </h1>
            <p className="text-gray-600 mb-8">
              {error?.status === 404 
                ? "The page you're looking for doesn't exist. It might have been moved or deleted."
                : "We encountered an unexpected error. Please try again."}
            </p>
            <Button 
              onClick={() => navigate("/")}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl shadow-blue-500/40 rounded-xl px-8 py-6"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
