
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ChevronLeft, Calendar, Check, Package, MapPin, Table, UserX } from "lucide-react";
import { formatDate } from "@/utils/formatters";
import { SearchResults, RentalItem } from "@/types/contract";
import { searchByKennitala, offHireItem } from "@/services/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import OffHireDialog from "@/components/OffHireDialog";

const ContractDetails = () => {
  const { contractNumber } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [contractData, setContractData] = useState<SearchResults | null>(null);
  const [localRentalItems, setLocalRentalItems] = useState<RentalItem[]>([]);
  const [pickedItems, setPickedItems] = useState<Record<string, boolean>>({});
  const [offHireDialogOpen, setOffHireDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RentalItem | null>(null);
  const [processingItemId, setProcessingItemId] = useState<string | null>(null);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  
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

  const handleRowClick = (itemId: string) => {
    setSelectedRowId(prevId => prevId === itemId ? null : itemId);
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

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "Active":
      case "Virkur": 
      case "Í leigu": return "bg-primary text-primary-foreground";
      case "Completed":
      case "Lokið": return "bg-green-500 text-black";
      case "Cancelled":
      case "Tiltekt": return "bg-white text-black";
      case "Tilbúið til afhendingar": return "bg-green-500 text-black";
      case "Úr leiga":
      case "Off-Hired": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

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
            {contract && (
              <div className="space-y-6 animate-fade-in">
                <Card className="shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-semibold text-white flex items-center justify-between">
                      <span>Samningur {contractNumber}</span>
                      <Badge className={getStatusColor(contract.status)}>
                        {contract.status}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Upphafsdagsetning</div>
                        <div className="text-lg font-medium text-white flex items-center">
                          <Calendar size={16} className="mr-2" />
                          {formatDate(contract.startDate)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Lokadagsetning</div>
                        <div className="text-lg font-medium text-white flex items-center">
                          <Calendar size={16} className="mr-2" />
                          {formatDate(contract.endDate)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Verkstaður</div>
                        <div className="text-lg font-medium text-white flex items-center">
                          <MapPin size={16} className="mr-2" />
                          {contract.location || '-'}
                        </div>
                      </div>
                      
                      {contractData && (
                        <div className="col-span-3">
                          <div className="text-sm text-gray-500">Leigutaki</div>
                          <div className="text-lg font-medium text-white">
                            {contractData.renter.name} ({contractData.renter.kennitala})
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Tabs defaultValue="active" className="w-full">
                  <TabsList className="w-full mb-4">
                    <TabsTrigger value="active" className="flex-1">Í leigu</TabsTrigger>
                    <TabsTrigger value="tiltekt" className="flex-1">Tiltekt</TabsTrigger>
                    <TabsTrigger value="offhired" className="flex-1">Úr leiga</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="active">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl font-semibold text-white flex items-center">
                          <span>Vörur í leigu</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {activeItems.length === 0 ? (
                          <div className="text-center py-6 text-gray-500">Engar vörur eru í leigu í þessum samningi</div>
                        ) : (
                          <div className="overflow-x-auto">
                            <UITable>
                              <TableHeader className="bg-[#2A2A2A]">
                                <TableRow>
                                  <TableHead className="text-white">Leigunúmer</TableHead>
                                  <TableHead className="text-white">Vöruheiti</TableHead>
                                  <TableHead className="text-white">Skiladagsetning</TableHead>
                                  <TableHead className="text-white">Staða</TableHead>
                                  <TableHead className="text-white text-center">Talningar</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody className="bg-[#2A2A2A]">
                                {activeItems.map((item) => {
                                  const isSelected = selectedRowId === item.id;
                                  
                                  return (
                                    <TableRow 
                                      key={item.id} 
                                      onClick={() => handleRowClick(item.id)}
                                      className={isSelected 
                                        ? "bg-primary hover:bg-primary/90 cursor-pointer" 
                                        : "hover:bg-[#3A3A3A] cursor-pointer"}
                                    >
                                      <TableCell className={isSelected ? "text-black" : "text-white"}>{item.serialNumber}</TableCell>
                                      <TableCell className={isSelected ? "font-medium text-black" : "font-medium text-white"}>{item.itemName}</TableCell>
                                      <TableCell>
                                        <div className={`flex items-center gap-1 ${isSelected ? "text-black" : "text-white"}`}>
                                          <Calendar size={14} className={isSelected ? "text-black" : "text-gray-400"} />
                                          <span>{formatDate(item.dueDate)}</span>
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        <Badge className={getStatusColor(item.status)}>
                                          {item.status}
                                        </Badge>
                                      </TableCell>
                                      <TableCell className="text-center">
                                        <span className={isSelected ? "font-medium text-black" : "font-medium text-white"}>1</span>
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </UITable>
                          </div>
                        )}
                      </CardContent>
                    </Card>
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
                                <div className="overflow-x-auto">
                                  <UITable>
                                    <TableHeader className="bg-[#2A2A2A]">
                                      <TableRow>
                                        <TableHead className="text-white">Leigunúmer</TableHead>
                                        <TableHead className="text-white">Vöruheiti</TableHead>
                                        <TableHead className="text-white">Skiladagsetning</TableHead>
                                        <TableHead className="text-white text-center">Staða</TableHead>
                                        <TableHead className="text-white text-center">Talningar</TableHead>
                                        <TableHead className="text-white text-center">Tiltekt</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody className="bg-[#2A2A2A]">
                                      {readyForPickItems.map((item) => {
                                        const isSelected = selectedRowId === item.id;
                                        const isPicked = pickedItems[item.id];
                                        
                                        return (
                                          <TableRow 
                                            key={item.id} 
                                            onClick={() => handleRowClick(item.id)}
                                            className={isSelected 
                                              ? "bg-primary hover:bg-primary/90 cursor-pointer" 
                                              : isPicked 
                                                ? "bg-green-900/20 hover:bg-green-900/30 cursor-pointer"
                                                : "hover:bg-[#3A3A3A] cursor-pointer"}
                                          >
                                            <TableCell className={isSelected ? "text-black" : "text-white"}>{item.serialNumber}</TableCell>
                                            <TableCell className={isSelected ? "font-medium text-black" : "font-medium text-white"}>{item.itemName}</TableCell>
                                            <TableCell>
                                              <div className={`flex items-center gap-1 ${isSelected ? "text-black" : "text-white"}`}>
                                                <Calendar size={14} className={isSelected ? "text-black" : "text-gray-400"} />
                                                <span>{formatDate(item.dueDate)}</span>
                                              </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                              <Badge className={getStatusColor(item.status)}>
                                                {item.status}
                                              </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                              <span className={isSelected ? "font-medium text-black" : "font-medium text-white"}>1</span>
                                            </TableCell>
                                            <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                                              <Button
                                                size="sm"
                                                variant={pickedItems[item.id] ? "default" : "outline"}
                                                onClick={() => toggleItemPicked(item.id)}
                                                className="flex items-center gap-1"
                                              >
                                                <Package size={14} />
                                                <span>{pickedItems[item.id] ? "Tilbúið" : "Merkja"}</span>
                                              </Button>
                                            </TableCell>
                                          </TableRow>
                                        );
                                      })}
                                    </TableBody>
                                  </UITable>
                                </div>
                              </div>
                            )}

                            {tiltektItems.length > 0 && (
                              <div>
                                <h3 className="text-lg font-medium text-white mb-4">Vörur tilbúnar til afhendingar</h3>
                                <div className="overflow-x-auto">
                                  <UITable>
                                    <TableHeader className="bg-[#2A2A2A]">
                                      <TableRow>
                                        <TableHead className="text-white">Leigunúmer</TableHead>
                                        <TableHead className="text-white">Vöruheiti</TableHead>
                                        <TableHead className="text-white">Skiladagsetning</TableHead>
                                        <TableHead className="text-white text-center">Staða</TableHead>
                                        <TableHead className="text-white text-center">Talningar</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody className="bg-[#2A2A2A]">
                                      {tiltektItems.map((item) => {
                                        const isSelected = selectedRowId === item.id;
                                        
                                        return (
                                          <TableRow 
                                            key={item.id} 
                                            onClick={() => handleRowClick(item.id)}
                                            className={isSelected 
                                              ? "bg-primary hover:bg-primary/90 cursor-pointer" 
                                              : "bg-green-900/20 hover:bg-green-900/30 cursor-pointer"}
                                          >
                                            <TableCell className={isSelected ? "text-black" : "text-white"}>{item.serialNumber}</TableCell>
                                            <TableCell className={isSelected ? "font-medium text-black" : "font-medium text-white"}>{item.itemName}</TableCell>
                                            <TableCell>
                                              <div className={`flex items-center gap-1 ${isSelected ? "text-black" : "text-white"}`}>
                                                <Calendar size={14} className={isSelected ? "text-black" : "text-gray-400"} />
                                                <span>{formatDate(item.dueDate)}</span>
                                              </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                              <Badge className={getStatusColor(item.status)}>
                                                Tilbúið til afhendingar
                                              </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                              <span className={isSelected ? "font-medium text-black" : "font-medium text-white"}>1</span>
                                            </TableCell>
                                          </TableRow>
                                        );
                                      })}
                                    </TableBody>
                                  </UITable>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="offhired">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl font-semibold text-white flex items-center">
                          <Table className="mr-2 h-5 w-5" />
                          <span>Vörur úr leigu</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {offHiredItems.length === 0 ? (
                          <div className="text-center py-6 text-gray-500">Engar vörur hafa verið skráðar úr leigu</div>
                        ) : (
                          <div className="overflow-x-auto">
                            <UITable>
                              <TableHeader className="bg-[#2A2A2A]">
                                <TableRow>
                                  <TableHead className="text-white">Leigunúmer</TableHead>
                                  <TableHead className="text-white">Vöruheiti</TableHead>
                                  <TableHead className="text-white">Skiladagsetning</TableHead>
                                  <TableHead className="text-white text-center">Staða</TableHead>
                                  <TableHead className="text-white text-center">Talningar</TableHead>
                                  <TableHead className="text-white text-center">Aðgerðir</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody className="bg-[#2A2A2A]">
                                {offHiredItems.map((item) => {
                                  const isSelected = selectedRowId === item.id;
                                  
                                  return (
                                    <TableRow 
                                      key={item.id}
                                      onClick={() => handleRowClick(item.id)}
                                      className={isSelected 
                                        ? "bg-primary hover:bg-primary/90 cursor-pointer" 
                                        : "hover:bg-[#3A3A3A] cursor-pointer"}
                                    >
                                      <TableCell className={isSelected ? "text-black" : "text-white"}>{item.serialNumber}</TableCell>
                                      <TableCell className={isSelected ? "font-medium text-black" : "font-medium text-white"}>{item.itemName}</TableCell>
                                      <TableCell>
                                        <div className={`flex items-center gap-1 ${isSelected ? "text-black" : "text-white"}`}>
                                          <Calendar size={14} className={isSelected ? "text-black" : "text-gray-400"} />
                                          <span>{formatDate(item.dueDate)}</span>
                                        </div>
                                      </TableCell>
                                      <TableCell className="text-center">
                                        <Badge className="bg-red-100 text-red-800">
                                          Úr leigu
                                        </Badge>
                                      </TableCell>
                                      <TableCell className="text-center">
                                        <span className={isSelected ? "font-medium text-black" : "font-medium text-white"}>1</span>
                                      </TableCell>
                                      <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                                        <Button
                                          size="sm"
                                          variant="destructive"
                                          onClick={() => handleOffHireClick(item)}
                                          disabled={processingItemId === item.id}
                                          className="flex items-center gap-1"
                                        >
                                          <UserX size={14} />
                                          <span>Skila</span>
                                        </Button>
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </UITable>
                          </div>
                        )}
                      </CardContent>
                    </Card>
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
