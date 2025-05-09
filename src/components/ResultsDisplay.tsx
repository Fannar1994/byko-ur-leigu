
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { SearchResults, Contract, RentalItem } from "@/types/contract";
import { toast } from "sonner";
import { offHireItem } from "@/services/api";
import OffHireDialog from "./OffHireDialog";
import TabContent from "./TabContent";
import ContractsTableComponent from "./ContractsTableComponent";
import RenterInfoCard from "./RenterInfoCard";
import RentalTabsNavigation from "./RentalTabsNavigation";

interface ResultsDisplayProps {
  results: SearchResults | null;
  onDataChange?: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, onDataChange }) => {
  const [sortField, setSortField] = useState<keyof Contract>("startDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [offHireDialogOpen, setOffHireDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RentalItem | null>(null);
  const [processingItemId, setProcessingItemId] = useState<string | null>(null);
  const [localRentalItems, setLocalRentalItems] = useState<RentalItem[]>([]);

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
    (item.status === "Off-Hired" || item.status === "Úr leiga")
  );

  const handleSort = (field: keyof Contract) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleOffHireClick = (item: RentalItem) => {
    setSelectedItem(item);
    setOffHireDialogOpen(true);
  };

  const handleOffHireConfirm = async (itemId: string, noCharge: boolean) => {
    setOffHireDialogOpen(false);
    setProcessingItemId(itemId);
    
    try {
      const response = await offHireItem(itemId, noCharge);
      
      if (response.success) {
        setLocalRentalItems(prevItems => 
          prevItems.map(item => 
            item.id === itemId 
              ? { ...item, status: "Úr leiga" } 
              : item
          )
        );
        
        toast.success("Aðgerð tókst", {
          description: response.message,
        });
        
        if (onDataChange) {
          onDataChange();
        }
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

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto animate-fade-in">
      <RenterInfoCard renter={results.renter} />

      <Tabs defaultValue="active" className="w-full">
        <RentalTabsNavigation />
        
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
        
        <TabsContent value="tiltekt" className="animate-fade-in">
          <TabContent 
            title="Vörur í tiltekt" 
            items={tiltektItems} 
            contractNumbers={contractNumbersMap} 
            showLocationColumn={true}
            showCountColumn={false}
          />
        </TabsContent>
        
        <TabsContent value="offhired" className="animate-fade-in">
          <TabContent 
            title="Úr leiga" 
            items={offHiredItems} 
            contractNumbers={contractNumbersMap} 
            showActions={true}
            onOffHireClick={handleOffHireClick}
            processingItemId={processingItemId}
            showLocationColumn={true}
            showCountColumn={false}
          />
        </TabsContent>
      </Tabs>

      <OffHireDialog
        isOpen={offHireDialogOpen}
        item={selectedItem}
        onClose={() => setOffHireDialogOpen(false)}
        onConfirm={handleOffHireConfirm}
      />
    </div>
  );
};

export default ResultsDisplay;
