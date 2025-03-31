
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { validateKennitala } from "@/services/api";
import { Search } from "lucide-react";

interface KennitalaSearchProps {
  onSearch: (kennitala: string) => void;
  isLoading: boolean;
}

const KennitalaSearch: React.FC<KennitalaSearchProps> = ({ onSearch, isLoading }) => {
  const [kennitala, setKennitala] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous error
    setError("");
    
    // Validate kennitala
    if (!validateKennitala(kennitala)) {
      setError("Invalid kennitala format. Please enter a 10-digit number.");
      return;
    }
    
    // Pass the kennitala to the parent component
    onSearch(kennitala);
  };

  // Format kennitala as the user types (adding hyphens)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Strip non-digit characters
    const digitsOnly = value.replace(/\D/g, "");
    
    // Limit to 10 digits
    const truncated = digitsOnly.substring(0, 10);
    
    setKennitala(truncated);
    
    // Clear error if input changes
    if (error) setError("");
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-md">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-brand-800">Search Contracts by Kennitala</h2>
            <p className="text-sm text-gray-500">
              Enter a 10-digit Icelandic ID number to find associated rental contracts.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-grow">
              <Input
                type="text"
                value={kennitala}
                onChange={handleChange}
                placeholder="Enter kennitala (e.g., 0123456789)"
                className={`pl-4 pr-10 py-6 text-lg ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {error && (
                <div className="text-red-500 text-sm mt-1">{error}</div>
              )}
            </div>
            <Button 
              type="submit" 
              disabled={isLoading || kennitala.length !== 10} 
              className="h-12 px-6 flex-shrink-0 bg-brand-600 hover:bg-brand-700"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                  <span>Searching...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Search size={18} />
                  <span>Search</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default KennitalaSearch;
