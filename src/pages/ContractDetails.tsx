
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { RentalItem, Contract } from "@/types/contract";
import { searchByKennitala, offHireItem } from "@/services/api";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import OffHireDialog from "@/components/OffHireDialog";
import ContractInfo from "@/components/ContractInfo";
import TabContent from "@/components/TabContent";
import RentalTabsNavigation from "@/components/RentalTabsNavigation";
import ContractsTableComponent from "@/components/ContractsTableComponent";

// Import refactored components
import ContractHeader from "@/components/contract/ContractHeader";
import ContractFooter from "@/components/contract/ContractFooter";
import ContractLoading from "@/components/contract/ContractLoading";
import ContractNotFound from "@/components/contract/ContractNotFound";
import TiltektTab from "@/components/contract/TiltektTab";

const ContractDetails = () => {
  const { contractNumber } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [contractData, setContractData] = useState<any | null>(null);
  const [localRentalItems, setLocalRentalItems] = useState<RentalItem[]>([]);
  const [pickedItems, setPickedItems] = useState<Record<string, boolean>>({});
  const [offHireDialogOpen, setOffHireDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RentalItem | null>(null);
  const [processingItemId, setProcessingItemId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof Contract>("startDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  const lastKennitala = localStorage.getItem('lastSearchedKennitala') || '';

  useEffect(() => {
    const fetchContractData = async () => {
      setLoading(true);
      try {
        const kennitala = lastKennitala || "1234567890";
        const data = await searchByKennitala(kennitala);
        setContractData(data);
        
        if (data) {
          const contract = data.contracts.find(c => c.contractNumber === contractNumber);
          
          if (contract) {
            const contractItems = data.rentalItems.filter(item => 
              item.contractId === contract.id
            );
            setLocalRentalItems(contractItems);
          } else {
            toast.error("Samningur fannst ekki", {
              description: `Samningur ${contractNumber} finnst ekki í kerfinu.`,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching contract data:", error);
        toast.error("Villa kom upp", {
          description: "Ekki tókst að sækja gögn um samning.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContractData();
  }, [contractNumber, lastKennitala]);

  const toggleItemPicked = (itemId: string) => {
    setPickedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleCompletePickup = () => {
    const pickedCount = Object.values(pickedItems).filter(Boolean).length;
    
    if (pickedCount === 0) {
      toast.error("Engar vörur valdar", {
        description: "Þú verður að velja að minnsta kosti eina vöru til að staðfesta tiltekt.",
      });
      return;
    }
    
    toast.success("Tiltekt lokið", {
      description: `${pickedCount} vörur merktar sem tilbúnar til afhendingar.`,
    });
    
    setLocalRentalItems(prev => 
      prev.map(item => 
        pickedItems[item.id] 
          ? { ...item, status: "Tilbúið til afhendingar" } 
          : item
      )
    );
    
    setPickedItems({});
  };

  const handleGoBack = () => {
    navigate('/?kennitala=' + lastKennitala);
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

  const handleSort = (field: keyof Contract) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const contract = contractData?.contracts.find(c => c.contractNumber === contractNumber);

  // Filter items by status
  const activeItems = localRentalItems.filter(item => 
    item.status === "Í leigu" || item.status === "On Rent"
  );
  
  const readyForPickItems = localRentalItems.filter(item => 
    item.status !== "Tiltekt" && 
    item.status !== "Úr leiga" && 
    item.status !== "Off-Hired" &&
    item.status !== "Í leigu" &&
    item.status !== "On Rent" &&
    item.status !== "Tilbúið til afhendingar"
  );
  
  const tiltektItems = localRentalItems.filter(item => 
    item.status === "Tiltekt" || item.status === "Tilbúið til afhendingar"
  );
  
  const offHiredItems = localRentalItems.filter(item => 
    item.status === "Úr leiga" || item.status === "Off-Hired"
  );

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

                <Tabs defaultValue="active" className="w-full">
                  <RentalTabsNavigation />
                  
                  <TabsContent value="active">
                    <ContractsTableComponent 
                      contracts={contractData.contracts}
                      sortField={sortField}
                      sortDirection={sortDirection}
                      handleSort={handleSort}
                    />
                  </TabsContent>
                  
                  <TabsContent value="tiltekt">
                    <TiltektTab 
                      readyForPickItems={readyForPickItems}
                      tiltektItems={tiltektItems}
                      pickedItems={pickedItems}
                      onTogglePicked={toggleItemPicked}
                      onCompletePickup={handleCompletePickup}
                    />
                  </TabsContent>
                  
                  <TabsContent value="offhired">
                    <TabContent 
                      title="Vörur úr leigu" 
                      items={offHiredItems}
                      showContractColumn={false}
                      showActions={true}
                      onOffHireClick={handleOffHireClick}
                      processingItemId={processingItemId}
                      showLocationColumn={true}
                      showCountColumn={false}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <ContractNotFound contractNumber={contractNumber} onGoBack={handleGoBack} />
            )}
          </>
        )}
      </main>
      
      <ContractFooter />

      <OffHireDialog
        isOpen={offHireDialogOpen}
        item={selectedItem}
        onClose={() => setOffHireDialogOpen(false)}
        onConfirm={handleOffHireConfirm}
      />
    </div>
  );
};

export default ContractDetails;
