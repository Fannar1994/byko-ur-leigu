import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, AlertCircle } from "lucide-react";
import ItemTable from "../ItemTable";
import { RentalItem } from "@/types/contract";
import { toast } from "sonner";
import { getItemCount } from "@/utils/countUtils";

interface TiltektTabProps {
  readyForPickItems: RentalItem[];
  tiltektItems: RentalItem[];
  pickedItems: Record<string, boolean>;
  onTogglePicked: (itemId: string) => void;
  onCompletePickup: () => void;
  showCountColumn?: boolean;
  onCountChange?: (itemId: string, count: number) => void;
  onStatusUpdate?: (item: RentalItem, count: number) => void;
  isTiltektCompleted?: boolean;
}

const TiltektTab: React.FC<TiltektTabProps> = ({ 
  readyForPickItems, 
  tiltektItems, 
  pickedItems, 
  onTogglePicked,
  onCompletePickup,
  showCountColumn = true,
  onCountChange,
  onStatusUpdate,
  isTiltektCompleted = false
}) => {
  const hasPickedItems = Object.values(pickedItems).some(Boolean);
  
  // Keep track of item counts to know which ones to update
  const [itemCounts, setItemCounts] = useState<Record<string, number>>({});
  
  const handleStatusClick = (item: RentalItem, count: number) => {
    if (count <= 0) {
      toast.error("Villa", {
        description: "Þú verður að setja inn talningar áður en þú setur vöruna í leigu.",
      });
      return;
    }
    
    if (onStatusUpdate) {
      console.log(`TiltektTab: Calling onStatusUpdate for item ${item.id} with count ${count}`);
      onStatusUpdate(item, count);
      
      // Show a more prominent toast notification
      toast.success("Vara uppfærð í 'Tilbúið til afhendingar'", {
        description: `${item.itemName} (${item.serialNumber}) hefur verið merkt sem tilbúin til afhendingar og skýrsla send.`,
        duration: 5000,
      });
    }
  };
  
  // New function to handle batch update of items with counts > 0
  const handleBatchStatusUpdate = () => {
    let updatedCount = 0;
    
    tiltektItems.forEach(item => {
      const count = getItemCount(item.id);
      if (count > 0 && onStatusUpdate) {
        onStatusUpdate(item, count);
        updatedCount++;
      }
    });
    
    if (updatedCount > 0) {
      toast.success(`${updatedCount} vörur uppfærðar`, {
        description: `${updatedCount} vörur hafa verið merktar sem "Vara afhent" og skýrslur sendar.`,
        duration: 5000,
      });
    } else {
      toast.error("Engar vörur uppfærðar", {
        description: "Þú verður að setja inn talningar fyrir vörur áður en þú getur merkt þær sem afhentar.",
      });
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-white flex justify-between items-center">
          <span>Tiltekt</span>
          {isTiltektCompleted && (
            <div className="flex items-center text-green-500 text-sm">
              <Check className="h-4 w-4 mr-1" />
              <span>Tiltekt lokið</span>
            </div>
          )}
          {readyForPickItems.length > 0 && !isTiltektCompleted && (
            <Button 
              className="ml-auto" 
              onClick={onCompletePickup}
              disabled={!hasPickedItems || isTiltektCompleted}
            >
              <Check className="h-4 w-4 mr-2" /> Staðfesta tiltekt
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isTiltektCompleted && (
          <div className="mb-4 p-2 bg-yellow-500/20 border border-yellow-500/30 rounded flex items-center">
            <AlertCircle className="h-4 w-4 mr-2 text-yellow-500" />
            <span className="text-sm text-yellow-500">Tiltekt hefur þegar verið lokið fyrir þennan samning.</span>
          </div>
        )}
      
        {readyForPickItems.length === 0 && tiltektItems.length === 0 ? (
          <div className="text-center py-6 text-gray-500">Engar vörur eru tilbúnar fyrir tiltekt</div>
        ) : (
          <div className="space-y-8">
            {readyForPickItems.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Vörur sem þarf að taka til</h3>
                <ItemTable 
                  items={readyForPickItems} 
                  showContractColumn={false}
                  onTogglePicked={!isTiltektCompleted ? onTogglePicked : undefined}
                  pickedItems={pickedItems}
                  showCountColumn={showCountColumn}
                  onCountChange={!isTiltektCompleted ? onCountChange : undefined}
                />
              </div>
            )}

            {tiltektItems.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Vörur tilbúnar til afhendingar</h3>
                <div className="mb-2 p-2 bg-gray-700 rounded flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-gray-300" />
                  <span className="text-sm text-gray-300">
                    Smelltu á "Tiltekt" merkið til að færa vöru í "Tilbúið til afhendingar". 
                    Settu inn talningu fyrst og smelltu svo á merkið.
                  </span>
                </div>
                <ItemTable 
                  items={tiltektItems} 
                  showContractColumn={false}
                  showCountColumn={showCountColumn}
                  onCountChange={onCountChange}
                  onStatusClick={handleStatusClick}
                />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TiltektTab;
