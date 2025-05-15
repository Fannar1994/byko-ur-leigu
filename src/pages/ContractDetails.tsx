
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ContractInfo from "@/components/ContractInfo";
import ContractHeader from "@/components/contract/ContractHeader";
import ContractFooter from "@/components/contract/ContractFooter";
import ContractLoading from "@/components/contract/ContractLoading";
import ContractNotFound from "@/components/contract/ContractNotFound";
import ContractTabs from "@/components/contract/ContractTabs";
import { RentalItem } from "@/types/contract";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Import custom hooks
import { useContractData } from "@/hooks/useContractData";
import { useFilteredItems } from "@/hooks/useFilteredItems";
import { useSorting } from "@/hooks/useSorting";
import { OffHireHandler } from "@/components/contract/OffHireHandler";
import { PickupHandler } from "@/components/contract/PickupHandler";
import { hasTiltektBeenCompleted } from "@/utils/contractStatusUtils";
import { setItemCount } from "@/utils/countUtils";

const ContractDetails = () => {
  const { contractNumber } = useParams();
  const navigate = useNavigate();
  
  // Use custom hooks
  const { loading, contractData, localRentalItems, setLocalRentalItems, lastKennitala } = 
    useContractData(contractNumber);
  const { activeItems, readyForPickItems, tiltektItems, offHiredItems } = 
    useFilteredItems(localRentalItems);
  const { sortField, sortDirection, handleSort } = useSorting();

  // Handle count change
  const handleCountChange = (itemId: string, count: number) => {
    console.log(`Item ${itemId} count changed to ${count}`);
    // Store the count in our utility
    setItemCount(itemId, count);
  };

  // Handle item status updates
  const handleItemStatusUpdate = (itemId: string | string[], newStatus: "On Rent" | "Off-Hired" | "Pending Return" | "Í leigu" | "Tiltekt" | "Úr leiga" | "Tilbúið til afhendingar") => {
    setLocalRentalItems(prevItems => {
      if (Array.isArray(itemId)) {
        return prevItems.map(item => 
          itemId.includes(item.id) 
            ? { ...item, status: newStatus } 
            : item
        );
      } else {
        return prevItems.map(item => 
          item.id === itemId 
            ? { ...item, status: newStatus } 
            : item
        );
      }
    });
  };

  // New function to handle status update with count
  const handleItemStatusUpdateWithCount = (itemId: string, newStatus: string, count: number) => {
    // Update the item status first
    handleItemStatusUpdate(itemId, newStatus as any);
    // Store the count in our utility
    setItemCount(itemId, count);
    console.log(`Item ${itemId} status changed to ${newStatus} with count ${count}`);
  };

  // Navigation
  const handleGoBack = () => {
    navigate('/?kennitala=' + lastKennitala);
  };

  // Get contract from data
  const contract = contractData?.contracts.find(c => c.contractNumber === contractNumber);
  const contractId = contract?.id || "";
  
  // Check if tiltekt has been completed for this contract
  const isTiltektCompleted = hasTiltektBeenCompleted(contractId);
  
  // Check if contract is "Úr leiga" status
  const isContractOffHired = contract?.status === "Úr leiga" || contract?.status === "Completed";

  return (
    <div className="min-h-screen bg-background dark">
      <ContractHeader onGoBack={handleGoBack} />
      
      <main className="container px-4 pb-12 max-w-7xl mx-auto space-y-8">
        {loading ? (
          <ContractLoading />
        ) : (
          <>
            {contract && contractData ? (
              <div className="space-y-6 animate-fade-in">
                <ContractInfo contract={contract} renter={contractData.renter} />
                
                {isContractOffHired ? (
                  // Render history view for off-hired contracts
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold text-white">
                        Samningur hefur verið merktur úr leigu
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-gray-400 mb-4">
                        Þessi samningur er merktur sem "Úr leigu" og er því einungis hægt að skoða upplýsingar um hann.
                      </div>
                      
                      <h3 className="text-lg font-medium text-white mb-4">Vörur í samningi</h3>
                      <div className="rounded-md border border-white/10 overflow-hidden">
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
                            {localRentalItems.map((item) => (
                              <tr key={item.id} className="hover:bg-white/5">
                                <td className="py-3 px-4 text-white">{item.serialNumber}</td>
                                <td className="py-3 px-4 text-white">{item.itemName}</td>
                                <td className="py-3 px-4 text-white">{item.location || "-"}</td>
                                <td className="py-3 px-4 text-white">{item.status || "-"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  // Render normal tabs view for active contracts
                  <OffHireHandler onItemStatusUpdate={handleItemStatusUpdate}>
                    {({ handleOffHireClick, processingItemId, processedItems }) => (
                      <PickupHandler 
                        contractId={contractId} 
                        onItemStatusUpdate={handleItemStatusUpdate}
                      >
                        {({ pickedItems, toggleItemPicked, handleCompletePickup, isTiltektCompleted }) => (
                          <ContractTabs 
                            contracts={contractData.contracts}
                            activeItems={activeItems}
                            readyForPickItems={readyForPickItems}
                            tiltektItems={tiltektItems}
                            offHiredItems={offHiredItems}
                            pickedItems={pickedItems}
                            processingItemId={processingItemId}
                            processedItems={processedItems}
                            sortField={sortField}
                            sortDirection={sortDirection}
                            onTogglePicked={toggleItemPicked}
                            onCompletePickup={handleCompletePickup}
                            onOffHireClick={handleOffHireClick}
                            handleSort={handleSort}
                            onCountChange={handleCountChange}
                            onItemStatusUpdate={handleItemStatusUpdateWithCount}
                            isTiltektCompleted={isTiltektCompleted}
                          />
                        )}
                      </PickupHandler>
                    )}
                  </OffHireHandler>
                )}
              </div>
            ) : (
              <ContractNotFound contractNumber={contractNumber} onGoBack={handleGoBack} />
            )}
          </>
        )}
      </main>
      
      <ContractFooter />
    </div>
  );
};

export default ContractDetails;
