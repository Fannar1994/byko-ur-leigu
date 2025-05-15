
import React from "react";
import { AlertCircle, FileText, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import ItemTable from "@/components/ItemTable";
import { RentalItem } from "@/types/contract";
import { toast } from "sonner";
import { getItemCount } from "@/utils/countUtils";

interface TiltektItemsListProps {
  displayedTiltektItems: RentalItem[];
  onOpenDescriptionDialog: (item: RentalItem) => void;
  onBatchStatusUpdate: () => void;
  onStatusClick: (item: RentalItem, count: number) => void;
  onCountChange?: (itemId: string, count: number) => void;
  showCountColumn?: boolean;
}

const TiltektItemsList: React.FC<TiltektItemsListProps> = ({
  displayedTiltektItems,
  onOpenDescriptionDialog,
  onBatchStatusUpdate,
  onStatusClick,
  onCountChange,
  showCountColumn = true,
}) => {
  if (displayedTiltektItems.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-white">Vörur tilbúnar til afhendingar</h3>
        <div className="flex space-x-2">
          <Button
            onClick={() => {
              const item = displayedTiltektItems[0];
              onOpenDescriptionDialog(item);
            }}
            variant="outline"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <FileText className="h-4 w-4 mr-2" /> Bæta við athugasemd
          </Button>
          <Button
            onClick={onBatchStatusUpdate}
            variant="secondary"
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Check className="h-4 w-4 mr-2" /> Merkja taldar vörur afhentar
          </Button>
        </div>
      </div>
      <div className="mb-2 p-2 bg-gray-700 rounded flex items-center justify-center">
        <AlertCircle className="h-4 w-4 mr-2 text-gray-300" />
        <span className="text-sm text-gray-300">
          Smelltu á "Taktu mynd" til að færa vöru í "Tilbúið til afhendingar".
          Settu inn talningu fyrst og smelltu svo á merkið.
        </span>
      </div>
      <ItemTable
        items={displayedTiltektItems}
        showContractColumn={false}
        showCountColumn={showCountColumn}
        onCountChange={onCountChange}
        onStatusClick={onStatusClick}
      />
    </div>
  );
};

export default TiltektItemsList;
