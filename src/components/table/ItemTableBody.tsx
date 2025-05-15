
import React from "react";
import { RentalItem } from "@/types/contract";
import ItemTableRow from "./ItemTableRow";

interface ItemTableBodyProps {
  items: RentalItem[];
  selectedRowId: string | null;
  pickedItems: Record<string, boolean>;
  contractNumbers?: Record<string, string>;
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

const ItemTableBody: React.FC<ItemTableBodyProps> = ({
  items,
  selectedRowId,
  pickedItems,
  contractNumbers,
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
  return (
    <>
      {items.map((item) => {
        const isSelected = selectedRowId === item.id;
        const isPicked = pickedItems[item.id];
        const contractNumber = contractNumbers ? contractNumbers[item.contractId] : undefined;
        
        return (
          <ItemTableRow 
            key={item.id}
            item={item}
            isSelected={isSelected}
            isPicked={isPicked}
            contractNumber={contractNumber}
            onTogglePicked={onTogglePicked}
            onOffHireClick={onOffHireClick}
            processingItemId={processingItemId}
            onCountChange={onCountChange}
            onStatusClick={onStatusClick}
            itemCounts={itemCounts}
            showContractColumn={showContractColumn}
            showCountColumn={showCountColumn}
            showLocationColumn={showLocationColumn}
            showDepartmentColumn={showDepartmentColumn}
            showActions={showActions}
            onRowClick={() => onRowClick(item.id)}
            onOpenDescriptionDialog={onOpenDescriptionDialog}
            hideMerkjaButtons={hideMerkjaButtons}
          />
        );
      })}
    </>
  );
};

export default ItemTableBody;
