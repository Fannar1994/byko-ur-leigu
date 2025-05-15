
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { RentalItem } from "@/types/contract";
import CountComponent from "../CountComponent";
import ItemActionButton from "../item/ItemActionButton";
import ItemStatusCell from "../item/ItemStatusCell";
import ItemLocation from "../item/ItemLocation";
import ItemDepartment from "../item/ItemDepartment";
import ContractLink from "../item/ContractLink";

interface ItemTableRowProps {
  item: RentalItem;
  isSelected: boolean;
  isPicked: boolean;
  contractNumber?: string;
  onTogglePicked?: (itemId: string) => void;
  onOffHireClick?: (item: RentalItem) => void;
  processingItemId?: string | null;
  onCountChange?: (itemId: string, count: number) => void;
  onStatusClick?: (item: RentalItem, count: number) => void;
  itemCounts: Record<string, number>;
  showContractColumn: boolean;
  showCountColumn: boolean;
  showLocationColumn: boolean;
  showDepartmentColumn: boolean;
  showActions: boolean;
  onRowClick: () => void;
}

const ItemTableRow: React.FC<ItemTableRowProps> = ({
  item,
  isSelected,
  isPicked,
  contractNumber,
  onTogglePicked,
  onOffHireClick,
  processingItemId,
  onCountChange,
  onStatusClick,
  itemCounts,
  showContractColumn,
  showCountColumn,
  showLocationColumn,
  showDepartmentColumn,
  showActions,
  onRowClick
}) => {
  const handleCountChange = (count: number) => {
    if (onCountChange) {
      onCountChange(item.id, count);
    }
  };

  // Check if this is a Tiltekt item
  const isTiltektItem = item.status === "Tiltekt" || item.id.includes("mock-tiltekt");
  
  return (
    <TableRow 
      onClick={onRowClick}
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
          <ContractLink 
            contractNumber={contractNumber}
            isSelected={isSelected}
          />
        </TableCell>
      )}
      
      {showDepartmentColumn && (
        <TableCell className={isSelected ? "text-black" : "text-white"}>
          <ItemDepartment 
            department={item.department}
            isSelected={isSelected}
          />
        </TableCell>
      )}
      
      {showLocationColumn && (
        <TableCell className={isSelected ? "text-black" : "text-white"}>
          <ItemLocation 
            location={item.location}
            isSelected={isSelected} 
          />
        </TableCell>
      )}
      
      <ItemStatusCell 
        status={item.status || ""} 
        isTiltektItem={isTiltektItem}
        isSelected={isSelected}
      />
      
      {showCountColumn && (
        <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
          <CountComponent 
            itemId={item.id}
            onCountChange={handleCountChange}
            count={itemCounts[item.id]}
          />
        </TableCell>
      )}
      
      {showActions && onOffHireClick && (
        <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
          <ItemActionButton 
            item={item}
            onOffHireClick={onOffHireClick}
            processingItemId={processingItemId}
            actionType="offHire"
          />
        </TableCell>
      )}
      
      {onTogglePicked && (
        <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
          <ItemActionButton 
            item={item}
            isPicked={isPicked}
            onTogglePicked={onTogglePicked}
            actionType="pick"
          />
        </TableCell>
      )}
    </TableRow>
  );
};

export default ItemTableRow;
