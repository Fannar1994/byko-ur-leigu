
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { SearchResults, Contract, RentalItem } from "@/types/contract";
import { toast } from "sonner";
import TabContent from "./TabContent";
import ContractsTableComponent from "./ContractsTableComponent";
import RenterInfoCard from "./RenterInfoCard";
import RentalTabsNavigation from "./RentalTabsNavigation";
import { OffHireHandler } from "./contract/OffHireHandler";
import { useLocation } from "react-router-dom";

interface ResultsDisplayProps {
  results: SearchResults | null;
  onDataChange?: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, onDataChange }) => {
  const [sortField, setSortField] = useState<keyof Contract>("startDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [localRentalItems, setLocalRentalItems] = useState<RentalItem[]>([]);
  const [processedItems, setProcessedItems] = useState<string[]>([]);
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  
  // Add this for counting functionality
  const handleCountChange = (itemId: string, count: number) => {
    console.log(`Item ${itemId} count changed to ${count}`);
    // Here you would typically update some state or call an API
  };

  useEffect(() => {
    if (results?.rentalItems) {
      setLocalRentalItems(results.rentalItems);
    }
  }, [results]);

  if (!results) return null;

  const sortedContracts = [...results.contracts].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const contractIds = results.contracts.map(c => c.id);
  
  const contractNumbersMap: Record<string, string> = {};
  results.contracts.forEach(c => {
    contractNumbersMap[c.id] = c.contractNumber;
  });
  
  const tiltektItems = localRentalItems.filter(item => 
    contractIds.includes(item.contractId) && 
    (item.status === "Tiltekt" || item.status === "Tilbúið til afhendingar")
  );
  
  const offHiredItems = localRentalItems.filter(item => 
    contractIds.includes(item.contractId) && 
    (item.status === "Off-Hired" || item.status === "Úr leiga") &&
    !processedItems.includes(item.id)
  );

  const handleSort = (field: keyof Contract) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Update item status locally after off-hire - fixed to use proper type
  const handleItemStatusUpdate = (itemId: string, newStatus: "Tiltekt" | "Úr leiga" | "Í leigu" | "On Rent" | "Off-Hired" | "Pending Return" | "Tilbúið til afhendingar") => {
    setLocalRentalItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId 
          ? { ...item, status: newStatus } 
          : item
      )
    );
    
    // If item is being marked as returned, add to processed items
    if (newStatus === "Úr leiga") {
      setProcessedItems(prev => [...prev, itemId]);
    }
    
    if (onDataChange) {
      onDataChange();
    }
  };

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto animate-fade-in">
      <RenterInfoCard renter={results.renter} />

      <Tabs defaultValue={isHomePage ? "active" : "tiltekt"} className="w-full">
        <RentalTabsNavigation />
        
        {isHomePage && (
          <TabsContent value="active" className="animate-fade-in">
            <Card>
              <ContractsTableComponent 
                contracts={sortedContracts}
                sortField={sortField}
                sortDirection={sortDirection}
                handleSort={handleSort}
              />
            </Card>
          </TabsContent>
        )}
        
        {!isHomePage && (
          <>
            <TabsContent value="tiltekt" className="animate-fade-in">
              <TabContent 
                title="Vörur í tiltekt" 
                items={tiltektItems} 
                contractNumbers={contractNumbersMap} 
                showLocationColumn={true}
                showCountColumn={true}
                onCountChange={handleCountChange}
              />
            </TabsContent>
            
            <TabsContent value="offhired" className="animate-fade-in">
              <OffHireHandler onItemStatusUpdate={handleItemStatusUpdate}>
                {({ handleOffHireClick, processingItemId }) => (
                  <TabContent 
                    title="Úr leiga" 
                    items={offHiredItems} 
                    contractNumbers={contractNumbersMap} 
                    showActions={true}
                    onOffHireClick={handleOffHireClick}
                    processingItemId={processingItemId}
                    showLocationColumn={true}
                    showCountColumn={true}
                    onCountChange={handleCountChange}
                  />
                )}
              </OffHireHandler>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}

export default ResultsDisplay;
