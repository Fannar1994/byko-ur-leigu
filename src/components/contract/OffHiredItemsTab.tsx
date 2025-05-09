
import React from "react";
import TabContent from "@/components/TabContent";
import { RentalItem } from "@/types/contract";

interface OffHiredItemsTabProps {
  offHiredItems: RentalItem[];
  handleOffHireClick: (item: RentalItem) => void;
  processingItemId: string | null;
}

const OffHiredItemsTab: React.FC<OffHiredItemsTabProps> = ({ 
  offHiredItems,
  handleOffHireClick,
  processingItemId
}) => {
  return (
    <TabContent 
      title="Vörur úr leigu" 
      items={offHiredItems}
      showContractColumn={false}
      showActions={true}
      onOffHireClick={handleOffHireClick}
      processingItemId={processingItemId}
      showLocationColumn={true}
      showCountColumn={false}
    />
  );
};

export default OffHiredItemsTab;
