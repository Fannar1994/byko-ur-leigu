
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchResults, Contract, RentalItem } from "@/types/contract";
import { formatDate } from "@/utils/formatters";
import { ChevronDown, ChevronUp, Calendar, MapPin } from "lucide-react";
import { toast } from "sonner";
import { offHireItem } from "@/services/api";
import { Link } from "react-router-dom";
import OffHireDialog from "./OffHireDialog";
import ItemTable from "./ItemTable";

interface ResultsDisplayProps {
  results: SearchResults | null;
  onDataChange?: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, onDataChange }) => {
  const [sortField, setSortField] = useState<keyof Contract>("startDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [offHireDialogOpen, setOffHireDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RentalItem | null>(null);
  const [processingItemId, setProcessingItemId] = useState<string | null>(null);
  const [localRentalItems, setLocalRentalItems] = useState<RentalItem[]>([]);

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

  const activeContracts = sortedContracts.filter(c => c.status === "Active" || c.status === "Virkur" || c.status === "Í leigu");
  const contractIds = results.contracts.map(c => c.id);
  
  const contractNumbersMap: Record<string, string> = {};
  results.contracts.forEach(c => {
    contractNumbersMap[c.id] = c.contractNumber;
  });
  
  const activeRentalItems = localRentalItems.filter(item => 
    contractIds.includes(item.contractId) && 
    (item.status === "On Rent" || item.status === "Í leigu")
  );
  
  const tiltektItems = localRentalItems.filter(item => 
    contractIds.includes(item.contractId) && 
    (item.status === "Tiltekt" || item.status === "Tilbúið til afhendingar")
  );
  
  const offHiredItems = localRentalItems.filter(item => 
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
              <ItemTable 
                items={activeRentalItems} 
                contractNumbers={contractNumbersMap}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tiltekt" className="animate-fade-in">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold text-white">Vörur í tiltekt</CardTitle>
            </CardHeader>
            <CardContent>
              <ItemTable 
                items={tiltektItems} 
                contractNumbers={contractNumbersMap}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="offhired" className="animate-fade-in">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold text-white">Úr leiga</CardTitle>
            </CardHeader>
            <CardContent>
              <ItemTable 
                items={offHiredItems} 
                contractNumbers={contractNumbersMap} 
                showActions={true}
                onOffHireClick={handleOffHireClick}
                processingItemId={processingItemId}
              />
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
