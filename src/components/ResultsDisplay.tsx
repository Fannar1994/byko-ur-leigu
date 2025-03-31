
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchResults, Contract, RentalItem } from "@/types/contract";
import { formatDate, formatCurrency } from "@/utils/formatters";
import { ChevronDown, ChevronUp, Calendar, FileText, Package, UserX } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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

  // Initialize local state when results change
  React.useEffect(() => {
    if (results?.rentalItems) {
      setLocalRentalItems(results.rentalItems);
    }
  }, [results]);

  if (!results) return null;

  // Sort contracts
  const sortedContracts = [...results.contracts].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Sort rental items
  const sortedItems = [...localRentalItems].sort((a, b) => {
    if (a[itemSortField] < b[itemSortField]) return itemSortDirection === "asc" ? -1 : 1;
    if (a[itemSortField] > b[itemSortField]) return itemSortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Only show active rental items (items from active contracts)
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
        // Update local state
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
        
        // Notify parent component if needed
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

  // Render sort icon
  const SortIcon = ({ field, currentField, direction }: { field: string, currentField: string, direction: "asc" | "desc" }) => {
    if (field !== currentField) return null;
    return direction === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  // Get contract status badge color
  const getStatusColor = (status: Contract["status"]) => {
    switch (status) {
      case "Active":
      case "Virkur": return "bg-primary text-primary-foreground"; // Yellow
      case "Completed":
      case "Lokið": return "bg-green-100 text-green-800"; // Green
      case "Cancelled":
      case "Tiltekt": return "bg-white text-black"; // White
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Get item status badge color
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
      {/* Renter Information */}
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

      {/* Contracts and Rental Items Tabs */}
      <Tabs defaultValue="contracts" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="contracts" className="flex items-center gap-2">
            <FileText size={16} />
            <span>Samningar ({results.contracts.length})</span>
          </TabsTrigger>
          <TabsTrigger value="items" className="flex items-center gap-2">
            <Package size={16} />
            <span>Í leigu ({activeRentalItems.length})</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Contracts Tab */}
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
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("contractNumber")}
                        >
                          <div className="flex items-center gap-1">
                            <span>Samningur #</span>
                            <SortIcon field="contractNumber" currentField={sortField} direction={sortDirection} />
                          </div>
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("status")}
                        >
                          <div className="flex items-center gap-1">
                            <span>Staða</span>
                            <SortIcon field="status" currentField={sortField} direction={sortDirection} />
                          </div>
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("startDate")}
                        >
                          <div className="flex items-center gap-1">
                            <span>Upphafsdagur</span>
                            <SortIcon field="startDate" currentField={sortField} direction={sortDirection} />
                          </div>
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("endDate")}
                        >
                          <div className="flex items-center gap-1">
                            <span>Lokadagur</span>
                            <SortIcon field="endDate" currentField={sortField} direction={sortDirection} />
                          </div>
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("totalValue")}
                        >
                          <div className="flex items-center gap-1">
                            <span>Virði</span>
                            <SortIcon field="totalValue" currentField={sortField} direction={sortDirection} />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {sortedContracts.map((contract) => (
                        <tr key={contract.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-brand-700 dark:text-brand-400">{contract.contractNumber}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={getStatusColor(contract.status)}>
                              {contract.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              <Calendar size={14} className="text-gray-400" />
                              <span>{formatDate(contract.startDate)}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              <Calendar size={14} className="text-gray-400" />
                              <span>{formatDate(contract.endDate)}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="font-medium">{formatCurrency(contract.totalValue)}</div>
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
        
        {/* Rental Items Tab */}
        <TabsContent value="items" className="animate-fade-in">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold text-white">Vörur í leigu</CardTitle>
            </CardHeader>
            <CardContent>
              {activeRentalItems.length === 0 ? (
                <div className="text-center py-6 text-gray-500">Engar vörur eru í leigu</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleItemSort("itemName")}
                        >
                          <div className="flex items-center gap-1">
                            <span>Vörunafn</span>
                            <SortIcon field="itemName" currentField={itemSortField} direction={itemSortDirection} />
                          </div>
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleItemSort("category")}
                        >
                          <div className="flex items-center gap-1">
                            <span>Flokkur</span>
                            <SortIcon field="category" currentField={itemSortField} direction={itemSortDirection} />
                          </div>
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleItemSort("serialNumber")}
                        >
                          <div className="flex items-center gap-1">
                            <span>Raðnr. #</span>
                            <SortIcon field="serialNumber" currentField={itemSortField} direction={itemSortDirection} />
                          </div>
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleItemSort("dueDate")}
                        >
                          <div className="flex items-center gap-1">
                            <span>Skiladagur</span>
                            <SortIcon field="dueDate" currentField={itemSortField} direction={itemSortDirection} />
                          </div>
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleItemSort("rentalRate")}
                        >
                          <div className="flex items-center gap-1">
                            <span>Verð</span>
                            <SortIcon field="rentalRate" currentField={itemSortField} direction={itemSortDirection} />
                          </div>
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          Samningur #
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          Aðgerðir
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {activeRentalItems.map((item) => {
                        const contract = results.contracts.find(c => c.id === item.contractId);
                        return (
                          <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium">{item.itemName}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant="outline">{item.category}</Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-600 dark:text-gray-400">{item.serialNumber}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-1">
                                <Calendar size={14} className="text-gray-400" />
                                <span>{formatDate(item.dueDate)}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium">{formatCurrency(item.rentalRate)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-brand-700 dark:text-brand-400">
                                {contract?.contractNumber || "-"}
                              </div>
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

      {/* Off-Hire Dialog */}
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
