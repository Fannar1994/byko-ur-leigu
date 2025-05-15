
import React, { useState } from "react";
import { RentalItem } from "@/types/contract";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import DescriptionDialog from "./dialog/DescriptionDialog";
import ItemDescriptionsList from "./items/ItemDescriptionsList";
import OffHiredItemsList from "./items/OffHiredItemsList";

interface OffHiredItemsTabProps {
  offHiredItems: RentalItem[];
  handleOffHireClick: (item: RentalItem) => void;
  handleBatchOffHire: (items: RentalItem[]) => void;
  processingItemId: string | null;
  showCountColumn?: boolean;
  onCountChange?: (itemId: string, count: number) => void;
  processedItems?: string[];
  pickedItems: Record<string, boolean>;
  onTogglePicked: (itemId: string) => void;
  anyItemsPicked: boolean;
}

interface ItemDescription {
  id: string;
  text: string;
}

const OffHiredItemsTab: React.FC<OffHiredItemsTabProps> = ({ 
  offHiredItems,
  handleOffHireClick,
  handleBatchOffHire,
  processingItemId,
  showCountColumn = true,
  onCountChange,
  processedItems = [],
  pickedItems,
  onTogglePicked,
  anyItemsPicked
}) => {
  // Filter out items that have been processed
  const displayedItems = offHiredItems.filter(item => !processedItems.includes(item.id));
  
  // State for description dialog
  const [isDescriptionDialogOpen, setIsDescriptionDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<RentalItem | null>(null);
  const [description, setDescription] = useState("");
  const [itemDescriptions, setItemDescriptions] = useState<ItemDescription[]>([]);
  
  // Get description for an item
  const getItemDescription = (itemId: string): string => {
    const desc = itemDescriptions.find(d => d.id === itemId);
    return desc ? desc.text : "";
  };
  
  // Handler for batch off-hire
  const handleBatchOffHireItems = () => {
    handleBatchOffHire(displayedItems);
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
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-white">Vörur úr leigu</CardTitle>
      </CardHeader>
      <CardContent>
        {displayedItems.length === 0 ? (
          <div className="text-center py-6 text-gray-500">Engar vörur í þessum flokki</div>
        ) : (
          <OffHiredItemsList
            displayedOffHiredItems={displayedItems}
            onOpenDescriptionDialog={handleOpenDescriptionDialog}
            onBatchOffHire={handleBatchOffHireItems}
            pickedItems={pickedItems}
            onTogglePicked={onTogglePicked}
            isProcessing={processingItemId !== null}
            anyItemsPicked={anyItemsPicked}
            onCountChange={onCountChange}
            showCountColumn={showCountColumn}
          />
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

export default OffHiredItemsTab;
