
import React, { useEffect } from "react"; // Added useEffect
import { TableRow, TableCell } from "@/components/ui/table";
import { RentalItem } from "@/types/contract";
import ContractLink from "@/components/item/ContractLink";
import ItemStatusBadge from "@/components/item/ItemStatusBadge";
import PhotoButton from "@/components/item/PhotoButton";
import ItemLocation from "@/components/item/ItemLocation";
import ItemDepartment from "@/components/item/ItemDepartment";
import ItemActionButton from "@/components/item/ItemActionButton";
import ItemStatusCell from "@/components/item/ItemStatusCell";
import CountComponent from "@/components/CountComponent";

interface ItemTableRowProps {
  item: RentalItem;
  isSelected: boolean;
  isPicked?: boolean;
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
  onRowClick: (itemId: string) => void;
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
  // Effect to automatically toggle picked state when count changes
  useEffect(() => {
    const count = itemCounts[item.id] || 0;
    // If count > 0 and item is not already picked, mark it as picked
    if (count > 0 && onTogglePicked && !isPicked) {
      onTogglePicked(item.id);
    }
    // If count is back to 0 and item is picked, toggle it back
    else if (count === 0 && onTogglePicked && isPicked) {
      onTogglePicked(item.id);
    }
  }, [itemCounts, item.id, isPicked, onTogglePicked]);

  const handleLocalCountChange = (count: number) => {
    if (onCountChange) {
      onCountChange(item.id, count);
    }
  };

  return (
    <TableRow 
      className={`
        cursor-pointer hover:bg-[#3A3A3A] transition-colors
        ${isSelected ? 'bg-[#3A3A3A]' : ''}
        ${isPicked ? 'bg-[#2c4633]' : ''}
        ${processingItemId === item.id ? 'opacity-50' : ''}
      `}
      onClick={(e) => onRowClick(item.id)}
    >
      <TableCell>
        <div className="flex flex-col">
          <span className="text-white">{item.serialNumber}</span>
          {item.status && (
            <ItemStatusBadge status={item.status} />
          )}
        </div>
      </TableCell>
      <TableCell>
        <span className="text-white">{item.itemName}</span>
      </TableCell>
      
      {showContractColumn && contractNumber && (
        <TableCell>
          <ContractLink contractNumber={contractNumber} isSelected={isSelected} />
        </TableCell>
      )}
      
      {showDepartmentColumn && (
        <TableCell>
          <ItemDepartment department={item.department} isSelected={isSelected} />
        </TableCell>
      )}
      
      {showLocationColumn && (
        <TableCell>
          <ItemLocation location={item.location} isSelected={isSelected} />
        </TableCell>
      )}
      
      <TableCell className="text-center">
        <PhotoButton />
      </TableCell>
      
      {showCountColumn && (
        <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
          <CountComponent 
            count={itemCounts[item.id]} 
            onCountChange={handleLocalCountChange}
            itemId={item.id}
          />
        </TableCell>
      )}
      
      {/* Removed the showActions section completely */}
      
      {onTogglePicked && (
        <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
          {/* Only show the Merkja button if count is 0 */}
          {(!itemCounts[item.id] || itemCounts[item.id] === 0) && (
            <ItemActionButton 
              item={item}
              isPicked={isPicked}
              onTogglePicked={onTogglePicked}
              actionType="pick"
            />
          )}
          {item.status === "Tiltekt" && onStatusClick && (
            <ItemStatusCell 
              status={item.status}
              isTiltektItem={true}
              isSelected={isSelected}
            />
          )}
        </TableCell>
      )}
    </TableRow>
  );
};

export default ItemTableRow;
