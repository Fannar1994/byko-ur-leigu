
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

const RentalTabsNavigation: React.FC = () => {
  return (
    <TabsList className="w-full mb-6">
      <TabsTrigger value="tiltekt" className="flex-1">Tiltekt</TabsTrigger>
      <TabsTrigger value="offhired" className="flex-1">Úr leiga</TabsTrigger>
    </TabsList>
  );
};

export default RentalTabsNavigation;
