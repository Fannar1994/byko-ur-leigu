
import { useState } from "react";
import { RentalItem } from "@/types/contract";
import { performOffHire } from "@/services/contractService";
import { useStatusNotifications } from "@/hooks/useStatusNotifications";
import { useItemSelection } from "@/hooks/useItemSelection";
import { useItemStatusUpdater } from "@/hooks/useItemStatusUpdater";

export function useOffHireHandler(
  rentalItems: RentalItem[],
  onRentalItemsChange: (newItems: RentalItem[]) => void
) {
  const [offHireDialogOpen, setOffHireDialogOpen] = useState(false);
  const { notifySuccess, notifyInfo, notifyError } = useStatusNotifications();
  const { selectedItem, processingItemId, selectItem, startProcessing, endProcessing } = useItemSelection();
  const { updateItemStatus } = useItemStatusUpdater(rentalItems, onRentalItemsChange);

  const handleOffHireClick = (item: RentalItem) => {
    selectItem(item);
    setOffHireDialogOpen(true);
  };

  const handleOffHireConfirm = async (itemId: string, noCharge: boolean) => {
    setOffHireDialogOpen(false);
    startProcessing(itemId);
    
    try {
      const response = await performOffHire(itemId, noCharge);
      
      if (response.success) {
        // Update the item status
        updateItemStatus(itemId, "Tiltekt");
        
        notifySuccess("Aðgerð tókst", response.message);
        
        // Send notification (simulated)
        notifyInfo("Tilkynning send", "Leiguhugbúnaður hefur verið uppfærður með nýjum talningum.");
      } else {
        notifyError("Villa", response.message || "Ekki tókst að skila vöru.");
      }
    } catch (error) {
      let errorMessage = "Óþekkt villa kom upp.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      notifyError("Villa", errorMessage);
    } finally {
      endProcessing();
    }
  };

  return {
    offHireDialogOpen,
    selectedItem,
    processingItemId,
    handleOffHireClick,
    handleOffHireConfirm,
    setOffHireDialogOpen
  };
}
