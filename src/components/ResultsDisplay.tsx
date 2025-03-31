
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchResults, Contract, RentalItem } from "@/types/contract";
import { formatDate, formatCurrency } from "@/utils/formatters";
import { ChevronDown, ChevronUp, Calendar, FileText, Package } from "lucide-react";

interface ResultsDisplayProps {
  results: SearchResults | null;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  const [sortField, setSortField] = useState<keyof Contract>("startDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [itemSortField, setItemSortField] = useState<keyof RentalItem>("dueDate");
  const [itemSortDirection, setItemSortDirection] = useState<"asc" | "desc">("asc");

  if (!results) return null;

  // Sort contracts
  const sortedContracts = [...results.contracts].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Sort rental items
  const sortedItems = [...results.rentalItems].sort((a, b) => {
    if (a[itemSortField] < b[itemSortField]) return itemSortDirection === "asc" ? -1 : 1;
    if (a[itemSortField] > b[itemSortField]) return itemSortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Only show active rental items (items from active contracts)
  const activeContracts = results.contracts.filter(c => c.status === "Active").map(c => c.id);
  const activeRentalItems = results.rentalItems.filter(item => activeContracts.includes(item.contractId));

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

  // Render sort icon
  const SortIcon = ({ field, currentField, direction }: { field: string, currentField: string, direction: "asc" | "desc" }) => {
    if (field !== currentField) return null;
    return direction === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  // Get contract status badge color
  const getStatusColor = (status: Contract["status"]) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Completed": return "bg-blue-100 text-blue-800";
      case "Cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto animate-fade-in">
      {/* Renter Information */}
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold text-brand-800">Renter Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Name</div>
              <div className="text-lg font-semibold">{results.renter.name}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Kennitala</div>
              <div className="text-lg">{results.renter.kennitala}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contracts and Rental Items Tabs */}
      <Tabs defaultValue="contracts" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="contracts" className="flex items-center gap-2">
            <FileText size={16} />
            <span>Contracts ({results.contracts.length})</span>
          </TabsTrigger>
          <TabsTrigger value="items" className="flex items-center gap-2">
            <Package size={16} />
            <span>Currently On Rent ({activeRentalItems.length})</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Contracts Tab */}
        <TabsContent value="contracts" className="animate-fade-in">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold text-brand-800">All Contracts</CardTitle>
            </CardHeader>
            <CardContent>
              {sortedContracts.length === 0 ? (
                <div className="text-center py-6 text-gray-500">No contracts found</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("contractNumber")}
                        >
                          <div className="flex items-center gap-1">
                            <span>Contract #</span>
                            <SortIcon field="contractNumber" currentField={sortField} direction={sortDirection} />
                          </div>
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("status")}
                        >
                          <div className="flex items-center gap-1">
                            <span>Status</span>
                            <SortIcon field="status" currentField={sortField} direction={sortDirection} />
                          </div>
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("startDate")}
                        >
                          <div className="flex items-center gap-1">
                            <span>Start Date</span>
                            <SortIcon field="startDate" currentField={sortField} direction={sortDirection} />
                          </div>
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("endDate")}
                        >
                          <div className="flex items-center gap-1">
                            <span>End Date</span>
                            <SortIcon field="endDate" currentField={sortField} direction={sortDirection} />
                          </div>
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("totalValue")}
                        >
                          <div className="flex items-center gap-1">
                            <span>Value</span>
                            <SortIcon field="totalValue" currentField={sortField} direction={sortDirection} />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sortedContracts.map((contract) => (
                        <tr key={contract.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-brand-700">{contract.contractNumber}</div>
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
              <CardTitle className="text-xl font-semibold text-brand-800">Items Currently On Rent</CardTitle>
            </CardHeader>
            <CardContent>
              {activeRentalItems.length === 0 ? (
                <div className="text-center py-6 text-gray-500">No items currently on rent</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleItemSort("itemName")}
                        >
                          <div className="flex items-center gap-1">
                            <span>Item Name</span>
                            <SortIcon field="itemName" currentField={itemSortField} direction={itemSortDirection} />
                          </div>
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleItemSort("category")}
                        >
                          <div className="flex items-center gap-1">
                            <span>Category</span>
                            <SortIcon field="category" currentField={itemSortField} direction={itemSortDirection} />
                          </div>
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleItemSort("serialNumber")}
                        >
                          <div className="flex items-center gap-1">
                            <span>Serial #</span>
                            <SortIcon field="serialNumber" currentField={itemSortField} direction={itemSortDirection} />
                          </div>
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleItemSort("dueDate")}
                        >
                          <div className="flex items-center gap-1">
                            <span>Due Date</span>
                            <SortIcon field="dueDate" currentField={itemSortField} direction={itemSortDirection} />
                          </div>
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleItemSort("rentalRate")}
                        >
                          <div className="flex items-center gap-1">
                            <span>Rate</span>
                            <SortIcon field="rentalRate" currentField={itemSortField} direction={itemSortDirection} />
                          </div>
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Contract #
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sortedItems
                        .filter(item => activeContracts.includes(item.contractId))
                        .map((item) => {
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
                                <div className="text-sm text-gray-600">{item.serialNumber}</div>
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
                                <div className="text-sm text-brand-700">
                                  {contract?.contractNumber || "-"}
                                </div>
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
    </div>
  );
};

export default ResultsDisplay;
