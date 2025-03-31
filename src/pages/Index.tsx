
import React, { useState } from "react";
import { toast } from "sonner";
import KennitalaSearch from "@/components/KennitalaSearch";
import ResultsDisplay from "@/components/ResultsDisplay";
import { searchByKennitala } from "@/services/api";
import { SearchResults } from "@/types/contract";
import { AlertCircle, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [lastSearchedKennitala, setLastSearchedKennitala] = useState<string>("");
  const navigate = useNavigate();

  const handleSearch = async (kennitala: string) => {
    setIsLoading(true);
    setLastSearchedKennitala(kennitala);
    try {
      const results = await searchByKennitala(kennitala);
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
      let errorMessage = "An unknown error occurred. Please try again.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast.error("Search Error", {
        description: errorMessage,
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      });
      
      setSearchResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    if (lastSearchedKennitala) {
      handleSearch(lastSearchedKennitala);
    }
  };

  return (
    <div className="min-h-screen bg-background dark">
      <header className="py-0 px-0 bg-[#2A2A2A] text-white mb-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center w-full">
            <img 
              src="/lovable-uploads/3e1840af-2d2e-403d-81ae-e4201bb075c5.png" 
              alt="BYKO LEIGA" 
              className="h-28 w-auto" 
            />
            <div className="hidden md:block ml-4">
              <h1 className="text-3xl font-bold text-white">Rental Contract System</h1>
              <p className="text-white">Search for rental contracts using Icelandic ID numbers</p>
            </div>
          </div>
          <div className="pr-6">
            <Button 
              variant="outline" 
              className="text-white border-white hover:bg-white/10"
              onClick={() => navigate("/login")}
            >
              <LogIn className="mr-2 h-4 w-4" /> Login
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container px-4 pb-12 max-w-7xl mx-auto space-y-8">
        <KennitalaSearch onSearch={handleSearch} isLoading={isLoading} />
        
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="h-12 w-12 rounded-full border-4 border-primary border-t-primary/20 animate-spin"></div>
          </div>
        )}
        
        {!isLoading && searchResults && (
          <ResultsDisplay results={searchResults} onDataChange={refreshData} />
        )}
        
        {!isLoading && !searchResults && (
          <div className="text-center py-12 text-muted-foreground">
            <p>Enter a kennitala to search for rental contracts.</p>
            <p className="text-sm mt-2">For testing, use any 10-digit number.</p>
          </div>
        )}
      </main>
      
      <footer className="bg-[#2A2A2A] text-white py-4 px-4">
        <div className="container mx-auto text-center text-sm">
          <p>BYKO Leiga</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
