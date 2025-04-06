
import React, { useState } from "react";
import { Calendar, UserX, Package } from "lucide-react";
import { RentalItem } from "@/types/contract";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ItemTableProps {
  items: RentalItem[];
  contractNumbers?: Record<string, string>;
  showActions?: boolean;
  showContractColumn?: boolean;
  onOffHireClick?: (item: RentalItem) => void;
  processingItemId?: string | null;
  onTogglePicked?: (itemId: string) => void;
  pickedItems?: Record<string, boolean>;
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
}) => {
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

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
      case "Tiltekt": return "bg-white text-black"; // White
      case "Tilbúið til afhendingar": return "bg-green-500 text-black"; // Green for ready items
      default: return "bg-gray-100 text-gray-800";
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
                <TableCell className="text-center">
                  <span className={isSelected ? "font-medium text-black" : "font-medium text-white"}>1</span>
                </TableCell>
                {showActions && onOffHireClick && (
                  <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onOffHireClick(item)}
                      disabled={processingItemId === item.id}
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
                      <Package size={14} />
                      <span>{pickedItems[item.id] ? "Tilbúið" : "Merkja"}</span>
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
