
import React, { useEffect } from "react"; 
import { TableRow, TableCell } from "@/components/ui/table";
import { RentalItem } from "@/types/contract";
import ContractLink from "@/components/item/ContractLink";
import ItemStatusBadge from "@/components/item/ItemStatusBadge";
import ItemLocation from "@/components/item/ItemLocation";
import ItemDepartment from "@/components/item/ItemDepartment";
import CountComponent from "@/components/CountComponent";
import { FileText } from "lucide-react";
import PhotoButton from "@/components/item/PhotoButton";

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
  onOpenDescriptionDialog?: (item: RentalItem) => void;
  hideMerkjaButtons?: boolean;
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
  onRowClick,
  onOpenDescriptionDialog,
  hideMerkjaButtons = false
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
      
      {showCountColumn && (
        <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-center">
            <CountComponent 
              count={itemCounts[item.id]} 
              onCountChange={handleLocalCountChange}
              itemId={item.id}
            />
          </div>
        </TableCell>
      )}
      
      {/* Photo button column */}
      <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-center">
          <PhotoButton />
        </div>
      </TableCell>
      
      {/* Comment button column */}
      <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
        {onOpenDescriptionDialog && (
          <div className="flex items-center justify-center">
            <button 
              className="text-blue-400 hover:text-blue-500 p-1 rounded-sm flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                onOpenDescriptionDialog(item);
              }}
              title="Bæta við athugasemd"
            >
              <FileText className="h-4 w-4" />
            </button>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
};

export default ItemTableRow;
