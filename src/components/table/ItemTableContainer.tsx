
import React, { useState, useEffect } from "react";
import { RentalItem } from "@/types/contract";
import {
  Table,
  TableBody,
} from "@/components/ui/table";
import ItemTableHeader from "./ItemTableHeader";
import ItemTableBody from "./ItemTableBody";
import { getItemCount, setItemCount } from "@/utils/countUtils";

interface ItemTableContainerProps {
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
  onOpenDescriptionDialog?: (item: RentalItem) => void;
  hideMerkjaButtons?: boolean;
}

const ItemTableContainer: React.FC<ItemTableContainerProps> = ({
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
  onOpenDescriptionDialog,
  hideMerkjaButtons = false
}) => {
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [itemCounts, setItemCounts] = useState<Record<string, number>>({});

  // Initialize item counts from the utility
  useEffect(() => {
    const counts: Record<string, number> = {};
    items.forEach(item => {
      counts[item.id] = getItemCount(item.id);
    });
    setItemCounts(counts);
  }, [items]);

  const handleRowClick = (itemId: string) => {
    setSelectedRowId(prevId => prevId === itemId ? null : itemId);
  };

  const handleCountChange = (itemId: string, count: number) => {
    // Store the count in local state
    setItemCounts(prev => ({
      ...prev,
      [itemId]: count
    }));
    
    // Store in util and call parent handler
    setItemCount(itemId, count);
    if (onCountChange) {
      onCountChange(itemId, count);
    }
  };

  const handleStatusClick = (item: RentalItem, count: number) => {
    console.log(`Status clicked for item ${item.id} with status ${item.status}`);
    if (onStatusClick) {
      // Use the stored count for this item
      const currentCount = itemCounts[item.id] || 0;
      console.log(`Calling onStatusClick with count: ${currentCount}`);
      onStatusClick(item, currentCount);
    }
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
          <ItemTableBody 
            items={items}
            selectedRowId={selectedRowId}
            pickedItems={pickedItems}
            contractNumbers={contractNumbers}
            onTogglePicked={onTogglePicked}
            onOffHireClick={onOffHireClick}
            processingItemId={processingItemId}
            onCountChange={handleCountChange}
            onStatusClick={handleStatusClick}
            itemCounts={itemCounts}
            showContractColumn={showContractColumn}
            showCountColumn={showCountColumn}
            showLocationColumn={showLocationColumn}
            showDepartmentColumn={showDepartmentColumn}
            showActions={showActions}
            onRowClick={handleRowClick}
            onOpenDescriptionDialog={onOpenDescriptionDialog}
            hideMerkjaButtons={hideMerkjaButtons}
          />
        </TableBody>
      </Table>
    </div>
  );
};

export default ItemTableContainer;
