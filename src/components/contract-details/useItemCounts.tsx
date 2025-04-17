
import { useState, useEffect } from "react";
import { RentalItem } from "@/types/contract";

export function useItemCounts(rentalItems: RentalItem[]) {
  const [itemCounts, setItemCounts] = useState<Record<string, number>>({});
  
  // Initialize counts
  useEffect(() => {
    const initialCounts: Record<string, number> = {};
    rentalItems.forEach(item => {
      initialCounts[item.id] = item.count || 1;
    });
    setItemCounts(initialCounts);
  }, [rentalItems]);

  const handleItemCountChange = (itemId: string, count: number) => {
    setItemCounts(prev => ({
      ...prev,
      [itemId]: count
    }));
  };

  return {
    itemCounts,
    handleItemCountChange
  };
}
