
import { useMemo } from "react";
import { RentalItem } from "@/types/contract";

export function useFilteredItems(rentalItems: RentalItem[]) {
  const activeItems = useMemo(() => rentalItems.filter(item => 
    item.status === "Í leigu" || item.status === "On Rent"
  ), [rentalItems]);
  
  const readyForPickItems = useMemo(() => rentalItems.filter(item => 
    item.status !== "Tiltekt" && 
    item.status !== "Úr leiga" && 
    item.status !== "Off-Hired" &&
    item.status !== "Í leigu" &&
    item.status !== "On Rent" &&
    item.status !== "Tilbúið til afhendingar"
  ), [rentalItems]);
  
  const tiltektItems = useMemo(() => rentalItems.filter(item => 
    item.status === "Tiltekt" || item.status === "Tilbúið til afhendingar"
  ), [rentalItems]);
  
  const offHiredItems = useMemo(() => rentalItems.filter(item => 
    item.status === "Úr leiga" || item.status === "Off-Hired"
  ), [rentalItems]);

  return {
    activeItems,
    readyForPickItems,
    tiltektItems,
    offHiredItems
  };
}
