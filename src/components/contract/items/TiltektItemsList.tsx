
import React from "react";
import { Button } from "@/components/ui/button";
import { RentalItem } from "@/types/contract";
import ItemTable from "@/components/ItemTable";

interface TiltektItemsListProps {
  displayedTiltektItems: RentalItem[];
  onOpenDescriptionDialog: (item: RentalItem) => void;
  onBatchStatusUpdate: () => void;
  onStatusClick: (item: RentalItem, count: number) => void;
  showCountColumn?: boolean;
  onCountChange?: (itemId: string, count: number) => void;
}

const TiltektItemsList: React.FC<TiltektItemsListProps> = ({
  displayedTiltektItems,
  onOpenDescriptionDialog,
  onBatchStatusUpdate,
  onStatusClick,
  showCountColumn = true,
  onCountChange
}) => {
  // Create a simple pickedItems object to make the component work with ItemTable
  const pickedItems: Record<string, boolean> = {};
  
  // Add a dummy toggle function since we handle picking via counts now
  const dummyToggle = () => {};

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-white">Taka til vörur</h3>
        <Button 
          variant="default" 
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={onBatchStatusUpdate}
        >
          Staðfesta tiltekt
        </Button>
      </div>

      <ItemTable 
        items={displayedTiltektItems}
        showContractColumn={false}
        showCountColumn={showCountColumn}
        onStatusClick={onStatusClick}
        onCountChange={onCountChange}
        pickedItems={pickedItems}
        onTogglePicked={dummyToggle}
        onOpenDescriptionDialog={onOpenDescriptionDialog}
        hideMerkjaButtons={true} // Hide the Merkja buttons as requested
      />
    </div>
  );
};

export default TiltektItemsList;
