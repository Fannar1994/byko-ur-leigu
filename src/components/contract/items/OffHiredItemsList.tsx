
import React from "react";
import { Check, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import ItemTable from "@/components/ItemTable";
import { RentalItem } from "@/types/contract";
import { getItemCount } from "@/utils/countUtils";

interface OffHiredItemsListProps {
  displayedOffHiredItems: RentalItem[];
  onOpenDescriptionDialog: (item: RentalItem) => void;
  onBatchOffHire: () => void;
  pickedItems: Record<string, boolean>;
  onTogglePicked: (itemId: string) => void;
  isProcessing: boolean;
  anyItemsPicked: boolean;
  onCountChange?: (itemId: string, count: number) => void;
  showCountColumn?: boolean;
}

const OffHiredItemsList: React.FC<OffHiredItemsListProps> = ({
  displayedOffHiredItems,
  onOpenDescriptionDialog,
  onBatchOffHire,
  pickedItems,
  onTogglePicked,
  isProcessing,
  anyItemsPicked,
  onCountChange,
  showCountColumn = true,
}) => {
  if (displayedOffHiredItems.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-white">Vörur úr leigu</h3>
        <div className="flex space-x-2">
          <Button
            onClick={() => {
              const item = displayedOffHiredItems[0];
              onOpenDescriptionDialog(item);
            }}
            variant="outline"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <FileText className="h-4 w-4 mr-2" /> Bæta við athugasemd
          </Button>
          <Button
            onClick={onBatchOffHire}
            variant="secondary"
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={!anyItemsPicked || isProcessing}
          >
            <Check className="h-4 w-4 mr-2" /> Skila vöru
          </Button>
        </div>
      </div>
      <div className="mb-2 p-2 bg-gray-700 rounded flex items-center justify-center">
        <FileText className="h-4 w-4 mr-2 text-gray-300" />
        <span className="text-sm text-gray-300">
          Veldu vörur til að skila og smelltu á "Skila vöru" til að staðfesta.
        </span>
      </div>
      <ItemTable
        items={displayedOffHiredItems}
        showContractColumn={false}
        showCountColumn={showCountColumn}
        onCountChange={onCountChange}
        onTogglePicked={onTogglePicked}
        pickedItems={pickedItems}
      />
    </div>
  );
};

export default OffHiredItemsList;
