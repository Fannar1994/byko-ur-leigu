
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
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
    (item.status === "Off-Hired" || item.status === "Úr leiga")
  );

  // Get off-hired contracts
  const offHiredContracts = results.contracts.filter(contract => 
    contract.status === "Úr leiga" || contract.status === "Completed"
  );

  // Check if all contracts are off-hired
  const allContractsOffHired = results.contracts.length > 0 && 
    results.contracts.every(contract => 
      contract.status === "Úr leiga" || contract.status === "Completed"
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
    
    if (onDataChange) {
      onDataChange();
    }
  };

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto animate-fade-in">
      <RenterInfoCard renter={results.renter} />

      {isHomePage ? (
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
        </Tabs>
      ) : (
        <>
          {allContractsOffHired ? (
            // All contracts are off-hired, show history view
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white">
                  Samningur hefur verið merktur úr leigu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-gray-400 mb-4">
                  Allir samningar eru merktir sem "Úr leigu" og er því einungis hægt að skoða upplýsingar um þá.
                </div>
                
                <div className="space-y-6">
                  {offHiredContracts.map(contract => (
                    <div key={contract.id}>
                      <h3 className="text-lg font-medium text-white mb-2">
                        Samningur {contract.contractNumber}
                      </h3>
                      <div className="rounded-md border border-white/10 overflow-hidden mb-6">
                        <table className="w-full text-sm">
                          <thead className="bg-white/5">
                            <tr>
                              <th className="py-3 px-4 text-left font-medium text-white">Vörunr.</th>
                              <th className="py-3 px-4 text-left font-medium text-white">Heiti</th>
                              <th className="py-3 px-4 text-left font-medium text-white">Staðsetning</th>
                              <th className="py-3 px-4 text-left font-medium text-white">Staða</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {localRentalItems
                              .filter(item => item.contractId === contract.id)
                              .map((item) => (
                                <tr key={item.id} className="hover:bg-white/5">
                                  <td className="py-3 px-4 text-white">{item.serialNumber}</td>
                                  <td className="py-3 px-4 text-white">{item.itemName}</td>
                                  <td className="py-3 px-4 text-white">{item.location || "-"}</td>
                                  <td className="py-3 px-4 text-white">{item.status || "-"}</td>
                                </tr>
                              ))
                            }
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            // Show normal tabs
            <Tabs defaultValue="tiltekt" className="w-full">
              <RentalTabsNavigation />
              
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
                  {({ handleOffHireClick, processingItemId, processedItems }) => (
                    <TabContent 
                      title="Úr leiga" 
                      items={offHiredItems.filter(item => !processedItems.includes(item.id))}
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
            </Tabs>
          )}
        </>
      )}
    </div>
  );
}

export default ResultsDisplay;
