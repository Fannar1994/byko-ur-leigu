
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchResults, Contract, RentalItem } from "@/types/contract";
import { toast } from "sonner";
import { offHireItem } from "@/services/api";
import OffHireDialog from "./OffHireDialog";
import TabContent from "./TabContent";
import ContractsTableComponent from "./ContractsTableComponent";

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

  React.useEffect(() => {
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

  const activeContracts = sortedContracts.filter(c => c.status === "Active" || c.status === "Virkur" || c.status === "Í leigu");
  const contractIds = results.contracts.map(c => c.id);
  
  const contractNumbersMap: Record<string, string> = {};
  results.contracts.forEach(c => {
    contractNumbersMap[c.id] = c.contractNumber;
  });
  
  const activeRentalItems = localRentalItems.filter(item => 
    contractIds.includes(item.contractId) && 
    (item.status === "On Rent" || item.status === "Í leigu")
  );
  
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
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold text-white">Upplýsingar um leigutaka</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Nafn</div>
              <div className="text-lg font-semibold text-white">{results.renter.name}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Kennitala</div>
              <div className="text-lg text-white">{results.renter.kennitala}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="active" className="flex-1">Í leigu</TabsTrigger>
          <TabsTrigger value="tiltekt" className="flex-1">Tiltekt</TabsTrigger>
          <TabsTrigger value="offhired" className="flex-1">Úr leiga</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="animate-fade-in">
          <TabContent 
            title="Vörur í leigu" 
            items={activeRentalItems} 
            contractNumbers={contractNumbersMap} 
          />
        </TabsContent>
        
        <TabsContent value="tiltekt" className="animate-fade-in">
          <TabContent 
            title="Vörur í tiltekt" 
            items={tiltektItems} 
            contractNumbers={contractNumbersMap} 
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
