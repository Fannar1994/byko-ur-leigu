
import React from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import RentalTabsNavigation from "@/components/RentalTabsNavigation";
import { Contract, RentalItem } from "@/types/contract";
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
  onCountChange?: (itemId: string, count: number) => void;
  onItemStatusUpdate?: (itemId: string, newStatus: string, count: number) => void;
}

const ContractTabs: React.FC<ContractTabsProps> = ({
  readyForPickItems,
  tiltektItems,
  offHiredItems,
  pickedItems,
  processingItemId,
  onTogglePicked,
  onCompletePickup,
  onOffHireClick,
  onCountChange,
  onItemStatusUpdate
}) => {
  return (
    <Tabs defaultValue="tiltekt" className="w-full">
      <RentalTabsNavigation />
      
      <TabsContent value="tiltekt">
        <TiltektTab 
          readyForPickItems={readyForPickItems}
          tiltektItems={tiltektItems}
          pickedItems={pickedItems}
          onTogglePicked={onTogglePicked}
          onCompletePickup={onCompletePickup}
          showCountColumn={true}
          onCountChange={onCountChange}
          onStatusUpdate={onItemStatusUpdate}
        />
      </TabsContent>
      
      <TabsContent value="offhired">
        <OffHiredItemsTab 
          offHiredItems={offHiredItems}
          handleOffHireClick={onOffHireClick}
          processingItemId={processingItemId}
          showCountColumn={true}
          onCountChange={onCountChange}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ContractTabs;
