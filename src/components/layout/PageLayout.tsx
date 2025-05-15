
import React, { ReactNode } from "react";
import { useSessionMonitor } from "@/hooks/useSessionMonitor";

interface PageLayoutProps {
  children: ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
  // Monitor session status and auto-reconnect if needed
  const isSessionValid = useSessionMonitor();
  
  return (
    <div className="min-h-screen bg-background dark flex flex-col">
      {!isSessionValid && (
        <div className="bg-yellow-500 text-black px-4 py-2 text-center text-sm">
          Tengingarvandamál við inspHire. Reynt er að endurtengjast...
        </div>
      )}
      
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          {children}
        </div>
      </main>
      
      <footer className="bg-[#2A2A2A] text-white py-4 px-4">
        <div className="container mx-auto text-center text-sm">
          <p>BYKO Leiga</p>
        </div>
      </footer>
    </div>
  );
};

export default PageLayout;
