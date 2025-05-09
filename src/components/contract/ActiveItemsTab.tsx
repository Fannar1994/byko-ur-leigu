
import React from "react";
import TabContent from "@/components/TabContent";
import { RentalItem } from "@/types/contract";

interface ActiveItemsTabProps {
  activeItems: RentalItem[];
  handleOffHireClick: (item: RentalItem) => void;
  processingItemId: string | null;
  onCountChange?: (itemId: string, count: number) => void;
  showCountColumn?: boolean;
}

const ActiveItemsTab: React.FC<ActiveItemsTabProps> = ({ 
  activeItems,
  handleOffHireClick,
  processingItemId,
  onCountChange,
  showCountColumn = false
}) => {
  return (
    <TabContent 
      title="Vörur í leigu" 
      items={activeItems}
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

export default ActiveItemsTab;
