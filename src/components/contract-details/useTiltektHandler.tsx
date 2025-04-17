
import { useState } from "react";
import { toast } from "sonner";
import { RentalItem } from "@/types/contract";

export function useTiltektHandler(
  rentalItems: RentalItem[],
  onRentalItemsChange: (newItems: RentalItem[]) => void,
  itemCounts: Record<string, number>
) {
  const [pickedItems, setPickedItems] = useState<Record<string, boolean>>({});

  const toggleItemPicked = (itemId: string) => {
    setPickedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleCompletePickup = () => {
    const pickedCount = Object.values(pickedItems).filter(Boolean).length;
    
    toast.success("Tiltekt lokið", {
      description: `${pickedCount} vörur merktar sem tilbúnar til afhendingar.`,
    });
    
    // Update rental items with new status and counts
    onRentalItemsChange(
      rentalItems.map(item => {
        if (pickedItems[item.id]) {
          return { 
            ...item, 
            status: "Tilbúið til afhendingar",
            count: itemCounts[item.id] || 1
          };
        }
        return item;
      })
    );
    
    setPickedItems({});
    
    // Send notification (simulated)
    toast.info("Tilkynning send", {
      description: "Söluaðili hefur verið látinn vita að vörur séu tilbúnar.",
    });
  };

  return {
    pickedItems,
    toggleItemPicked,
    handleCompletePickup
  };
}
