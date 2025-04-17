
import { useState } from "react";
import { RentalItem } from "@/types/contract";
import { useStatusNotifications } from "@/hooks/useStatusNotifications";
import { useItemStatusUpdater } from "@/hooks/useItemStatusUpdater";

export function useTiltektHandler(
  rentalItems: RentalItem[],
  onRentalItemsChange: (newItems: RentalItem[]) => void,
  itemCounts: Record<string, number>
) {
  const [pickedItems, setPickedItems] = useState<Record<string, boolean>>({});
  const { notifySuccess, notifyInfo } = useStatusNotifications();
  const { updateMultipleItemStatus } = useItemStatusUpdater(rentalItems, onRentalItemsChange);

  const toggleItemPicked = (itemId: string) => {
    setPickedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleCompletePickup = () => {
    const pickedCount = Object.values(pickedItems).filter(Boolean).length;
    const pickedItemIds = Object.entries(pickedItems)
      .filter(([_, isPicked]) => isPicked)
      .map(([id]) => id);
    
    notifySuccess("Tiltekt lokið", 
      `${pickedCount} vörur merktar sem tilbúnar til afhendingar.`
    );
    
    // Create additional properties for each picked item
    const additionalProps: Record<string, Partial<RentalItem>> = {};
    pickedItemIds.forEach(id => {
      additionalProps[id] = { count: itemCounts[id] || 1 };
    });
    
    // Update all picked items at once
    updateMultipleItemStatus(pickedItemIds, "Tilbúið til afhendingar", additionalProps);
    
    setPickedItems({});
    
    // Send notification (simulated)
    notifyInfo("Tilkynning send", 
      "Söluaðili hefur verið látinn vita að vörur séu tilbúnar."
    );
  };

  return {
    pickedItems,
    toggleItemPicked,
    handleCompletePickup
  };
}
