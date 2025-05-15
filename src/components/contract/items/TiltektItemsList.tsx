
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
        showActions={false}
        onStatusClick={onStatusClick}
        onCountChange={onCountChange}
        onOpenDescriptionDialog={onOpenDescriptionDialog}
        hideMerkjaButtons={true}
      />
    </div>
  );
};

export default TiltektItemsList;
