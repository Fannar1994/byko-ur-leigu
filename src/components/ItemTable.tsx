
import React, { useState } from "react";
import { Calendar, UserX, Package, Minus, Plus, Check } from "lucide-react";
import { RentalItem } from "@/types/contract";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { updateItemCount } from "@/services/contractService";
import { Input } from "@/components/ui/input";
import CountComponent from "@/components/CountComponent";

interface ItemTableProps {
  items: RentalItem[];
  contractNumbers?: Record<string, string>;
  showActions?: boolean;
  showContractColumn?: boolean;
  onOffHireClick?: (item: RentalItem) => void;
  processingItemId?: string | null;
  onTogglePicked?: (itemId: string) => void;
  pickedItems?: Record<string, boolean>;
  onItemCountChange?: (itemId: string, count: number) => void;
  showProject?: boolean;
}

const ItemTable: React.FC<ItemTableProps> = ({
  items,
  contractNumbers,
  showActions = false,
  showContractColumn = true,
  onOffHireClick,
  processingItemId,
  onTogglePicked,
  pickedItems = {},
  onItemCountChange,
  showProject = false,
}) => {
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [itemCounts, setItemCounts] = useState<Record<string, number>>({});
  const [updatingCount, setUpdatingCount] = useState<string | null>(null);

  // Initialize counts from items if they have count property
  React.useEffect(() => {
    const initialCounts: Record<string, number> = {};
    items.forEach(item => {
      initialCounts[item.id] = item.count || 1;
    });
    setItemCounts(initialCounts);
  }, [items]);

  const handleRowClick = (itemId: string) => {
    setSelectedRowId(prevId => prevId === itemId ? null : itemId);
  };

  const getItemStatusColor = (status?: string) => {
    switch (status) {
      case "On Rent": 
      case "Í leigu": return "bg-primary text-primary-foreground"; // Yellow
      case "Off-Hired":
      case "Úr leiga": return "bg-red-100 text-red-800";
      case "Pending Return": 
      case "Tiltekt": return "bg-primary text-white"; // Yellow for Tiltekt
      case "Tilbúið til afhendingar": return "bg-green-500 text-black"; // Green for ready items
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleCountChange = async (itemId: string, newCount: number) => {
    if (updatingCount === itemId) return;

    // Update local state immediately for UI responsiveness
    setItemCounts(prev => ({
      ...prev,
      [itemId]: newCount
    }));

    // If there's a handler provided by parent, call it
    if (onItemCountChange) {
      onItemCountChange(itemId, newCount);
      return;
    }

    try {
      setUpdatingCount(itemId);
      const result = await updateItemCount(itemId, newCount);
      
      if (result.success) {
        toast.success(result.message);
      } else {
        // Revert on failure
        setItemCounts(prev => ({
          ...prev,
          [itemId]: prev[itemId] || 1
        }));
        toast.error("Villa við að uppfæra talningu");
      }
    } catch (error) {
      toast.error("Villa kom upp", {
        description: error instanceof Error ? error.message : "Óþekkt villa"
      });
      
      // Revert on error
      setItemCounts(prev => ({
        ...prev,
        [itemId]: prev[itemId] || 1
      }));
    } finally {
      setUpdatingCount(null);
    }
  };

  if (items.length === 0) {
    return <div className="text-center py-6 text-gray-500">Engar vörur fundust</div>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-[#2A2A2A]">
          <TableRow>
            <TableHead className="text-white">Leigunúmer</TableHead>
            <TableHead className="text-white">Vöruheiti</TableHead>
            {showContractColumn && (
              <TableHead className="text-white">Samningsnúmer</TableHead>
            )}
            <TableHead className="text-white">Skiladagsetning</TableHead>
            <TableHead className="text-white text-center">Staða</TableHead>
            {showProject && (
              <TableHead className="text-white">Verk</TableHead>
            )}
            <TableHead className="text-white text-center">Talningar</TableHead>
            {(showActions || onTogglePicked) && (
              <TableHead className="text-white text-center">Aðgerðir</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody className="bg-[#2A2A2A]">
          {items.map((item) => {
            const isSelected = selectedRowId === item.id;
            const isPicked = pickedItems[item.id];
            const count = itemCounts[item.id] || 1;
            const isProcessing = processingItemId === item.id;
            const isUpdatingCount = updatingCount === item.id;
            
            return (
              <TableRow 
                key={item.id} 
                onClick={() => handleRowClick(item.id)}
                className={isSelected 
                  ? "bg-primary text-black hover:bg-primary/90 cursor-pointer" 
                  : isPicked 
                    ? "bg-green-900/20 hover:bg-green-900/30 cursor-pointer"
                    : "hover:bg-primary/90 hover:text-black cursor-pointer"}
              >
                <TableCell className={isSelected ? "text-black" : "text-white"}>
                  {item.serialNumber}
                </TableCell>
                <TableCell className={isSelected ? "font-medium text-black" : "font-medium text-white"}>
                  {item.itemName}
                </TableCell>
                {showContractColumn && (
                  <TableCell className={isSelected ? "text-black" : "text-white"}>
                    {contractNumbers && contractNumbers[item.contractId] && (
                      <Link 
                        to={`/contract/${contractNumbers[item.contractId]}`}
                        className={isSelected ? "text-black hover:underline" : "text-primary hover:underline"}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {contractNumbers[item.contractId]}
                      </Link>
                    )}
                    {(!contractNumbers || !contractNumbers[item.contractId]) && (
                      <span>-</span>
                    )}
                  </TableCell>
                )}
                <TableCell className={isSelected ? "text-black" : "text-white"}>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} className={isSelected ? "text-black" : "text-gray-400"} />
                    <span>{formatDate(item.dueDate)}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge className={getItemStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                </TableCell>
                {showProject && (
                  <TableCell className={isSelected ? "text-black" : "text-white"}>
                    {item.contractId && contractNumbers ? item.project || "Verkefni A" : "-"}
                  </TableCell>
                )}
                <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                  <CountComponent 
                    count={count}
                    onCountChange={(newCount) => handleCountChange(item.id, newCount)}
                    isUpdating={isUpdatingCount}
                  />
                </TableCell>
                {showActions && onOffHireClick && (
                  <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onOffHireClick(item)}
                      disabled={isProcessing}
                      className="flex items-center gap-1"
                    >
                      <UserX size={14} />
                      <span>Skila</span>
                    </Button>
                  </TableCell>
                )}
                {onTogglePicked && (
                  <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="sm"
                      variant={pickedItems[item.id] ? "default" : "outline"}
                      onClick={() => onTogglePicked(item.id)}
                      className="flex items-center gap-1"
                    >
                      {pickedItems[item.id] ? <Check size={14} /> : <Package size={14} />}
                      <span>{pickedItems[item.id] ? "Bekræfta" : "Merkja"}</span>
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ItemTable;
