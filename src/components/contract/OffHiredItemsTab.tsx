
import React, { useState } from "react";
import { RentalItem } from "@/types/contract";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import DescriptionDialog from "./dialog/DescriptionDialog";
import ItemDescriptionsList from "./items/ItemDescriptionsList";
import OffHiredItemsList from "./items/OffHiredItemsList";
import { useOffHireItem } from "@/mutations/useOffHireItem";
import { toast } from "sonner";

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
  contractId?: string;
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
  anyItemsPicked,
  contractId
}) => {
  // Filter out items that have been processed
  const displayedItems = offHiredItems.filter(item => !processedItems.includes(item.id));
  
  // Use our mutation hook
  const offHireMutation = useOffHireItem(contractId);
  
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
  
  // Handler for batch off-hire with React Query
  const handleBatchOffHireItems = () => {
    // Get only picked items
    const itemsToOffHire = displayedItems.filter(item => pickedItems[item.id]);
    
    if (itemsToOffHire.length === 0) {
      toast.error("Engar vörur valdar", {
        description: "Veldu vörur til að skila áður en þú ýtir á 'Skila vöru'.",
      });
      return;
    }
    
    // Process each item
    const today = new Date().toISOString().split('T')[0];
    let successCount = 0;
    let failCount = 0;
    
    itemsToOffHire.forEach(item => {
      const itemDesc = getItemDescription(item.id);
      const reason = itemDesc ? 
        `Off-hire from Tiltektarkerfi: ${itemDesc}` : 
        "Off-hire from Tiltektarkerfi";
      
      offHireMutation.mutate(
        { itemId: item.id, date: today, reason },
        {
          onSuccess: () => {
            successCount++;
            // Still call the original handler for UI updates
            handleOffHireClick(item);
          },
          onError: () => {
            failCount++;
          }
        }
      );
    });
    
    if (successCount > 0) {
      toast.success(`${successCount} vörur merktar úr leigu`, {
        description: `${successCount} vörur hafa verið merktar sem 'Úr leigu'.`,
      });
    }
    
    if (failCount > 0) {
      toast.error(`Villa við að merkja ${failCount} vörur úr leigu`, {
        description: "Ekki tókst að merkja allar vörur úr leigu. Vinsamlegast reyndu aftur.",
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
        <CardTitle className="text-xl font-semibold text-white">Úr leigu</CardTitle>
      </CardHeader>
      <CardContent>
        {displayedItems.length === 0 ? (
          <div className="text-center py-6 text-gray-500">Engar vörur í þessum flokki</div>
        ) : (
          <div className="space-y-8">
            <OffHiredItemsList
              displayedOffHiredItems={displayedItems}
              onOpenDescriptionDialog={handleOpenDescriptionDialog}
              onBatchOffHire={handleBatchOffHireItems}
              pickedItems={pickedItems}
              onTogglePicked={onTogglePicked}
              isProcessing={processingItemId !== null || offHireMutation.isPending}
              anyItemsPicked={anyItemsPicked}
              onCountChange={onCountChange}
              showCountColumn={showCountColumn}
            />
            
            <ItemDescriptionsList
              itemDescriptions={itemDescriptions}
              displayedItems={displayedItems}
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

export default OffHiredItemsTab;
