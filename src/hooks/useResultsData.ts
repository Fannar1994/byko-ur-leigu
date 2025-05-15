
import { useState, useEffect } from "react";
import { SearchResults, Contract, RentalItem } from "@/types/contract";

export function useResultsData(results: SearchResults | null) {
  const [sortField, setSortField] = useState<keyof Contract>("startDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [localRentalItems, setLocalRentalItems] = useState<RentalItem[]>([]);
  
  useEffect(() => {
    if (results?.rentalItems) {
      setLocalRentalItems(results.rentalItems);
    }
  }, [results]);
  
  const handleSort = (field: keyof Contract) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  // Update item status locally after off-hire
  const handleItemStatusUpdate = (itemId: string, newStatus: "Tiltekt" | "Úr leiga" | "Í leigu" | "On Rent" | "Off-Hired" | "Pending Return" | "Tilbúið til afhendingar") => {
    setLocalRentalItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId 
          ? { ...item, status: newStatus } 
          : item
      )
    );
  };
  
  // Prepare sorted contracts
  const sortedContracts = results?.contracts 
    ? [...results.contracts].sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1;
        return 0;
      })
    : [];
  
  // Create contract numbers map
  const contractNumbersMap: Record<string, string> = {};
  if (results?.contracts) {
    results.contracts.forEach(c => {
      contractNumbersMap[c.id] = c.contractNumber;
    });
  }
  
  // Get contract IDs
  const contractIds = results?.contracts?.map(c => c.id) || [];
  
  // Filter items by status
  const tiltektItems = localRentalItems.filter(item => 
    contractIds.includes(item.contractId) && 
    (item.status === "Tiltekt" || item.status === "Tilbúið til afhendingar")
  );
  
  const offHiredItems = localRentalItems.filter(item => 
    contractIds.includes(item.contractId) && 
    (item.status === "Off-Hired" || item.status === "Úr leiga")
  );
  
  // Get off-hired contracts
  const offHiredContracts = results?.contracts?.filter(contract => 
    contract.status === "Úr leiga" || contract.status === "Completed"
  ) || [];
  
  // Check if all contracts are off-hired
  const allContractsOffHired = results?.contracts?.length ? 
    results.contracts.every(contract => 
      contract.status === "Úr leiga" || contract.status === "Completed"
    ) : false;
  
  return {
    sortField,
    sortDirection,
    localRentalItems,
    sortedContracts,
    contractNumbersMap,
    tiltektItems,
    offHiredItems,
    offHiredContracts,
    allContractsOffHired,
    handleSort,
    handleItemStatusUpdate
  };
}
