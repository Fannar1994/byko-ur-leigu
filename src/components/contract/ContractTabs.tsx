
import React from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import RentalTabsNavigation from "@/components/RentalTabsNavigation";
import { Contract, RentalItem } from "@/types/contract";
import TiltektTab from "./TiltektTab";
import OffHiredItemsTab from "./OffHiredItemsTab";
import { setItemCount, getItemCount } from "@/utils/countUtils";

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
  onItemStatusUpdate?: (itemId: string, newStatus: "Tiltekt" | "Úr leiga" | "Í leigu" | "On Rent" | "Off-Hired" | "Pending Return" | "Tilbúið til afhendingar", count: number) => void;
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
  // Enhance the count change handler to store counts in our utility
  const handleCountChange = (itemId: string, count: number) => {
    // Store the count in our utility
    setItemCount(itemId, count);
    
    // Call the original handler if provided
    if (onCountChange) {
      onCountChange(itemId, count);
    }
  };
  
  return (
    <Tabs defaultValue="tiltekt" className="w-full">
      <RentalTabsNavigation />
      
      <TabsContent value="active">
        {/* This is intentionally empty as we're focusing on the other tabs */}
      </TabsContent>
      
      <TabsContent value="tiltekt">
        <TiltektTab 
          readyForPickItems={readyForPickItems}
          tiltektItems={tiltektItems}
          pickedItems={pickedItems}
          onTogglePicked={onTogglePicked}
          onCompletePickup={onCompletePickup}
          showCountColumn={true}
          onCountChange={handleCountChange}
          onStatusUpdate={onItemStatusUpdate}
        />
      </TabsContent>
      
      <TabsContent value="offhired">
        <OffHiredItemsTab 
          offHiredItems={offHiredItems}
          handleOffHireClick={onOffHireClick}
          processingItemId={processingItemId}
          showCountColumn={true}
          onCountChange={handleCountChange}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ContractTabs;
