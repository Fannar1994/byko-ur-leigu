
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "react-router-dom";

const RentalTabsNavigation: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  
  return (
    <TabsList className="w-full mb-6">
      {isHomePage ? (
        <TabsTrigger value="active" className="flex-1">Samningar</TabsTrigger>
      ) : (
        <>
          <TabsTrigger value="tiltekt" className="flex-1">Tiltekt</TabsTrigger>
          <TabsTrigger value="offhired" className="flex-1">Úr leigu</TabsTrigger>
        </>
      )}
    </TabsList>
  );
};

export default RentalTabsNavigation;
