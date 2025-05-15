
import React, { useState, createContext, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ContractDetails from "./pages/ContractDetails";
import { loginToInspHire } from "@/api/inspHireService";
import { toast } from "sonner";

// Create auth context
export const AuthContext = createContext({
  isAuthenticated: true, // Always authenticated
  setIsAuthenticated: (value: boolean) => {},
  logout: () => {}
});

// Protected route component - modified to always allow access
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
});

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Always authenticated
  const [isInitializing, setIsInitializing] = useState(true);
  
  // Initialize API session on app load
  useEffect(() => {
    const initializeSession = async () => {
      try {
        // Check if we already have a session
        const existingSession = localStorage.getItem("inspSession");
        
        // If no session exists or we want to refresh it
        if (!existingSession) {
          console.log("No existing session found, logging in to inspHire...");
          const sessionData = await loginToInspHire("api", "1994");
          
          // Session is now set in localStorage by the loginToInspHire function
          console.log("New session established:", sessionData.sessionId);
        } else {
          console.log("Using existing inspHire session");
        }
      } catch (error) {
        console.error("Failed to initialize inspHire session:", error);
        toast.error("Tengingarvilla við inspHire", {
          description: "Reyndu aftur eða hafðu samband við kerfisstjóra.",
        });
      } finally {
        setIsInitializing(false);
      }
    };

    initializeSession();
    
    // Set default values for session that would normally be set after login
    if (!localStorage.getItem("inspDepot")) {
      localStorage.setItem("inspDepot", "main");
      localStorage.setItem("inspUsername", "api");
    }
  }, []);

  // Logout function to clear session
  const logout = () => {
    // Keep logout functionality for any buttons that might use it
    localStorage.removeItem("inspSession");
    localStorage.removeItem("inspDepot");
    localStorage.removeItem("inspUsername");
    // But immediately restore authentication
    setTimeout(() => setIsAuthenticated(true), 100);
    
    // Re-initialize session
    loginToInspHire("api", "1994").catch(console.error);
  };
  
  // Show loading state while initializing
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 rounded-full border-4 border-t-transparent border-yellow-500 animate-spin mx-auto"></div>
          <p className="text-lg text-white">Tengist inspHire...</p>
        </div>
      </div>
    );
  }
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, logout }}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/contract/:contractNumber" element={<ContractDetails />} />
              <Route path="*" element={<NotFound />} />
              {/* Redirect /login to home */}
              <Route path="/login" element={<Navigate to="/" />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </AuthContext.Provider>
  );
};

export default App;
