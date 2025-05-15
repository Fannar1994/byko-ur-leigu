
import React from "react";
import ItemTable from "@/components/ItemTable";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { RentalItem } from "@/types/contract";

interface ReadyForPickItemsProps {
  readyForPickItems: RentalItem[];
  pickedItems: Record<string, boolean>;
  onTogglePicked: (itemId: string) => void;
  onCompletePickup: () => void;
  showCountColumn?: boolean;
  onCountChange?: (itemId: string, count: number) => void;
  hasPickedItems: boolean;
  isTiltektCompleted?: boolean;
}

const ReadyForPickItems: React.FC<ReadyForPickItemsProps> = ({
  readyForPickItems,
  pickedItems,
  onTogglePicked,
  onCompletePickup,
  showCountColumn = true,
  onCountChange,
  hasPickedItems,
  isTiltektCompleted = false,
}) => {
  if (readyForPickItems.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-white mb-4">Vörur sem þarf að taka til</h3>
        {!isTiltektCompleted && (
          <Button
            onClick={onCompletePickup}
            disabled={!hasPickedItems || isTiltektCompleted}
          >
            <Check className="h-4 w-4 mr-2" /> Staðfesta tiltekt
          </Button>
        )}
      </div>
      <ItemTable
        items={readyForPickItems}
        showContractColumn={false}
        onTogglePicked={!isTiltektCompleted ? onTogglePicked : undefined}
        pickedItems={pickedItems}
        showCountColumn={showCountColumn}
        onCountChange={!isTiltektCompleted ? onCountChange : undefined}
      />
    </div>
  );
};

export default ReadyForPickItems;
