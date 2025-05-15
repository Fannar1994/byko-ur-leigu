import React, { useState, createContext, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ContractDetails from "./pages/ContractDetails";
import { toast } from "sonner";
import { useAutoLogin } from "@/hooks/useAutoLogin";

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

// Create a new QueryClient instance with default options
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
  const { isLoading } = useAutoLogin();
  
  // Logout function to clear session
  const logout = () => {
    // Keep logout functionality for any buttons that might use it
    localStorage.removeItem("inspSession");
    localStorage.removeItem("inspDepot");
    localStorage.removeItem("inspUsername");
    // But immediately restore authentication
    setTimeout(() => setIsAuthenticated(true), 100);
  };
  
  // Show loading state while initializing
  if (isLoading) {
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
