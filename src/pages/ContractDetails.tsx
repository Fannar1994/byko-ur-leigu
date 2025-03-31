import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ChevronLeft, Calendar, Check, Package, MapPin } from "lucide-react";
import { formatDate } from "@/utils/formatters";
import { SearchResults, RentalItem } from "@/types/contract";
import { searchByKennitala } from "@/services/api";

const ContractDetails = () => {
  const { contractNumber } = useParams();
  const [loading, setLoading] = useState(true);
  const [contractData, setContractData] = useState<SearchResults | null>(null);
  const [localRentalItems, setLocalRentalItems] = useState<RentalItem[]>([]);
  const [pickedItems, setPickedItems] = useState<Record<string, boolean>>({});
  const [countValues, setCountValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchContractData = async () => {
      setLoading(true);
      try {
        const data = await searchByKennitala("any-kennitala");
        setContractData(data);
        
        if (data) {
          const contract = data.contracts.find(c => c.contractNumber === contractNumber);
          
          if (contract) {
            const contractItems = data.rentalItems.filter(item => 
              item.contractId === contract.id
            );
            setLocalRentalItems(contractItems);
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
  }, [contractNumber]);

  const handleCountChange = (itemId: string, value: string) => {
    setCountValues(prev => ({
      ...prev,
      [itemId]: value
    }));
  };

  const toggleItemPicked = (itemId: string) => {
    setPickedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleCompletePickup = () => {
    const pickedCount = Object.values(pickedItems).filter(Boolean).length;
    
    toast.success("Tiltekt lokið", {
      description: `${pickedCount} vörur merktar sem tilbúnar til afhendingar.`,
    });
    
    // In a real app, you would save this state to the server
  };

  const contract = contractData?.contracts.find(c => c.contractNumber === contractNumber);

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
            <Link to="/">
              <Button variant="outline" className="text-white border-white hover:bg-white/10">
                <ChevronLeft className="mr-2 h-4 w-4" /> Til baka
              </Button>
            </Link>
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
                      <Badge className="ml-2 py-1 px-2">
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

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-semibold text-white flex justify-between items-center">
                      <span>Vörur í samningi</span>
                      <Button 
                        className="ml-auto" 
                        onClick={handleCompletePickup}
                        disabled={!Object.values(pickedItems).some(Boolean)}
                      >
                        <Check className="h-4 w-4 mr-2" /> Staðfesta tiltekt
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {localRentalItems.length === 0 ? (
                      <div className="text-center py-6 text-gray-500">Engar vörur fundust í þessum samningi</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                          <thead className="bg-[#2A2A2A]">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                Leigunúmer
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                Vöruheiti
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                Skiladagsetning
                              </th>
                              <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                                Talning
                              </th>
                              <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                                Tiltekt
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-[#2A2A2A] divide-y divide-gray-700">
                            {localRentalItems.map((item) => (
                              <tr key={item.id} className={pickedItems[item.id] ? "bg-green-900/20" : ""}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-white">{item.serialNumber}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="font-medium text-white">{item.itemName}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center gap-1 text-white">
                                    <Calendar size={14} className="text-gray-400" />
                                    <span>{formatDate(item.dueDate)}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                  <Input
                                    type="number"
                                    value={countValues[item.id] || ''}
                                    onChange={(e) => handleCountChange(item.id, e.target.value)}
                                    className="w-24 mx-auto text-center bg-gray-800 border-gray-700 text-white"
                                    min="0"
                                  />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                  <Button
                                    size="sm"
                                    variant={pickedItems[item.id] ? "default" : "outline"}
                                    onClick={() => toggleItemPicked(item.id)}
                                    className="flex items-center gap-1"
                                  >
                                    <Package size={14} />
                                    <span>{pickedItems[item.id] ? "Tilbúið" : "Merkja"}</span>
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {!contract && !loading && (
              <div className="text-center py-12 text-white">
                <p>Samningur með númer {contractNumber} fannst ekki.</p>
                <Link to="/" className="text-primary hover:underline mt-4 inline-block">
                  Til baka
                </Link>
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
    </div>
  );
};

export default ContractDetails;
