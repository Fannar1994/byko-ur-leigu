
import { useMemo } from "react";
import { RentalItem } from "@/types/contract";

export function useFilteredItems(rentalItems: RentalItem[]) {
  // Filter active items (Í leigu/On Rent)
  const activeItems = useMemo(() => rentalItems.filter(item => 
    item.status === "Í leigu" || item.status === "On Rent"
  ), [rentalItems]);
  
  // Items that need to be picked - make sure to EXCLUDE all statuses that should be in other categories
  const readyForPickItems = useMemo(() => rentalItems.filter(item => 
    item.status !== "Tiltekt" && 
    item.status !== "Úr leiga" && 
    item.status !== "Off-Hired" &&
    item.status !== "Í leigu" &&
    item.status !== "On Rent" &&
    item.status !== "Tilbúið til afhendingar" &&
    item.status !== "Vara afhent"
  ), [rentalItems]);
  
  // Include both "Tiltekt" and items ready for delivery in tiltektItems list
  const tiltektItems = useMemo(() => rentalItems.filter(item => 
    item.status === "Tiltekt" || 
    item.status === "Tilbúið til afhendingar" ||
    item.status === "Vara afhent"
  ), [rentalItems]);
  
  // Filter to ONLY show On Rent or Í leigu items in the offHiredItems list
  const offHiredItems = useMemo(() => rentalItems.filter(item => 
    item.status === "On Rent" || item.status === "Í leigu"
  ), [rentalItems]);

  return {
    activeItems,
    readyForPickItems,
    tiltektItems,
    offHiredItems
  };
}
