
import React from "react";
import { SearchResults } from "@/types/contract";
import { toast } from "sonner";
import RenterInfoCard from "./RenterInfoCard";
import { useLocation } from "react-router-dom";
import { useResultsData } from "@/hooks/useResultsData";
import HomePageView from "./results/HomePageView";
import ActiveContractsView from "./results/ActiveContractsView";
import ContractHistoryView from "./results/ContractHistoryView";

interface ResultsDisplayProps {
  results: SearchResults | null;
  onDataChange?: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, onDataChange }) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  
  // Use our custom hook to manage the data
  const {
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
  } = useResultsData(results);
  
  // Add this for counting functionality
  const handleCountChange = (itemId: string, count: number) => {
    console.log(`Item ${itemId} count changed to ${count}`);
    // Here you would typically update some state or call an API
  };

  if (!results) return null;

  // Handler that wraps the item status update and triggers the onDataChange callback
  const handleItemStatusUpdateWithCallback = (
    itemId: string, 
    newStatus: "Tiltekt" | "Úr leiga" | "Í leigu" | "On Rent" | "Off-Hired" | "Pending Return" | "Tilbúið til afhendingar"
  ) => {
    handleItemStatusUpdate(itemId, newStatus);
    
    if (onDataChange) {
      onDataChange();
    }
  };

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto animate-fade-in">
      <RenterInfoCard renter={results.renter} />

      {isHomePage ? (
        <HomePageView 
          sortedContracts={sortedContracts}
          sortField={sortField}
          sortDirection={sortDirection}
          handleSort={handleSort}
        />
      ) : (
        <>
          {allContractsOffHired ? (
            <ContractHistoryView 
              offHiredContracts={offHiredContracts}
              localRentalItems={localRentalItems}
            />
          ) : (
            <ActiveContractsView 
              tiltektItems={tiltektItems}
              offHiredItems={offHiredItems}
              contractNumbersMap={contractNumbersMap}
              onItemStatusUpdate={handleItemStatusUpdateWithCallback}
              onCountChange={handleCountChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ResultsDisplay;
