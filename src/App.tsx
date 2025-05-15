import React, { useState, createContext, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ContractDetails from "./pages/ContractDetails";

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
  
  // Simulate session setup on app load
  useEffect(() => {
    // Set default values for session that would normally be set after login
    if (!localStorage.getItem("inspSession")) {
      localStorage.setItem("inspSession", "auto-session");
      localStorage.setItem("inspDepot", "main");
      localStorage.setItem("inspUsername", "user");
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
  };
  
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
