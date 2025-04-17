
import { RentalItem } from "@/types/contract";

export function useItemStatusUpdater(
  rentalItems: RentalItem[],
  onRentalItemsChange: (newItems: RentalItem[]) => void
) {
  const updateItemStatus = (itemId: string, newStatus: string, additionalProps?: Partial<RentalItem>) => {
    onRentalItemsChange(
      rentalItems.map(item => 
        item.id === itemId 
          ? { ...item, status: newStatus, ...additionalProps } 
          : item
      )
    );
  };
  
  const updateMultipleItemStatus = (itemIds: string[], newStatus: string, additionalProps?: Record<string, Partial<RentalItem>>) => {
    onRentalItemsChange(
      rentalItems.map(item => {
        if (itemIds.includes(item.id)) {
          const specificProps = additionalProps?.[item.id] || {};
          return { ...item, status: newStatus, ...specificProps };
        }
        return item;
      })
    );
  };
  
  return {
    updateItemStatus,
    updateMultipleItemStatus
  };
}
