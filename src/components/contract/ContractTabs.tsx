
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
  processedItems: string[]; // Updated to required prop
  sortField: keyof Contract;
  sortDirection: "asc" | "desc";
  onTogglePicked: (itemId: string) => void;
  onCompletePickup: () => void;
  onOffHireClick: (item: RentalItem) => void;
  handleSort: (field: keyof Contract) => void;
  onCountChange?: (itemId: string, count: number) => void;
  onItemStatusUpdate?: (itemId: string, newStatus: "Tiltekt" | "Úr leiga" | "Í leigu" | "On Rent" | "Off-Hired" | "Pending Return" | "Tilbúið til afhendingar", count: number) => void;
  isTiltektCompleted?: boolean;
}

const ContractTabs: React.FC<ContractTabsProps> = ({
  readyForPickItems,
  tiltektItems,
  offHiredItems,
  pickedItems,
  processingItemId,
  processedItems,
  onTogglePicked,
  onCompletePickup,
  onOffHireClick,
  onCountChange,
  onItemStatusUpdate,
  isTiltektCompleted = false
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

  // Create a wrapped status update handler
  const handleItemStatusUpdate = (item: RentalItem, count: number) => {
    if (onItemStatusUpdate) {
      // Ensure we have a count before updating status
      if (count <= 0) {
        return;
      }
      
      onItemStatusUpdate(item.id, "Tilbúið til afhendingar", count);
    }
  };
  
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
          onCountChange={handleCountChange}
          onStatusUpdate={handleItemStatusUpdate}
          isTiltektCompleted={isTiltektCompleted}
        />
      </TabsContent>
      
      <TabsContent value="offhired">
        <OffHiredItemsTab 
          offHiredItems={offHiredItems.filter(item => !processedItems.includes(item.id))}
          handleOffHireClick={onOffHireClick}
          processingItemId={processingItemId}
          showCountColumn={true}
          onCountChange={handleCountChange}
          processedItems={processedItems}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ContractTabs;
