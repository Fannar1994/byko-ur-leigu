
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchResults, Contract, RentalItem } from "@/types/contract";
import { formatDate, formatCurrency } from "@/utils/formatters";
import { ChevronDown, ChevronUp, Calendar, FileText, Package, UserX, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import OffHireDialog from "./OffHireDialog";
import { offHireItem } from "@/services/api";
import { Link } from "react-router-dom";

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
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

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

  const activeContracts = sortedContracts.filter(c => c.status === "Active" || c.status === "Virkur" || c.status === "Í leigu");
  const contractIds = results.contracts.map(c => c.id);
  
  const activeRentalItems = sortedItems.filter(item => 
    contractIds.includes(item.contractId) && 
    (item.status === "On Rent" || item.status === "Í leigu")
  );
  
  const tiltektItems = sortedItems.filter(item => 
    contractIds.includes(item.contractId) && 
    (item.status === "Tiltekt" || item.status === "Tilbúið til afhendingar")
  );
  
  const offHiredItems = sortedItems.filter(item => 
    contractIds.includes(item.contractId) && 
    (item.status === "Off-Hired" || item.status === "Úr leiga")
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
              ? { ...item, status: "Úr leiga" } 
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

  const handleRowClick = (itemId: string) => {
    setSelectedRowId(prevId => prevId === itemId ? null : itemId);
  };

  const SortIcon = ({ field, currentField, direction }: { field: string, currentField: string, direction: "asc" | "desc" }) => {
    if (field !== currentField) return null;
    return direction === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  const getStatusColor = (status: Contract["status"]) => {
    switch (status) {
      case "Active":
      case "Virkur":
      case "Í leigu": return "bg-primary text-primary-foreground"; // Yellow
      case "Completed":
      case "Lokið": return "bg-green-500 text-black"; // Green with black text
      case "Cancelled":
      case "Tiltekt": return "bg-white text-black"; // White
      case "Úr leiga": return "bg-red-100 text-red-800"; // Red light
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getItemStatusColor = (status?: string) => {
    switch (status) {
      case "On Rent": 
      case "Í leigu": return "bg-primary text-primary-foreground"; // Yellow
      case "Off-Hired":
      case "Úr leiga": return "bg-red-100 text-red-800";
      case "Pending Return": 
      case "Tiltekt": return "bg-white text-black"; // White
      case "Tilbúið til afhendingar": return "bg-green-500 text-black"; // Green for ready items
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const renderContractsTable = (contracts: Contract[]) => (
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
              onClick={() => handleSort("location")}
            >
              <div className="flex items-center gap-1">
                <span>Verkstaður</span>
                <SortIcon field="location" currentField={sortField} direction={sortDirection} />
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
            >
              <div className="flex items-center gap-1 justify-center">
                <span>Núverandi dagsetning</span>
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
            <th 
              className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider"
            >
              <span>Talningar</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-[#2A2A2A] divide-y divide-gray-700">
          {contracts.map((contract) => (
            <tr key={contract.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <Link 
                  to={`/contract/${contract.contractNumber}`}
                  className="font-medium text-primary hover:underline"
                >
                  {contract.contractNumber}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge className={getStatusColor(contract.status)}>
                  {contract.status}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-1 text-white">
                  <MapPin size={14} className="text-gray-400" />
                  <span>{contract.location || '-'}</span>
                </div>
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
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="font-medium text-white">0</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderItemsTable = (items: RentalItem[], showActions: boolean = true) => (
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
              className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider"
            >
              <span>Staða</span>
            </th>
            <th 
              className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider"
            >
              <span>Talningar</span>
            </th>
            {showActions && (
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
              >
                Aðgerðir
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-[#2A2A2A] divide-y divide-gray-700">
          {items.map((item) => {
            const contract = results.contracts.find(c => c.id === item.contractId);
            const isSelected = selectedRowId === item.id;

            return (
              <tr 
                key={item.id} 
                onClick={() => handleRowClick(item.id)}
                className={isSelected 
                  ? "bg-primary hover:bg-primary/90 cursor-pointer" 
                  : "hover:bg-[#3A3A3A] cursor-pointer"}
              >
                <td className={`px-6 py-4 whitespace-nowrap ${isSelected ? "text-black" : "text-white"}`}>
                  <div className="text-sm">{item.serialNumber}</div>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap ${isSelected ? "text-black font-medium" : "font-medium text-white"}`}>
                  {item.itemName}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap ${isSelected ? "text-black" : "text-white"}`}>
                  {contract && (
                    <Link 
                      to={`/contract/${contract.contractNumber}`}
                      className={isSelected ? "text-sm text-black hover:underline" : "text-sm text-primary hover:underline"}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {contract.contractNumber}
                    </Link>
                  )}
                  {!contract && (
                    <div className="text-sm text-white">-</div>
                  )}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap ${isSelected ? "text-black" : "text-white"}`}>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} className={isSelected ? "text-black" : "text-gray-400"} />
                    <span>{formatDate(item.dueDate)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <Badge className={getItemStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-center ${isSelected ? "text-black font-medium" : "text-white font-medium"}`}>
                  1
                </td>
                {showActions && (
                  <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
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
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

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

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="active" className="flex-1">Í leigu</TabsTrigger>
          <TabsTrigger value="tiltekt" className="flex-1">Tiltekt</TabsTrigger>
          <TabsTrigger value="offhired" className="flex-1">Úr leiga</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="animate-fade-in">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold text-white">Vörur í leigu</CardTitle>
            </CardHeader>
            <CardContent>
              {activeRentalItems.length === 0 ? (
                <div className="text-center py-6 text-gray-500">Engar vörur í leigu fundust</div>
              ) : renderItemsTable(activeRentalItems, false)}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tiltekt" className="animate-fade-in">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold text-white">Vörur í tiltekt</CardTitle>
            </CardHeader>
            <CardContent>
              {tiltektItems.length === 0 ? (
                <div className="text-center py-6 text-gray-500">Engar vörur eru í tiltekt</div>
              ) : renderItemsTable(tiltektItems, false)}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="offhired" className="animate-fade-in">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold text-white">Úr leiga</CardTitle>
            </CardHeader>
            <CardContent>
              {offHiredItems.length === 0 ? (
                <div className="text-center py-6 text-gray-500">Engar vörur eru skráðar úr leigu</div>
              ) : renderItemsTable(offHiredItems, true)}
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
