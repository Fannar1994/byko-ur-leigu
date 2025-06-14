
import React, { useState, useContext, useEffect } from "react";
import { toast } from "sonner";
import KennitalaSearch from "@/components/KennitalaSearch";
import ResultsDisplay from "@/components/ResultsDisplay";
import { searchByKennitala } from "@/services/api";
import { SearchResults } from "@/types/contract";
import { AlertCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../App";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [lastSearchedKennitala, setLastSearchedKennitala] = useState<string>("");
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);
  const [searchParams] = useSearchParams();

  // Check for URL parameters or stored kennitala on initial load
  useEffect(() => {
    const urlKennitala = searchParams.get('kennitala');
    const storedKennitala = localStorage.getItem('lastSearchedKennitala');
    
    // Prioritize URL parameter over stored value
    if (urlKennitala) {
      setLastSearchedKennitala(urlKennitala);
      handleSearch(urlKennitala);
    } else if (storedKennitala) {
      setLastSearchedKennitala(storedKennitala);
      handleSearch(storedKennitala);
    }
  }, [searchParams]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    toast.success("Útskráning tókst", {
      description: "Þú hefur verið skráð/ur út.",
    });
    navigate("/login");
  };

  const handleSearch = async (kennitala: string) => {
    setIsLoading(true);
    setLastSearchedKennitala(kennitala);
    // Store the kennitala in localStorage
    localStorage.setItem('lastSearchedKennitala', kennitala);
    
    try {
      const results = await searchByKennitala(kennitala);
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
      let errorMessage = "Óþekkt villa kom upp. Vinsamlegast reyndu aftur.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast.error("Leitarvilla", {
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
      <header className="py-4 px-0 bg-[#2A2A2A] text-white mb-8 flex justify-center">
        <div className="w-full flex items-center justify-center">
          <img 
            src="/lovable-uploads/3e1840af-2d2e-403d-81ae-e4201bb075c5.png" 
            alt="BYKO LEIGA" 
            className="h-32 w-auto mx-auto" 
          />
          <div className="absolute right-6">
            <Button 
              variant="outline" 
              className="text-white border-white hover:bg-white/10"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" /> Útskrá
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container px-4 pb-12 max-w-7xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Samningayfirlit BYKO Leigu</h1>
          <p className="text-white">Leitaðu að leigusamningum með kennitölu</p>
        </div>
      
        <KennitalaSearch onSearch={handleSearch} isLoading={isLoading} initialKennitala={lastSearchedKennitala} />
        
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="h-12 w-12 rounded-full border-4 border-primary border-t-primary/20 animate-spin"></div>
          </div>
        )}
        
        {!isLoading && searchResults && (
          <ResultsDisplay results={searchResults} onDataChange={refreshData} />
        )}
        
        {!isLoading && !searchResults && !lastSearchedKennitala && (
          <div className="text-center py-12 text-white">
            <p>Sláðu inn kennitölu til að leita að leigusamningum.</p>
            <p className="text-sm mt-2">Fyrir prófun, notaðu hvaða 10 stafa tölu sem er.</p>
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
