
import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Check, AlertCircle } from "lucide-react";
import { RentalItem } from "@/types/contract";
import { toast } from "sonner";
import { getItemCount } from "@/utils/countUtils";

// Import our new components
import DescriptionDialog from "./dialog/DescriptionDialog";
import ItemDescriptionsList from "./items/ItemDescriptionsList";
import TiltektItemsList from "./items/TiltektItemsList";
import ReadyForPickItems from "./items/ReadyForPickItems";

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

interface ItemDescription {
  id: string;
  text: string;
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
  
  // State for description dialog
  const [isDescriptionDialogOpen, setIsDescriptionDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<RentalItem | null>(null);
  const [description, setDescription] = useState("");
  const [itemDescriptions, setItemDescriptions] = useState<ItemDescription[]>([]);
  
  // Filter tiltektItems to separate "Tiltekt" items from "Tilbúið til afhendingar" items
  const tiltektOnlyItems = tiltektItems.filter(item => 
    item.status === "Tiltekt"
  );
  
  const readyForDeliveryItems = tiltektItems.filter(item => 
    item.status === "Tilbúið til afhendingar" || item.status === "Vara afhent"
  );
  
  // Get description for an item
  const getItemDescription = (itemId: string): string => {
    const desc = itemDescriptions.find(d => d.id === itemId);
    return desc ? desc.text : "";
  };
  
  // Handle status click for a single item
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
      
      toast.success("Vara uppfærð í 'Tilbúið til afhendingar'", {
        description: `${item.itemName} (${item.serialNumber}) hefur verið merkt sem tilbúin til afhendingar og skýrsla send.`,
        duration: 5000,
      });
    }
  };
  
  // Handle batch update of items with counts > 0
  const handleBatchStatusUpdate = () => {
    let updatedCount = 0;
    
    tiltektItems.forEach(item => {
      // Only process items that are in "Tiltekt" status
      if (item.status === "Tiltekt") {
        const count = getItemCount(item.id);
        if (count > 0 && onStatusUpdate) {
          onStatusUpdate(item, count);
          updatedCount++;
        }
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
  
  // Handler for opening the description dialog
  const handleOpenDescriptionDialog = (item: RentalItem) => {
    setCurrentItem(item);
    // Load existing description if any
    const existingDescription = getItemDescription(item.id);
    setDescription(existingDescription);
    setIsDescriptionDialogOpen(true);
  };
  
  // Handler for saving the description
  const handleSaveDescription = () => {
    if (!currentItem) return;
    
    // Update or add new description
    setItemDescriptions(prev => {
      const existingIndex = prev.findIndex(d => d.id === currentItem.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { id: currentItem.id, text: description };
        return updated;
      } else {
        return [...prev, { id: currentItem.id, text: description }];
      }
    });
    
    setIsDescriptionDialogOpen(false);
    
    // Show success toast
    if (description.trim()) {
      toast.success("Athugasemd vistuð", {
        description: `Athugasemdin fyrir ${currentItem.itemName} hefur verið vistuð.`,
      });
    } else {
      toast.info("Athugasemd fjarlægð", {
        description: `Athugasemdin fyrir ${currentItem.itemName} hefur verið fjarlægð.`,
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
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isTiltektCompleted && (
          <div className="mb-4 p-2 bg-yellow-500/20 border border-yellow-500/30 rounded flex items-center">
            <AlertCircle className="h-4 w-4 mr-2 text-yellow-500" />
            <span className="text-sm text-yellow-500">Tiltekt hefur þegar verið lokið fyrir þennan samning.</span>
          </div>
        )}
      
        {readyForPickItems.length === 0 && tiltektOnlyItems.length === 0 && readyForDeliveryItems.length === 0 ? (
          <div className="text-center py-6 text-gray-500">Engar vörur eru tilbúnar fyrir tiltekt</div>
        ) : (
          <div className="space-y-8">
            {readyForPickItems.length > 0 && (
              <ReadyForPickItems
                readyForPickItems={readyForPickItems}
                pickedItems={pickedItems}
                onTogglePicked={onTogglePicked}
                onCompletePickup={onCompletePickup}
                showCountColumn={showCountColumn}
                onCountChange={onCountChange}
                hasPickedItems={hasPickedItems}
                isTiltektCompleted={isTiltektCompleted}
              />
            )}

            {tiltektOnlyItems.length > 0 && (
              <TiltektItemsList
                displayedTiltektItems={tiltektOnlyItems}
                onOpenDescriptionDialog={handleOpenDescriptionDialog}
                onBatchStatusUpdate={handleBatchStatusUpdate}
                onStatusClick={handleStatusClick}
                onCountChange={onCountChange}
                showCountColumn={showCountColumn}
              />
            )}
            
            {readyForDeliveryItems.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Vörur tilbúnar til afhendingar</h3>
                <ItemTable 
                  items={readyForDeliveryItems}
                  showContractColumn={false}
                  showCountColumn={showCountColumn}
                  onCountChange={onCountChange}
                />
              </div>
            )}
            
            <ItemDescriptionsList
              itemDescriptions={itemDescriptions}
              displayedItems={[...tiltektOnlyItems, ...readyForDeliveryItems]}
              onEditDescription={handleOpenDescriptionDialog}
            />
          </div>
        )}
      </CardContent>
      
      {/* Description Dialog */}
      <DescriptionDialog
        isOpen={isDescriptionDialogOpen}
        onOpenChange={setIsDescriptionDialogOpen}
        currentItem={currentItem}
        description={description}
        setDescription={setDescription}
        onSave={handleSaveDescription}
      />
    </Card>
  );
};

// Add missing import
import ItemTable from "@/components/ItemTable";

export default TiltektTab;
