
import { useState } from "react";
import { toast } from "sonner";
import { RentalItem } from "@/types/contract";
import { performOffHire } from "@/services/contractService";

export function useOffHireHandler(
  rentalItems: RentalItem[],
  onRentalItemsChange: (newItems: RentalItem[]) => void
) {
  const [offHireDialogOpen, setOffHireDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RentalItem | null>(null);
  const [processingItemId, setProcessingItemId] = useState<string | null>(null);

  const handleOffHireClick = (item: RentalItem) => {
    setSelectedItem(item);
    setOffHireDialogOpen(true);
  };

  const handleOffHireConfirm = async (itemId: string, noCharge: boolean) => {
    setOffHireDialogOpen(false);
    setProcessingItemId(itemId);
    
    try {
      const response = await performOffHire(itemId, noCharge);
      
      if (response.success) {
        // Update the item status and its count
        onRentalItemsChange(
          rentalItems.map(item => 
            item.id === itemId 
              ? { ...item, status: "Tiltekt" } 
              : item
          )
        );
        
        toast.success("Aðgerð tókst", {
          description: `${response.message}`,
        });
        
        // Send notification (simulated)
        toast.info("Tilkynning send", {
          description: "Leiguhugbúnaður hefur verið uppfærður með nýjum talningum.",
        });
      } else {
        toast.error("Villa", {
          description: response.message || "Ekki tókst að skila vöru.",
        });
      }
    } catch (error) {
      let errorMessage = "Óþekkt villa kom upp.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast.error("Villa", {
        description: errorMessage,
      });
    } finally {
      setProcessingItemId(null);
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
