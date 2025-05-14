
import React, { useState } from "react";
import { RentalItem } from "@/types/contract";
import {
  Table,
  TableBody,
} from "@/components/ui/table";
import ItemTableHeader from "./item/ItemTableHeader";
import ItemTableRow from "./item/ItemTableRow";

interface ItemTableProps {
  items: RentalItem[];
  contractNumbers?: Record<string, string>;
  showActions?: boolean;
  showContractColumn?: boolean;
  showCountColumn?: boolean;
  showLocationColumn?: boolean;
  showDepartmentColumn?: boolean;
  onOffHireClick?: (item: RentalItem) => void;
  processingItemId?: string | null;
  onTogglePicked?: (itemId: string) => void;
  pickedItems?: Record<string, boolean>;
  onCountChange?: (itemId: string, count: number) => void;
  onStatusClick?: (item: RentalItem, count: number) => void;
}

const ItemTable: React.FC<ItemTableProps> = ({
  items,
  contractNumbers,
  showActions = false,
  showContractColumn = true,
  showCountColumn = false, 
  showLocationColumn = false,
  showDepartmentColumn = true,
  onOffHireClick,
  processingItemId,
  onTogglePicked,
  pickedItems = {},
  onCountChange,
  onStatusClick,
}) => {
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [itemCounts, setItemCounts] = useState<Record<string, number>>({});

  const handleRowClick = (itemId: string) => {
    setSelectedRowId(prevId => prevId === itemId ? null : itemId);
  };

  const handleCountChange = (itemId: string, count: number) => {
    if (onCountChange) {
      onCountChange(itemId, count);
    }
    // Store the count in local state
    setItemCounts(prev => ({
      ...prev,
      [itemId]: count
    }));
  };

  if (items.length === 0) {
    return <div className="text-center py-6 text-gray-500">Engar vörur fundust</div>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <ItemTableHeader 
          showContractColumn={showContractColumn}
          showCountColumn={showCountColumn}
          showLocationColumn={showLocationColumn}
          showDepartmentColumn={showDepartmentColumn}
          showActions={showActions || !!onTogglePicked}
        />
        <TableBody className="bg-[#2A2A2A]">
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
                onCountChange={handleCountChange}
                onStatusClick={onStatusClick}
                itemCounts={itemCounts}
                showContractColumn={showContractColumn}
                showCountColumn={showCountColumn}
                showLocationColumn={showLocationColumn}
                showDepartmentColumn={showDepartmentColumn}
                showActions={showActions}
                onRowClick={() => handleRowClick(item.id)}
              />
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ItemTable;
