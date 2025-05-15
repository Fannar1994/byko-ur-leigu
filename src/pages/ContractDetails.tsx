
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import ContractInfo from "@/components/ContractInfo";
import ContractHeader from "@/components/contract/ContractHeader";
import ContractFooter from "@/components/contract/ContractFooter";
import ContractLoading from "@/components/contract/ContractLoading";
import ContractNotFound from "@/components/contract/ContractNotFound";
import { Card } from "@/components/ui/card";
import HistoricalContractView from "@/components/contract/HistoricalContractView";
import ContractHandlers from "@/components/contract/ContractHandlers";

// Import custom hooks
import { useContractData } from "@/hooks/useContractData";
import { useFilteredItems } from "@/hooks/useFilteredItems";
import { useSorting } from "@/hooks/useSorting";
import { useItemStatusUpdate } from "@/hooks/useItemStatusUpdate";
import { useCountHandler } from "@/hooks/useCountHandler";

const ContractDetails = () => {
  const { contractNumber } = useParams();
  const navigate = useNavigate();
  
  // Use custom hooks
  const { loading, contractData, localRentalItems, setLocalRentalItems, lastKennitala } = 
    useContractData(contractNumber);
  const { activeItems, readyForPickItems, tiltektItems, offHiredItems } = 
    useFilteredItems(localRentalItems);
  const { sortField, sortDirection, handleSort } = useSorting();
  const { handleItemStatusUpdate, handleItemStatusUpdateWithCount } = 
    useItemStatusUpdate(setLocalRentalItems);
  const { handleCountChange } = useCountHandler();

  // Navigation
  const handleGoBack = () => {
    navigate('/?kennitala=' + lastKennitala);
  };

  // Get contract from data
  const contract = contractData?.contracts.find(c => c.contractNumber === contractNumber);
  const contractId = contract?.id || "";
  
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
                  <HistoricalContractView localRentalItems={localRentalItems} />
                ) : (
                  <Card className="p-6">
                    <div className="space-y-4">
                      <ContractHandlers
                        contractId={contractId}
                        localRentalItems={localRentalItems}
                        activeItems={activeItems}
                        readyForPickItems={readyForPickItems}
                        tiltektItems={tiltektItems}
                        offHiredItems={offHiredItems}
                        handleItemStatusUpdate={handleItemStatusUpdate}
                        handleItemStatusUpdateWithCount={handleItemStatusUpdateWithCount}
                        handleCountChange={handleCountChange}
                        sortField={sortField}
                        sortDirection={sortDirection}
                        handleSort={handleSort}
                      />
                    </div>
                  </Card>
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
