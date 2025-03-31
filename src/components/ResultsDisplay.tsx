import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchResults, Contract, RentalItem } from "@/types/contract";
import { formatDate, formatCurrency } from "@/utils/formatters";
import { ChevronDown, ChevronUp, Calendar, FileText, Package, UserX } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import OffHireDialog from "./OffHireDialog";
import { offHireItem } from "@/services/api";

interface ResultsDisplayProps {
  results: SearchResults | null;
  onDataChange?: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, onDataChange }) => {
  const [sortField, setSortField] = useState<keyof Contract>("startDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [itemSortField, setItemSortField] = useState<keyof RentalItem>("dueDate");
  const [itemSortDirection, setItemSortDirection] = useState<"asc" | "desc">("asc");
  const [offHireDialogOpen, setOffHireDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RentalItem | null>(null);
  const [processingItemId, setProcessingItemId] = useState<string | null>(null);
  const [localRentalItems, setLocalRentalItems] = useState<RentalItem[]>([]);
  const [countValues, setCountValues] = useState<Record<string, string>>({});

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

  const sortedItems = [...localRentalItems].sort((a, b) => {
    if (a[itemSortField] < b[itemSortField]) return itemSortDirection === "asc" ? -1 : 1;
    if (a[itemSortField] > b[itemSortField]) return itemSortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const activeContracts = results.contracts.filter(c => c.status === "Active" || c.status === "Virkur").map(c => c.id);
  const activeRentalItems = sortedItems.filter(item => 
    activeContracts.includes(item.contractId) && 
    item.status !== "Off-Hired"
  );

  const handleSort = (field: keyof Contract) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleItemSort = (field: keyof RentalItem) => {
    if (itemSortField === field) {
      setItemSortDirection(itemSortDirection === "asc" ? "desc" : "asc");
    } else {
      setItemSortField(field);
      setItemSortDirection("asc");
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
              ? { ...item, status: "Off-Hired" } 
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

  const handleCountChange = (itemId: string, value: string) => {
    setCountValues(prev => ({
      ...prev,
      [itemId]: value
    }));
  };

  const SortIcon = ({ field, currentField, direction }: { field: string, currentField: string, direction: "asc" | "desc" }) => {
    if (field !== currentField) return null;
    return direction === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  const getStatusColor = (status: Contract["status"]) => {
    switch (status) {
      case "Active":
      case "Virkur": return "bg-primary text-primary-foreground"; // Yellow
      case "Completed":
      case "Lokið": return "bg-green-500 text-black"; // Green with black text
      case "Cancelled":
      case "Tiltekt": return "bg-white text-black"; // White
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getItemStatusColor = (status?: string) => {
    switch (status) {
      case "On Rent": 
      case "Í leigu": return "bg-primary text-primary-foreground"; // Yellow
      case "Off-Hired": return "bg-red-100 text-red-800";
      case "Pending Return": return "bg-white text-black"; // White
      default: return "bg-gray-100 text-gray-800";
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

      <Tabs defaultValue="contracts" className="w-full">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="contracts" className="flex-1">Allir samningar</TabsTrigger>
          <TabsTrigger value="items" className="flex-1">Í leigu</TabsTrigger>
        </TabsList>
        
        <TabsContent value="contracts" className="animate-fade-in">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold text-white">Allir samningar</CardTitle>
            </CardHeader>
            <CardContent>
              {sortedContracts.length === 0 ? (
                <div className="text-center py-6 text-gray-500">Engir samningar fundust</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-[#2A2A2A]">
                      <tr>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("contractNumber")}
                        >
                          <div className="flex items-center gap-1">
                            <span>Samningsnúmer</span>
                            <SortIcon field="contractNumber" currentField={sortField} direction={sortDirection} />
                          </div>
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("status")}
                        >
                          <div className="flex items-center gap-1">
                            <span>Staða</span>
                            <SortIcon field="status" currentField={sortField} direction={sortDirection} />
                          </div>
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("startDate")}
                        >
                          <div className="flex items-center gap-1">
                            <span>Upphafsdagsetning</span>
                            <SortIcon field="startDate" currentField={sortField} direction={sortDirection} />
                          </div>
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("endDate")}
                        >
                          <div className="flex items-center gap-1">
                            <span>Lokadagsetning</span>
                            <SortIcon field="endDate" currentField={sortField} direction={sortDirection} />
                          </div>
                        </th>
                        <th 
                          className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("totalValue")}
                        >
                          <div className="flex items-center gap-1 justify-center">
                            <span>Núverandi dagsetning</span>
                            <SortIcon field="totalValue" currentField={sortField} direction={sortDirection} />
                          </div>
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("endDate")}
                        >
                          <div className="flex items-center gap-1">
                            <span>Áætlaður skiladagur</span>
                            <SortIcon field="endDate" currentField={sortField} direction={sortDirection} />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-[#2A2A2A] divide-y divide-gray-700">
                      {sortedContracts.map((contract) => (
                        <tr key={contract.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-white">{contract.contractNumber}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={getStatusColor(contract.status)}>
                              {contract.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-1 text-white">
                              <Calendar size={14} className="text-gray-400" />
                              <span>{formatDate(contract.startDate)}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-1 text-white">
                              <Calendar size={14} className="text-gray-400" />
                              <span>{formatDate(contract.endDate)}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="font-medium text-white">{formatDate(new Date().toISOString())}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-1 text-white">
                              <Calendar size={14} className="text-gray-400" />
                              <span>{formatDate(contract.endDate)}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="items" className="animate-fade-in">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold text-white">Í leigu</CardTitle>
            </CardHeader>
            <CardContent>
              {activeRentalItems.length === 0 ? (
                <div className="text-center py-6 text-gray-500">Engar vörur eru í leigu</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-[#2A2A2A]">
                      <tr>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
                          onClick={() => handleItemSort("serialNumber")}
                        >
                          <div className="flex items-center gap-1">
                            <span>Leigunúmer</span>
                            <SortIcon field="serialNumber" currentField={itemSortField} direction={itemSortDirection} />
                          </div>
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
                          onClick={() => handleItemSort("itemName")}
                        >
                          <div className="flex items-center gap-1">
                            <span>Vöruheiti</span>
                            <SortIcon field="itemName" currentField={itemSortField} direction={itemSortDirection} />
                          </div>
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                        >
                          <span>Samningsnúmer</span>
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
                          onClick={() => handleItemSort("dueDate")}
                        >
                          <div className="flex items-center gap-1">
                            <span>Skiladagsetning</span>
                            <SortIcon field="dueDate" currentField={itemSortField} direction={itemSortDirection} />
                          </div>
                        </th>
                        <th 
                          className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
                          onClick={() => handleItemSort("rentalRate")}
                        >
                          <div className="flex items-center gap-1 justify-center">
                            <span>Talning</span>
                            <SortIcon field="rentalRate" currentField={itemSortField} direction={itemSortDirection} />
                          </div>
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                        >
                          Aðgerðir
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-[#2A2A2A] divide-y divide-gray-700">
                      {activeRentalItems.map((item) => {
                        const contract = results.contracts.find(c => c.id === item.contractId);
                        return (
                          <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-white">{item.serialNumber}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-white">{item.itemName}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-white">
                                {contract?.contractNumber || "-"}
                              </div>
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
                            <td className="px-6 py-4 whitespace-nowrap">
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
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
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
