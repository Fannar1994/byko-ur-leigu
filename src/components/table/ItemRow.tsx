
import React from "react";
import { Calendar, Check, Package, UserX } from "lucide-react";
import { RentalItem } from "@/types/contract";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { TableCell, TableRow } from "@/components/ui/table";
import CountComponent from "@/components/CountComponent";

interface ItemRowProps {
  item: RentalItem;
  contractNumbers?: Record<string, string>;
  showContractColumn: boolean;
  isSelected: boolean;
  isPicked: boolean;
  processingItemId: string | null;
  showActions: boolean;
  onOffHireClick?: (item: RentalItem) => void;
  onTogglePicked?: (itemId: string) => void;
  onItemCountChange?: (itemId: string, count: number) => void;
  count: number;
  isUpdatingCount: boolean;
  showProject: boolean;
  handleRowClick: (itemId: string) => void;
}

const ItemRow: React.FC<ItemRowProps> = ({
  item,
  contractNumbers,
  showContractColumn,
  isSelected,
  isPicked,
  processingItemId,
  showActions,
  onOffHireClick,
  onTogglePicked,
  onItemCountChange,
  count,
  isUpdatingCount,
  showProject,
  handleRowClick,
}) => {
  const isProcessing = processingItemId === item.id;
  
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
          onCountChange={(newCount) => onItemCountChange && onItemCountChange(item.id, newCount)}
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
            variant={isPicked ? "default" : "outline"}
            onClick={() => onTogglePicked(item.id)}
            className="flex items-center gap-1"
          >
            {isPicked ? <Check size={14} /> : <Package size={14} />}
            <span>{isPicked ? "Bekræfta" : "Merkja"}</span>
          </Button>
        </TableCell>
      )}
    </TableRow>
  );
};

export default ItemRow;
