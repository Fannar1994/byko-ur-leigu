
import React from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Contract } from "@/types/contract";
import RentalTabsNavigation from "@/components/RentalTabsNavigation";
import ContractsTableComponent from "@/components/ContractsTableComponent";

interface HomePageViewProps {
  sortedContracts: Contract[];
  sortField: keyof Contract;
  sortDirection: "asc" | "desc";
  handleSort: (field: keyof Contract) => void;
}

const HomePageView: React.FC<HomePageViewProps> = ({
  sortedContracts,
  sortField,
  sortDirection,
  handleSort
}) => {
  return (
    <Tabs defaultValue="active" className="w-full">
      <RentalTabsNavigation />
      
      <TabsContent value="active" className="animate-fade-in">
        <Card>
          <ContractsTableComponent 
            contracts={sortedContracts}
            sortField={sortField}
            sortDirection={sortDirection}
            handleSort={handleSort}
          />
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default HomePageView;
