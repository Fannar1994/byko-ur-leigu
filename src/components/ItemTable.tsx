
import React from "react";
import { RentalItem } from "@/types/contract";
import { Table, TableBody } from "@/components/ui/table";
import ItemTableHeader from "@/components/table/ItemTableHeader";
import ItemRow from "@/components/table/ItemRow";
import EmptyItemsMessage from "@/components/table/EmptyItemsMessage";
import { useItemTable } from "@/components/table/useItemTable";

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
  processingItemId = null,
  onTogglePicked,
  pickedItems = {},
  onItemCountChange,
  showProject = false,
}) => {
  const {
    selectedRowId,
    itemCounts,
    updatingCount,
    handleRowClick,
    handleCountChange
  } = useItemTable(items, onItemCountChange);

  if (items.length === 0) {
    return <EmptyItemsMessage />;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <ItemTableHeader
          showContractColumn={showContractColumn}
          showActions={showActions}
          onTogglePicked={onTogglePicked}
          showProject={showProject}
        />
        <TableBody className="bg-[#2A2A2A]">
          {items.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              contractNumbers={contractNumbers}
              showContractColumn={showContractColumn}
              isSelected={selectedRowId === item.id}
              isPicked={!!pickedItems[item.id]}
              processingItemId={processingItemId}
              showActions={showActions}
              onOffHireClick={onOffHireClick}
              onTogglePicked={onTogglePicked}
              onItemCountChange={handleCountChange}
              count={itemCounts[item.id] || 1}
              isUpdatingCount={updatingCount === item.id}
              showProject={showProject}
              handleRowClick={handleRowClick}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ItemTable;
