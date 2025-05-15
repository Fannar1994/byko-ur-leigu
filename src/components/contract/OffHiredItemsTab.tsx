
import React from "react";
import TabContent from "@/components/TabContent";
import { RentalItem } from "@/types/contract";

interface OffHiredItemsTabProps {
  offHiredItems: RentalItem[];
  handleOffHireClick: (item: RentalItem) => void;
  processingItemId: string | null;
  showCountColumn?: boolean;
  onCountChange?: (itemId: string, count: number) => void;
  processedItems?: string[]; // New prop to track processed items
}

const OffHiredItemsTab: React.FC<OffHiredItemsTabProps> = ({ 
  offHiredItems,
  handleOffHireClick,
  processingItemId,
  showCountColumn = true,
  onCountChange,
  processedItems = [] // Default to empty array
}) => {
  // Filter out items that have been processed
  const displayedItems = processedItems.length > 0
    ? offHiredItems.filter(item => !processedItems.includes(item.id))
    : offHiredItems;

  return (
    <TabContent 
      title="Vörur úr leigu" 
      items={displayedItems}
      showContractColumn={false}
      showActions={true}
      onOffHireClick={handleOffHireClick}
      processingItemId={processingItemId}
      showLocationColumn={true}
      showCountColumn={showCountColumn}
      onCountChange={onCountChange}
    />
  );
};

export default OffHiredItemsTab;
