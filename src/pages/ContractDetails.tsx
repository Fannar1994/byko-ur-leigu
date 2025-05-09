
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ChevronLeft, Check } from "lucide-react";
import { RentalItem } from "@/types/contract";
import { searchByKennitala, offHireItem } from "@/services/api";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import OffHireDialog from "@/components/OffHireDialog";
import ContractInfo from "@/components/ContractInfo";
import ItemTable from "@/components/ItemTable";
import TabContent from "@/components/TabContent";
import RentalTabsNavigation from "@/components/RentalTabsNavigation";

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

  const contract = contractData?.contracts.find(c => c.contractNumber === contractNumber);

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
      <header className="py-4 px-0 bg-[#2A2A2A] text-white mb-8 flex justify-center">
        <div className="w-full flex items-center justify-center">
          <img 
            src="/lovable-uploads/3e1840af-2d2e-403d-81ae-e4201bb075c5.png" 
            alt="BYKO LEIGA" 
            className="h-32 w-auto mx-auto" 
          />
          <div className="absolute left-6">
            <Button 
              variant="outline" 
              className="text-white border-white hover:bg-white/10"
              onClick={handleGoBack}
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Til baka
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container px-4 pb-12 max-w-7xl mx-auto space-y-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-12 w-12 rounded-full border-4 border-primary border-t-primary/20 animate-spin"></div>
          </div>
        ) : (
          <>
            {contract && contractData && (
              <div className="space-y-6 animate-fade-in">
                <ContractInfo contract={contract} renter={contractData.renter} />

                <Tabs defaultValue="active" className="w-full">
                  <RentalTabsNavigation />
                  
                  <TabsContent value="active">
                    <TabContent 
                      title="Vörur í leigu" 
                      items={activeItems} 
                      showContractColumn={false} 
                      showCountColumn={false}
                      showLocationColumn={true}
                    />
                  </TabsContent>
                  
                  <TabsContent value="tiltekt">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl font-semibold text-white flex justify-between items-center">
                          <span>Tiltekt</span>
                          {readyForPickItems.length > 0 && (
                            <Button 
                              className="ml-auto" 
                              onClick={handleCompletePickup}
                              disabled={!Object.values(pickedItems).some(Boolean)}
                            >
                              <Check className="h-4 w-4 mr-2" /> Staðfesta tiltekt
                            </Button>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {readyForPickItems.length === 0 && tiltektItems.length === 0 ? (
                          <div className="text-center py-6 text-gray-500">Engar vörur eru tilbúnar fyrir tiltekt</div>
                        ) : (
                          <div className="space-y-8">
                            {readyForPickItems.length > 0 && (
                              <div>
                                <h3 className="text-lg font-medium text-white mb-4">Vörur sem þarf að taka til</h3>
                                <ItemTable 
                                  items={readyForPickItems} 
                                  showContractColumn={false}
                                  onTogglePicked={toggleItemPicked}
                                  pickedItems={pickedItems}
                                />
                              </div>
                            )}

                            {tiltektItems.length > 0 && (
                              <div>
                                <h3 className="text-lg font-medium text-white mb-4">Vörur tilbúnar til afhendingar</h3>
                                <ItemTable 
                                  items={tiltektItems} 
                                  showContractColumn={false}
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
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
                    />
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {!contract && !loading && (
              <div className="text-center py-12 text-white">
                <p>Samningur með númer {contractNumber} fannst ekki.</p>
                <Button onClick={handleGoBack} className="mt-4">
                  Til baka
                </Button>
              </div>
            )}
          </>
        )}
      </main>
      
      <footer className="bg-[#2A2A2A] text-white py-4 px-4">
        <div className="container mx-auto text-center text-sm">
          <p>BYKO Leiga</p>
        </div>
      </footer>

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
