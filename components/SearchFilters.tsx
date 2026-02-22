"use client";

import { Search, MapPin, Filter, X, Building2 } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface SearchFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
  selectedLocation: string;
  onLocationChange: (value: string) => void;
  locations?: string[]; // Add this prop
}

export function SearchFilters({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedLocation,
  onLocationChange,
  locations = [], // Default to empty array
}: SearchFiltersProps) {
  const handleClearAll = () => {
    onSearchChange("");
    onTypeChange("all");
    onLocationChange("all");
  };

  const hasActiveFilters = selectedType !== "all" || selectedLocation !== "all" || searchQuery !== "";

  // Format location name for display (capitalize first letter, replace hyphens)
  const formatLocationName = (location: string) => {
    return location
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl border-b border-white/40 sticky top-20 z-40 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row gap-3 items-center max-w-5xl mx-auto">
          {/* Search Bar */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search hospitals, clinics, or services..."
              className="pl-10 pr-10 h-10 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Type Filter */}
          <Select value={selectedType} onValueChange={onTypeChange}>
            <SelectTrigger className="w-full md:w-40 h-10 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400/50">
              <Building2 className="w-3.5 h-3.5 mr-1.5 text-gray-600" />
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent className="bg-white rounded-lg shadow-xl border-gray-200">
              <SelectItem value="all" className="text-sm">All Types</SelectItem>
              <SelectItem value="hospital" className="text-sm">🏥 Hospital</SelectItem>
              <SelectItem value="clinic" className="text-sm">🏪 Clinic</SelectItem>
            </SelectContent>
          </Select>

          {/* Location Filter - Now dynamic */}
          <Select value={selectedLocation} onValueChange={onLocationChange}>
            <SelectTrigger className="w-full md:w-40 h-10 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400/50">
              <MapPin className="w-3.5 h-3.5 mr-1.5 text-gray-600" />
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent className="bg-white rounded-lg shadow-xl border-gray-200 max-h-60 overflow-y-auto">
              <SelectItem value="all" className="text-sm">All Locations</SelectItem>
              {locations.length > 0 ? (
                locations.map((location) => (
                  <SelectItem key={location} value={location.toLowerCase()} className="text-sm">
                    {formatLocationName(location)}
                  </SelectItem>
                ))
              ) : (
                // Fallback to static locations if no dynamic locations
                <>
                  <SelectItem value="downtown" className="text-sm">Downtown</SelectItem>
                  <SelectItem value="west side" className="text-sm">West Side</SelectItem>
                  <SelectItem value="east side" className="text-sm">East Side</SelectItem>
                  <SelectItem value="north side" className="text-sm">North Side</SelectItem>
                  <SelectItem value="suburbs" className="text-sm">Suburbs</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>

          {/* Clear Button */}
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              onClick={handleClearAll}
              className="h-10 px-3 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            >
              <X className="w-3.5 h-3.5 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}