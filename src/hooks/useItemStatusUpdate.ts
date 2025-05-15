
import { useState } from "react";
import { RentalItem } from "@/types/contract";
import { setItemCount } from "@/utils/countUtils";
import { toast } from "sonner";

export function useItemStatusUpdate(setLocalRentalItems: React.Dispatch<React.SetStateAction<RentalItem[]>>) {
  // Handle item status updates
  const handleItemStatusUpdate = (
    itemId: string | string[], 
    newStatus: "On Rent" | "Off-Hired" | "Pending Return" | "Í leigu" | "Tiltekt" | "Úr leiga" | "Tilbúið til afhendingar" | "Vara afhent"
  ) => {
    setLocalRentalItems(prevItems => {
      if (Array.isArray(itemId)) {
        return prevItems.map(item => 
          itemId.includes(item.id) 
            ? { ...item, status: newStatus as any } 
            : item
        );
      } else {
        return prevItems.map(item => 
          item.id === itemId 
            ? { ...item, status: newStatus as any } 
            : item
        );
      }
    });

    // Show toast notification when item status is updated
    if (newStatus === "Tilbúið til afhendingar") {
      // This additional toast provides a system-level confirmation
      toast.success("Staða uppfærð", {
        description: "Vara hefur verið merkt sem tilbúin til afhendingar og skýrsla hefur verið send.",
      });
    } else if (newStatus === "Vara afhent") {
      toast.success("Staða uppfærð", {
        description: "Vara hefur verið merkt sem afhent og skýrsla hefur verið send.",
      });
    }
  };

  // New function to handle status update with count
  const handleItemStatusUpdateWithCount = (itemId: string, newStatus: string, count: number) => {
    // Update the item status first
    handleItemStatusUpdate(itemId, newStatus as any);
    // Store the count in our utility
    setItemCount(itemId, count);
    console.log(`Item ${itemId} status changed to ${newStatus} with count ${count}`);
  };

  return {
    handleItemStatusUpdate,
    handleItemStatusUpdateWithCount
  };
}
