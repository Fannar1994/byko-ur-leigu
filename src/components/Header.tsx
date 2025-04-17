
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface HeaderProps {
  onBackClick: () => void;
  logoSrc?: string;
}

const Header: React.FC<HeaderProps> = ({ onBackClick, logoSrc = "/lovable-uploads/3e1840af-2d2e-403d-81ae-e4201bb075c5.png" }) => {
  return (
    <header className="py-4 px-0 bg-[#2A2A2A] text-white mb-8 flex justify-center">
      <div className="w-full flex items-center justify-center">
        <img 
          src={logoSrc} 
          alt="BYKO LEIGA" 
          className="h-32 w-auto mx-auto" 
        />
        <div className="absolute left-6">
          <Button 
            variant="outline" 
            className="text-white border-white hover:bg-white/10"
            onClick={onBackClick}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Til baka
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
