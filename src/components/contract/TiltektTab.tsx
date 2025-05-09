
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import ItemTable from "../ItemTable";
import { RentalItem } from "@/types/contract";

interface TiltektTabProps {
  readyForPickItems: RentalItem[];
  tiltektItems: RentalItem[];
  pickedItems: Record<string, boolean>;
  onTogglePicked: (itemId: string) => void;
  onCompletePickup: () => void;
}

const TiltektTab: React.FC<TiltektTabProps> = ({ 
  readyForPickItems, 
  tiltektItems, 
  pickedItems, 
  onTogglePicked,
  onCompletePickup 
}) => {
  const hasPickedItems = Object.values(pickedItems).some(Boolean);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-white flex justify-between items-center">
          <span>Tiltekt</span>
          {readyForPickItems.length > 0 && (
            <Button 
              className="ml-auto" 
              onClick={onCompletePickup}
              disabled={!hasPickedItems}
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
                  onTogglePicked={onTogglePicked}
                  pickedItems={pickedItems}
                  showCountColumn={false}
                />
              </div>
            )}

            {tiltektItems.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Vörur tilbúnar til afhendingar</h3>
                <ItemTable 
                  items={tiltektItems} 
                  showContractColumn={false}
                  showCountColumn={false}
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
