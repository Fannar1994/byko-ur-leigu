
import { useMemo } from "react";
import { RentalItem } from "@/types/contract";

export function useFilteredItems(rentalItems: RentalItem[]) {
  // Add sample items if there are none in the respective categories
  const enhancedItems = useMemo(() => {
    // Check if we need to add sample data
    const hasTiltektItems = rentalItems.some(item => 
      item.status === "Tiltekt" || item.status === "Tilbúið til afhendingar"
    );
    
    const hasOffHiredItems = rentalItems.some(item => 
      item.status === "Úr leiga" || item.status === "Off-Hired"
    );
    
    let result = [...rentalItems];
    
    // Only add mock data if we're on a contract page and have some items
    if (rentalItems.length > 0) {
      // Add sample Tiltekt items if none exist
      if (!hasTiltektItems) {
        const contractId = rentalItems[0].contractId;
        const timestamp = Date.now();
        
        result.push({
          id: `mock-tiltekt-1-${timestamp}`,
          contractId: contractId,
          itemName: "Rafmagnsborvél",
          category: "Handverkfæri",
          serialNumber: "TIL-12345",
          dueDate: new Date().toISOString().split('T')[0],
          rentalRate: 2500,
          status: "Tiltekt",
          location: "KOPA",
          department: "KOPA"
        });
        
        result.push({
          id: `mock-tiltekt-2-${timestamp}`,
          contractId: contractId,
          itemName: "Slípivél",
          category: "Handverkfæri",
          serialNumber: "TIL-67890",
          dueDate: new Date().toISOString().split('T')[0],
          rentalRate: 1800,
          status: "Tiltekt",  // Changed from "Tilbúið til afhendingar" to "Tiltekt" so user can see the transition
          location: "GRAN",
          department: "GRAN"
        });
      }
      
      // Add sample Úr leiga items if none exist
      if (!hasOffHiredItems) {
        const contractId = rentalItems[0].contractId;
        const timestamp = Date.now();
        
        result.push({
          id: `mock-offhired-1-${timestamp}`,
          contractId: contractId,
          itemName: "Háþrýstidæla",
          category: "Verkfæri",
          serialNumber: "URL-24680",
          dueDate: new Date().toISOString().split('T')[0],
          rentalRate: 3500,
          status: "Úr leiga",
          location: "KOPA",
          department: "KOPA"
        });
        
        result.push({
          id: `mock-offhired-2-${timestamp}`,
          contractId: contractId,
          itemName: "Stigapallur",
          category: "Verkfæri",
          serialNumber: "URL-98765",
          dueDate: new Date().toISOString().split('T')[0],
          rentalRate: 1800,
          status: "Off-Hired",
          location: "KEFL",
          department: "KEFL"
        });
      }
    }
    
    return result;
  }, [rentalItems]);
  
  const activeItems = useMemo(() => enhancedItems.filter(item => 
    item.status === "Í leigu" || item.status === "On Rent"
  ), [enhancedItems]);
  
  const readyForPickItems = useMemo(() => enhancedItems.filter(item => 
    item.status !== "Tiltekt" && 
    item.status !== "Úr leiga" && 
    item.status !== "Off-Hired" &&
    item.status !== "Í leigu" &&
    item.status !== "On Rent" &&
    item.status !== "Tilbúið til afhendingar"
  ), [enhancedItems]);
  
  const tiltektItems = useMemo(() => enhancedItems.filter(item => 
    item.status === "Tiltekt" || item.status === "Tilbúið til afhendingar"
  ), [enhancedItems]);
  
  const offHiredItems = useMemo(() => enhancedItems.filter(item => 
    item.status === "Úr leiga" || item.status === "Off-Hired"
  ), [enhancedItems]);

  return {
    activeItems,
    readyForPickItems,
    tiltektItems,
    offHiredItems
  };
}
