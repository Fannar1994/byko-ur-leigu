
import React, { useState } from "react";
import { toast } from "sonner";
import KennitalaSearch from "@/components/KennitalaSearch";
import ResultsDisplay from "@/components/ResultsDisplay";
import { searchByKennitala } from "@/services/api";
import { SearchResults } from "@/types/contract";
import { AlertCircle } from "lucide-react";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [lastSearchedKennitala, setLastSearchedKennitala] = useState<string>("");

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
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white dark:from-gray-900 dark:to-gray-950">
      <header className="py-6 px-4 bg-brand-800 text-white mb-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">Kennitala Connect</h1>
          <p className="text-brand-100">Search for rental contracts using Icelandic ID numbers</p>
        </div>
      </header>
      
      <main className="container px-4 pb-12 max-w-7xl mx-auto space-y-8">
        <KennitalaSearch onSearch={handleSearch} isLoading={isLoading} />
        
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="h-12 w-12 rounded-full border-4 border-brand-300 border-t-brand-600 animate-spin"></div>
          </div>
        )}
        
        {!isLoading && searchResults && (
          <ResultsDisplay results={searchResults} onDataChange={refreshData} />
        )}
        
        {!isLoading && !searchResults && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p>Enter a kennitala to search for rental contracts.</p>
            <p className="text-sm mt-2">For testing, use any 10-digit number.</p>
          </div>
        )}
      </main>
      
      <footer className="bg-brand-800 text-white py-4 px-4">
        <div className="container mx-auto text-center text-sm">
          <p>© {new Date().getFullYear()} Kennitala Connect | InspHire Integration</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
