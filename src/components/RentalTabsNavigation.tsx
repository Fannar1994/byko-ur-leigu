
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

const RentalTabsNavigation: React.FC = () => {
  return (
    <TabsList className="w-full mb-6">
      <TabsTrigger value="active" className="flex-1">Í leigu</TabsTrigger>
      <TabsTrigger value="tiltekt" className="flex-1">Tiltekt</TabsTrigger>
    </TabsList>
  );
};

export default RentalTabsNavigation;
