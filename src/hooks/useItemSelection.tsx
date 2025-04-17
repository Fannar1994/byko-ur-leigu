
import { useState } from "react";
import { RentalItem } from "@/types/contract";

export function useItemSelection() {
  const [selectedItem, setSelectedItem] = useState<RentalItem | null>(null);
  const [processingItemId, setProcessingItemId] = useState<string | null>(null);
  
  const selectItem = (item: RentalItem) => {
    setSelectedItem(item);
  };
  
  const startProcessing = (itemId: string) => {
    setProcessingItemId(itemId);
  };
  
  const endProcessing = () => {
    setProcessingItemId(null);
  };
  
  const clearSelection = () => {
    setSelectedItem(null);
  };
  
  return {
    selectedItem,
    processingItemId,
    selectItem,
    startProcessing,
    endProcessing,
    clearSelection
  };
}
