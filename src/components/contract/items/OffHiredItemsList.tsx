
import React from "react";
import { Button } from "@/components/ui/button";
import { RentalItem } from "@/types/contract";
import ItemTable from "@/components/ItemTable";
import { Trash2 } from "lucide-react";

interface OffHiredItemsListProps {
  displayedOffHiredItems: RentalItem[];
  onOpenDescriptionDialog: (item: RentalItem) => void;
  onBatchOffHire: () => void;
  pickedItems: Record<string, boolean>;
  onTogglePicked: (itemId: string) => void;
  isProcessing: boolean;
  anyItemsPicked: boolean;
  showCountColumn?: boolean;
  onCountChange?: (itemId: string, count: number) => void;
}

const OffHiredItemsList: React.FC<OffHiredItemsListProps> = ({
  displayedOffHiredItems,
  onOpenDescriptionDialog,
  onBatchOffHire,
  pickedItems,
  onTogglePicked,
  isProcessing,
  anyItemsPicked,
  showCountColumn = true,
  onCountChange
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div></div> {/* Empty div to maintain flex layout */}
        <Button 
          variant="destructive" 
          className="text-white"
          onClick={onBatchOffHire}
          disabled={isProcessing || !anyItemsPicked}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Skila vöru
        </Button>
      </div>

      <ItemTable 
        items={displayedOffHiredItems}
        showContractColumn={false}
        showCountColumn={showCountColumn}
        showActions={false}
        onCountChange={onCountChange}
        pickedItems={pickedItems}
        onTogglePicked={onTogglePicked}
        onOpenDescriptionDialog={onOpenDescriptionDialog}
        hideMerkjaButtons={true}
      />
    </div>
  );
};

export default OffHiredItemsList;
