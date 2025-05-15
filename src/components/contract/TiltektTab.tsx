
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, AlertCircle } from "lucide-react";
import ItemTable from "../ItemTable";
import { RentalItem } from "@/types/contract";
import { toast } from "sonner";

interface TiltektTabProps {
  readyForPickItems: RentalItem[];
  tiltektItems: RentalItem[];
  pickedItems: Record<string, boolean>;
  onTogglePicked: (itemId: string) => void;
  onCompletePickup: () => void;
  showCountColumn?: boolean;
  onCountChange?: (itemId: string, count: number) => void;
  onStatusUpdate?: (itemId: string, newStatus: "Tiltekt" | "Úr leiga" | "Í leigu" | "On Rent" | "Off-Hired" | "Pending Return" | "Tilbúið til afhendingar", count: number) => void;
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
  
  const handleStatusClick = (item: RentalItem, count: number) => {
    if (count <= 0) {
      toast.error("Villa", {
        description: "Þú verður að setja inn talningar áður en þú setur vöruna í leigu.",
      });
      return;
    }
    
    if (onStatusUpdate) {
      onStatusUpdate(item.id, "Í leigu", count);
      toast.success("Aðgerð tókst", {
        description: `${item.itemName} sett í leigu með ${count} talningar.`,
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
