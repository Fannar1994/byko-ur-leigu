
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { RentalItem } from "@/types/contract";
import { toast } from "sonner";
import ItemTable from "@/components/ItemTable";

interface PickableItemsSectionProps {
  readyForPickItems: RentalItem[];
  tiltektItems: RentalItem[];
  pickedItems: Record<string, boolean>;
  toggleItemPicked: (itemId: string) => void;
  handleCompletePickup: () => void;
  onItemCountChange?: (itemId: string, count: number) => void;
}

const PickableItemsSection: React.FC<PickableItemsSectionProps> = ({
  readyForPickItems,
  tiltektItems,
  pickedItems,
  toggleItemPicked,
  handleCompletePickup,
  onItemCountChange
}) => {
  const handlePickupConfirm = () => {
    const pickedCount = Object.values(pickedItems).filter(Boolean).length;
    
    if (pickedCount === 0) {
      toast.error("Engar vörur valdar", {
        description: "Þú verður að velja að minnsta kosti eina vöru til að staðfesta tiltekt.",
      });
      return;
    }
    
    handleCompletePickup();
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-white flex justify-between items-center">
          <span>Tiltekt</span>
          {readyForPickItems.length > 0 && (
            <Button 
              className="ml-auto" 
              onClick={handlePickupConfirm}
              disabled={!Object.values(pickedItems).some(Boolean)}
            >
              <Check className="h-4 w-4 mr-2" /> Staðfesta tiltekt
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
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
                  onTogglePicked={toggleItemPicked}
                  pickedItems={pickedItems}
                  onItemCountChange={onItemCountChange}
                />
              </div>
            )}

            {tiltektItems.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Vörur tilbúnar til afhendingar</h3>
                <ItemTable 
                  items={tiltektItems} 
                  showContractColumn={false}
                  onItemCountChange={onItemCountChange}
                />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PickableItemsSection;
