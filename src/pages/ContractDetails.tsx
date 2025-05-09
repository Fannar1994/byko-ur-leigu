
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import ContractInfo from "@/components/ContractInfo";
import ContractHeader from "@/components/contract/ContractHeader";
import ContractFooter from "@/components/contract/ContractFooter";
import ContractLoading from "@/components/contract/ContractLoading";
import ContractNotFound from "@/components/contract/ContractNotFound";
import ContractTabs from "@/components/contract/ContractTabs";
import { RentalItem } from "@/types/contract";

// Import custom hooks
import { useContractData } from "@/hooks/useContractData";
import { useFilteredItems } from "@/hooks/useFilteredItems";
import { useSorting } from "@/hooks/useSorting";
import { OffHireHandler } from "@/components/contract/OffHireHandler";
import { PickupHandler } from "@/components/contract/PickupHandler";

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
    // Here you would normally update a state or make an API call
  };

  // Handle item status updates
  const handleItemStatusUpdate = (itemId: string | string[], newStatus: string) => {
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

  // Navigation
  const handleGoBack = () => {
    navigate('/?kennitala=' + lastKennitala);
  };

  // Get contract from data
  const contract = contractData?.contracts.find(c => c.contractNumber === contractNumber);

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
                
                <OffHireHandler onItemStatusUpdate={handleItemStatusUpdate}>
                  {({ handleOffHireClick, processingItemId }) => (
                    <PickupHandler onItemStatusUpdate={handleItemStatusUpdate}>
                      {({ pickedItems, toggleItemPicked, handleCompletePickup }) => (
                        <ContractTabs 
                          contracts={contractData.contracts}
                          activeItems={activeItems}
                          readyForPickItems={readyForPickItems}
                          tiltektItems={tiltektItems}
                          offHiredItems={offHiredItems}
                          pickedItems={pickedItems}
                          processingItemId={processingItemId}
                          sortField={sortField}
                          sortDirection={sortDirection}
                          onTogglePicked={toggleItemPicked}
                          onCompletePickup={handleCompletePickup}
                          onOffHireClick={handleOffHireClick}
                          handleSort={handleSort}
                          onCountChange={handleCountChange}
                        />
                      )}
                    </PickupHandler>
                  )}
                </OffHireHandler>
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
