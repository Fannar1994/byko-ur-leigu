
import React from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import RentalTabsNavigation from "@/components/RentalTabsNavigation";
import ContractsTableComponent from "@/components/ContractsTableComponent";
import { Contract, RentalItem } from "@/types/contract";
import ActiveItemsTab from "./ActiveItemsTab";
import TiltektTab from "./TiltektTab";
import OffHiredItemsTab from "./OffHiredItemsTab";

interface ContractTabsProps {
  contracts: Contract[];
  activeItems: RentalItem[];
  readyForPickItems: RentalItem[];
  tiltektItems: RentalItem[];
  offHiredItems: RentalItem[];
  pickedItems: Record<string, boolean>;
  processingItemId: string | null;
  sortField: keyof Contract;
  sortDirection: "asc" | "desc";
  onTogglePicked: (itemId: string) => void;
  onCompletePickup: () => void;
  onOffHireClick: (item: RentalItem) => void;
  handleSort: (field: keyof Contract) => void;
}

const ContractTabs: React.FC<ContractTabsProps> = ({
  contracts,
  activeItems,
  readyForPickItems,
  tiltektItems,
  offHiredItems,
  pickedItems,
  processingItemId,
  sortField,
  sortDirection,
  onTogglePicked,
  onCompletePickup,
  onOffHireClick,
  handleSort
}) => {
  return (
    <Tabs defaultValue="active" className="w-full">
      <RentalTabsNavigation />
      
      <TabsContent value="active">
        <ContractsTableComponent 
          contracts={contracts}
          sortField={sortField}
          sortDirection={sortDirection}
          handleSort={handleSort}
        />
      </TabsContent>
      
      <TabsContent value="onrent">
        <ActiveItemsTab 
          activeItems={activeItems} 
          handleOffHireClick={onOffHireClick} 
          processingItemId={processingItemId} 
        />
      </TabsContent>
      
      <TabsContent value="tiltekt">
        <TiltektTab 
          readyForPickItems={readyForPickItems}
          tiltektItems={tiltektItems}
          pickedItems={pickedItems}
          onTogglePicked={onTogglePicked}
          onCompletePickup={onCompletePickup}
        />
      </TabsContent>
      
      <TabsContent value="offhired">
        <OffHiredItemsTab 
          offHiredItems={offHiredItems}
          handleOffHireClick={onOffHireClick}
          processingItemId={processingItemId}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ContractTabs;
